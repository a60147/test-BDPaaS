/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

loginPage = function(){
    var myID;
    var myClass;
    var myConsts;
    var myLanguage;
    var parentElement;
    var mainElement;

    var loginForm;
    var accountField;
    var passwordField;
    var loginButton;
    
    this.initialize();
}

loginPage.prototype.initialize=function(){
    this.myID=webView.id.loginPage;
    this.myClass=webView.cls.loginPage;
    this.myConsts=webView.constants.loginPage;
    this.myLanguage=webView.lang.loginPage;
}

loginPage.prototype.add=function(target, option){
    this.parentElement = target;
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: this.myID.MAIN_FRAME, class: this.myClass.MAIN_FRAME});
    jLego.background.add(this.mainElement, jLego.func.getImgPath({category: 'background', name: "bdPaaS", type: 'jpg'}));
    webView.loginPage.DrawLoginPage(this.mainElement);
    this.resize();
    $(this.loginForm).fadeIn(1500);
}

loginPage.prototype.DrawLoginPage=function(target){
    this.loginForm = 
          jLego.basicUI.addForm(target, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_FRAME, method: 'post', action: 'check.jsp'});
    $(this.loginForm).hide();
    var titleFrame =
          jLego.basicUI.addDiv(this.loginForm, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_TITLE_FRAME}); 
    $(titleFrame).text("BDPAAS");
    var accountFrame = 
          jLego.basicUI.addDiv(this.loginForm, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_FRAME});   
    var accountTitle = 
          jLego.basicUI.addDiv(accountFrame, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_TITLE}); 
    $(accountTitle).text("ACCOUNT:");
    this.accountField = 
          jLego.basicUI.addInput(accountFrame, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_BOX, type: 'text', name: 'account'});
    var passwordFrame =
          jLego.basicUI.addDiv(this.loginForm, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_FRAME});  
    var passwordTitle = 
          jLego.basicUI.addDiv(passwordFrame, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_TITLE}); 
    $(passwordTitle).text("PASSWORD:");
    this.passwordField = 
          jLego.basicUI.addInput(passwordFrame, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_BOX, type: 'password', name: 'password'});
    var buttonFrame = 
          jLego.basicUI.addDiv(this.loginForm, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_INPUT_FRAME});  
    this.loginButton = 
            jLego.basicUI.addButton(buttonFrame, {id: jLego.func.getRandomString(), class: this.myClass.LOGIN_BUTTON, name: 'login', label: "Login"}); 
}

loginPage.prototype.resize=function(){
        var marginLeft = parseInt($(this.mainElement).css('left'));
        var marginTop = parseInt($(this.mainElement).css('top'));
        $(this.mainElement).width($(this.parentElement).width() - (2 * marginLeft));
        $(this.mainElement).height($(this.parentElement).height() - (2 * marginTop));
        var newLeft = ($(this.mainElement).width() - $(this.loginForm).width())/2;
        $(this.loginForm).css('left', parseInt(newLeft) + "px");
}

loginPage.prototype.resizeHandler=function(){
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