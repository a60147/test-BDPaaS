/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */

jLego.objectUI.topBanner=function(option){
    var myID;
    var myClass;
    var myConsts;
    
    var parentElement;
    var mainElement;
    var backgroundGroundFrame;
    var frontGroundFrame;
    var itemContainer;
    var height;
    var itemList;
    var itemMap;
    var selectedItem;
    var selectedItemIndex = -1;
    this.initialize();
    if(option != null) this.parseOption(option);
}

jLego.objectUI.topBanner.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.topBanner;
    this.myClass=jLego.objectUI.cls.topBanner;
    this.myConsts=jLego.objectUI.constants.topBanner;
    this.itemList = [];
    this.itemMap = {};
    this.height = 32;
}

jLego.objectUI.topBanner.prototype.parseOption=function(option){
    if(option.height!=null) this.height = option.height;
}

jLego.objectUI.topBanner.prototype.add=function(target, option){
    if(target == null) return;
    else this.parentElement = target;
    if(option != null) this.parseOption(option);
    
    //create main element
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME});
    //create background element
    this.backgroundGroundFrame = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.BACKGROUND});
    //create frontground element
    this.frontGroundFrame = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.FRONTGROUND});
    //create item container
    this.itemContainer = 
            jLego.basicUI.addDiv(this.frontGroundFrame, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_CONTAINER});
}


jLego.objectUI.topBanner.prototype.addItem=function(option, onCallbackObject, offCallbackObject){
    var iconURL, name, key = jLego.func.getRandomString(), selected = false;
    if(option==null) return;
    if(option.iconURL) iconURL = option.iconURL;
    if(option.name) name = option.name;
    if(option.key) key = option.key;
    if(option.selected){
        if(option.selected == true || option.selected == "true") selected = true;
        else selected = false;
    }
    var itemHeight = $(this.frontGroundFrame).height();
    //item frame
    var newItem = 
            jLego.basicUI.addDiv(this.itemContainer, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_FRAME});
    if(selected) $(newItem).addClass(this.myClass.ITEM_FRAME_SELECTED);
    $(newItem).height(itemHeight);
    //icon element
    if(iconURL){
        var iconElement = 
            jLego.basicUI.addImg(newItem, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_ICON, src: iconURL});
    }
    //$(iconElement).height(itemHeight - 2 * parseInt($(iconElement).css('margin')));
   // $(iconElement).width(itemHeight - 2 * parseInt($(iconElement).css('margin')));
   $(iconElement).height("20px");
   $(iconElement).width("20px");
    //name element
    var nameElement = 
            jLego.basicUI.addDiv(newItem, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_NAME});
    $(nameElement).text(name);
    $(nameElement).height(itemHeight);
    $(nameElement).css('line-height', itemHeight + "px");
    //save item
    var index = this.itemList.length;
    $(newItem).data('key', key);
    $(newItem).data('index', index);
    if(selected) this.selectedItemIndex = index;
    $(newItem).data('selected', selected);
    $(newItem).data('enableClick', true);
    this.itemList[index] = newItem;
    this.itemMap[key] = newItem;
    
    if(onCallbackObject != null) this.setItemCallback(newItem, onCallbackObject, offCallbackObject);

    return newItem;
}

jLego.objectUI.topBanner.prototype.setItemCallback = function(item, onCallbackObject, offCallbackObject){
    var onCallback, onArg, offCallback, offArg;
    if(onCallbackObject!=null){
        onCallback=onCallbackObject.callback;
        onArg=onCallbackObject.arg;
    }
    if(offCallbackObject!=null){
        offCallback=offCallbackObject.callback;
        offArg=offCallbackObject.arg;
    }
    $(item).off('click');
    $(item).data('onCallback', onCallback);
    $(item).data('onArg', onArg);
    $(item).data('offCallback', offCallback);
    $(item).data('offArg', offArg);
    $(item).data('parent', this);
    $(item).click(function(){
        var parent = $(this).data('parent');
        var selected = $(this).data('selected');
        if(!selected){
            if($(this).data('enableClick')){
                if(parent.selectedItem != null){
                    parent.enableItemClick(parent.selectedItem);
                    $(parent.selectedItem).click();
                }
                var index = $(this).data('index');
                var callback = $(this).data('onCallback');
                var arg = $(this).data('onArg');
                if(callback!=null) callback(arg);
                $(this).addClass(parent.myClass.ITEM_FRAME_SELECTED);
                $(this).data('selected', !selected);
                parent.selectedItem = this;
                parent.selectedItemIndex = index;
                parent.disableItemClick(this);
            }
        }
        else{
            if($(this).data('enableClick')){
                var callback = $(this).data('offCallback');
                var arg = $(this).data('offArg');
                if(callback!=null) callback(arg);
                $(this).removeClass(parent.myClass.ITEM_FRAME_SELECTED);
                $(this).data('selected', !selected);
                parent.selectedItem = null;
                parent.selectedItemIndex = -1;
            }
        }
    });
}

jLego.objectUI.topBanner.prototype.disableItemClick = function(item){
    $(item).data('enableClick', false);
}

jLego.objectUI.topBanner.prototype.isItemSelected=function(item){
    return $(item).data('selected');
}

jLego.objectUI.topBanner.prototype.enableItemClick = function(item){
    $(item).data('enableClick', true);
}
        
jLego.objectUI.topBanner.prototype.getItemByIndex=function(index){
    if(index >= 0 && index < this.itemList.length) return this.itemList[index];
    else return null;
}

jLego.objectUI.topBanner.prototype.getItemByKey=function(key){
    return this.itemMap[key];
}

jLego.objectUI.topBanner.prototype.resize=function(){
}

jLego.objectUI.topBanner.prototype.resizeHandler=function(){
    this.resize();
}