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
public class Language {
    public void mixin(JspWriter out, String languageCode) throws IOException{
        if(languageCode==null) languageCode = "en_US";
        else{
            languageCode = languageCode.replace("\"", "");
            languageCode = languageCode.replace("'", "");
        }
        languageCode = languageCode.toLowerCase();
        switch(languageCode){
            case "zh":
            case "zh-tw":
            case "zh_tw":
                out.append("<script type=\"text/javascript\" src=\"languages/zh_TW.js\"></script>");
                out.append("<script>webView.currentLanguage = \"zh_TW\";</script>");
                break;
            case "en":
            case "en-us":
            case "en_us":   
            default:
                out.append("<script type=\"text/javascript\" src=\"languages/en_US.js\"></script>");
                out.append("<script>webView.currentLanguage = \"en_US\";</script>");
                break;
        }
    }
}
