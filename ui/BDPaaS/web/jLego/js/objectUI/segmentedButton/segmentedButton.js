/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
jLego.objectUI.segmentedButton=function(){
    var myID;
    var myClass;
    var parentElement;
    var mainElement;
    var buttonList;
    var segmentedWidth;
    var segmentedHeight;
    var alignment;
    var positionX;
    var positionY;
    var offsetX;
    var offsetY;
    var onColor;
    var offColor;
    var onTextColor;
    var offTextColor;
    var borderRadius;
    this.initialize();
}

jLego.objectUI.segmentedButton.prototype.initialize=function(){
    this.myID = jLego.objectUI.id.segmentedButton;
    this.myClass = jLego.objectUI.cls.segmentedButton;
    this.segmentedWidth = 0;
    this.segmentedHeight = 24;
    this.offsetX = 0;
    this.offsetY = 0;
    this.buttonList = [];
    this.onColor = "#539F07";
    this.offColor = "#ffffff";
    this.onTextColor = "#ffffff";
    this.offTextColor = "#000000";
    this.borderRadius = "5px";
}

jLego.objectUI.segmentedButton.prototype.add=function(target, option){
    //check option
    if(target==null) return null;
    if(option==null){
        var option={titleList: [], widthList: []};
        return null;
    }
    else{
        if(option.titleList==null)   return null;
        else if(option.widthList==null)   return null;
    }
    this.parentElement = target;
    //calculate maxWidth
    for(var i=0; i<option.widthList.length; i++){
        this.segmentedWidth += parseInt(option.widthList[i]);
    }
    if(option.height!=null){
        this.segmentedHeight = parseInt(option.height);
    }
    if(option.borderRadius!=null){
        this.borderRadius = option.borderRadius;
    }
    if(option.onColor!=null){
        this.onColor = option.onColor;
    }
    if(option.offColor!=null){
        this.offColor = option.offColor;
    }
    if(option.onTextColor!=null){
        this.onTextColor = option.onTextColor;
    }
    if(option.offTextColor!=null){
        this.offTextColor = option.offTextColor;
    }
    if(option.offsetX!=null){
        this.offsetX = parseInt(option.offsetX);
    }
    if(option.offsetY!=null){
        this.offsetY = parseInt(option.offsetY);
    }
    if(option.alignment!=null){
        this.alignment = option.alignment;
        switch(this.alignment){
            case 'left':
                this.positionX = 0;
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight)/2);
                break;
            case 'center':
                this.positionX = parseInt(($(this.parentElement).width() - this.segmentedWidth)/2);
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight)/2);
                break;
            case 'right':
                this.positionX = parseInt($(this.parentElement).width() - this.segmentedWidth);
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight)/2);
                break;
            case 'top-left':
                this.positionX = 0;
                this.positionY = 0;
                break;
            case 'top-center':
                this.positionX = 0;
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight)/2);
                break;
            case 'top-right':
                this.positionX = parseInt($(this.parentElement).width() - this.segmentedWidth);
                 this.positionY = 0;
                break;  
            case 'bottom-left':
                this.positionX = 0;
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight));
                break;
            case 'bottom-center':
                this.positionX = parseInt(($(this.parentElement).width() - this.segmentedWidth)/2);
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight));
                break;
            case 'bottom-right':
                this.positionX = parseInt($(this.parentElement).width() - this.segmentedWidth);
                this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight));
                break;
        }
    }
    else{
        this.alignment = "center";
        this.positionX = parseInt(($(this.parentElement).width() - this.segmentedWidth)/2);
        this.positionY = parseInt(($(this.parentElement).height() - this.segmentedHeight)/2);
    }
    
    this.mainElement =
            jLego.basicUI.addDiv(this.parentElement, {id: jLego.func.getRandomString(), class: this.myClass.SEGMENTED_FRAME});
    $(this.mainElement).width(this.segmentedWidth);
    $(this.mainElement).height(this.segmentedHeight);
    if(option.top) $(this.mainElement).css('top', option.top + "px");
    else if(option.bottom) $(this.mainElement).css('bottom', option.bottom + "px");
    else $(this.mainElement).css('top', (this.positionY + this.offsetY) + "px");
    if(option.left)  $(this.mainElement).css('left', option.left + "px");
    else if(option.right)  $(this.mainElement).css('right', option.right + "px");
    else $(this.mainElement).css('left', (this.positionX + this.offsetX) + "px");
    
    
    for(var i=0; i<option.titleList.length; i++){
        var newButton = 
                jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.SEGMENTED_BUTTON});
        $(newButton).width(option.widthList[i]);
        $(newButton).height(this.segmentedHeight);
        $(newButton).css('border', '1px solid ' + this.onColor);
        if(i==0) $(newButton).css('border-radius', this.borderRadius + " 0 0 " + this.borderRadius);
        else if(i==option.titleList.length-1){
            $(newButton).css('border-left', "0px");
            $(newButton).css('border-radius', "0 " + this.borderRadius + " " + this.borderRadius +" 0");
        }
        else{
            $(newButton).css('border-left', "0px");
        }
        $(newButton).css('background-color', this.offColor);
        $(newButton).css('color', this.offTextColor);
        $(newButton).css('line-height', this.segmentedHeight + "px");
        $(newButton).text(option.titleList[i]);
        $(newButton).data('isON', false);
        $(newButton).data('index', i);
        this.buttonList[this.buttonList.length] = newButton;
    }
    if(option.initONIndex!=null){
        $(this.buttonList[option.initONIndex]).css('background-color', this.onColor);
        $(this.buttonList[option.initONIndex]).css('color', this.onTextColor);
        $(this.buttonList[option.initONIndex]).data('isON', true);
    }
    this.setToogleSegmentedButtons();
}

jLego.objectUI.segmentedButton.prototype.setToogleSegmentedButtons = function(){
    for(var i=0;i< this.buttonList.length; i++){
        var button = this.buttonList[i];
        $(button).data('myParent', this);
        $(button).click(function(){
            var parent = $(this).data('myParent');
            var index = $(this).data('index');
            for(var j=0;j< parent.buttonList.length; j++){
                if(index==j){
                    if($(this).data('isON')!=true){
                        $(this).data('isON', true);
                        $(this).css('background-color', parent.onColor);
                        $(this).css('color', parent.onTextColor);
                        if($(this).data('onCallback')!=null){
                            if($(this).data('onArg')!=null)   $(this).data('onCallback')($(this).data('onArg'));
                            else    $(this).data('onCallback')();
                        } 
                    }
                }
                else{
                    $(parent.buttonList[j]).css('background-color', parent.offColor);
                    $(parent.buttonList[j]).css('color', parent.offTextColor);
                    $(parent.buttonList[j]).data('isON', false);
                }
            }
        });
    }
}

jLego.objectUI.segmentedButton.prototype.getSegmentedButton = function(index){
    if(index < 0 || index >= this.buttonList.length) return null;
    return this.buttonList[index];
}


jLego.objectUI.segmentedButton.prototype.setSegmentedButtonClick = function(segmentedButton, onCallbackObject){
    var parent=this;
    var onCallback, onArg;
    if(onCallbackObject!=null){
        onCallback=onCallbackObject.callback;
        onArg=onCallbackObject.arg;
    }
    $(segmentedButton).data('onCallback', onCallback);
    $(segmentedButton).data('onArg', onArg);
}
