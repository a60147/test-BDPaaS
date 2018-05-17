/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
jLego.objectUI.toastCTRLer=function(){
    var myID;
    var myClass;
    var myLanguage;
    var myConsts;

    var mainElement;
    
    this.initialize();
}

jLego.objectUI.toastCTRLer.prototype.initialize=function(){
    this.myID = jLego.objectUI.id.toastCTRLer;
    this.myClass = jLego.objectUI.cls.toastCTRLer;
    this.myConsts = jLego.objectUI.constants.toastCTRLer;
    this.myLanguage=jLego.objectUI.lang.toastCTRLer;
}

jLego.objectUI.toastCTRLer.prototype.add=function(option){
    this.mainElement = 
        jLego.basicUI.addDiv(document.body, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_MAIN_FRAME});
    if(option!=null){
        if(option.alignBottom == true){
            $(this.mainElement).css('bottom', "20px");
        }
        else{
            $(this.mainElement).css('top', '0px');
        }
    }
    else{
        $(this.mainElement).css('top', '0px');
    }
}

jLego.objectUI.toastCTRLer.prototype.addWarning=function(option){
    if(option==null) return;  
    if(this.mainElement == null)  this.add();
    var cardClass = this.myClass.TOASTCTRLER_CARD_WARNING;
    var card = this.addCard(cardClass, jLego.func.getImgPath({category: 'toastCTRLer', name: 'warning', type: 'png'}), option);
    return card;
}

jLego.objectUI.toastCTRLer.prototype.addError=function(option){
    if(option==null) return;
    if(this.mainElement == null)  this.add();
    var cardClass = this.myClass.TOASTCTRLER_CARD_ERROR;
    var card = this.addCard(cardClass, jLego.func.getImgPath({category: 'toastCTRLer', name: 'error', type: 'png'}), option);
    return card;
}

jLego.objectUI.toastCTRLer.prototype.addInfo=function(option){
    if(option==null) return;
    if(this.mainElement == null)  this.add();
    var cardClass = this.myClass.TOASTCTRLER_CARD_INFO;
    var card = this.addCard(cardClass, jLego.func.getImgPath({category: 'toastCTRLer', name: 'info', type: 'png'}), option);
    return card;
}

jLego.objectUI.toastCTRLer.prototype.addSuccess=function(option){
    if(option==null) return;
    if(this.mainElement == null)  this.add();
    var cardClass = this.myClass.TOASTCTRLER_CARD_SUCCESS;
    var card = this.addCard(cardClass, jLego.func.getImgPath({category: 'toastCTRLer', name: 'success', type: 'png'}), option);
    return card;
}

jLego.objectUI.toastCTRLer.prototype.addCard = function(cardClass, cardIcon, option){
    var outterFrame =
        jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_CARD + " " + cardClass}); 
    var title =
        jLego.basicUI.addDiv(outterFrame, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_CARD_TITLE});
    $(title).text(option.title);
    var contentFrame =
        jLego.basicUI.addDiv(outterFrame, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_CARD_CONTENT_FRAME});
    var icon =
        jLego.basicUI.addImg(contentFrame, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_CARD_ICON, src: cardIcon});
    var content =
        jLego.basicUI.addDiv(contentFrame, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_CARD_CONTENT});
    $(content).text(option.content);
    var closeButton = 
        jLego.basicUI.addImg(outterFrame, {id: jLego.func.getRandomString(), class: this.myClass.TOASTCTRLER_CARD_CLOSEBUTTON, src: jLego.func.getImgPath({category: 'toastCTRLer', name: 'close', type: 'png'})});
    $(closeButton).hide();
    if(option.hasCloseButton){
        $(closeButton).show();
        $(closeButton).data('outterFrame', outterFrame);
        $(closeButton).click(function(){
            var outterFrame = $(this).data('outterFrame');
            $(outterFrame).remove();
        })
    }
    if(option.autoFadeOut != false){
        var fadeOutTime = option.fadeOutTime? option.fadeOutTime: 3000;
        var timer = window.setTimeout(function(){
            $(outterFrame).fadeOut(500);
        }, fadeOutTime);
    }
    return outterFrame;
}

