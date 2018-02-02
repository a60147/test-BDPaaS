/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
jLego.objectUI.visMap=function(option){
    var myID;
    var myClass;
    var myConsts;
    
    var parentElement;
    var mainElement;
    var visMapElement;
    
    var mapData;
    var mapOption;
    this.initialize();
    if(option != null) this.parseOption(option);
}

jLego.objectUI.visMap.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.visMap;
    this.myClass=jLego.objectUI.cls.visMap;
    this.myConsts=jLego.objectUI.constants.visMap;
}

jLego.objectUI.visMap.prototype.parseOption=function(option){
    this.mapData = option
}

jLego.objectUI.visMap.prototype.add=function(target, option){
    if(target == null) return;
    else this.parentElement = target;
    if(option == null) return;
    else if(option.mapData == null) return;
    else if(option.mapOptions == null) return;
    
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME});
    
    var container = document.getElementById($(this.mainElement).attr('id'));
    
    this.visMapElement = new vis.Network(container, option.mapData, option.mapOptions);
    this.resize();
}

jLego.objectUI.visMap.prototype.reDraw=function(option){
    this.visMapElement.setData(option.mapData);
    this.visMapElement.setOptions(option.mapOptions);

    $(this.mainElement).hide();
    this.visMapElement.redraw();
    $(this.mainElement).fadeIn(500);
}

jLego.objectUI.visMap.prototype.getVisMapElement=function(){
    return this.visMapElement;
}

jLego.objectUI.visMap.prototype.resize=function(){
    
}

jLego.objectUI.visMap.prototype.resizeHandler=function(){
    this.resize();
}