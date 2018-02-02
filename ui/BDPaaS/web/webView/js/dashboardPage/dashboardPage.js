/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

dashboardPage = function(){
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

dashboardPage.prototype.initialize=function(){
    this.myID=webView.id.dashboardPage;
    this.myClass=webView.cls.dashboardPage;
    this.myConsts=webView.constants.dashboardPage;
    this.myLanguage=webView.lang.dashboardPage;
    
    this.buttonCTRLer = new jLego.objectUI.buttonCTRLer();
    this.searchBarCTRLer = new jLego.objectUI.searchBar();
    this.selectedSparkProjectItem = null;
}

dashboardPage.prototype.add=function(target){
    if(target == null) return;
    else this.parentElement = target;
    //add frames
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.CONTENT_FRAME});
    //jLego.background.add(this.mainElement, jLego.func.getImgPath({category: 'background', name: "bdPaaS_blur", type: 'jpg'}));
    var dashboardPageCTRLer = this;
    
    var myLoading = new jLego.objectUI.nowLoading();
   
    webView.connection.getAllDashboards(function(Jdata){
        if(Jdata.errorCode==0){
            $(dashboardPageCTRLer.mainElement).html('');
            dashboardPageCTRLer.drawDashboardButtons({platformList: Jdata.platform});
            
        }
        else if(Jdata.errorCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
        myLoading.close();
    });

    this.resize(); 
}

dashboardPage.prototype.drawDashboardButtons=function(option){
    var actionButtonFrame =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.ACTION_BUTTON_FRAME});
    
    this.searchBarCTRLer.add(actionButtonFrame, {width: 300, top: 10, left: 20});
    
    var refreshProjectButton =
            this.buttonCTRLer.addFreeSingleButton(actionButtonFrame, {type: "normal", float: 'right', top: 8, right: 10, title: "Refresh", iconURL: jLego.func.getImgPath({category: 'buttonIcon', name: 'refresh', type: 'png'})});
    $(refreshProjectButton).data('parent', this);
    $(refreshProjectButton).click(function(){
       var parent = $(this).data('parent');
       parent.reDrawDashboardPanel();
    });
    var platformButtonFrame =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.PLATFORM_BUTTON_FRAME});

    var projectList = {};
    var itemList = [];
    for(var i=0; i<option.platformList.length; i++){
        var currentProject = option.platformList[i]
        var dashboardItemButton = this.drawItemButton(platformButtonFrame, currentProject.user, "#3d7ba5", jLego.func.getImgPath({folder: "webView/img/button", name: "dashboardWhite", type: "png"}), currentProject);
        $(dashboardItemButton).data('parent', this);
        $(dashboardItemButton).data('projectData', currentProject);
        $(dashboardItemButton).click(function(){
            var parent = $(this).data("parent");
            var projectData = $(this).data('projectData');
            parent.drawDashboardIframe(projectData);
        })
        $(dashboardItemButton).attr('title', currentProject.url);
        $(dashboardItemButton).tooltip();
        itemList[itemList.length] = dashboardItemButton;
    }
    this.setSearchEvent(itemList);
}

dashboardPage.prototype.setSearchEvent=function(itemList){
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
                /*if(projectData.user.toString().indexOf($(this).val()) >=0 || projectData.url.toString().indexOf($(this).val()) >=0){
                    $(currentItem).show();
                }*/
                if(projectData.user.toString().indexOf($(this).val()) >=0){
                    $(currentItem).show(150);
                }
                else{
                    $(currentItem).hide(150);
                }
            }
        }
    });
}

dashboardPage.prototype.drawItemButton=function(target, title, buttonColor, iconURL, projectData){
    var itemButton =
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON});
    $(itemButton).css('background-color', buttonColor);
    var icon = 
           jLego.basicUI.addImg(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_ICON, src: iconURL}); 
    var label =
            jLego.basicUI.addDiv(itemButton, {id: jLego.func.getRandomString(), class: this.myClass.MENU_BUTTON_LABEL});
       $(label).text(title);
    return itemButton;
}

dashboardPage.prototype.drawDashboardIframe=function(projectData){
    var dashboardPageCTRLer = this;
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

dashboardPage.prototype.addBackButton=function(){
    var backButton =
            jLego.basicUI.addImg(this.subIFrameContainer, {class: this.myClass.BACK_BUTTON, src: jLego.func.getImgPath({folder: "webView/img/button", name: "backWhite", type: "png"})});
    $(backButton).data('parent', this);
    $(backButton).click(function(){
        var parent = $(this).data("parent");
        $(parent.subIFrameContainer).remove();
    })
}

dashboardPage.prototype.reDrawDashboardPanel=function(){
    var bigDataPageCTRLer = this;
    var myLoading = new jLego.objectUI.nowLoading();
    var dashboardPageCTRLer = this;
    webView.connection.getAllDashboards(function(Jdata){
        if(Jdata.errorCode==0){
            $(dashboardPageCTRLer.mainElement).html('');
            dashboardPageCTRLer.drawDashboardButtons({platformList: Jdata.platform});
            
        }
        else if(Jdata.errorCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
        myLoading.close();
    });
}


dashboardPage.prototype.resize=function(){
    this.buttonCTRLer.resize();
}
