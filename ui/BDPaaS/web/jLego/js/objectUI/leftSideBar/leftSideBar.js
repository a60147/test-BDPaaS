/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */

jLego.objectUI.leftSideBar=function(option){
    var myID;
    var myClass;
    var myConsts;
    
    var parentElement;
    var mainElement;
    var categoryList;
    this.initialize();
    if(option != null) this.parseOption(option);
}

jLego.objectUI.leftSideBar.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.leftSideBar;
    this.myClass=jLego.objectUI.cls.leftSideBar;
    this.myConsts=jLego.objectUI.constants.leftSideBar;
    this.categoryList = [];
}

jLego.objectUI.leftSideBar.prototype.add=function(target, option){
    if(target == null) return;
    else this.parentElement = target;
    if(option != null) this.parseOption(option);
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME});
    this.resize();
}

jLego.objectUI.leftSideBar.prototype.addCategory=function(option){
    var name, shown = true, hasSearchBar=false;
    if(option==null) return;
    if(option.name) name = option.name;
    if(option.shown == false) shown = false;
    if(option.hasSearchBar == true) hasSearchBar = true;
    
    var newCategory = 
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.CATEGORY_FRAME});
    var titleFrame = 
            jLego.basicUI.addDiv(newCategory, {id: jLego.func.getRandomString(), class: this.myClass.CATEGORY_TITLE_FRAME});
    $(titleFrame).text(name);
    if(hasSearchBar){
        var searchFrame = 
            jLego.basicUI.addDiv(newCategory, {id: jLego.func.getRandomString(), class: this.myClass.CATEGORY_SEARCH_FRAME});
        var searchBox =
                jLego.basicUI.addDiv(searchFrame, {id: jLego.func.getRandomString(), class: this.myClass.SEARCH_BOX});
        var positionY = 5;
        var positionX = 5;
        var searchWidth = $(searchFrame).width() - (2*positionX);
        var searchHeight = $(searchFrame).height() - (2*positionY);
        $(searchBox).width(searchWidth);
        $(searchBox).height(searchHeight);
        $(searchBox).css('top', positionY + "px");
        $(searchBox).css('left', positionX + "px");
        var borderRaidus = parseInt(searchHeight / 2) + 1;
        $(searchBox).css('border-raidus', borderRaidus + "px");
        $(searchBox).css('-webkit-border-radius', borderRaidus + "px");
        $(searchBox).css('-moz-border-radius', borderRaidus + "px");
    
        var searchElement = 
                jLego.basicUI.addInput(searchBox, {id: jLego.func.getRandomString(), class: this.myClass.SEARCH_ELEMENT, type: 'text', name: ''});  
        var searchIcon=
                jLego.basicUI.addImg(searchBox, {id: jLego.func.getRandomString(), class: this.myClass.SEARCH_ICON, src: jLego.func.getImgPath({category: 'common', name: 'search', type: 'png'})});
        var iconPositionRightX = 5;
        var iconPositionY = 3;
        var iconSize = searchHeight - (2*iconPositionY);
        $(searchIcon).height(iconSize);
        $(searchIcon).height(iconSize);
        $(searchIcon).css('margin-right', iconPositionRightX + "px");
        $(searchIcon).css('margin-top', iconPositionY + "px");
        $(searchElement).width(searchWidth - $(searchIcon).width() - iconSize - (2 * iconPositionRightX) - 10);
        $(searchElement).height(searchHeight - 4);
        $(searchElement).css('line-height', (searchHeight - 2) + "px");
        if(!shown) $(searchFrame).hide();
    }
    var contentFrame = 
            jLego.basicUI.addDiv(newCategory, {id: jLego.func.getRandomString(), class: this.myClass.CATEGORY_CONTENT_FRAME});
    $(contentFrame).css('overflow-y', 'auto');
    $(contentFrame).perfectScrollbar();
    if(!shown) $(contentFrame).hide();
    //save data
    var index = this.categoryList.length;
    $(newCategory).data('shown', shown);
    $(newCategory).data('index', index);
    $(newCategory).data('titleFrame', titleFrame);
    $(newCategory).data('contentFrame', contentFrame);
    var itemList = [];
    $(newCategory).data('itemList', itemList);
    $(newCategory).data('selectedItemIndex', -1);
    $(newCategory).data('selectedItem', null);
    if(hasSearchBar){
        $(newCategory).data('searchFrame', searchFrame);
        $(newCategory).data('searchElement', searchElement);
    }
    this.categoryList[index] = newCategory;
    
    this.resize();
    return newCategory;
}

jLego.objectUI.leftSideBar.prototype.getSearchElementInCategory=function(targetCategory){
    return $(targetCategory).data('searchElement');
}

jLego.objectUI.leftSideBar.prototype.setSearchElementText=function(targetCategory, searchText){
    var searchElement = $(targetCategory).data('searchElement');
    $(searchElement).val(searchText);
    $(searchElement).trigger('keyup');
}

