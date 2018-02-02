/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

jLego.objectUI.nowLoading=function(){
    var myID;
    var myClass;
    var myConsts;
    
    this.mainElement;
    this.loadingIcon;
    
    this.totalRotateStep;
    this.rotateStep;
    this.timer;
    
    this.initialize();
}

jLego.objectUI.nowLoading.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.nowLoading;
    this.myClass=jLego.objectUI.cls.nowLoading;
    this.myConsts=jLego.objectUI.constants.nowLoading;
    this.myLanguage = jLego.objectUI.lang.nowLoading;
    
    this.totalRotateStep=10;
    this.rotateStep=0;
}

jLego.objectUI.nowLoading.prototype.add=function(target, option){
    if(jLego.func.isInIframe()){
        //alert(window.self.parent.document)
        //var target = window.self.parent.document;
    }
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.LOADING_BACKGROUND});
    var foregroundElement = 
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.LOADING_FOREGROUND});
    this.loadingIcon = 
            jLego.basicUI.addImg(foregroundElement, {id: jLego.func.getRandomString(), class: this.myClass.LOADING_ICON, src: jLego.func.getImgPath({category: 'nowLoading', name: 'loading', type: 'png'})});
    var loadingText = 
            jLego.basicUI.addDiv(foregroundElement, {id: jLego.func.getRandomString(), class: this.myClass.LOADING_TEXT});
    if(option==null){
        $(loadingText).text(this.myLanguage.LOADING);
    }
    else{
        if(option.loadingText!=null){
            $(loadingText).text(option.loadingText);
        }
        else{
            $(loadingText).text(this.myLanguage.LOADING);
        }
    }
    
    jLego.variables.tempOjbect = this;
    this.timer = setInterval(function(){
        var parent = jLego.variables.tempOjbect;
        parent.rotating();
    }, 100);
}

jLego.objectUI.nowLoading.prototype.rotating=function(){
    var singleStepAngle = 360/this.totalRotateStep;
    var newRotateStep = parseInt((this.rotateStep+1) % this.totalRotateStep);
    this.rotateStep = newRotateStep;
    var angle = singleStepAngle * newRotateStep;
     $(this.loadingIcon).css({
        "-webkit-transform": "rotate("+angle+"deg)",
        "-moz-transform": "rotate("+angle+"deg)",
        "transform": "rotate("+angle+"deg)"});
}

jLego.objectUI.nowLoading.prototype.close=function(){
    $(this.mainElement).remove();
    window.clearInterval(this.timer);
}