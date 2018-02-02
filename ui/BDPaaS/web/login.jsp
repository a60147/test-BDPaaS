<%-- 
    Document   : index
    Created on : 2016/8/1, 上午 10:59:19
    Author     : A40385
--%>
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
        <!--Mixin jLego objectUI-->
        <%new JLego().mixin(out, new String[]{"background"});%>
        <!--Mixin Pages-->
        <%new WebPage().mixin(out, new String[]{"common",
                                                "loginPage"});%>
    </head>
    <body>
        <script>
            //
            webView.loginPage.add(document.body);
            webView.loginPage.resizeHandler();
        </script>
    </body>
</html>
