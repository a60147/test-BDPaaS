/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */

jLego.objectUI.windowCTRLer=function(){
    var myID;
    var myClass;
    var myConsts;
    
    var windowCount;
    var currentZIndex;
    
    var windowMap;
    
    this.initialize();
}

jLego.objectUI.windowCTRLer.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.windowCTRLer;
    this.myClass=jLego.objectUI.cls.windowCTRLer;
    this.myConsts=jLego.objectUI.constants.windowCTRLer;
    
    this.currentZIndex=this.myConsts.DEFAULT_Z_INDEX;
    this.windowCount = 0;
    
    this.windowMap = {};
}

jLego.objectUI.windowCTRLer.prototype.add=function(target, option){
    var width, height, positionX, positionY;
    if(option.width!=null)  width=option.width;
    else width=this.myConsts.DEFAULT_WIDTH;
    if(option.height!=null && option.autoHeight!=true)  height=option.height;
    else height=this.myConsts.DEFAULT_HEIGHT;
    if(option.noOffset!=true){
        if(option.positionX!=null)  positionX=option.positionX+this.myConsts.DEFAULT_X_OFFSET * this.getWindowCount();
        else positionX=this.myConsts.POP_WINDOW_DEFAULT_X_POSITION+this.myConsts.DEFAULT_X_OFFSET * this.getWindowCount();
        if(option.positionY!=null)  positionY=option.positionY+this.myConsts.DEFAULT_Y_OFFSET * this.getWindowCount();
        else positionY=this.myConsts.POP_WINDOW_DEFAULT_Y_POSITION+this.myConsts.DEFAULT_Y_OFFSET * this.getWindowCount();
    }
    else{
        if(option.positionX!=null)  positionX=option.positionX;
        else positionX=this.myConsts.DEFAULT_X_POSITION;
        if(option.positionY!=null)  positionY=option.positionY;
        else positionY=this.myConsts.DEFAULT_Y_POSITION;
    }
    var mainElement =
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.WINDOW_FRAME});
    $(mainElement).width(width);
    $(mainElement).data('autoHeight', option.autoHeight);
    if(option.autoHeight != true) $(mainElement).height(height);
    if(option.float){
        $(mainElement).css('position', 'relative');
        $(mainElement).css('margin-left', positionX + "px");
        $(mainElement).css('margin-right', positionX + "px");
        $(mainElement).css('margin-top', positionY + "px");
        if(option.float == "left") $(mainElement).css('float', 'left');
        else if(option.float == "right") $(mainElement).css('float', 'right');
    }
    else{
        $(mainElement).css('left', positionX + "px");
        $(mainElement).css('top', positionY + "px");
        $(mainElement).css('position', 'absoluate');
    }
    $(mainElement).css('z-index', this.increaseWindowZIndex());
    if(option.dragInParent == true){
        $(mainElement).data("dragInParent", option.dragInParent);
        $(mainElement).draggable({containment: "parent"});
    }
    else{
        $(mainElement).draggable();
    }
    
    $(mainElement).data('parent', this);
    if(option.disableClickOnTop == true) $(mainElement).data('disableClickOnTop', true);
    $(mainElement).on('mousedown touchstart', function(){
        var parent = $(this).data('parent');
        var disableClickOnTop = $(this).data('disableClickOnTop');
        if(disableClickOnTop != true) $(this).css('z-index', parent.increaseWindowZIndex()); 
    });
    if(option.draggable!=1 || option.draggable!=true) $(mainElement).draggable('destroy');
    var titleFrame = 
            jLego.basicUI.addDiv(mainElement, {id: jLego.func.getRandomString(), class: this.myClass.TITLE_FRAME});
    if(option.titleBackgroundColor) $(titleFrame).css('background-color', option.titleBackgroundColor);
    var titleLabel =
            jLego.basicUI.addDiv(titleFrame, {id: jLego.func.getRandomString(), class: this.myClass.TITLE_LABEL});
    $(titleLabel).text(option.title);
    if(option.hasCloseButton != false){
        var closeButton = 
            jLego.basicUI.addImg(titleFrame, {id: jLego.func.getRandomString(), class: this.myClass.CLOSE_BUTTON, src: jLego.func.getImgPath({category: 'windowCTRLer', name: 'close', type: 'png'})});
        $(closeButton).data('parent', mainElement);
    }
    
    $(titleFrame).data('parentCTRLer', this);
    $(titleFrame).data('mainElement', mainElement);
    $(titleFrame).on('mousedown touchstart', function(){
        var parent = $(this).data('parentCTRLer');
        var disableClickOnTop = $($(this).data('mainElement')).data('disableClickOnTop');
        if(disableClickOnTop != true){
            parent.increaseWindowZIndex();
            $($(this).data('mainElement')).css('z-index', parent.getWindowZIndex()); 
        }
    });
    var contentFrame = 
            jLego.basicUI.addDiv(mainElement, {id: jLego.func.getRandomString(), class: this.myClass.CONTENT_FRAME});
    if(option.minContentHeight) $(contentFrame).css('min-height', option.minContentHeight + "px");
    if(option.maxContentHeight) $(contentFrame).css('max-height', option.maxContentHeight + "px");
    if(option.autoHeight != true){
        $(contentFrame).height(height - $(titleFrame).height());
    }
    else{
        if(option.contentPaddingTop) $(contentFrame).css('padding-top', option.contentPaddingTop + "px");
        if(option.contentPaddingBottom) $(contentFrame).css('padding-bottom', option.contentPaddingBottom + "px");
        if(option.contentPaddingLeft) $(contentFrame).css('padding-left', option.contentPaddingLeft + "px");
        if(option.contentPaddingRight) $(contentFrame).css('padding-right', option.contentPaddingRight + "px");
        if(option.contentPadding) $(contentFrame).css('padding', option.contentPadding + "px");
    }
    if(option.contentBackgroundColor) $(contentFrame).css('background-color', option.contentBackgroundColor);
    if(option.contentRadius) $(contentFrame).css('border-radius', option.contentRadius);
    $(mainElement).data('titleFrame', titleFrame);
    $(mainElement).data('titleLabel', titleLabel);
    $(mainElement).data('closeButton', closeButton);
    $(mainElement).data('contentFrame', contentFrame);

    if(option.closeListener!=null) $(mainElement).data('closeListener', option.closeListener);
    if(option.onCloseEvent!=null) $(mainElement).data('onCloseEvent', option.onCloseEvent);
    if(option.closeCallbackObject!=null) $(mainElement).data('closeCallbackObject', option.closeCallbackObject);
    this.resizeFrame(mainElement);
    this.setCloseButtonClick(mainElement);
    this.increaseWindowZIndex();
    this.increaseWindowCount();
    
    if(option.windowKey != null){
        this.windowMap[option.windowKey] = mainElement;
        $(mainElement).data('windowKey', option.windowKey);
    }
    else{
        var windowKey = jLego.func.getUniqueKeyOfObject(this.windowMap);
        this.windowMap[windowKey] = mainElement;
        $(mainElement).data('windowKey', windowKey);
        
    }
    return mainElement;
};

