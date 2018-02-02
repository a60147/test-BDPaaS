<%-- 
    Document   : index
    Created on : 2016/8/1, 上午 10:59:19
    Author     : A40385
--%>
<%@page import="org.itri.data.entity.Login"%>
<%@page import="org.itri.dataAccess.AuthDBManager"%>
<%@page import="org.itri.mixinCTRLer.WebPage"%>
<%@page import="org.itri.mixinCTRLer.JLego"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" type="image/png" href="webView/img/favicon/favicon2-32x32.png">
        <title>BDPaaS</title>
        <!--Import jLego-->
        <link rel="stylesheet" href="jLego/css/jLego.css" type="text/css"/>
        <script type="text/javascript" src="jLego/js/portal.js"></script>
        <!--Import webPage-->
        <script type="text/javascript" src="webView/js/portal.js"></script>
        <!--Get Input Argument (Language) -->
        <!--Mixin jLego objectUI-->
        <%new JLego().mixin(out, new String[]{"background"});%>
        <!--Mixin Pages-->
        <%new WebPage().mixin(out, new String[]{"common",
                                                "checkPage"});%>
    </head>
    <body>
        <%
        String account = "";
        String password = null;
        boolean resultResult = false;
        AuthDBManager myAuthDBManager = new AuthDBManager();
        if(request.getParameter("account") != null && request.getParameter("password") != null) {
            account = request.getParameter("account");
            password = request.getParameter("password");
            System.out.println("account: " + account);
            System.out.println("password " + password);
            Login loginData = myAuthDBManager.doLogin(account, password);
            if(loginData.getResult()){
                resultResult = true;
                System.out.println("set account: " + account);
                System.out.println("set password " + password);
                session.setAttribute("userID", account);
                session.setAttribute("password", password);
                session.setAttribute("authority", loginData.getAuthority());
                response.sendRedirect("index.jsp");
            }
        }
        else{
            response.sendRedirect("login.jsp");
        }
        %>
        <script>
            if('<%=resultResult%>'=="false"){
                webView.checkPage.add(document.body);
                webView.checkPage.resizeHandler();
            }
        </script>
    </body>
</html>
