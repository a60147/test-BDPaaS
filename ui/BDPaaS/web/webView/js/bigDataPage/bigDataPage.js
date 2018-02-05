/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

bigDataPage = function(){
    var myID;
    var myClass;
    var myConsts;
    var myLanguage;
    
    var parentElement;
    var mainElement;
    
    var fullIFrameElement;
    var subIFrameContainer;
    var subToolElement;
    var subIFrameElement;
    var sparkConsoleIFrameElement;
    var sparkZeppelinIFrameElement;
    var sparkProjectFrame;
    var selectedSparkProjectItem;
    var sparkRunFrame;
    
    var popupPanelCTRLer;
    var buttonCTRLer;
    
    var zeppelinTabButton;
    var sparTabkButton;
    
    var scheduleFrame;
    this.initialize();
}

bigDataPage.prototype.initialize=function(){
    this.myID=webView.id.bigDataPage;
    this.myClass=webView.cls.bigDataPage;
    this.myConsts=webView.constants.bigDataPage;
    this.myLanguage=webView.lang.bigDataPage;
    
    this.buttonCTRLer = new jLego.objectUI.buttonCTRLer();
    this.selectedSparkProjectItem = null;
}

bigDataPage.prototype.add=function(target, option){
    if(target == null) return;
    else this.parentElement = target;
    //add frames
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.CONTENT_FRAME});
    //jLego.background.add(this.mainElement, jLego.func.getImgPath({category: 'background', name: "bdPaaS_blur", type: 'jpg'}));
    var dnnPageCTRLer = this;
    if(option.fullIFrameMode==true){
        var myLoading = new jLego.objectUI.nowLoading();
        myLoading.add(this.mainElement, {loadingText: "Loading.."});
        webView.connection.getDataTorrentURL(function(Jdata){
           if(Jdata.errCode == 0) {
                dnnPageCTRLer.fullIFrameElement = 
                    jLego.basicUI.addIFrame(dnnPageCTRLer.mainElement, {class: dnnPageCTRLer.myClass.CONTENT_FRAME, src: Jdata.url + "/#graphs"});
                $(dnnPageCTRLer.fullIFrameElement).attr('frameBorder', "0");
                $(dnnPageCTRLer.fullIFrameElement).on("load", function () {
                    myLoading.close();
                });
           } 
           else{
               myLoading.close();
           }
        });
    }
    else{
        this.drawPlatformButtons(option);
    }

    this.resize(); 
}