jLego.objectUI.windowCTRLer.prototype.updateTitleColor=function(mainElement, titleBackgroundColor){
    var titleFrame = $(mainElement).data('titleFrame');
     $(titleFrame).css('background-color', titleBackgroundColor);
}

jLego.objectUI.windowCTRLer.prototype.updateContentColor=function(mainElement, contentBackgroundColor){
    var contentFrame = $(mainElement).data('contentFrame');
    $(contentFrame).css('background-color', contentBackgroundColor);
}

jLego.objectUI.windowCTRLer.prototype.getWindowByKey = function(windowKey){
    return this.windowMap[windowKey];
}

jLego.objectUI.windowCTRLer.prototype.getWindowKey = function(window){
    return $(window).data('windowKey');
}

jLego.objectUI.windowCTRLer.prototype.setCloseButtonClick=function(window){
    var closeButton = $(window).data('closeButton');
    $(closeButton).data('parent', this);
    $(closeButton).data('window', window);
    $(closeButton).click(function(){
        var parent = $(this).data('parent');
        var window = $(this).data('window');
        parent.triggerCloseEvent(window);
        parent.triggerCloseCallback(window);
        parent.closeWindow(window);
    });
}

jLego.objectUI.windowCTRLer.prototype.showWindow=function(window){
    $(window).show();
}
jLego.objectUI.windowCTRLer.prototype.hideWindow=function(window){
    $(window).hide();
}
jLego.objectUI.windowCTRLer.prototype.closeWindow=function(window){
    delete this.windowMap[$(window).data('windowKey')]; 
    $(window).remove();
    this.decreaseWindowCount();
}

