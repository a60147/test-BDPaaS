/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.mixinCTRLer;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.jsp.JspWriter;

/**
 *
 * @author jkl
 */
public class JLego {
    public void mixin(JspWriter out, String languageCode, String[] modules) throws IOException{
        new Language().mixin(out, languageCode);
        this.mixin(out, modules);
    }
    public void mixin(JspWriter out, String[] modules) throws IOException{
        boolean isImportedDateTimePicker = false;
        boolean isVisImported = false;
        boolean isGSAPTweenImported = false;
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/jQuery/jquery-1.10.2.js\"></script>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/jQuery/jquery.min.js\"></script>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/jQuery/jquery-ui.js\"></script>");
        out.append("<link rel=\"stylesheet\" href=\"jLego/js/addOns/jQuery/jquery-ui.css\" type=\"text/css\"/>");
        
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/jQuery/jquery.foggy.min.js\"></script>");
        
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/moment/moment.js\"></script>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/moment/moment-timezone.js\"></script>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/data.js\"></script>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/func.js\"></script>");
        
        out.append("<script>jLego.init();</script>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/basicUI/basicUI.js\"></script>");
        out.append("<script>jLego.variables.isInit=true;</script>");
        
        out.append("<link rel=\"stylesheet\" href=\"jLego/js/addOns/perfectScrollbar/css/perfect-scrollbar.css\" type=\"text/css\"/>");
        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/perfectScrollbar/js/perfect-scrollbar.jquery.js\"></script>");
        for(int i=0; i<modules.length; i++){
            switch(modules[i]){
                case "background":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/background.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/background/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/background/background.js\"></script>");
                    out.append("<script>"+
                    "jLego.background = new jLego.objectUI.background();"+
                    "</script>");
                    break;
                case "hintCardCTRLer":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/hintCardCTRLer.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/hintCardCTRLer/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/hintCardCTRLer/hintCardCTRLer.js\"></script>");
                    break;
                case "topBanner":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/topBanner.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/topBanner/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/topBanner/topBanner.js\"></script>");
                    out.append("<script>"+
                    "jLego.topBanner = new jLego.objectUI.topBanner();"+
                    "jLego.variables.resizableObjectList[jLego.variables.resizableObjectList.length] = jLego.topBanner;"+
                    "</script>");
                    break;
                case "leftSideBar":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/leftSideBar.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/leftSideBar/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/leftSideBar/leftSideBar.js\"></script>");
                    out.append("<script>"+
                    "jLego.leftSideBar = new jLego.objectUI.leftSideBar();"+
                    "jLego.variables.resizableObjectList[jLego.variables.resizableObjectList.length] = jLego.leftSideBar;"+
                    "</script>");
                    break;
                case "visMap":
                    if(!isVisImported){
                        out.append("<link rel=\"stylesheet\" href=\"jLego/js/addOns/vis/vis.min.css\" type=\"text/css\"/>");
                        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/vis/vis.min.js\"></script>");
                        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/vis/vis.animateTraffic.js\"></script>");
                        isVisImported = !isVisImported;
                    }
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/visMap.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/visMap/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/visMap/visMap.js\"></script>");
                    out.append("<script>"+
                    "jLego.visMap = new jLego.objectUI.visMap();"+
                    "jLego.variables.resizableObjectList[jLego.variables.resizableObjectList.length] = jLego.visMap;"+
                    "</script>");
                    break;
                case "statusMonitor":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/statusMonitor.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/statusMonitor/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/statusMonitor/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/statusMonitor/statusMonitor.js\"></script>");
                    out.append("<script>"+
                    "jLego.statusMonitor = new jLego.objectUI.statusMonitor();"+
                    "</script>");
                    break;
                case "buttonCTRLer":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/buttonCTRLer.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/buttonCTRLer/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/buttonCTRLer/buttonCTRLer.js\"></script>");
                    break;
                case "windowCTRLer":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/windowCTRLer.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/windowCTRLer/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/windowCTRLer/windowCTRLer.js\"></script>");
                    break;
                case "optionListCTRLer":
                    if(!isImportedDateTimePicker){
                        out.append("<link rel=\"stylesheet\" href=\"jLego/css/addOns/jquery-ui-timepicker-addon.css\" type=\"text/css\"/>");
                        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/dateTimePicker/jquery-ui-timepicker-addon.js\"></script>");
                        out.append("<script type=\"text/javascript\" src=\"jLego/js/addOns/dateTimePicker/jquery-ui-sliderAccess.js\"></script>");
                        isImportedDateTimePicker = true;
                    }
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/optionListCTRLer.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/optionListCTRLer/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/optionListCTRLer/optionListCTRLer.js\"></script>");
                    break;
                case "nowLoading":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/nowLoading.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/nowLoading/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/nowLoading/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/nowLoading/nowLoading.js\"></script>");
                    break;
                case "statusSummaryBar":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/statusSummaryBar.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/statusSummaryBar/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/statusSummaryBar/statusSummaryBar.js\"></script>");
                    out.append("<script>"+
                    "jLego.statusSummaryBar = new jLego.objectUI.statusSummaryBar();"+
                    "jLego.variables.resizableObjectList[jLego.variables.resizableObjectList.length] = jLego.statusSummaryBar;"+
                    "</script>");
                    break;
                case "segmentedButton":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/segmentedButton.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/segmentedButton/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/segmentedButton/segmentedButton.js\"></script>");
                    out.append("<script>"+
                    "jLego.segmentedButton = new jLego.objectUI.segmentedButton();"+
                    "jLego.variables.resizableObjectList[jLego.variables.resizableObjectList.length] = jLego.segmentedButton;"+
                    "</script>");
                    break;
                case "toastCTRLer":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/toastCTRLer.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/toastCTRLer/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/toastCTRLer/toastCTRLer.js\"></script>");
                    out.append("<script>"+
                    "jLego.toastCTRLer = new jLego.objectUI.toastCTRLer();"+
                    "</script>");
                    break;
                case "searchBar":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/searchBar.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/searchBar/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/searchBar/searchBar.js\"></script>");
                    break;
                case "tabPage":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/tabPage.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/tabPage/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/tabPage/tabPage.js\"></script>");
                    break;
               case "nodeTable":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/nodeTable.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/nodeTable/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/nodeTable/nodeTable.js\"></script>");
                    out.append("<script>"+
                    "jLego.nodeTable = new jLego.objectUI.nodeTable();"+
                    "</script>");
                    break;
                case "notificationCenter":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/notificationCenter.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/notificationCenter/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/notificationCenter/notificationCenter.js\"></script>");
                    out.append("<script>"+
                    "jLego.notificationCenter = new jLego.objectUI.notificationCenter();"+
                    "</script>");
                    break;
                case "popoutPanel":
                    out.append("<link rel=\"stylesheet\" href=\"jLego/css/objectUI/popoutPanel.css\" type=\"text/css\"/>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/popoutPanel/languages/autoLanguage.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/popoutPanel/data.js\"></script>");
                    out.append("<script type=\"text/javascript\" src=\"jLego/js/objectUI/popoutPanel/popoutPanel.js\"></script>");
                    break;
                default:
                    break;
            }
        }
    }
}