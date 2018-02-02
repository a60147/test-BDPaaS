/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

checkPage = function(){
    var myID;
    var myClass;
    var myConsts;
    var myLanguage;
    var parentElement;
    var mainElement;

    var loginResultFrame;
    var backButton;
    
    this.initialize();
}

checkPage.prototype.initialize=function(){
    this.myID=webView.id.checkPage;
    this.myClass=webView.cls.checkPage;
    this.myConsts=webView.constants.checkPage;
    this.myLanguage=webView.lang.checkPage;
}

checkPage.prototype.add=function(target, option){
    this.parentElement = target;
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: this.myID.MAIN_FRAME, class: this.myClass.MAIN_FRAME});
    jLego.background.add(this.mainElement, jLego.func.getImgPath({category: 'background', name: "bdPaaS", type: 'jpg'}));
    webView.checkPage.DrawLoginResult(this.mainElement);
    this.resize();
}

checkPage.prototype.DrawLoginResult=function(target){
    this.loginResultFrame = 
          jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.RESULT_FRAME}); 
    var resultFrame = 
          jLego.basicUI.addDiv(this.loginResultFrame, {id: jLego.func.getRandomString(), class: this.myClass.RESULT_TEXT_FRAME});   
    $(resultFrame).text("Login Fail!");
    var buttonFrame = 
          jLego.basicUI.addDiv(this.loginResultFrame, {id: jLego.func.getRandomString(), class: this.myClass.RESULT_BUTTON_FRAME});  
    this.backButton = 
          jLego.basicUI.addDiv(buttonFrame, {id: jLego.func.getRandomString(), class: this.myClass.RESULT_BUTTON});
    $(this.backButton).text("Back");
    $(this.backButton).click(function(){
       var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
    });
}

checkPage.prototype.resize=function(){
        var marginLeft = parseInt($(this.mainElement).css('left'));
        var marginTop = parseInt($(this.mainElement).css('top'));
        $(this.mainElement).width($(this.parentElement).width() - (2 * marginLeft));
        $(this.mainElement).height($(this.parentElement).height() - (2 * marginTop));
        var newLeft = ($(this.mainElement).width() - $(this.loginResultFrame).width())/2;
        $(this.loginResultFrame).css('left', parseInt(newLeft) + "px");
}

checkPage.prototype.resizeHandler=function(){
    jLego.variables.webpageCTRLer = this;
    if(!jLego.func.isMobile()){
        window.onresize = function() {
            //resize main page
            jLego.variables.webpageCTRLer.resize();

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