bigDataPage.prototype.drawPlatformButtons=function(option){
    var actionButtonFrame =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.ACTION_BUTTON_FRAME});
    var refreshProjectButton =
            this.buttonCTRLer.addFreeSingleButton(actionButtonFrame, {type: "normal", float: 'right', top: 8, right: 10, title: "Refresh", iconURL: jLego.func.getImgPath({category: 'buttonIcon', name: 'refresh', type: 'png'})});
    $(refreshProjectButton).data('parent', this);
    $(refreshProjectButton).click(function(){
       var parent = $(this).data('parent');
       parent.reDrawBigDataPanel();
    });
    var platformButtonFrame =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.PLATFORM_BUTTON_FRAME});
    /*var reserveButton = this.drawMenuButton(this.mainElement, "Reserve", "#5c5c5c", jLego.func.getImgPath({folder: "webView/img/button", name: "reserveWhite", type: "png"}));
    $(reserveButton).data('parent', this);
    $(reserveButton).click(function(){
        var parent = $(this).data("parent");
        parent.drawReserveForm();
    })*/
    var addProjectButton = this.drawMenuButton(platformButtonFrame, "Add Project", "#5c5c5c", jLego.func.getImgPath({folder: "webView/img/button", name: "plusWhite", type: "png"}));
    $(addProjectButton).data('parent', this);
    $(addProjectButton).click(function(){
        var parent = $(this).data("parent");
        parent.drawAddProjectForm();
    })
    var projectList = {};
    for(var i=0; i<option.platformList.length; i++){
        var currentPlatform = option.platformList[i];
        if(projectList[currentPlatform.projectName] == null){
            projectList[currentPlatform.projectName] = {};
        }

        projectList[currentPlatform.projectName][currentPlatform.type] = currentPlatform.url;
        
        projectList[currentPlatform.projectName]["isCreating"] = currentPlatform.isCreating;
        if(currentPlatform.type == "apex"){
            var projectNameArray = currentPlatform.projectName.toString().split("-");
            var targetProjectName = "";
            if(projectNameArray.length >= 4) targetProjectName = projectNameArray[2] + "-" + projectNameArray[3];
            else targetProjectName = projectNameArray[2];
            projectList[currentPlatform.projectName]["projectName"] = targetProjectName;
            projectList[currentPlatform.projectName]["fullProjectName"] = currentPlatform.projectName;
            projectList[currentPlatform.projectName]["type"] = "apex";
        }
        else if(currentPlatform.type == "spark" || currentPlatform.type == "zeppelin"){
            var projectNameArray = currentPlatform.projectName.toString().split("-");
            var targetProjectName = "";
            if(projectNameArray.length >= 4) targetProjectName = projectNameArray[2] + "-" + projectNameArray[3];
            else targetProjectName = projectNameArray[2];
            projectList[currentPlatform.projectName]["projectName"] = targetProjectName;
            projectList[currentPlatform.projectName]["fullProjectName"] = currentPlatform.projectName;
            projectList[currentPlatform.projectName]["type"] = "spark";
        }
    }

    for(var key in projectList) {
        var currentProject = projectList[key];
        if(currentProject.type == "apex"){
            var apexItemButton = this.drawItemButton(platformButtonFrame, "Apex", "#059eda", jLego.func.getImgPath({folder: "webView/img/button", name: "apex", type: "png"}), currentProject);
            $(apexItemButton).data('parent', this);
            $(apexItemButton).data('projectData', currentProject);
            if(currentProject.isCreating==true){
                $(apexItemButton).css('opacity', '0.5');
                $(apexItemButton).css('cursor', 'not-allowed');
            }
            else{
                $(apexItemButton).click(function(){
                    var parent = $(this).data("parent");
                    var projectData = $(this).data('projectData');
                    parent.drawApexIframe(projectData);
                })
                var deleteButton = this.getDeleteButtonOfItemButton(apexItemButton);
                $(deleteButton).data('parent', this);
                $(deleteButton).data('projectData', currentProject);
                $(deleteButton).click(function(e) {
                    e.stopPropagation();
                    var parent = $(this).data('parent');
                    var projectData = $(this).data('projectData');
                    parent.drawDeleteProjectNotification(projectData);
               });
            }
            
        }
        else if(currentProject.type == "spark"){
            var sparkItemButton = this.drawItemButton(platformButtonFrame, "Spark", "#e1691a", jLego.func.getImgPath({folder: "webView/img/button", name: "spark", type: "png"}), currentProject);
            $(sparkItemButton).data('parent', this);
            $(sparkItemButton).data('projectData', currentProject);
            if(currentProject.isCreating==true){
                $(sparkItemButton).css('opacity', '0.5');
                $(sparkItemButton).css('cursor', 'not-allowed');
            }
            else{
                $(sparkItemButton).click(function(){
                    var parent = $(this).data("parent");
                    var projectData = $(this).data('projectData');
                    parent.drawSparkIframe(projectData);
                })
                var deleteButton = this.getDeleteButtonOfItemButton(sparkItemButton);
                $(deleteButton).data('parent', this);
                $(deleteButton).data('projectData', currentProject);
                $(deleteButton).click(function(e) {
                    e.stopPropagation();
                    var parent = $(this).data('parent');
                    var projectData = $(this).data('projectData');
                    parent.drawDeleteProjectNotification(projectData);
               });
            }
        }
     }
}
bigDataPage.prototype.drawSparkIframe=function(projectData){
    var bigDataPageCTRLer = this;
    if(this.subIFrameContainer != null) $(this.subIFrameContainer).remove();
    this.subIFrameContainer = 
            jLego.basicUI.addDiv(this.mainElement, {class: this.myClass.CONTENT_FRAME});
    this.subToolElement = 
            jLego.basicUI.addDiv(this.subIFrameContainer, {class: this.myClass.CONTENT_TOOL_FRAME});
    this.drawSparkTool(this.subToolElement, projectData);
    this.addBackButton();        
    
}

