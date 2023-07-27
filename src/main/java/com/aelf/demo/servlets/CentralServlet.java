package com.aelf.demo.servlets;

import com.aelf.demo.internal.MethodCaller;

import io.aelf.response.ResultCode;
import io.aelf.utils.AElfException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.http.util.TextUtils;

import java.io.IOException;

import static com.aelf.demo.internal.MethodCaller.PARAM_LIST;
import static com.aelf.demo.internal.MethodCaller.PARAM_METHOD_NAME;

@WebServlet(name = "CentralServlet", urlPatterns = {"/api/central"})
public class CentralServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, AElfException {
        String methodName = req.getParameter(PARAM_METHOD_NAME);
        String params = req.getParameter(PARAM_LIST);
        if (TextUtils.isBlank(methodName))
            throw new AElfException(ResultCode.PARAM_ERROR, "wrong query with no method name");
        try {
            String result = MethodCaller.methodCall(methodName, params);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().print(result);
        } catch (NoSuchMethodException e) {
            throw new AElfException(e, ResultCode.PARAM_ERROR, "It seems that there's no method called : "
                    + methodName + " , or you provided wrong types of params and Java reflection could not" +
                    " determine which method you wanted to call.", true);
        } catch (Exception e) {
            throw new AElfException(e);
        }
    }
}
