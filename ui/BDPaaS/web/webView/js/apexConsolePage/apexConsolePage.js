/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

apexConsolePage = function(){
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
    
    var searchBarCTRLer;
    
    this.initialize();
}

apexConsolePage.prototype.initialize=function(){
    this.myID=webView.id.apexConsolePage;
    this.myClass=webView.cls.apexConsolePage;
    this.myConsts=webView.constants.apexConsolePage;
    this.myLanguage=webView.lang.apexConsolePage;
    
    this.buttonCTRLer = new jLego.objectUI.buttonCTRLer();
    this.searchBarCTRLer = new jLego.objectUI.searchBar();
    this.selectedSparkProjectItem = null;
}

apexConsolePage.prototype.add=function(target){
    if(target == null) return;
    else this.parentElement = target;
    //add frames
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.CONTENT_FRAME});
    //jLego.background.add(this.mainElement, jLego.func.getImgPath({category: 'background', name: "bdPaaS_blur", type: 'jpg'}));
    var apexConsolePageCTRLer = this;
    
    var myLoading = new jLego.objectUI.nowLoading();
   
    webView.connection.getAllApexConsoles(function(Jdata){
        if(Jdata.errorCode==0){
            $(apexConsolePageCTRLer.mainElement).html('');
            apexConsolePageCTRLer.drawConsoleButtons({platformList: Jdata.platform});
            
        }
        else if(Jdata.errorCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
        myLoading.close();
    });

    this.resize(); 
}

apexConsolePage.prototype.drawConsoleButtons=function(option){
    var actionButtonFrame =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.ACTION_BUTTON_FRAME});
    
    this.searchBarCTRLer.add(actionButtonFrame, {width: 300, top: 10, left: 20});
    
    var refreshProjectButton =
            this.buttonCTRLer.addFreeSingleButton(actionButtonFrame, {type: "normal", float: 'right', top: 8, right: 10, title: "Refresh", iconURL: jLego.func.getImgPath({category: 'buttonIcon', name: 'refresh', type: 'png'})});
    $(refreshProjectButton).data('parent', this);
    $(refreshProjectButton).click(function(){
       var parent = $(this).data('parent');
       parent.reDrawPanel();
    });
    var platformButtonFrame =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.PLATFORM_BUTTON_FRAME});

    var projectList = {};
    var itemList = [];
    for(var i=0; i<option.platformList.length; i++){
        var currentProject = option.platformList[i];
        var projectNameArray = currentProject.projectName.toString().split("-");
        var targetProjectName = "";
        if(projectNameArray.length >= 4) targetProjectName = projectNameArray[2] + "-" + projectNameArray[3];
        else targetProjectName = projectNameArray[2];
        currentProject.partialProjectName = targetProjectName;
        if(currentProject.type == "hadoop"){
            var itemButton = this.drawItemButton(platformButtonFrame, currentProject.user, "#c7aa11", jLego.func.getImgPath({folder: "webView/img/button", name: "hadoopWhite", type: "png"}), currentProject);
        }
        else if(currentProject.type == "yarn"){
            var itemButton = this.drawItemButton(platformButtonFrame, currentProject.user, "#5fa33e", jLego.func.getImgPath({folder: "webView/img/button", name: "yarnWhite", type: "png"}), currentProject);
        }
        $(itemButton).data('parent', this);
        $(itemButton).data('projectData', currentProject);
        $(itemButton).click(function(){
            var parent = $(this).data("parent");
            var projectData = $(this).data('projectData');
            parent.drawIframe(projectData);
        })
        $(itemButton).attr('title', currentProject.url);
        $(itemButton).tooltip();
        itemList[itemList.length] = itemButton;
    }
    this.setSearchEvent(itemList);
}

apexConsolePage.prototype.setSearchEvent=function(itemList){
    var searchElement = this.searchBarCTRLer.getSearchElement();
    searchElement.off('keyup');
    $(searchElement).data('itemList', itemList);
    $(searchElement).data('parent', this);
    searchElement.on('keyup', function(){
        var parent = $(this).data('parent');
        var itemList = $(this).data('itemList');
        for(var i=0; i<itemList.length; i++){
            var currentItem = itemList[i];
            if($(this).val()==""){
                $(currentItem).show(150);
            }
            else{
                var projectData = $(currentItem).data('projectData');
                if(projectData.user.toString().indexOf($(this).val()) >=0 || projectData.partialProjectName.toString().indexOf($(this).val()) >=0){
                    $(currentItem).show();
                }
                /*if(projectData.user.toString().indexOf($(this).val()) >=0){
                    $(currentItem).show(150);
                }*/
                else{
                    $(currentItem).hide(150);
                }
            }
        }
    });
}

apexConsolePage.prototype.drawItemButton=function(target, title, buttonColor, iconURL, projectData){
    var itemButton =
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON});
    $(itemButton).css('background-color', buttonColor);
    var icon = 
           jLego.basicUI.addImg(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_ICON, src: iconURL}); 
   
   var label =
        jLego.basicUI.addDiv(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL_HALF});
   $(label).text(title);
   $(label).css('margin-top', '15px');
   
   var projectNameLabel =
        jLego.basicUI.addDiv(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL_HALF});
   $(projectNameLabel).text(projectData.partialProjectName);
       
    return itemButton;
}

apexConsolePage.prototype.drawIframe=function(projectData){
    var apexConsolePageCTRLer = this;
    if(this.subIFrameContainer != null) $(this.subIFrameContainer).remove();
    this.subIFrameContainer = 
            jLego.basicUI.addDiv(this.mainElement, {class: this.myClass.CONTENT_FRAME});
    this.subToolElement = 
            jLego.basicUI.addDiv(this.subIFrameContainer, {class: this.myClass.CONTENT_TOOL_FRAME});
    this.addBackButton();        
    var myLoading = new jLego.objectUI.nowLoading();
    myLoading.add(this.mainElement, {loadingText: "Loading.."});
    this.subIFrameElement = 
        jLego.basicUI.addIFrame(this.subIFrameContainer, {class: this.myClass.CONTENT_I_FRAME, src: projectData.url}); 
    $(this.subIFrameElement).attr('frameBorder', "0");
    $(this.subIFrameElement).on("load", function () {
        myLoading.close();
    });

}

apexConsolePage.prototype.addBackButton=function(){
    var backButton =
            jLego.basicUI.addImg(this.subIFrameContainer, {class: this.myClass.BACK_BUTTON, src: jLego.func.getImgPath({folder: "webView/img/button", name: "backWhite", type: "png"})});
    $(backButton).data('parent', this);
    $(backButton).click(function(){
        var parent = $(this).data("parent");
        $(parent.subIFrameContainer).remove();
    })
}

apexConsolePage.prototype.reDrawPanel=function(){
    var bigDataPageCTRLer = this;
    var myLoading = new jLego.objectUI.nowLoading();
    var apexConsolePageCTRLer = this;
    webView.connection.getAllSparkConsoles(function(Jdata){
        if(Jdata.errorCode==0){
            $(apexConsolePageCTRLer.mainElement).html('');
            apexConsolePageCTRLer.drawSparkConsoleButtons({platformList: Jdata.platform});
            
        }
        else if(Jdata.errorCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
        myLoading.close();
    });
}


apexConsolePage.prototype.resize=function(){
    this.buttonCTRLer.resize();
}