bigDataPage.prototype.drawSparkTool=function(target, projectData){
    /*var runButton = 
        jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_BUTTON});    
    $(runButton).text('Run');
    $(runButton).css('margin-right', '20px');
    var gap =
        jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_GAP});   
    var projectButton = 
        jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_BUTTON});  
    $(projectButton).text('Projects');
    var gap =
        jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_GAP});   
    var consoleButton = 
        jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_BUTTON});  
    $(consoleButton).text('Console');
    
    var buttonObjects = {
        consoleButton: consoleButton,
        projectButton: projectButton,
        runButton: runButton
    }
    $(consoleButton).data('buttonObjects', buttonObjects);
    $(projectButton).data('buttonObjects', buttonObjects);
    $(runButton).data('buttonObjects', buttonObjects);
    this.setSparkConsoleClickEvent(consoleButton);
    this.setSparkProjectClickEvent(projectButton);*/
    if(projectData["zeppelin"] != null){
        this.zeppelinTabButton  = 
            jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_BUTTON});  
        $(this.zeppelinTabButton).text('Zeppelin');  
        $(this.zeppelinTabButton).css('margin-right', '20px');
        this.setSparkZeppelinClickEvent(projectData["zeppelin"]);
    }
    if(projectData["spark"] != null){
        if(webView.variables.authority == 0){
            var gap =
                jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_GAP}); 
            this.sparkTabButton = 
                jLego.basicUI.addDiv(target, {class: this.myClass.TOOL_BUTTON});  
            $(this.sparkTabButton).text('Spark');
            this.setSparkConsoleClickEvent(projectData["spark"]);
        }
        
    }
    if(this.zeppelinTabButton!=null) $(this.zeppelinTabButton).click();
    else if(this.sparkTabButton!=null) $(this.sparkTabButton).click();
}

bigDataPage.prototype.drawDeleteProjectNotification=function(projectData){
    this.popupPanelCTRLer = new jLego.objectUI.popoutPanel();
    this.popupPanelCTRLer.add(document.body, {hasFootFrame: true, 
                                               title: "Delete Project",
                                               minHeightInPixel: 200,
                                               minWidthInPixel: 300,
                                               maxHeightInPixel: 200,
                                               maxWidthInPixel: 600,
                                               });
    var contentFrame = this.popupPanelCTRLer.getContentFrame();  
    var description = 
            jLego.basicUI.addDiv(contentFrame, {id: jLego.func.getRandomString(), class: ''});
    $(description).text(projectData.projectName + " will be deleted, are you sure?");
    $(description).css('margin-left', '10px');
    $(description).css('margin-top', '10px');
    $(description).css('text-align', 'left');
    var footerFrame = this.popupPanelCTRLer.getFootFrame();
    var okButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'positive', float: 'right', top: 4, right: 5, title: "OK", iconURL: jLego.func.getImgPath({category: 'buttonIcon/white', name: 'success', type: 'png'})});
    $(okButton).data('parent', this);
    $(okButton).data('projectData', projectData);
    $(okButton).click(function(){
        var parent = $(this).data('parent');
        var projectData = $(this).data('projectData');
        parent.popupPanelCTRLer.close();
        webView.connection.deleteProjectByUser({projectName: projectData.projectName, type: projectData.type}, function(Jdata){
            if(Jdata.errorCode==0){
                jLego.toastCTRLer.addSuccess({
                    title: "Deleting",
                    content: "Please wait..."
                });
                parent.reDrawBigDataPanel();
            }
            else if(Jdata.errorCode == 101){
                var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
            }
            else{
                jLego.toastCTRLer.addError({
                    title: "Error",
                    content: "Cannot delete."
                });
            }
            
        });
        //parent.doGCReserveSetting(this);
        /*parent.popoutPanelCTRLer.close();
        jLego.toastCTRLer.addSuccess({
            title: parent.myLanguage.SETTING_SUCCESS_SET_TITLE,
            content: parent.myLanguage.SETTING_SUCCESS_SET_CONTENT
        });*/
    });
    var cancelButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'negtive', float: 'right', top: 4, right: 5, title: "Cancel", iconURL: jLego.func.getImgPath({category: 'buttonIcon/white', name: 'error', type: 'png'})});
    $(cancelButton).data('parent', this);
    $(cancelButton).click(function(){
        var parent = $(this).data('parent');
        parent.popupPanelCTRLer.close();
    });
}

