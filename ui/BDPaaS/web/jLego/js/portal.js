/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jLego = {};
jLego.id = {};
jLego.classs = {};
jLego.cls = jLego.classs;
jLego.url = {};
jLego.languages = {};
jLego.language = jLego.languages;
jLego.lang = jLego.languages;
jLego.variables = {};
jLego.var = jLego.variables;
jLego.constants = {};
jLego.const = jLego.constants;
jLego.functions = {};
jLego.function = jLego.functions;
jLego.func = jLego.functions;

        
jLego.init = function(){
    jLego.func.registerSite('basicUI');
    jLego.func.registerSite('objectUI');
}

jLego.resize = function(){
    for(var i=0; i< jLego.variables.resizableObjectList.length; i++){
        if(jLego.variables.resizableObjectList[i].resizeHandler) jLego.variables.resizableObjectList[i].resizeHandler();
    }
}

jLego.setLanguage = function(language){
    switch(language){
        case 'EN':
        case 'en':
        case 'English':
        case 'en-US':
        case 'en_US':
            jLego.lang.currentLanguage="en_US";
            break;
        case 'ja':
        case 'ja_JP':
            jLego.lang.currentLanguage="ja_JP";
            break;
        case 'zh':
        case 'TW':
        case 'Taiwan':
        case 'Chinese':
        case 'Tradition_Chinese':
        case 'zh-TW':
        case 'zh_TW':
        default:
            jLego.lang.currentLanguage="zh_TW";
            break;
    }
}

jLego.getCurrentLanguage = function(){
    return jLego.lang.currentLanguage;
}



