/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

jLego.objectUI.hintCardCTRLer = function(){
    var myID;
    var myClass;
    var myConsts;
    
    this.initialize();
}

jLego.objectUI.hintCardCTRLer.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.hintCardCTRLer;
    this.myClass=jLego.objectUI.cls.hintCardCTRLer;
    this.myConsts=jLego.objectUI.constants.hintCardCTRLer;
}

jLego.objectUI.hintCardCTRLer.prototype.addCard=function(option){
    var newHintCard = 
            jLego.basicUI.addDiv(document.body, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME});
    $(newHintCard).hide();
    if(option.title != null){
        var titleFrame = 
                jLego.basicUI.addDiv(newHintCard, {id: jLego.func.getRandomString(), class: this.myClass.TITLE_FRAME});
        if(option.iconURL != null){
            var titleIcon = 
                jLego.basicUI.addImg(titleFrame, {id: jLego.func.getRandomString(), class: this.myClass.TITLE_ICON, src: option.iconURL});
        }
        var titleText = 
                jLego.basicUI.addDiv(titleFrame, {id: jLego.func.getRandomString(), class: this.myClass.TITLE_TEXT});
        $(titleText).text(option.title);
        $(newHintCard).data('titleFrame', titleFrame);
        $(newHintCard).data('titleIcon', titleIcon);
        $(newHintCard).data('titleText', titleText);
    }
    if(option.itemList != null){
        var itemList = [];
        for(var i=0; i<option.itemList.length; i++){
            var itemOption = option.itemList[i];
            var itemFrame = 
                    jLego.basicUI.addDiv(newHintCard, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_FRAME});
            if(itemOption.iconURL != null){
                var itemIcon = 
                    jLego.basicUI.addImg(itemFrame, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_ICON, src: itemOption.iconURL});
            }
            var itemTitle = 
                jLego.basicUI.addDiv(itemFrame, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_TITLE});
            $(itemTitle).text(itemOption.title);
            if(itemOption.type=="badge"){
                if(parseInt(itemOption.content) > 0){
                    var itemText = 
                        jLego.basicUI.addDiv(itemFrame, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_BADGE_WARNING});
                }
                else{
                    var itemText = 
                        jLego.basicUI.addDiv(itemFrame, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_BADGE});
                }
                $(itemText).text(itemOption.content);
            }
            else{
                var itemText = 
                    jLego.basicUI.addDiv(itemFrame, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_TEXT});
                $(itemText).text(itemOption.content);
            }
            itemList[itemList.length] = {
                itemIcon: itemIcon,
                itemTitle: itemTitle,
                itemText: itemText,
                type: itemOption.type
            }
        }
        $(newHintCard).data('itemList', itemList);
    }
    if(option.hintList != null){
        var bottomLine = 
                jLego.basicUI.addDiv(newHintCard, {id: jLego.func.getRandomString(), class: this.myClass.BOTTOM_LINE});
        for(var i=0; i<option.hintList.length; i++){
            var hintFrame = 
                    jLego.basicUI.addDiv(newHintCard, {id: jLego.func.getRandomString(), class: this.myClass.HINT_FRAME});
            $(hintFrame).text(option.hintList[i].content);
        }
    }
    $(newHintCard).fadeIn(500);
    return newHintCard;
}

jLego.objectUI.hintCardCTRLer.prototype.updateCard=function(hintCard, option){
    if(option.title != null){
        var titleText = $(hintCard).data('titleText');
        $(titleText).text(option.title);
    }
    if(option.itemList != null){
        var itemList = $(hintCard).data('itemList');
        for(var i=0; i<option.itemList.length; i++){
            if(itemList != null){
                var itemOption = option.itemList[i];
                if(i < itemList.length){
                    $(itemList[i].itemText).text(itemOption.content);
                    if(itemList[i].type=="badge"){
                        if(parseInt(itemOption.content) > 0){
                            $(itemList[i].itemText).attr('class', this.myClass.ITEM_BADGE_WARNING);
                        }
                        else{
                            $(itemList[i].itemText).attr('class', this.myClass.ITEM_BADGE);
                        }
                    }
                }
            }
        }
    }
}

jLego.objectUI.hintCardCTRLer.prototype.removeCard=function(hintCard){
    $(hintCard).fadeOut(300);
    $(hintCard).remove();
}
