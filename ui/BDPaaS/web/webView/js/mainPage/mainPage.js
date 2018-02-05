/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

mainPage = function(){
    var myID;
    var myClass;
    var myConsts;
    var myLanguage;
    var parentElement;
    var mainElement;
    var topBannerFrame;
    var contentFrame;
    
    var topBannerHeight;

    var topBannerCTRLer;
    
    //top banner items
    var selectedItem;
    var dashboardItem;
    var sparkConsoleItem;
    var apexConsoleItem;
    var bigDataItem;
    var monitorItem;
    var userItem;
    
    var updateInterval;
    
    var buttonCTRLer;
    
    this.initialize();
}

mainPage.prototype.initialize=function(){
    this.myID=webView.id.mainPage;
    this.myClass=webView.cls.mainPage;
    this.myConsts=webView.constants.mainPage;
    this.myLanguage=webView.lang.mainPage;
    
    this.buttonCTRLer = new jLego.objectUI.buttonCTRLer();
    
    this.topBannerHeight = 32;
}

mainPage.prototype.parseOption=function(option){
    if(option.topBannerHeight!=null) this.topBannerHeight = option.topBannerHeight;
}

mainPage.prototype.add=function(target, option){
    if(target == null) return;
    else this.parentElement = target;
    if(option != null) this.parseOption(option);
    
    //add frames
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME});
    this.topBannerFrame = 
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.TOP_BANNER_FRAME});
    this.contentFrame = 
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.CONTENT_FRAME});
    this.resize(); 
    
    //add top banner
    jLego.topBanner.add(this.topBannerFrame, {
        height: this.topBannerHeight
    });
    
    var mainPageCTRLer = this;
    webView.connection.getMyPlatforms(function(Jdata){
        if(Jdata.errorCode==0){
            mainPageCTRLer.drawTopBannerItems(Jdata);
        }
        else if(Jdata.errorCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
    });
    
}

mainPage.prototype.drawTopBannerItems=function(Jdata){
    this.topBannerCTRLer = jLego.topBanner;
    var hasDashboardFlag = false;
    var hasSparkConsoleFlag = false;
    if(webView.variables.authority == 0){
        if(Jdata.k8sDashboard!=null){
            this.dashboardItem = this.addDashboardItem(Jdata.k8sDashboard);
            hasDashboardFlag = true;
        }
        this.sparkConsoleItem = this.addSparkConsoleItem();
        this.apexConsoleItem = this.addApexConsoleItem();
        hasSparkConsoleFlag = true;
    }
    this.bigDataItem = this.addBigDataItem(Jdata.platform);
    this.addLogoutButton();
    //this.monitorItem = this.addMonitorItem();
    if(webView.variables.authority == 0){
        this.userItem = this.addUserItem();
    }
    if(hasDashboardFlag) $(this.dashboardItem).click();
    else $(this.bigDataItem).click();
}

mainPage.prototype.addDashboardItem=function(dashboardURL){
    var onCallbackObject = {
        arg: {
            mainCTRLer: this,
            dashboardURL: dashboardURL
        },
        callback: function(arg){
            var mainCTRLer = arg.mainCTRLer;
            var currentItem = mainCTRLer.dashboardItem;
            mainCTRLer.selectedItem = currentItem;
            $(mainCTRLer.contentFrame).html('');
            mainCTRLer.disableAllAutoUpdate();
            webView.dashboardPage.add(mainCTRLer.contentFrame, {dashboardURL: arg.dashboardURL});
        }
    }
    var offCallbackObject = {
        arg: {},
        callback: function(arg){
        }
    }
    var dashboardItem = this.topBannerCTRLer.addItem({
        iconURL: jLego.func.getImgPath({folder: "webView/img/topBanner/", name: "dashboardWhite", type: "png"}),
        name: "k8s Dashboard",
        key: "k8sDashboard",
        selected: false
    }, onCallbackObject, offCallbackObject);
    return dashboardItem;
}

mainPage.prototype.addSparkConsoleItem=function(){
    var onCallbackObject = {
        arg: {
            mainCTRLer: this
        },
        callback: function(arg){
            var mainCTRLer = arg.mainCTRLer;
            var currentItem = mainCTRLer.sparkConsoleItem;
            mainCTRLer.selectedItem = currentItem;
            $(mainCTRLer.contentFrame).html('');
            mainCTRLer.disableAllAutoUpdate();
            webView.sparkConsolePage.add(mainCTRLer.contentFrame);
        }
    }
    var offCallbackObject = {
        arg: {},
        callback: function(arg){
        }
    }
    var newItem = this.topBannerCTRLer.addItem({
        iconURL: jLego.func.getImgPath({folder: "webView/img/topBanner/", name: "sparkWhite", type: "png"}),
        name: "Spark Console",
        key: "sparkConsole",
        selected: false
    }, onCallbackObject, offCallbackObject);
    return newItem;
}

