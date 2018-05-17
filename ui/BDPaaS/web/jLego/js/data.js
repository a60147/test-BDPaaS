/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
//********************** VARIABLES *************************
jLego.variables.isInit = false;
jLego.variables.resizableObjectList =[];

//********************** CONSTANTS *************************
jLego.constants.projectName = window.location.pathname.substr(1, window.location.pathname.lastIndexOf('/')-1);
jLego.constants.randomIDSize = 12;

//********************** URL *************************
jLego.url.rootUrl = '../' + jLego.constants.projectName;
jLego.url.baseUrl = '../' + jLego.constants.projectName +'/jLego';
jLego.url.baseImgUrl = '../' + jLego.constants.projectName +'/jLego/img';
jLego.url.baseImgUrlBlur = "_blur";
jLego.url.baseImgExtensionJPG = ".jpg";
jLego.url.baseImgExtensionPNG = ".png";
jLego.url.baseImgExtensionGIF = ".gif";