bigDataPage.prototype.deleteProject=function(projectData){
    
}
bigDataPage.prototype.setSparkConsoleClickEvent=function(targetURL){
    var bigDataPageCTRLer = this;
    var targetURL = targetURL;
    $(this.sparkTabButton).data('isON', false);
    $(this.sparkTabButton).click(function(){
        var myLoading = new jLego.objectUI.nowLoading();
        var isON = $(this).data('isON');
        if(!isON){
            $(this).attr('class', bigDataPageCTRLer.myClass.TOOL_BUTTON_CLICK);
            $(bigDataPageCTRLer.zeppelinTabButton).attr('class', bigDataPageCTRLer.myClass.TOOL_BUTTON);
            $(bigDataPageCTRLer.zeppelinTabButton).data('isON', false);
            myLoading.add(bigDataPageCTRLer.mainElement, {loadingText: "Loading.."});
            if(bigDataPageCTRLer.sparkConsoleIFrameElement!=null) $(bigDataPageCTRLer.sparkConsoleIFrameElement).remove();
            if(bigDataPageCTRLer.sparkZeppelinIFrameElement!=null) $(bigDataPageCTRLer.sparkZeppelinIFrameElement).hide();
            bigDataPageCTRLer.sparkConsoleIFrameElement = 
                jLego.basicUI.addIFrame(bigDataPageCTRLer.subIFrameContainer, {class: bigDataPageCTRLer.myClass.CONTENT_I_FRAME, src: targetURL});
            $(bigDataPageCTRLer.sparkConsoleIFrameElement).attr('frameBorder', "0");
            $(bigDataPageCTRLer.sparkConsoleIFrameElement).on("load", function () {
                myLoading.close();
            });
        }
        
    });
}

bigDataPage.prototype.setSparkZeppelinClickEvent=function(targetURL){
    var bigDataPageCTRLer = this;
    var targetURL = targetURL;
    $(this.zeppelinTabButton).data('isON', false);
    $(this.zeppelinTabButton).click(function(){
        var isON = $(this).data('isON');
        if(!isON){
            $(this).attr('class', bigDataPageCTRLer.myClass.TOOL_BUTTON_CLICK);
            $(bigDataPageCTRLer.sparkTabButton).attr('class', bigDataPageCTRLer.myClass.TOOL_BUTTON);
            $(bigDataPageCTRLer.sparkTabButton).data('isON', false);
            var myLoading = new jLego.objectUI.nowLoading();
            myLoading.add(bigDataPageCTRLer.mainElement, {loadingText: "Loading.."});
            if(bigDataPageCTRLer.sparkZeppelinIFrameElement!=null) $(bigDataPageCTRLer.sparkZeppelinIFrameElement).remove();
            if(bigDataPageCTRLer.sparkConsoleIFrameElement!=null) $(bigDataPageCTRLer.sparkConsoleIFrameElement).hide();
            bigDataPageCTRLer.sparkZeppelinIFrameElement = 
                jLego.basicUI.addIFrame(bigDataPageCTRLer.subIFrameContainer, {class: bigDataPageCTRLer.myClass.CONTENT_I_FRAME, src: targetURL});
            $(bigDataPageCTRLer.sparkZeppelinIFrameElement).attr('frameBorder', "0");
            $(bigDataPageCTRLer.sparkZeppelinIFrameElement).on("load", function () {
                myLoading.close();
            });
        }
    });
}



bigDataPage.prototype.setSparkProjectClickEvent=function(button){
    var bigDataPageCTRLer = this;
    $(button).click(function(){
        var myLoading = new jLego.objectUI.nowLoading();
        myLoading.add(bigDataPageCTRLer.mainElement, {loadingText: "Loading.."});
        webView.connection.getSparkProjectList(function(Jdata){
            if(Jdata.errCode == 0) {
                bigDataPageCTRLer.drawSparkProjectFrame(Jdata);
            } 
            else{

            }
            myLoading.close();
         });
    });
}  
bigDataPage.prototype.drawSparkProjectFrame = function(Jdata){
    if(this.sparkProjectFrame != null) $(this.sparkProjectFrame).show();
    else{
        this.sparkProjectFrame = 
            jLego.basicUI.addDiv(this.subIFrameContainer, {class: this.myClass.CONTENT_I_FRAME});
        var buttonFrame =
            jLego.basicUI.addDiv(this.sparkProjectFrame, {class: this.myClass.SPARK_PROJECT_BUTTON_FRAME});   
        var addProjectButton =
            this.buttonCTRLer.addFreeSingleButton(buttonFrame, {type: "info", float: 'left', top: 4, left: 10, title: "Add Project", iconURL: jLego.func.getImgPath({folder: "webView/img/button", name: "plusWhite", type: "png"})});

        var projectListFrame =
            jLego.basicUI.addDiv(this.sparkProjectFrame, {class: this.myClass.SPARK_PROJECT_LIST_FRAME});       
        for(var i=0; i<Jdata.projectList.length; i++){
            this.drawSparkProjectItem(Jdata.projectList[i], projectListFrame);
        }
    }
}