jLego.objectUI.windowCTRLer.prototype.triggerCloseEvent=function(window){
    if($(window).data('onCloseEvent')!=null){
        $(window).data('closeListener').trigger($(window).data('onCloseEvent'));
    }
}

jLego.objectUI.windowCTRLer.prototype.triggerCloseCallback=function(window){
    if($(window).data('closeCallbackObject')!=null){
        var callbackObject = $(window).data('closeCallbackObject');
        callbackObject.callback(callbackObject.arg);
    }
}

jLego.objectUI.windowCTRLer.prototype.increaseWindowCount = function(){
    this.windowCount++;
    return this.windowCount;
}

jLego.objectUI.windowCTRLer.prototype.decreaseWindowCount = function(){
    this.windowCount--;
    return this.windowCount;
}

jLego.objectUI.windowCTRLer.prototype.getWindowCount = function(){
    return this.windowCount;
}

jLego.objectUI.windowCTRLer.prototype.increaseWindowZIndex=function(){
    this.currentZIndex++;
    return this.currentZIndex;
}

jLego.objectUI.windowCTRLer.prototype.getWindowZIndex=function(){
    return this.currentZIndex;
}

jLego.objectUI.windowCTRLer.prototype.enableDraggable=function(window){
    var dragInParent = $(window).data("dragInParent");
    if(dragInParent == true) $(window).draggable({containment: "parent"});
    else $(window).draggable();
}
jLego.objectUI.windowCTRLer.prototype.disableDraggable=function(window){
    if($(window).data('uiDraggable')){ 
        $(window).draggable('destroy');
    }
}

jLego.objectUI.windowCTRLer.prototype.setTitle=function(window, title){
    $(window).data('titleLabel').text(title);
}
jLego.objectUI.windowCTRLer.prototype.getTitleBar=function(window){
    return $(window).data('titleFrame');
}

jLego.objectUI.windowCTRLer.prototype.getContentFrame=function(window){
    return $(window).data('contentFrame');
}

jLego.objectUI.windowCTRLer.prototype.getFreeFrame=function(window){
    return this.getContentFrame(window);
}

jLego.objectUI.windowCTRLer.prototype.isON=function(window){
    if($(window).is(":visible")) return true;
    else return false;
}

jLego.objectUI.windowCTRLer.prototype.cleanContentFrame=function(window){
    $(window).data('contentFrame').html('');
}

jLego.objectUI.windowCTRLer.prototype.cleanFreeFrame=function(window){
    this.cleanContentFrame(window);
}

jLego.objectUI.windowCTRLer.prototype.showTitleBar=function(window){
    $(window).data('titleFrame').show();
    $(window).data('closeButton').show();
    this.resizeFrame(window);
}
jLego.objectUI.windowCTRLer.prototype.hideTitleBar=function(window){
    $(window).data('titleFrame').hide();
    this.resizeFrame(window);
}
jLego.objectUI.windowCTRLer.prototype.getTitleBar=function(window){
    return $(window).data('titleFrame');
}

jLego.objectUI.windowCTRLer.prototype.resizeFrame=function(window){
    var frame = window;
    var title = $(window).data('titleFrame');
    var freeFrame = $(window).data('contentFrame');
    var closeButton=$(window).data('closeButton');
    if($(title).is(":visible")){
        if($(window).data('autoHeight') != true){
            $(freeFrame).height($(frame).height() - $(title).height());
        }
    }
    else{
        $(freeFrame).height($(frame).height());
    }
}