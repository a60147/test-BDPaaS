/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

connection = function(apiProvider){
    var apiProvider;
    this.initialize(apiProvider);
}

connection.prototype.initialize=function(apiProvider){
    if(apiProvider == null) this.apiProvider = "0";
    else this.apiProvider = apiProvider;
}

connection.prototype.getDataTorrentURL=function(onReceiveCallback){
    $.ajax({
        url: webView.url.common.getDataTorrentURL,
        type: "GET",
        dataType: "json",
        async: true,
        data: {
        },
        success: function(Jdata) {
              onReceiveCallback(Jdata);
        },
        error: function() {
            //jLego.statusMonitor.showWarning({title: "Get System Info Error!"});
            onReceiveCallback({errCode: 1});
        }        
    });
}

connection.prototype.getSparkProjectList=function(onReceiveCallback){
    $.ajax({
        url: webView.url.common.getSparkProjectList,
        type: "GET",
        dataType: "json",
        async: true,
        data: {
        },
        success: function(Jdata) {
              onReceiveCallback(Jdata);
        },
        error: function() {
            //jLego.statusMonitor.showWarning({title: "Get System Info Error!"});
            onReceiveCallback({errCode: 1});
        }        
    });
}

connection.prototype.getSparkZeppelinURL=function(onReceiveCallback){
    $.ajax({
        url: webView.url.common.getSparkZeppelinURL,
        type: "GET",
        dataType: "json",
        async: true,
        data: {
        },
        success: function(Jdata) {
              onReceiveCallback(Jdata);
        },
        error: function() {
            //jLego.statusMonitor.showWarning({title: "Get System Info Error!"});
            onReceiveCallback({errCode: 1});
        }        
    });
}

connection.prototype.getSparkConsoleURL=function(onReceiveCallback){
    $.ajax({
        url: webView.url.common.getSparkConsoleURL,
        type: "GET",
        dataType: "json",
        async: true,
        data: {
        },
        success: function(Jdata) {
              onReceiveCallback(Jdata);
        },
        error: function() {
            //jLego.statusMonitor.showWarning({title: "Get System Info Error!"});
            onReceiveCallback({errCode: 1});
        }        
    });
}

connection.prototype.doLogout=function(onReceiveCallback){
    $.ajax({
        url: webView.url.common.doLogout,
        type: "GET",
        dataType: "json",
        async: true,
        data: {
        },
        success: function(Jdata) {
              onReceiveCallback(Jdata);
        },
        error: function() {
            //jLego.statusMonitor.showWarning({title: "Get System Info Error!"});
            onReceiveCallback({errCode: 1});
        }        
    });
}

connection.prototype.getAllUsers=function(onReceiveCallback){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : webView.url.common.getAllUsers,
        data     : {},
        dataType: "json",
        async: false,
        processData: false,
        contentType: false,
        success  : function(Jdata) {
            //alert(JSON.stringify(Jdata))
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });

}

connection.prototype.addUser=function(userFormData, onReceiveCallback){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : "addUser",
        data     : userFormData,
        dataType: "json",
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.editUser=function(userFormData, onReceiveCallback){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : "editUser",
        data     : userFormData,
        dataType: "json",
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.deleteUser=function(targetUserID, onReceiveCallback){
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : "deleteUser",
        data     : {targetUserID: targetUserID},
        dataType: "json",
        async: true,
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.getMyPlatforms=function(onReceiveCallback){
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : "getMyPlatforms",
        data     : {},
        dataType: "json",
        async: true,
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.getAllDashboards=function(onReceiveCallback){
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : "getAllDashboards",
        data     : {},
        dataType: "json",
        async: true,
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.getAllSparkConsoles=function(onReceiveCallback){
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : "getAllSparkConsoles",
        data     : {},
        dataType: "json",
        async: true,
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.getAllApexConsoles=function(onReceiveCallback){
    $.ajax({
        type     : "GET",
        cache    : false,
        url      : "getAllApexConsoles",
        data     : {},
        dataType: "json",
        async: true,
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.manualEditPlatform=function(inputFormData, onReceiveCallback){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : "manualUpdatePlatform",
        data     : JSON.stringify(inputFormData),
        dataType: "json",
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}


connection.prototype.addProjectByUser=function(inputFormData, onReceiveCallback){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : "addProjectByUser",
        data     : JSON.stringify(inputFormData),
        dataType: "json",
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

connection.prototype.deleteProjectByUser=function(inputFormData, onReceiveCallback){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : "deleteProjectByUser",
        data     : JSON.stringify(inputFormData),
        dataType: "json",
        success  : function(Jdata) {
            onReceiveCallback(Jdata);
        },
        error: function(){
            onReceiveCallback({errCode: 1});
        }
    });
}