bigDataPage.prototype.drawSparkProjectItem=function(project, target){
    var projectFrame =
        jLego.basicUI.addDiv(target, {class: this.myClass.SPARK_PROJECT_LIST_ITEM_FRAME});  
    var projectIcon =
        jLego.basicUI.addImg(projectFrame, {class: this.myClass.SPARK_PROJECT_LIST_ITEM_ICON, src: jLego.func.getImgPath({folder: "webView/img/spark", name: "project", type: "png"})});    
    var projectText =
        jLego.basicUI.addDiv(projectFrame, {class: this.myClass.SPARK_PROJECT_LIST_ITEM_TEXT});   
    $(projectText).text(project.name);
    var projectArrow =
        jLego.basicUI.addImg(projectFrame, {class: this.myClass.SPARK_PROJECT_LIST_ITEM_ARROW, src: jLego.func.getImgPath({folder: "webView/img/spark", name: "arrow", type: "png"})});   
    this.setupSparkProjectItemClickEvent(projectFrame);
}

bigDataPage.prototype.setupSparkProjectItemClickEvent=function(projectItem){
    $(projectItem).data('parent', this);
    $(projectItem).data('isON', false);
    $(projectItem).click(function(){
       var parent = $(this).data('parent');
       var isON = $(this).data('isON');
       if(isON == true){
           parent.selectedSparkProjectItem = null;
           $(this).attr('class', parent.myClass.SPARK_PROJECT_LIST_ITEM_FRAME);
       }
       else{
           if(parent.selectedSparkProjectItem != null) $(parent.selectedSparkProjectItem).click();
           $(this).attr('class', parent.myClass.SPARK_PROJECT_LIST_ITEM_FRAME_SELECTED);
           parent.selectedSparkProjectItem = this;
       }
       $(this).data('isON', !isON);
    });
}

bigDataPage.prototype.setSparkRunClickEvent=function(button){
    
}

bigDataPage.prototype.drawApexIframe=function(projectData){
    var bigDataPageCTRLer = this;
    var myLoading = new jLego.objectUI.nowLoading();
    myLoading.add(this.mainElement, {loadingText: "Loading.."});
    if(this.subIFrameContainer != null) $(this.subIFrameContainer).remove();
    this.subIFrameContainer = 
            jLego.basicUI.addDiv(this.mainElement, {class: this.myClass.CONTENT_FRAME});
    this.subToolElement = 
            jLego.basicUI.addDiv(this.subIFrameContainer, {class: this.myClass.CONTENT_TOOL_FRAME});
    this.addBackButton(); 
    
    this.subIFrameElement = 
        jLego.basicUI.addIFrame(this.subIFrameContainer, {class: this.myClass.CONTENT_I_FRAME, src: projectData.apex});
    $(this.subIFrameElement).attr('frameBorder', "0");
    $(this.subIFrameElement).on("load", function () {
        myLoading.close();
    });
            
}

bigDataPage.prototype.addBackButton=function(){
    var backButton =
            jLego.basicUI.addImg(this.subIFrameContainer, {class: this.myClass.BACK_BUTTON, src: jLego.func.getImgPath({folder: "webView/img/button", name: "backWhite", type: "png"})});
    $(backButton).data('parent', this);
    $(backButton).click(function(){
        var parent = $(this).data("parent");
        $(parent.subIFrameContainer).remove();
    })
}

bigDataPage.prototype.drawMenuButton=function(target, title, buttonColor, iconURL){
    var menuButton =
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON});
    $(menuButton).css('background-color', buttonColor);
    var icon = 
           jLego.basicUI.addImg(menuButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_ICON, src: iconURL}); 
   var label =
            jLego.basicUI.addDiv(menuButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL});
       $(label).text(title);
    return menuButton;
}