jLego.objectUI.leftSideBar.prototype.addItemInCategory=function(targetCategory, option, onCallbackObject, offCallbackObject){
    var name, iconURL, selected;
    if(option==null) return;
    if(option.name) name = option.name;
    if(option.iconURL) iconURL = option.iconURL;
    if(option.selected){
        if(option.selected == true || option.selected == "true") selected = true;
        else selected = false;
    }
    var targetContainer = $(targetCategory).data('contentFrame');
    //item frame
    var newItem = 
            jLego.basicUI.addDiv(targetContainer, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_FRAME});
    if(selected) $(newItem).addClass(this.myClass.ITEM_FRAME_SELECTED);
    else $(newItem).addClass(this.myClass.ITEM_FRAME_NOT_SELECTED);
    //icon element
    if(iconURL){
        var iconElement = 
            jLego.basicUI.addImg(newItem, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_ICON, src: iconURL});
    }
    //name element
    var nameElement = 
            jLego.basicUI.addDiv(newItem, {id: jLego.func.getRandomString(), class: this.myClass.ITEM_NAME});
    $(nameElement).text(name);
    $(nameElement).attr('title', option.tooltip);
    $(nameElement).tooltip();
    //save item
    var itemList = $(targetCategory).data('itemList');
    var index = itemList.length;
    itemList[index] = newItem;
    $(targetCategory).data('itemList', itemList);
    if(selected){
        $(targetCategory).data('selectedItemIndex', index);
        $(targetCategory).data('selectedItem', newItem);
    }
    $(newItem).data('index', index);
    $(newItem).data('selected', selected);
    $(newItem).data('enableClick', true);
    $(newItem).data('category', targetCategory);
    
    if(onCallbackObject != null) this.setItemCallback(newItem, onCallbackObject, offCallbackObject);
    
    return newItem;
}

jLego.objectUI.leftSideBar.prototype.cleanCategoryContent = function(category){
    var contentFrame = $(category).data('contentFrame');
    $(contentFrame).html('');
    var itemList = [];
    $(category).data('itemList', itemList);
    $(category).data('selectedItemIndex', -1);
    $(category).data('selectedItem', null);
}

jLego.objectUI.leftSideBar.prototype.isItemSelectedInCategory = function(category, item){
    var selectedItemIndex = $(category).data('selectedItemIndex');
    if(selectedItemIndex == -1) return false;
    else{
        var itemIndex = $(item).data('index');
        if(selectedItemIndex == itemIndex) return true;
        else return false;
    }
}

jLego.objectUI.leftSideBar.prototype.setItemCallback = function(item, onCallbackObject, offCallbackObject){
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
                //click previous selected item
                var targetCategory = $(this).data('category');
                var previouSelectedItem = $(targetCategory).data('selectedItem');
                if(previouSelectedItem != null){
                    parent.enableItemClick(previouSelectedItem);
                    $(previouSelectedItem).click();
                }
                //click current selected item
                var callback = $(this).data('onCallback');
                var arg = $(this).data('onArg');
                if(callback!=null) callback(arg);
                $(this).removeClass(parent.myClass.ITEM_FRAME_NOT_SELECTED);
                $(this).addClass(parent.myClass.ITEM_FRAME_SELECTED);
                var itemIndex = $(this).data('index');
                $(targetCategory).data('selectedItemIndex', itemIndex);
                $(targetCategory).data('selectedItem', this);
                $(this).data('selected', !selected);
                parent.disableItemClick(this);
            }
        }
        else{
            if($(this).data('enableClick')){
                var callback = $(this).data('offCallback');
                var arg = $(this).data('offArg');
                if(callback!=null) callback(arg);
                $(this).removeClass(parent.myClass.ITEM_FRAME_SELECTED);
                $(this).addClass(parent.myClass.ITEM_FRAME_NOT_SELECTED);
                var targetCategory = $(this).data('category');
                $(targetCategory).data('selectedItemIndex', -1);
                $(targetCategory).data('selectedItem', null);
                $(this).data('selected', !selected);
            }
        }
    });
}

jLego.objectUI.leftSideBar.prototype.disableItemClick = function(item){
    $(item).data('enableClick', false);
}

jLego.objectUI.leftSideBar.prototype.enableItemClick = function(item){
    $(item).data('enableClick', true);
}

jLego.objectUI.leftSideBar.prototype.resize=function(){
    var parentWidth = $(this.parentElement).width();
    var parentHeight = $(this.parentElement).height();
    var offCount=0, onCount=0, reserveHeight = 0;

    for (var i=0; i<this.categoryList.length; i++) {
        var currentCategory = this.categoryList[i];
        if($(currentCategory).data('shown')){
            onCount++;
            var searchFrame = $(currentCategory).data('searchFrame');
            if(searchFrame){
                reserveHeight += $(searchFrame).height();
            }
        }
        else{
            offCount++;
        }
        var titleFrame = $(currentCategory).data('titleFrame');
        reserveHeight += $(titleFrame).height();
    }
    if(onCount > 0){
        var remianHeight = parentHeight - reserveHeight;
        var avgContainerHeight = remianHeight / onCount;
    }
    for (var i=0; i<this.categoryList.length; i++) {
        var currentCategory = this.categoryList[i];
        if($(currentCategory).data('shown')){
            var contentFrame = $(currentCategory).data('contentFrame');
            $(contentFrame).height(avgContainerHeight);
        }
    }
}

jLego.objectUI.leftSideBar.prototype.resizeHandler=function(){
    this.resize();
}
