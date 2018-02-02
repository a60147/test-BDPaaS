/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

userPage.prototype.addUserPanel = function(target, option){
    var Jdata = option.Jdata;
    var userPanel = 
        jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.NODE_FRAME});
    this.userFrame = userPanel;
    //Title
    var titleFrame =
        jLego.basicUI.addDiv(userPanel, {id: jLego.func.getRandomString(), class: this.myClass.NODE_TITLE});      
    $(titleFrame).text(option.title);
    
    //Node table
    var nodeFrame =
        jLego.basicUI.addDiv(userPanel, {id: jLego.func.getRandomString(), class: this.myClass.NODE_TABLE_FRAME});    
    this.userTableCTRLer = new jLego.objectUI.nodeTable();
    this.userTableCTRLer.add(nodeFrame, {
        columnTitleList: this.myLanguage.USER_NODE_TABLE_TITLE,
        widthType: this.myLanguage.USER_NODE_TABLE_TITLE_WIDTH_TYPE,
        minWidthList: this.myLanguage.USER_NODE_TABLE_TITLE_WIDTH,
        rowCount: Jdata.data.length
    });
    var container;
    
    for(var i=0; i<Jdata.data.length; i++){
        var columeIndex = 0;
        var currentData= Jdata.data[i];
        var password = currentData.password;
        //userID
        container = this.userTableCTRLer.getContainer(i, columeIndex);
        var userID = 
                jLego.basicUI.addDiv(container, {id: jLego.func.getRandomString(), class: ""});
        $(userID).text(currentData.userID);
        columeIndex++;
        //userName
        container = this.userTableCTRLer.getContainer(i, columeIndex);
        var userName = 
                jLego.basicUI.addDiv(container, {id: jLego.func.getRandomString(), class: ""});
        $(userName).text(currentData.userName);
        columeIndex++;
        //platformContainer
        container = this.userTableCTRLer.getContainer(i, columeIndex);
        var platformContainer = 
                jLego.basicUI.addDiv(container, {id: jLego.func.getRandomString(), class: ""});
        var k8sDashboardIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'dashboardDark', type: 'png'})});
        var apexIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'apexDark', type: 'png'})});
        var hadoopIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'hadoopDark', type: 'png'})});
        var yarnIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'yarnDark', type: 'png'})});
        var sparkIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'sparkDark', type: 'png'})});
        var zeppelinIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'zeppelinDark', type: 'png'})});
        var grafanaIcon = 
                jLego.basicUI.addImg(platformContainer, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({folder: "webView/img/platform", name: 'grafanaDark', type: 'png'})});

        if(!this.hasThisTypeOfPlatform(currentData.platform, "apex")){
            $(apexIcon).css('opacity', "0.3");
            $(apexIcon).attr('title', 'Apex: Unavailable');
            $(apexIcon).tooltip();
        }
        else{
            $(apexIcon).attr('title', 'Apex: ' + this.getURLOfPlatform(currentData.platform, "apex"));
            $(apexIcon).tooltip();
        }
        if(!this.hasThisTypeOfPlatform(currentData.platform, "zeppelin")){
            $(zeppelinIcon).css('opacity', "0.3");
            $(zeppelinIcon).attr('title', 'Zeppelin: Unavailable');
            $(zeppelinIcon).tooltip();
        }
        else{
            $(zeppelinIcon).attr('title', 'Zeppelin: ' + this.getURLOfPlatform(currentData.platform, "zeppelin"));
            $(zeppelinIcon).tooltip();
        }
        if(!this.hasThisTypeOfPlatform(currentData.platform, "spark")){
            $(sparkIcon).css('opacity', "0.3");
            $(sparkIcon).attr('title', 'Spark: Unavailable');
            $(sparkIcon).tooltip();
        }
        else{
            $(sparkIcon).attr('title', 'Spark: ' + this.getURLOfPlatform(currentData.platform, "spark"));
            $(sparkIcon).tooltip();
        }
        if(!this.hasThisTypeOfPlatform(currentData.platform, "hadoop")){
            $(hadoopIcon).css('opacity', "0.3");
            $(hadoopIcon).attr('title', 'Hadoop: Unavailable');
            $(hadoopIcon).tooltip();
        }
        else{
            $(hadoopIcon).attr('title', 'Hadoop: ' + this.getURLOfPlatform(currentData.platform, "hadoop"));
            $(hadoopIcon).tooltip();
        }
        if(!this.hasThisTypeOfPlatform(currentData.platform, "yarn")){
            $(yarnIcon).css('opacity', "0.3");
            $(yarnIcon).attr('title', 'Yarn: Unavailable');
            $(yarnIcon).tooltip();
        }
        else{
            $(yarnIcon).attr('title', 'Yarn: ' + this.getURLOfPlatform(currentData.platform, "yarn"));
            $(yarnIcon).tooltip();
        }
        if(!this.hasThisTypeOfPlatform(currentData.platform, "k8sDashboard")){
            $(k8sDashboardIcon).css('opacity', "0.3");
            $(k8sDashboardIcon).attr('title', 'Dashboard: Unavailable');
            $(k8sDashboardIcon).tooltip();
        }
        else{
            $(k8sDashboardIcon).attr('title', 'Dashboard: ' + this.getURLOfPlatform(currentData.platform, "k8sDashboard"));
            $(k8sDashboardIcon).tooltip();
        }
        if(!this.hasThisTypeOfPlatform(currentData.platform, "grafana")){
            $(grafanaIcon).css('opacity', "0.3");
            $(grafanaIcon).attr('title', 'Grafana: Unavailable');
            $(grafanaIcon).tooltip();
        }
        else{
            $(grafanaIcon).attr('title', 'Grafana: ' + this.getURLOfPlatform(currentData.platform, "grafana"));
            $(grafanaIcon).tooltip();
        }
        columeIndex++;
        //authority
        container = this.userTableCTRLer.getContainer(i, columeIndex);
        var authority = 
                jLego.basicUI.addDiv(container, {id: jLego.func.getRandomString(), class: ""});
        if(currentData.authority == 0){
            $(authority).text("Administrator");
        }
        else{
            $(authority).text("User");
        }
        columeIndex++;
        //action
        container = this.userTableCTRLer.getContainer(i, columeIndex);
        var editButton = 
                jLego.basicUI.addImg(container, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({category: 'buttonIcon', name: 'edit', type: 'png'})});
        $(editButton).data('parent', this);
        $(editButton).data('userData', currentData);
        $(editButton).attr('title', "Edit");
        $(editButton).tooltip();
        $(editButton).click(function(){
            var parent = $(this).data('parent');
            var currentData = $(this).data('userData');
            var targetExpiredDate = null;
            if(currentData.expiredDate != null && currentData.expiredDate != ""){
                targetExpiredDate = new moment(currentData.expiredDate).format('YYYY-MM-DD HH:mm:ss').toString();
            }
            parent.drawEditUserForm(currentData.userID, currentData.userName, currentData.password, targetExpiredDate, currentData.authority, currentData.platform);

        })
        var writeButton = 
                jLego.basicUI.addImg(container, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({category: 'buttonIcon', name: 'handWrite', type: 'png'})});
        $(writeButton).data('parent', this);
        $(writeButton).data('userData', currentData);
        $(writeButton).attr('title', "Manual Edit Platform");
        $(writeButton).tooltip();
        $(writeButton).click(function(){
            var parent = $(this).data('parent');
            var currentData = $(this).data('userData');
            parent.drawManualEditPlatformForm(currentData.userID, currentData.platform);
        })
        var deleteButton = 
                jLego.basicUI.addImg(container, {id: jLego.func.getRandomString(), class: this.myClass.NODE_ACTION_ICON, src: jLego.func.getImgPath({category: 'buttonIcon', name: 'trash', type: 'png'})});
        $(deleteButton).data('parent', this);
        $(deleteButton).data('userData', currentData);
        $(deleteButton).attr('title', "Delete");
        $(deleteButton).tooltip();
        $(deleteButton).click(function(){
            var parent = $(this).data('parent');
            var currentData = $(this).data('userData');
            parent.deleteUser(currentData.userID);
        })
        columeIndex++;
    }
}

userPage.prototype.hasThisTypeOfPlatform=function(platformList, type){
    for(var i=0; i<platformList.length; i++){
        if(platformList[i].type == type) return true;
    }
    return false;
}

userPage.prototype.getURLOfPlatform=function(platformList, type){
    var hasMultiple = false;
    var targetURL = "";
    for(var i=0; i<platformList.length; i++){
        if(platformList[i].type == type){
            if(targetURL == "") targetURL = platformList[i].url;
            else{
                if(hasMultiple == false) targetURL += "...";
                hasMultiple = true;
            }
        }
    }
    return targetURL;
}


userPage.prototype.deleteUser = function(targetUserID){
    webView.connection.deleteUser(targetUserID, function(Jdata){
       if(Jdata.errorCode==0){
           jLego.toastCTRLer.addSuccess({title: "Success", content: "Delete Success!"});
           webView.userPage.reDrawUserPanel();
       } 
       else{
            jLego.toastCTRLer.addError({title: "Failed", content: "Delete Failed..."});
       }
    });
}