bigDataPage.prototype.drawItemButton=function(target, title, buttonColor, iconURL, projectData){
    var itemButton =
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON});
    $(itemButton).css('background-color', buttonColor);
    var icon = 
           jLego.basicUI.addImg(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_ICON, src: iconURL}); 
    if(projectData==null){
       var label =
            jLego.basicUI.addDiv(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL});
       $(label).text(title);
   }
   else{
       var label =
            jLego.basicUI.addDiv(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL_HALF});
       $(label).text(title);
       $(label).css('margin-top', '15px');
       var projectNameLabel =
            jLego.basicUI.addDiv(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL_HALF});
       $(projectNameLabel).text(projectData.projectName);
       if(projectData.isCreating==true){
           var loadIcon = 
                jLego.basicUI.addImg(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_LOADING_BUTTON_ICON, src: jLego.func.getImgPath({folder: "webView/img/button", name: "loadingWhite", type: "png"})}); 
           $(itemButton).attr('title', 'Unavailable');
           $(itemButton).tooltip();
        }
       else{
           var deleteButton = 
                jLego.basicUI.addImg(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_DELETE_BUTTON_ICON, src: jLego.func.getImgPath({folder: "webView/img/button", name: "deleteWhite", type: "png"})}); 
           $(deleteButton).attr('title', 'Delete');
           $(deleteButton).tooltip();
           $(itemButton).data('deleteButton', deleteButton);
       }
   }
    return itemButton;
}

bigDataPage.prototype.getDeleteButtonOfItemButton=function(itemButton){
    return $(itemButton).data('deleteButton');
}

bigDataPage.prototype.drawReserveForm=function(){
    this.popupPanelCTRLer = new jLego.objectUI.popoutPanel();
    var optionListCTRLer = new jLego.objectUI.optionListCTRLer();
    this.popupPanelCTRLer.add(document.body, {hasFootFrame: true, title: "Reservation"});
    var contentFrame = this.popupPanelCTRLer.getContentFrame();
    
    var scheduleOutterFrame =
            jLego.basicUI.addDiv(contentFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCHEDULE_OUTTER_FRAME});
    
    this.scheduleFrame =
            jLego.basicUI.addDiv(scheduleOutterFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCHEDULE_FRAME});
    this.drawScheduleTable(this.scheduleFrame);
    var footerFrame = this.popupPanelCTRLer.getFootFrame();
    var submitButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'positive', top: 4, right: 10, title: "Reserve"});
    $(submitButton).data('parent', this);
   
    $(submitButton).click(function(){

    });
}

