<%-- 
    Document   : index
    Created on : 2017/9/4, 上午 09:19:22
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
        <!--Import jLego-->
        <link rel="stylesheet" href="jLego/css/jLego.css" type="text/css"/>
        <script type="text/javascript" src="jLego/js/portal.js"></script>
        <!--Import webPage-->
        <script type="text/javascript" src="webView/js/portal.js"></script>
        <title>BDPaaS</title>
        <!--Mixin jLego objectUI-->
        <%
            String languageCode = request.getParameter("lang");
            //mixin jLego objectUI
            new JLego().mixin(out, languageCode, new String[]{"topBanner", 
                                                              "buttonCTRLer", 
                                                              "segmentedButton", 
                                                              "windowCTRLer", 
                                                              "optionListCTRLer", 
                                                              "statusMonitor", 
                                                              "toastCTRLer",
                                                              "hintCardCTRLer",
                                                              "tabPage",
                                                              "searchBar",
                                                              "nowLoading",
                                                              "notificationCenter",
                                                              "nodeTable",
                                                              "popoutPanel",
                                                              "background"
                                                              }); 
            //mixin webPage
            WebPage myWebPage = new WebPage();
            myWebPage.mixin(out, languageCode, new String[]{"common", "mainPage", "bigDataPage", "userPage", "dashboardPage", "sparkConsolePage", "apexConsolePage"});
        %>
    </head>
    <body>
        <%
        String account = "";
        String password = null;
        String authority = "";
        AuthDBManager myAuthDBManager = new AuthDBManager();
        String currentUser = (String)session.getAttribute("userID");
        String currentPassword = (String)session.getAttribute("password");
        System.out.println("currentUser: " + currentUser);
        System.out.println("currentPassword " + currentPassword);
        if(currentUser != null && currentPassword != null) {
            Login loginData = myAuthDBManager.doLogin(currentUser, currentPassword);
            if(loginData.getResult()){
                authority  = String.valueOf(loginData.getAuthority());
            }
        }
        else{
            response.sendRedirect("login.jsp");
        }
        %>
        <script>
            webView.variables.authority = '<%=authority%>';
            webView.mainPage.add(document.body);
            webView.mainPage.resizeHandler();
        </script>
    </body>
</html>
