/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
package org.itri.mixinCTRLer;

import java.io.IOException;
import javax.servlet.jsp.JspWriter;

/**
 *
 * @author A40385
 */
public class WebPage {

      public WebPage(){
      }
      public void mixin(JspWriter out, String languageCode, String[] modules) throws IOException{
        new Language().mixin(out, languageCode);
        this.mixin(out, modules);
    }
    public void mixin(JspWriter out, String[] modules) throws IOException{
        for(int i=0; i<modules.length; i++){
            switch(modules[i]){
                case "loginPage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/loginPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/loginPage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/loginPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/loginPage/loginPage.js\"></script>");
                    out.append("<script>"+
                    "webView.loginPage = new loginPage();"+
                    "</script>");
                    break;
                case "checkPage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/checkPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/checkPage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/checkPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/checkPage/checkPage.js\"></script>");
                    out.append("<script>"+
                    "webView.checkPage = new checkPage();"+
                    "</script>");
                    break;
                case "mainPage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/mainPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/mainPage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/mainPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/mainPage/mainPage.js\"></script>");
                    out.append("<script>"+
                    "webView.mainPage = new mainPage();"+
                    "</script>");
                    break;
                case "common":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/common.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/common/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/common/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/common/url.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/common/connection.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/common/utils.js\"></script>");
                    out.append("<script>"+
                        "webView.common = {" +
                        "myID: webView.id.common," +
                        "myClass: webView.cls.common," +
                        "myConsts: webView.constants.common," +
                        "myLanguage: webView.lang.common " +
                        "};" +
                        "webView.commonConsts = webView.constants.common;" + 
                        "webView.connection = new connection();"+
                        "webView.utils = new utils();"+
                    "</script>");
                    break;
                case "bigDataPage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/bigDataPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/bigDataPage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/bigDataPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/bigDataPage/bigDataPage.js\"></script>");
                    out.append("<script>"+
                    "webView.bigDataPage = new bigDataPage();"+
                    "</script>");
                    break;
                case "dashboardPage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/dashboardPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/dashboardPage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/dashboardPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/dashboardPage/dashboardPage.js\"></script>");
                    out.append("<script>"+
                    "webView.dashboardPage = new dashboardPage();"+
                    "</script>");
                    break;
                case "sparkConsolePage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/sparkConsolePage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/sparkConsolePage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/sparkConsolePage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/sparkConsolePage/sparkConsolePage.js\"></script>");
                    out.append("<script>"+
                    "webView.sparkConsolePage = new sparkConsolePage();"+
                    "</script>");
                    break;
                case "apexConsolePage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/apexConsolePage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/apexConsolePage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/apexConsolePage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/apexConsolePage/apexConsolePage.js\"></script>");
                    out.append("<script>"+
                    "webView.apexConsolePage = new apexConsolePage();"+
                    "</script>");
                    break;
                case "userPage":
                    out.append("<link rel=\"stylesheet\" href=\"webView/css/userPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/userPage/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/userPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/userPage/userPage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"webView/js/userPage/drawUserPanel.js\"></script>");
                    out.append("<script>"+
                    "webView.userPage = new userPage();"+
                    "</script>");
                    break;
                default:
                    break;
            }
        }
    }
}
