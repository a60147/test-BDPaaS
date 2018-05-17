/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */

jLego.objectUI.searchBar=function(){
    var myID;
    var myConsts;
    var myClass;
    var parentElement;
    var mainElement;
    var searchElement;
    this.initialize();
}

jLego.objectUI.searchBar.prototype.initialize=function(){
    this.myID = jLego.objectUI.id.searchBar;
    this.myClass = jLego.objectUI.cls.searchBar;
}

jLego.objectUI.searchBar.prototype.add=function(target, option){
    //check option
    if(target==null) return null;
    if(option==null){
        var option={};
    }
    this.parentElement = target;
    
    var width, height, positionX = 0, positionY = 0;
    if(option.width==null){
        width = $(target).width();
    }
    else{
        width = parseInt(option.width);
    }
    if(option.left!=null){
        positionX = parseInt(option.left);
    }
    else if(option.right!=null){
        positionX = parseInt(option.right);
    }
    if(option.top!=null){
        positionY = parseInt(option.top);
    }
    else if(option.bottom!=null){
        positionY = parseInt(option.bottom);
    }
    var defID = jLego.func.getRandomString();
    var frame =
            jLego.basicUI.addDiv(target, {id: defID+"_search_box", class: this.myClass.SEARCH_BOX});
    $(frame).width(width);
    $(frame).height(height);
    this.mainElement = frame;
    if(option.top) $(frame).css('top', positionY + "px");
    else if(option.bottom) $(frame).css('bottom', positionY + "px");
    else $(frame).css('top', positionY + "px");
    if(option.left)  $(frame).css('left', positionX + "px");
    else if(option.right)  $(frame).css('right', positionX + "px");
    else $(frame).css('left', positionX + "px");
    this.searchElement = 
            jLego.basicUI.addInput(frame, {id: defID+"_search_input", class: this.myClass.SEARCH_ELEMENT, type: 'text', name: ''});  
    var searchIcon=
            jLego.basicUI.addImg(frame, {id: defID+"_searchIcon", class: this.myClass.SEARCH_ICON, src: jLego.func.getImgPath({category: 'common', name: 'search', type: 'png'})});
    $(this.searchElement).width(width - $(searchIcon).width() - 20);
    $(this.searchElement).height(height - 2);
    $(this.searchElement).css('line-height', (height - 2) + "px");
}

jLego.objectUI.searchBar.prototype.show=function(){
    $(this.mainElement).show();
}
jLego.objectUI.searchBar.prototype.hide=function(){
    $(this.mainElement).hide();
}

jLego.objectUI.searchBar.prototype.getSearchElement=function(){
    return this.searchElement;
}

jLego.objectUI.searchBar.prototype.setSearchElementText=function(searchText){
    $(this.searchElement).val(searchText);
    $(this.searchElement).trigger('keyup');
}