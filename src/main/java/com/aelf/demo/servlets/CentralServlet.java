package com.aelf.demo.servlets;

import com.google.gson.*;
import com.aelf.demo.internal.ClientHolder;
import com.aelf.demo.internal.FieldType;
import com.aelf.demo.internal.Parameter;
import io.aelf.internal.sdkv2.AElfClientAsync;
import io.aelf.response.ResultCode;
import io.aelf.sdk.AElfClient;
import io.aelf.utils.AElfException;
import io.aelf.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.http.util.TextUtils;

import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.IntStream;

@SuppressWarnings("deprecation")
@WebServlet(name = "CentralServlet", urlPatterns = {"/central"})
public class CentralServlet extends HttpServlet {

    private static final String PARAM_METHOD_NAME = "method_name";
    private static final String PARAM_LIST = "params";
    private static final String PARAM_FIELD_POSITION = "position";
    private static final String PARAM_FIELD_TYPE = "type";
    private static final String PARAM_FIELD_CONTENT = "content";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, AElfException {
        String methodName = req.getParameter(PARAM_METHOD_NAME);
        String params = req.getParameter(PARAM_LIST);
        if (TextUtils.isBlank(methodName))
            throw new AElfException(ResultCode.PARAM_ERROR, "wrong query with no method name");
        JsonArray array;
        String decodedParams = TextUtils.isBlank(params)
                ? "[]"
                : new String(Base64.getDecoder().decode(params.getBytes(StandardCharsets.UTF_8)));
        try {
            array = JsonParser.parseString(decodedParams).getAsJsonArray();
        } catch (JsonSyntaxException e) {
            throw new AElfException(ResultCode.INTERNAL_ERROR, "error when try to parse params : " + decodedParams);
        }
        if (array == null || !array.isJsonArray()) throw new AElfException(ResultCode.PARAM_ERROR,
                "provide parameter list like [ {name:'obj1',content:'123',type:Type.STRING} , ... ]" +
                        " or [] means no params, and encode it with Base64.");
        AElfClientAsync client = ClientHolder.getClient();
        Class<AElfClient> clazz = AElfClient.class;
        try {
            Parameter<?>[] convertedParams = IntStream.range(0, array.size())
                    .mapToObj(i -> array.get(i).getAsJsonObject())
                    .map(CentralServlet::getDeclaredField)
                    .sorted(Comparator.comparingInt(a -> a.position))
                    .toArray(Parameter[]::new);
            Method method = clazz.getDeclaredMethod(methodName, getParamClasses(convertedParams));
            String result = JsonUtil.toJsonString(method.invoke(client, getContents(convertedParams)));
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().print(result);
        } catch (NoSuchMethodException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR, "It seems that there's no method called : " + methodName, true);
        } catch (Exception e) {
            throw new AElfException(e);
        }
    }

    private static Parameter<?> getDeclaredField(JsonObject element) throws AElfException {
        try {
            int type = element.get(PARAM_FIELD_TYPE).getAsInt();
            int position = element.get(PARAM_FIELD_POSITION).getAsInt();
            JsonElement content = element.get(PARAM_FIELD_CONTENT);
            Object obj;
            switch (type) {
                case FieldType.INTEGER: {
                    obj = content.getAsInt();
                    break;
                }
                case FieldType.BOOLEAN: {
                    obj = content.getAsBoolean();
                    break;
                }
                case FieldType.LONG: {
                    obj = content.getAsLong();
                    break;
                }
                case FieldType.STRING:
                default: {
                    obj = content.getAsString();
                }
            }
            return new Parameter<>(obj, position);
        } catch (NullPointerException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR, "check your params again ", true);
        } catch (UnsupportedOperationException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR,
                    "it seems that you are providing a wrong parameter type, check your request again.", true);
        }
    }

    private static Class<?>[] getParamClasses(Parameter<?>[] params) {
        return Arrays.stream(params).map(param -> param.content.getClass()).toArray(Class<?>[]::new);
    }

    private static Object[] getContents(Parameter<?>[] params) {
        return Arrays.stream(params).map(param -> param.content).toArray();
    }
}
