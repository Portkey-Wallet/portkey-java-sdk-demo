package com.aelf.demo.internal;

import com.google.gson.*;
import io.aelf.internal.sdkv2.AElfClientAsync;
import io.aelf.internal.sdkv2.AElfClientV2;
import io.aelf.response.ResultCode;
import io.aelf.sdk.AElfClient;
import io.aelf.utils.AElfException;
import io.aelf.utils.JsonUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.http.util.TextUtils;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.Comparator;
import java.util.stream.IntStream;

@SuppressWarnings("deprecation")
public final class MethodCaller {
    public static final String PARAM_METHOD_NAME = "method_name";
    public static final String PARAM_LIST = "params";
    public static final String PARAM_FIELD_POSITION = "position";
    public static final String PARAM_FIELD_TYPE = "type";
    public static final String PARAM_FIELD_CONTENT = "content";
    public static final String PARAM_FIELD_CLASS_NAME = "javaReflectClassName";
    public static final String PARAM_SPECIAL_CALL = "special_call";

    public static final String SPECIAL_CALL_INIT = "initAelfClient";

    public static String methodCall(String methodName, String params) throws NoSuchMethodException, InvocationTargetException,
            AElfException, IllegalAccessException {
        Parameter<?>[] convertedParams = convertParams(params);
        AElfClient client = ClientHolder.getClient();
        if (client == null)
            throw new AElfException(ResultCode.INTERNAL_ERROR, "AElfClient did not init, try [init()] button first.");
        Class<AElfClient> clazz = AElfClient.class;
        Method method = clazz.getDeclaredMethod(methodName, getParamClasses(convertedParams));
        return JsonUtil.toJsonString(method.invoke(client, getContents(convertedParams)));
    }

    public static Parameter<?>[] convertParams(String params) throws AElfException {
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
        return IntStream.range(0, array.size())
                .mapToObj(i -> array.get(i).getAsJsonObject())
                .map(MethodCaller::getDeclaredField)
                .sorted(Comparator.comparingInt(a -> a.position))
                .toArray(Parameter[]::new);
    }

    public static void initTarget(String params, HttpServletResponse response) throws AElfException, IOException {
        Parameter<?>[] parameter = convertParams(params);
        if (parameter.length == 0) {
            ClientHolder.setClient(new AElfClientV2(TestParams.CLIENT_HTTP_URL));
            return;
        }
        try {
            Constructor<AElfClient> clientConstructor = AElfClient.class.getConstructor(getParamClasses(parameter));
            AElfClient client=clientConstructor.newInstance(getContents(parameter));
            ClientHolder.setClient(client);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().print("init ok.");
        } catch (NoSuchMethodException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR,
                    "There's no constructor for AElfClient for those params, please check your params type", true);
        } catch (InvocationTargetException | IllegalAccessException | InstantiationException e) {
            throw new AElfException(e,ResultCode.INTERNAL_ERROR);
        }
    }

    public static Parameter<?> getDeclaredField(JsonObject element) throws AElfException {
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
                case FieldType.WRAPPED_BOOLEAN: {
                    obj = content.getAsBoolean() ? Boolean.TRUE : Boolean.FALSE;
                    break;
                }
                case FieldType.LONG: {
                    obj = content.getAsLong();
                    break;
                }
                case FieldType.ANY_JSON_OBJECT: {
                    Class<?> clazz = Class.forName(element.get(PARAM_FIELD_CLASS_NAME).getAsString());
                    obj = new Gson().fromJson(content.getAsString(), clazz);
                    break;
                }
                case FieldType.STRING:
                default: {
                    obj = content.getAsString();
                }
            }
            return new Parameter<>(obj, position, type);
        } catch (NullPointerException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR, "check your params again ", true);
        } catch (UnsupportedOperationException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR,
                    "it seems that you are providing a wrong parameter type, check your request again.", true);
        } catch (ClassNotFoundException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR, "the CLASS_NAME you provided is not found : "
                    + element.get(PARAM_FIELD_CLASS_NAME), true);
        }
    }

    private static Class<?>[] getParamClasses(Parameter<?>[] params) {
        return Arrays.stream(params).map(param -> {
            switch (param.type) {
                case FieldType.INTEGER:
                    return Integer.TYPE;
                case FieldType.BOOLEAN:
                    return Boolean.TYPE;
                case FieldType.LONG:
                    return Long.TYPE;
                case FieldType.WRAPPED_BOOLEAN:
                    return Boolean.class;
                case FieldType.STRING:
                case FieldType.ANY_JSON_OBJECT:
                default:
                    return param.content.getClass();
            }
        }).toArray(Class<?>[]::new);
    }

    private static Object[] getContents(Parameter<?>[] params) {
        return Arrays.stream(params).map(param -> param.content).toArray();
    }


}