bigDataPage.prototype.drawScheduleTable=function(scheduleFrame){
    var bigDataPageCTRLer = this;
    var appointments = new Array();
    
    // prepare the data
    var source =
    {
        dataType: "array",
        dataFields: [
            { name: 'id', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'subject', type: 'string' },
            { name: 'calendar', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' }
        ],
        id: 'id',
        localData: appointments
    };
    var adapter = new $.jqx.dataAdapter(source);
    $(scheduleFrame).jqxScheduler({
        date: new $.jqx.date(2016, 11, 23),
        width: 850,
        height: 600,
        source: adapter,
        view: 'monthView',
        showLegend: true,
        editDialogCreate:bigDataPageCTRLer.editDialogCreate,
        ready: function () {
            $(scheduleFrame).jqxScheduler('ensureAppointmentVisible', 'id1');
        },
        resources:
        {
            colorScheme: "scheme05",
            dataField: "calendar",
            source:  new $.jqx.dataAdapter(source)
        },
        appointmentDataFields:
        {
            from: "start",
            to: "end",
            id: "id",
            description: "description",
            location: "location",
            subject: "subject",
            resourceId: "calendar"
        },
        views:
        [
            'dayView',
            'weekView',
            'monthView'
        ]
    });
}

bigDataPage.prototype.editDialogCreate=function(dialog, fields, editAppointment){

    fields.repeatContainer.hide();
    // hide status option
    fields.statusContainer.hide();
    // hide timeZone option
    fields.timeZoneContainer.hide();
    // hide color option
    fields.colorContainer.hide();
    
    fields.locationContainer.hide();
    
    fields.subjectLabel.html("Title");
    //fields.locationLabel.html("Where");
    fields.fromLabel.html("Start");
    fields.toLabel.html("End");
    fields.resourceLabel.html("Calendar");
    
    var idKey = $(webView.bigDataPage.scheduleFrame).attr('id');
    
    var imageSelection = $("<div id=\"imageSelectionContainer\">\n\
                          <div id=\"imageSelectionLabel\" class=\"jqx-scheduler-edit-dialog-label\">Image</div> \n\
                          <div id=\"imageSelectionInput" + idKey + "\" class=\"jqx-scheduler-edit-dialog-field\">\n\
                       </div>");
    
    
    $("#dialog" + idKey).children().last().before($(imageSelection));
    var imageList = ["Windows 10", "Ubuntu 14.0", "RedHat 6"];
    $("#imageSelectionInput" + idKey).jqxDropDownList({ source: imageList, selectedIndex: 1, width: '370', height: '20'});
}

bigDataPage.prototype.drawAddProjectForm=function(){
    this.popupPanelCTRLer = new jLego.objectUI.popoutPanel();
    var optionListCTRLer = new jLego.objectUI.optionListCTRLer();
    this.popupPanelCTRLer.add(document.body, {hasFootFrame: true, title: "Add Project"});
    var contentFrame = this.popupPanelCTRLer.getContentFrame();
    $(contentFrame).css('overflow', 'auto');
    var projectType = optionListCTRLer.add(contentFrame, {
        title: "Role",
        type: 'select',
        inputType: 'text',
        selectionName: ["Spark", "Apex"],
        selectionValue: ['spark', 'apex'],
        defaultValue: 'spark',
        hideButton: true,
        hideBottomBorder: false,
    });
    var projectName = optionListCTRLer.add(contentFrame, {
        title: "Project Name",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    this.setupInputTextOnly(projectName);
    var footerFrame = this.popupPanelCTRLer.getFootFrame();
    var submitButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'positive', top: 4, right: 10, title: "Add"});
    $(submitButton).data('parent', this);
    $(submitButton).data('inputDataSet', {
        optionListCTRLer: optionListCTRLer,
        projectType: projectType,
        projectName: projectName,
    });
     $(submitButton).click(function(){
        var parent = $(this).data('parent');
        var inputDataSet = $(this).data('inputDataSet');
        var optionListCTRLer = inputDataSet.optionListCTRLer;
        var inputProjectType=optionListCTRLer.getValue(inputDataSet.projectType);
        var inputProjectName = optionListCTRLer.getValue(inputDataSet.projectName);


        if(inputProjectName == ""){
            jLego.toastCTRLer.addError({title: "Error", content: "Please fill all field."});
        }
        else{
            var inputForm = {
                type: inputProjectType,
                projectName: inputProjectName
            }

            var completeCallback = function(Jdata){
                if(Jdata.errorCode==0){
                    parent.popupPanelCTRLer.close();
                    jLego.toastCTRLer.addSuccess({title: "Success", content: "Add success!"});   
                    parent.reDrawBigDataPanel();
                }
                else if(Jdata.errorCode == 101){
                    var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
                }
                else{
                    jLego.toastCTRLer.addError({title: "Error", content: "Failed!"});
                }
            }
            webView.connection.addProjectByUser(inputForm, completeCallback);
        }
    });
}

bigDataPage.prototype.setupInputTextOnly=function(element){
    $(element).data('currentValue', $(element).val());
    $(element).keydown(function (e) {
        var txt = String.fromCharCode(e.which);
        if(e.which==8 || e.which == 37 || e.which == 39 || e.which == 46|| e.which == 36){
            
        }
        else if(!txt.match(/[A-Za-z0-9+#.]/)) {
            return false;
        }
    });
}

bigDataPage.prototype.reDrawBigDataPanel=function(){
    var bigDataPageCTRLer = this;
    webView.connection.getMyPlatforms(function(Jdata){
        if(Jdata.errorCode==0){
            $(bigDataPageCTRLer.mainElement).html('');
            bigDataPageCTRLer.drawPlatformButtons({platformList: Jdata.platform});
            
        }
        else if(Jdata.errorCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
    });
}

bigDataPage.prototype.resize=function(){
    this.buttonCTRLer.resize();
}
