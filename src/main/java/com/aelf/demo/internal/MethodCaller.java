package com.aelf.demo.internal;

import com.google.gson.*;
import io.aelf.internal.sdkv2.AElfClientAsync;
import io.aelf.response.ResultCode;
import io.aelf.sdk.AElfClient;
import io.aelf.utils.AElfException;
import io.aelf.utils.JsonUtil;
import org.apache.http.util.TextUtils;

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

    public static String methodCall(String methodName, String params) throws NoSuchMethodException,InvocationTargetException,
            AElfException, IllegalAccessException {
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
        Parameter<?>[] convertedParams = IntStream.range(0, array.size())
                .mapToObj(i -> array.get(i).getAsJsonObject())
                .map(MethodCaller::getDeclaredField)
                .sorted(Comparator.comparingInt(a -> a.position))
                .toArray(Parameter[]::new);
        Method method = clazz.getDeclaredMethod(methodName, getParamClasses(convertedParams));
        return JsonUtil.toJsonString(method.invoke(client, getContents(convertedParams)));
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
