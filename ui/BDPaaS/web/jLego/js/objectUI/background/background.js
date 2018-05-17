/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */

jLego.objectUI.background=function(){
    var myID;
    var myClass;
    var defaultBackgroundURL;
    var mainElement;
    this.initialize();
};
jLego.objectUI.background.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.background;
    this.myClass=jLego.objectUI.cls.background;
}
//元件加入
jLego.objectUI.background.prototype.add=function(target, backgroundURL){
    this.mainElement = jLego.basicUI.addDiv(target, {id: this.myID.BG_FRAME,
                                                     class: this.myClass.BG_FRAME}
                                            );
    this.defaultBackgroundURL=backgroundURL;
    $(this.mainElement).css('background-image', 'url('+backgroundURL +')');
    return this.mainElement;
}
//元件讀取
jLego.objectUI.background.prototype.get=function(){
    return this.mainElement;
};
//設定背景圖片
jLego.objectUI.background.prototype.setBackgroundImage=function(backgroundURL){
    $(this.mainElement).css('background-image', 'url('+backgroundURL +')');
};
//回復預設背景圖片
jLego.objectUI.background.prototype.restoreDefaultBackgroundImage=function(){
    $(this.mainElement).css('background-image', 'url('+this.defaultBackgroundURL +')');
};
   