mainPage.prototype.addApexConsoleItem=function(){
    var onCallbackObject = {
        arg: {
            mainCTRLer: this
        },
        callback: function(arg){
            var mainCTRLer = arg.mainCTRLer;
            var currentItem = mainCTRLer.apexConsoleItem;
            mainCTRLer.selectedItem = currentItem;
            $(mainCTRLer.contentFrame).html('');
            mainCTRLer.disableAllAutoUpdate();
            webView.apexConsolePage.add(mainCTRLer.contentFrame);
        }
    }
    var offCallbackObject = {
        arg: {},
        callback: function(arg){
        }
    }
    var newItem = this.topBannerCTRLer.addItem({
        iconURL: jLego.func.getImgPath({folder: "webView/img/topBanner/", name: "apexWhite", type: "png"}),
        name: "Apex Console",
        key: "apexConsole",
        selected: false
    }, onCallbackObject, offCallbackObject);
    return newItem;
}

mainPage.prototype.addBigDataItem=function(platformList){
    var onCallbackObject = {
        arg: {
            mainCTRLer: this,
            platformList: platformList
        },
        callback: function(arg){
            var mainCTRLer = arg.mainCTRLer;
            var currentItem = mainCTRLer.bigDataItem;
            mainCTRLer.selectedItem = currentItem;
            $(mainCTRLer.contentFrame).html('');
            mainCTRLer.disableAllAutoUpdate();
            webView.bigDataPage.add(mainCTRLer.contentFrame, {fullIFrameMode: false, platformList: arg.platformList});
        }
    }
    var offCallbackObject = {
        arg: {},
        callback: function(arg){
        }
    }
    var bigDataItem = this.topBannerCTRLer.addItem({
        iconURL: jLego.func.getImgPath({folder: "webView/img/topBanner/", name: "connectWhite", type: "png"}),
        name: "Big Data",
        key: "bigData",
        selected: false
    }, onCallbackObject, offCallbackObject);
    return bigDataItem;
}

mainPage.prototype.addUserItem=function(){
    var onCallbackObject = {
        arg: {
            mainCTRLer: this,
        },
        callback: function(arg){
            var mainCTRLer = arg.mainCTRLer;
            var currentItem = mainCTRLer.dnnItem;
            mainCTRLer.selectedItem = currentItem;
            $(mainCTRLer.contentFrame).html('');
            mainCTRLer.disableAllAutoUpdate();
            webView.userPage.add(mainCTRLer.contentFrame);
            //webView.bigDataPage.add(mainCTRLer.contentFrame, {fullIFrameMode: false});
        }
    }
    var offCallbackObject = {
        arg: {},
        callback: function(arg){
        }
    }
    var newItem = this.topBannerCTRLer.addItem({
        iconURL: jLego.func.getImgPath({folder: "webView/img/topBanner/", name: "userMGMTWhite", type: "png"}),
        name: "User Management",
        key: "userMGMT",
        selected: false
    }, onCallbackObject, offCallbackObject);
    return newItem;
}


mainPage.prototype.addLogoutButton=function(){
    var logoutButton =
            this.buttonCTRLer.addFreeSingleButton(this.topBannerFrame, {type: "transparent", float: 'right', top: 0, right: 10, title: "Logout", iconURL: jLego.func.getImgPath({folder: "webView/img/button", name: "exitWhite", type: "png"})});
    $(logoutButton).click(function(){
        webView.connection.doLogout(function(Jdata){
             window.location = 'login.jsp';
        });
    });
}

mainPage.prototype.resize=function(){
    var windowWidth = $(this.parentElement).width();
    var windowHeight = $(this.parentElement).height();
    //resize main element
    $(this.mainElement).width(windowWidth);
    $(this.mainElement).height(windowHeight);
    //resize top banner frame
    $(this.topBannerFrame).width(windowWidth);
    $(this.topBannerFrame).height(this.topBannerHeight);
    //resize content frame
    var contentWidth = windowWidth;
    var contentHeight = windowHeight - $(this.topBannerFrame).height();
    $(this.contentFrame).width(contentWidth);
    $(this.contentFrame).height(contentHeight); 
    $(this.contentFrame).css('top', $(this.topBannerFrame).height() + "px");
}

mainPage.prototype.resizeHandler=function(){
    if(!jLego.func.isMobile()){
        window.onresize = function() {
            //resize main page
            webView.mainPage.resize();

            //resize objectUI
            jLego.resize();
            
        }
    }
    else{
        window.addEventListener("orientationchange", function() {
            //resize main page
            jLego.variables.webpageCTRLer.resize();
            //resize objectUI
            jLego.resize();
        }, false);
    }
}

mainPage.prototype.disableAllAutoUpdate=function(){

}


