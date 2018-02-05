/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

userPage = function(){
    var myID;
    var myClass;
    var myConsts;
    var myLanguage;
    var parentElement;
    var mainElement; 
    
    //Button Part
    var buttonFrame;
    var addUserButton;
    var refreshButton;
    
    //User Part
    var userFrame;
    var userTableCTRLer;
    
    var buttonCTRLer;
   
    var popupPanelCTRLer;
    
    this.initialize();
}

userPage.prototype.initialize=function(){
    this.myID=webView.id.userPage;
    this.myClass=webView.cls.userPage;
    this.myConsts=webView.constants.userPage;
    this.myLanguage=webView.lang.userPage;
    
    this.buttonCTRLer = new jLego.objectUI.buttonCTRLer();
}

userPage.prototype.add=function(target){
    this.parentElement = target;
    this.mainElement = 
           jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME}); 
    webView.constants.userPage.tempTarget = this.mainElement;
    jLego.toastCTRLer.add();
    webView.connection.getAllUsers(function(Jdata){
        if(Jdata.errorCode==0){
            webView.userPage.addButtonPanel(webView.constants.userPage.tempTarget);
            webView.userPage.addUserPanel(webView.constants.userPage.tempTarget, {
                title: "User List",
                Jdata: Jdata
            });
            webView.userPage.resize();
            //webView.userPage.startUpdateMonitor(false);
        }
        else if(Jdata.errprCode == 101){
            var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
        }
    });
}

userPage.prototype.addButtonPanel=function(target){
    this.buttonFrame = 
        jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.BUTTON_PANEL_FRAME});
    //add task button
    this.addUserButton =
       jLego.basicUI.addDiv(this.buttonFrame, {id: jLego.func.getRandomString(), class: this.myClass.LEFT_BUTTON_FRAME});
    var icon =
       jLego.basicUI.addImg(this.addUserButton, {id: jLego.func.getRandomString(), class: this.myClass.BUTTON_ICON, src: jLego.func.getImgPath({category: 'buttonIcon', name: 'addUser', type: 'png'})});
    var text = 
       jLego.basicUI.addDiv(this.addUserButton, {id: jLego.func.getRandomString(), class: this.myClass.BUTTON_TEXT});
    $(text).text("Add User");
    $(this.addUserButton).data('parent', this);
    $(this.addUserButton).click(function(){
        var parent = $(this).data('parent');
        parent.drawAddNewUserForm();
    });
    //refresh button
    this.refreshButton =
       jLego.basicUI.addDiv(this.buttonFrame, {id: jLego.func.getRandomString(), class: this.myClass.RIGHT_BUTTON_FRAME});
    var icon =
       jLego.basicUI.addImg(this.refreshButton, {id: jLego.func.getRandomString(), class: this.myClass.BUTTON_ICON, src: jLego.func.getImgPath({category: 'buttonIcon', name: 'refresh', type: 'png'})});
    var text = 
       jLego.basicUI.addDiv(this.refreshButton, {id: jLego.func.getRandomString(), class: this.myClass.BUTTON_TEXT});
    $(text).text("Refresh"); 
    $(this.refreshButton).data('parent', this);
    $(this.refreshButton).click(function(){
        var parent = $(this).data('parent');
        parent.reDrawUserPanel();
    });
}

userPage.prototype.drawAddNewUserForm=function(){
    this.popupPanelCTRLer = new jLego.objectUI.popoutPanel();
    var optionListCTRLer = new jLego.objectUI.optionListCTRLer();
    this.popupPanelCTRLer.add(document.body, {hasFootFrame: true, title: "Add User"});
    var contentFrame = this.popupPanelCTRLer.getContentFrame();
    $(contentFrame).css('overflow', 'auto');
    //button frame
    var buttonFrame =
            jLego.basicUI.addDiv(contentFrame, {id: jLego.func.getRandomString(), class: this.myClass.FORM_BUTTON_FRAME});
    var apexItemList = [];
    var sparkItemList = [];
    var addApexProjectButton =
        this.buttonCTRLer.addFreeSingleButton(buttonFrame, {type: 'positive', float: "left", top: 4, left: 10, title: "Add Apex"});
    var addSparkProjectButton =
        this.buttonCTRLer.addFreeSingleButton(buttonFrame, {type: 'positive', float: "left", top: 4, left: 8, title: "Add Spark"});
    //setting list
    var userID = optionListCTRLer.add(contentFrame, {
        title: "Account",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var userName = optionListCTRLer.add(contentFrame, {
        title: "Name",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var password = optionListCTRLer.add(contentFrame, {
        title: "Password",
        type: 'input',
        inputType: 'password',
        hideButton: true,
        hideBottomBorder: false,
    });
    
    var confirmPassword = optionListCTRLer.add(contentFrame, {
        title: "Confirm Password",
        type: 'input',
        inputType: 'password',
        hideButton: true,
        hideBottomBorder: false,
    });
    var expiredDate = optionListCTRLer.add(contentFrame, {
        title: "Expired Date",
        type: 'timeInput',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var authority = optionListCTRLer.add(contentFrame, {
                title: "Role",
                type: 'select',
                inputType: 'text',
                selectionName: ["Administrator", "User"],
                selectionValue: [0, 1],
                defaultValue: 1,
                hideButton: true,
                hideBottomBorder: false,
            });
    this.setupInputTextOnly(userID);
    this.setupInputTextOnly(password);
    this.setupInputTextOnly(confirmPassword);
    //apexItemList[apexItemList.length] = this.addApexProjectInputField(optionListCTRLer, contentFrame);
    //sparkItemList[sparkItemList.length] = this.addSparkProjectInputField(optionListCTRLer, contentFrame);
    
    /*var apexURL = optionListCTRLer.add(contentFrame, {
        title: "Apex (dataTorrent) URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var sparkURL = optionListCTRLer.add(contentFrame, {
        title: "Spark URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var zeppelinURL = optionListCTRLer.add(contentFrame, {
        title: "Zeppelin URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var grafanaURL = optionListCTRLer.add(contentFrame, {
        title: "Grafana URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var k8sDashboardURL = optionListCTRLer.add(contentFrame, {
        title: "Dashboard URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var hadoopURL = optionListCTRLer.add(contentFrame, {
        title: "Hadoop URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });
    var yarnURL = optionListCTRLer.add(contentFrame, {
        title: "Yarn URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
    });*/
    var footerFrame = this.popupPanelCTRLer.getFootFrame();
    var submitButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'positive', top: 4, right: 10, title: "Add"});
    $(submitButton).data('parent', this);
    $(submitButton).data('inputDataSet', {
        optionListCTRLer: optionListCTRLer,
        userID: userID,
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
        expiredDate: expiredDate,
        authority: authority,
        apexItemList: apexItemList,
        sparkItemList: sparkItemList
        /*apexURL: apexURL,
        sparkURL: sparkURL,
        grafanaURL: grafanaURL,
        k8sDashboardURL: k8sDashboardURL,
        yarnURL: yarnURL,
        hadoopURL: hadoopURL,
        zeppelinURL: zeppelinURL*/
    });
    
    $(addApexProjectButton).data('submitButton', submitButton);
    $(addApexProjectButton).data('parent', this);
    $(addApexProjectButton).data('optionListCTRLer', optionListCTRLer);
    $(addApexProjectButton).data('contentFrame', contentFrame);
    $(addSparkProjectButton).data('submitButton', submitButton);
    $(addSparkProjectButton).data('parent', this);
    $(addSparkProjectButton).data('optionListCTRLer', optionListCTRLer);
    $(addSparkProjectButton).data('contentFrame', contentFrame);
    $(addApexProjectButton).click(function(){
        var submitButton = $(this).data('submitButton');
        var parent = $(this).data('parent');
        var contentFrame = $(this).data('contentFrame');
        var optionListCTRLer = $(this).data('optionListCTRLer');
        var inputDataSet = $(submitButton).data('inputDataSet');
        var apexItemList = inputDataSet.apexItemList;
        apexItemList[apexItemList.length] = parent.addApexProjectInputField(optionListCTRLer, contentFrame);
        inputDataSet.apexItemList = apexItemList;
         $(submitButton).data('inputDataSet', inputDataSet);
    });
    $(addSparkProjectButton).click(function(){
        var submitButton = $(this).data('submitButton');
        var parent = $(this).data('parent');
        var contentFrame = $(this).data('contentFrame');
        var optionListCTRLer = $(this).data('optionListCTRLer');
        var inputDataSet = $(submitButton).data('inputDataSet');
        var sparkItemList = inputDataSet.sparkItemList;
        sparkItemList[sparkItemList.length] = parent.addSparkProjectInputField(optionListCTRLer, contentFrame);
        inputDataSet.sparkItemList = sparkItemList;
         $(submitButton).data('inputDataSet', inputDataSet);
    });
    $(submitButton).click(function(){
        var parent = $(this).data('parent');
        var inputDataSet = $(this).data('inputDataSet');
        var optionListCTRLer = inputDataSet.optionListCTRLer;
        var inputUserID = optionListCTRLer.getValue(inputDataSet.userID);
        var inputUserName = optionListCTRLer.getValue(inputDataSet.userName);
        var inputPassword = optionListCTRLer.getValue(inputDataSet.password);
        var inputPasswordConfirm = optionListCTRLer.getValue(inputDataSet.confirmPassword);
        var inputExpiredDate = optionListCTRLer.getValue(inputDataSet.expiredDate);
        var inputAuthority=optionListCTRLer.getValue(inputDataSet.authority);
        var apexItemList = inputDataSet.apexItemList;
        var sparkItemList = inputDataSet.sparkItemList;
        /*var inputApexURL=optionListCTRLer.getValue(inputDataSet.apexURL);
        var inputSparkURL=optionListCTRLer.getValue(inputDataSet.sparkURL);
        var inputGrafanaURL=optionListCTRLer.getValue(inputDataSet.grafanaURL);
        var inputHadoopURL=optionListCTRLer.getValue(inputDataSet.hadoopURL);
        var inputK8SDashboardURL=optionListCTRLer.getValue(inputDataSet.k8sDashboardURL);
        var inputYarnURL=optionListCTRLer.getValue(inputDataSet.yarnURL);
        var inputZeppelinURL = optionListCTRLer.getValue(inputDataSet.zeppelinURL);*/
        var expiredTimeMoment = null;
        if(inputExpiredDate != "" && inputExpiredDate != null){
            var expiredTimeMoment = new moment(inputExpiredDate).valueOf();
        }
        if(inputUserID == "" || inputUserName == "" || inputPassword == "" || inputPasswordConfirm == ""){
            jLego.toastCTRLer.addError({title: "Error", content: "Please fill all field."});
        }
        else if(inputPassword != inputPasswordConfirm){
            jLego.toastCTRLer.addError({title: "Error", content: "Password not match."});
        }
        else{
            var apexProjectList = [];
            for(var i=0; i<apexItemList.length; i++){
                var currentItem = apexItemList[i];
                if(!parent.isItemDeleted(currentItem)){
                    var projectName = optionListCTRLer.getValue(currentItem);
                    if(projectName!=null){
                        if(projectName.toString().replace(" ", "") != ""){
                            var newProject = {
                                projectName: projectName,
                                type: "apex",
                                operation: "add"
                            }
                            apexProjectList[apexProjectList.length] = newProject;
                        }
                    }
                }
            }
            var sparkProjectList = [];
            for(var i=0; i<sparkItemList.length; i++){
                var currentItem = sparkItemList[i];
                var projectName = optionListCTRLer.getValue(currentItem);
                if(projectName!=null){
                    if(projectName.toString().replace(" ", "") != ""){
                        var newProject = {
                            projectName: projectName,
                            type: "spark",
                            operation: "add"
                        }
                        sparkProjectList[sparkProjectList.length] = newProject;
                    }
                }
            }
            var inputForm = {
                userID: inputUserID,
                userName: inputUserName,
                password: inputPassword,
                authority: inputAuthority,
                expiredDate: expiredTimeMoment,
                apexProjectList: JSON.stringify(apexProjectList),
                sparkProjectList: JSON.stringify(sparkProjectList)
                /*apexURL: inputApexURL,
                sparkURL: inputSparkURL,
                grafanaURL: inputGrafanaURL,
                hadoopURL: inputHadoopURL,
                k8sDashboardURL: inputK8SDashboardURL,
                yarnURL: inputYarnURL,
                zeppelinURL: inputZeppelinURL*/
            }

            var completeCallback = function(Jdata){
                if(Jdata.errorCode==0){
                    parent.popupPanelCTRLer.close();
                    jLego.toastCTRLer.addSuccess({title: "Success", content: "Add success!"});   
                    parent.reDrawUserPanel();
                }
                else if(Jdata.errorCode == 101){
                    var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
                }
                else if(Jdata.errorCode == 201){
                    jLego.toastCTRLer.addError({title: "Error", content: "User existed."});
                }
                else{
                    jLego.toastCTRLer.addError({title: "Error", content: "Failed!"});
                }
            }
            webView.connection.addUser(inputForm, completeCallback);
        }
    });
}

userPage.prototype.addApexProjectInputField=function(optionListCTRLer, target, defaultValue, editable){
    var apexItem = optionListCTRLer.add(target, {
        title: "Apex Project",
        type: 'input',
        inputType: 'text',
        hideButton: false,
        buttonClass: "warning",
        buttonText: "Delete",
        defaultValue: defaultValue,
        editable: editable,
        hideBottomBorder: false,
    });
    this.setupInputTextOnly(apexItem);
    var deleteButton = optionListCTRLer.getButton(apexItem);
    $(deleteButton).data('relatedItem', apexItem);
    $(deleteButton).click(function(){
        var relatedItem = $(this).data('relatedItem');
        $(relatedItem).data('isDeleted', true);
        $(relatedItem).hide();
    })
    if(editable==false){
        $(apexItem).data('wasExisted', true);
    }
    return apexItem;
}

userPage.prototype.addSparkProjectInputField=function(optionListCTRLer, target, defaultValue, editable){
    var sparkItem = optionListCTRLer.add(target, {
        title: "Spark Project",
        type: 'input',
        inputType: 'text',
        hideButton: false,
        buttonClass: "warning",
        buttonText: "Delete",
        defaultValue: defaultValue,
        editable: editable,
        hideBottomBorder: false,
    });
    this.setupInputTextOnly(sparkItem);
    var deleteButton = optionListCTRLer.getButton(sparkItem);
    $(deleteButton).data('relatedItem', sparkItem);
    $(deleteButton).click(function(){
        var relatedItem = $(this).data('relatedItem');
        $(relatedItem).data('isDeleted', true);
        $(relatedItem).hide();
    })
    if(editable==false){
        $(sparkItem).data('wasExisted', true);
    }
    return sparkItem;
}

userPage.prototype.isItemDeleted =function(item){
    if($(item).data('isDeleted') == true) return true;
    else return false;
}

userPage.prototype.wasItemExisted =function(item){
    if($(item).data('wasExisted') == true) return true;
    else return false;
}


userPage.prototype.drawEditUserForm=function(userID, currentUserName, currentPassword, currentExpiredDate, currentAuthority, currentPlatforms){
    if(currentPlatforms == null) currentPlatforms = {};
    this.popupPanelCTRLer = new jLego.objectUI.popoutPanel();
    var optionListCTRLer = new jLego.objectUI.optionListCTRLer();
    this.popupPanelCTRLer.add(document.body, {hasFootFrame: true, title: "Edit User"});
    var contentFrame = this.popupPanelCTRLer.getContentFrame();
    //button frame
    var buttonFrame =
            jLego.basicUI.addDiv(contentFrame, {id: jLego.func.getRandomString(), class: this.myClass.FORM_BUTTON_FRAME});
    var apexItemList = [];
    var sparkItemList = [];
    var addApexProjectButton =
        this.buttonCTRLer.addFreeSingleButton(buttonFrame, {type: 'positive', float: "left", top: 4, left: 10, title: "Add Apex"});
    var addSparkProjectButton =
        this.buttonCTRLer.addFreeSingleButton(buttonFrame, {type: 'positive', float: "left", top: 4, left: 8, title: "Add Spark"});

    var userID = optionListCTRLer.add(contentFrame, {
        title: "Account",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: userID,
        editable: false
    });
    var userName = optionListCTRLer.add(contentFrame, {
        title: "Name",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentUserName,
    });
    var password = optionListCTRLer.add(contentFrame, {
        title: "Password",
        type: 'input',
        inputType: 'password',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPassword,
    });
    var confirmPassword = optionListCTRLer.add(contentFrame, {
        title: "Confirm Password",
        type: 'input',
        inputType: 'password',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPassword,
    });
    var expiredDate = optionListCTRLer.add(contentFrame, {
        title: "Expired Date",
        type: 'timeInput',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentExpiredDate,
    });
    var authority = optionListCTRLer.add(contentFrame, {
        title: "Role",
        type: 'select',
        inputType: 'text',
        selectionName: ["Administrator", "User"],
        selectionValue: [0, 1],
        defaultValue: currentAuthority,
        hideButton: true,
        hideBottomBorder: false,
    });
    this.setupInputTextOnly(userID);
    this.setupInputTextOnly(password);
    this.setupInputTextOnly(confirmPassword);
    for(var i=0; i<currentPlatforms.length; i++){
        var currentPlatform = currentPlatforms[i];
        if(currentPlatform.type=="apex"){
            var projectNameKeyList = currentPlatform.projectName.toString().split("-");
            if(projectNameKeyList.length >= 4) var projectName = projectNameKeyList[2] + "-" + projectNameKeyList[3];
            else var projectName = projectNameKeyList[2];
            apexItemList[apexItemList.length] = this.addApexProjectInputField(optionListCTRLer, contentFrame, projectName, false);
        }
        else if(currentPlatform.type=="spark"){
            var projectNameKeyList = currentPlatform.projectName.toString().split("-");
            if(projectNameKeyList.length >= 4) var projectName = projectNameKeyList[2] + "-" + projectNameKeyList[3];
            else var projectName = projectNameKeyList[2];
            sparkItemList[sparkItemList.length] = this.addSparkProjectInputField(optionListCTRLer, contentFrame, projectName, false);
        }
    }
    /*var apexURL = optionListCTRLer.add(contentFrame, {
        title: "Apex (dataTorrent) URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPlatforms.apexURL,
    });
    var sparkURL = optionListCTRLer.add(contentFrame, {
        title: "Spark URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPlatforms.sparkURL,
    });
    var grafanaURL = optionListCTRLer.add(contentFrame, {
        title: "Grafana URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPlatforms.grafanaURL,
    });
    var k8sDashboardURL = optionListCTRLer.add(contentFrame, {
        title: "Dashboard URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPlatforms.k8sDashboardURL,
    });
    var hadoopURL = optionListCTRLer.add(contentFrame, {
        title: "Hadoop URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPlatforms.hadoopURL,
    });
    var yarnURL = optionListCTRLer.add(contentFrame, {
        title: "Yarn URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: currentPlatforms.yarnURL,
    });*/
    
    var footerFrame = this.popupPanelCTRLer.getFootFrame();
    var submitButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'positive', top: 4, right: 10, title: "Edit"});
    $(submitButton).data('parent', this);
    
    $(submitButton).data('inputDataSet', {
        optionListCTRLer: optionListCTRLer,
        userID: userID,
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
        expiredDate: expiredDate,
        authority: authority,
        apexItemList: apexItemList,
        sparkItemList: sparkItemList
        /*apexURL: apexURL,
        sparkURL: sparkURL,
        grafanaURL: grafanaURL,
        k8sDashboardURL: k8sDashboardURL,
        yarnURL: yarnURL,
        hadoopURL: hadoopURL*/
    });
    
    $(addApexProjectButton).data('submitButton', submitButton);
    $(addApexProjectButton).data('parent', this);
    $(addApexProjectButton).data('optionListCTRLer', optionListCTRLer);
    $(addApexProjectButton).data('contentFrame', contentFrame);
    $(addSparkProjectButton).data('submitButton', submitButton);
    $(addSparkProjectButton).data('parent', this);
    $(addSparkProjectButton).data('optionListCTRLer', optionListCTRLer);
    $(addSparkProjectButton).data('contentFrame', contentFrame);
    $(addApexProjectButton).click(function(){
        var submitButton = $(this).data('submitButton');
        var parent = $(this).data('parent');
        var contentFrame = $(this).data('contentFrame');
        var optionListCTRLer = $(this).data('optionListCTRLer');
        var inputDataSet = $(submitButton).data('inputDataSet');
        var apexItemList = inputDataSet.apexItemList;
        apexItemList[apexItemList.length] = parent.addApexProjectInputField(optionListCTRLer, contentFrame);
        inputDataSet.apexItemList = apexItemList;
         $(submitButton).data('inputDataSet', inputDataSet);
    });
    $(addSparkProjectButton).click(function(){
        var submitButton = $(this).data('submitButton');
        var parent = $(this).data('parent');
        var contentFrame = $(this).data('contentFrame');
        var optionListCTRLer = $(this).data('optionListCTRLer');
        var inputDataSet = $(submitButton).data('inputDataSet');
        var sparkItemList = inputDataSet.sparkItemList;
        sparkItemList[sparkItemList.length] = parent.addSparkProjectInputField(optionListCTRLer, contentFrame);
        inputDataSet.sparkItemList = sparkItemList;
         $(submitButton).data('inputDataSet', inputDataSet);
    });
    
    
    $(submitButton).click(function(){
        var parent = $(this).data('parent');
        var inputDataSet = $(this).data('inputDataSet');
        var optionListCTRLer = inputDataSet.optionListCTRLer;
        var inputUserID = optionListCTRLer.getValue(inputDataSet.userID);
        var inputUserName = optionListCTRLer.getValue(inputDataSet.userName);
        var inputPassword = optionListCTRLer.getValue(inputDataSet.password);
        var inputPasswordConfirm = optionListCTRLer.getValue(inputDataSet.confirmPassword);
        var inputExpiredDate = optionListCTRLer.getValue(inputDataSet.expiredDate);
        var inputAuthority=optionListCTRLer.getValue(inputDataSet.authority);
        var apexItemList = inputDataSet.apexItemList;
        var sparkItemList = inputDataSet.sparkItemList;
        /*var inputApexURL=optionListCTRLer.getValue(inputDataSet.apexURL);
        var inputSparkURL=optionListCTRLer.getValue(inputDataSet.sparkURL);
        var inputGrafanaURL=optionListCTRLer.getValue(inputDataSet.grafanaURL);
        var inputHadoopURL=optionListCTRLer.getValue(inputDataSet.hadoopURL);
        var inputK8SDashboardURL=optionListCTRLer.getValue(inputDataSet.k8sDashboardURL);
        var inputYarnURL=optionListCTRLer.getValue(inputDataSet.yarnURL);
        var inputZeppelinURL = optionListCTRLer.getValue(inputDataSet.zeppelinURL);*/
        var expiredTimeMoment = null;
        if(inputExpiredDate != "" && inputExpiredDate != null){
            var expiredTimeMoment = new moment(inputExpiredDate).valueOf();
        }
        if(inputUserID == "" || inputUserName == "" || inputPassword == "" || inputPasswordConfirm == ""){
            jLego.toastCTRLer.addError({title: "Error", content: "Please fill all field."});
        }
        else if(inputPassword != inputPasswordConfirm){
            jLego.toastCTRLer.addError({title: "Error", content: "Password not match."});
        }
        else{
            var apexProjectList = [];
            for(var i=0; i<apexItemList.length; i++){
                var currentItem = apexItemList[i];
                if(!parent.isItemDeleted(currentItem)){
                    if(!parent.wasItemExisted(currentItem)){
                        var projectName = optionListCTRLer.getValue(currentItem);
                        if(projectName!=null){
                            if(projectName.toString().replace(" ", "") != ""){
                                var newProject = {
                                    projectName: projectName,
                                    type: "apex",
                                    operation: "add"
                                }
                                apexProjectList[apexProjectList.length] = newProject;
                            }
                        }
                    }
                }
                else{
                    var projectName = optionListCTRLer.getValue(currentItem);
                    if(projectName!=null){
                        if(projectName.toString().replace(" ", "") != ""){
                            var newProject = {
                                projectName: projectName,
                                type: "apex",
                                operation: "delete"
                            }
                            apexProjectList[apexProjectList.length] = newProject;
                        }
                    }
                }
            }
            var sparkProjectList = [];
            for(var i=0; i<sparkItemList.length; i++){
                var currentItem = sparkItemList[i];
                if(!parent.isItemDeleted(currentItem)){
                    if(!parent.wasItemExisted(currentItem)){
                        var projectName = optionListCTRLer.getValue(currentItem);
                        if(projectName!=null){
                            if(projectName.toString().replace(" ", "") != ""){
                                var newProject = {
                                    projectName: projectName,
                                    type: "spark",
                                    operation: "add"
                                }
                                sparkProjectList[sparkProjectList.length] = newProject;
                            }
                        }
                    }
                }
                else{
                    var projectName = optionListCTRLer.getValue(currentItem);
                    if(projectName!=null){
                        if(projectName.toString().replace(" ", "") != ""){
                            var newProject = {
                                projectName: projectName,
                                type: "spark",
                                operation: "delete"
                            }
                            sparkProjectList[sparkProjectList.length] = newProject;
                        }
                    }
                }
            }
            var inputForm = {
                userID: inputUserID,
                userName: inputUserName,
                password: inputPassword,
                authority: inputAuthority,
                expiredDate: expiredTimeMoment,
                apexProjectList: JSON.stringify(apexProjectList),
                sparkProjectList: JSON.stringify(sparkProjectList)
                /*apexURL: inputApexURL,
                sparkURL: inputSparkURL,
                grafanaURL: inputGrafanaURL,
                hadoopURL: inputHadoopURL,
                k8sDashboardURL: inputK8SDashboardURL,
                yarnURL: inputYarnURL,
                zeppelinURL: inputZeppelinURL*/
            }

            var completeCallback = function(Jdata){
                if(Jdata.errorCode==0){
                    parent.popupPanelCTRLer.close();
                    jLego.toastCTRLer.addSuccess({title: "Success", content: "Add success!"});   
                    parent.reDrawUserPanel();
                }
                else if(Jdata.errorCode == 101){
                    var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
                }
                else if(Jdata.errorCode == 201){
                    jLego.toastCTRLer.addError({title: "Error", content: "User existed."});
                }
                else{
                    jLego.toastCTRLer.addError({title: "Error", content: "Failed!"});
                }
            }
            webView.connection.editUser(inputForm, completeCallback);
            
        }
    });
}

userPage.prototype.drawManualEditPlatformForm=function(userID, currentPlatforms){
    this.popupPanelCTRLer = new jLego.objectUI.popoutPanel();
    var optionListCTRLer = new jLego.objectUI.optionListCTRLer();
    this.popupPanelCTRLer.add(document.body, {hasFootFrame: true, title: "Manual Edit Platform"});
    var contentFrame = this.popupPanelCTRLer.getContentFrame();
    $(contentFrame).css('overflow', 'auto');
    var hasDashboardFlag = false; 
    var dashboardURL = "";
    var hasGrafanaFlag = false; 
    var grafanaURL = "";
    var hasApexFlag = false; 
    var hasSparkFlag = false; 
    var apexLabelList = [];
    var sparkLabelList = [];
    var hadoopLabelList = [];
    var yarnLabelList = [];
    var zeppelinLabelList = [];
    var apexItemList = [];
    var sparkItemList = [];
    var hadoopItemList = [];
    var yarnItemList = [];
    var zeppelinItemList = [];
    for(var i=0; i<currentPlatforms.length; i++){
        var currentPlatform = currentPlatforms[i];
        if(currentPlatform.type=="apex"){
            hasApexFlag = true;
        }
        else if(currentPlatform.type=="spark"){
            hasSparkFlag = true;
        }
        else if(currentPlatform.type=="k8sDashboard"){
            hasDashboardFlag = true;
            dashboardURL = currentPlatform.url;
        }
        else if(currentPlatform.type=="grafana"){
            hasGrafanaFlag = true;
            grafanaURL = currentPlatform.url;
        }
    }
    var k8sDashboarItem = optionListCTRLer.add(contentFrame, {
        title: "Dashboard URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: dashboardURL,
    });
    var grafanaItem = optionListCTRLer.add(contentFrame, {
        title: "Grafana URL",
        type: 'input',
        inputType: 'text',
        hideButton: true,
        hideBottomBorder: false,
        defaultValue: grafanaURL,
    });
    if(hasApexFlag==false){
        apexLabelList[apexLabelList.length] = optionListCTRLer.add(contentFrame, {
            title: "Apex Project",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true,
            editable: false,
            defaultValue: "MANUAL PLATFORM",
        });
        apexItemList[apexItemList.length] = optionListCTRLer.add(contentFrame, {
            title: "Apex URL",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true
        });
        hadoopLabelList[hadoopLabelList.length] = optionListCTRLer.add(contentFrame, {
            title: "Hadoop Project",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true,
            editable: false,
            defaultValue: "MANUAL PLATFORM",
        });
        $(hadoopLabelList[hadoopLabelList.length - 1]).hide();
        hadoopItemList[hadoopItemList.length] = optionListCTRLer.add(contentFrame, {
            title: "Hadoop URL",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true
        });
        yarnLabelList[yarnLabelList.length] = optionListCTRLer.add(contentFrame, {
            title: "Yarn Project",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true,
            editable: false,
            defaultValue: "MANUAL PLATFORM",
        });
        $(yarnLabelList[yarnLabelList.length - 1]).hide();
        yarnItemList[yarnItemList.length] = optionListCTRLer.add(contentFrame, {
            title: "Yarn URL",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: false
        });
    }
    if(hasSparkFlag==false){
        sparkLabelList[sparkLabelList.length] = optionListCTRLer.add(contentFrame, {
            title: "Spark Project",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true,
            editable: false,
            defaultValue: "MANUAL PLATFORM",
        });
        sparkItemList[sparkItemList.length] = optionListCTRLer.add(contentFrame, {
            title: "Spark URL",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true
        });
        zeppelinLabelList[yarnLabelList.length] = optionListCTRLer.add(contentFrame, {
            title: "Zeppelin Project",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: true,
            editable: false,
            defaultValue: "MANUAL PLATFORM",
        });
        $(zeppelinLabelList[zeppelinLabelList.length - 1]).hide();
        zeppelinItemList[zeppelinItemList.length] = optionListCTRLer.add(contentFrame, {
            title: "Zeppelin URL",
            type: 'input',
            inputType: 'text',
            hideButton: true,
            hideBottomBorder: false
        });
    }
    for(var i=0; i<currentPlatforms.length; i++){
        var currentPlatform = currentPlatforms[i];
        if(currentPlatform.type=="apex"){
            var projectNameKeyList = currentPlatform.projectName.toString().split("-");
            if(projectNameKeyList.length >= 4) var projectName = projectNameKeyList[2] + "-" + projectNameKeyList[3];
            else var projectName = projectNameKeyList[2];
            apexLabelList[apexLabelList.length] = optionListCTRLer.add(contentFrame, {
                title: "Apex Project",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                editable: false,
                defaultValue: projectName,
            });
            apexItemList[apexItemList.length] = optionListCTRLer.add(contentFrame, {
                title: "Spark URL",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                defaultValue: currentPlatform.url
            });
            var foundPlatformProjectName = projectName;
            var foundPlatformURL = "";
            for(var j=0; j<currentPlatforms.length; j++){
                var scanPlatform = currentPlatforms[j];
                if(scanPlatform.type == "hadoop" && scanPlatform.projectName == currentPlatform.projectName){
                    foundPlatformURL = scanPlatform.url;
                    break;
                }
            }
            hadoopLabelList[hadoopLabelList.length] = optionListCTRLer.add(contentFrame, {
                title: "Hadoop Project",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                editable: false,
                defaultValue: foundPlatformProjectName,
            });
            $(hadoopLabelList[hadoopLabelList.length - 1]).hide();
            hadoopItemList[hadoopItemList.length] = optionListCTRLer.add(contentFrame, {
                title: "Hadoop URL",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                defaultValue: foundPlatformURL
            });
            var foundPlatformURL = "";
            for(var j=0; j<currentPlatforms.length; j++){
                var scanPlatform = currentPlatforms[j];
                if(scanPlatform.type == "yarn" && scanPlatform.projectName == currentPlatform.projectName){
                     foundPlatformURL = scanPlatform.url;
                     break;
                }
            }
            yarnLabelList[yarnLabelList.length] = optionListCTRLer.add(contentFrame, {
                title: "Yarn Project",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                editable: false,
                defaultValue: foundPlatformProjectName,
            });
            $(yarnLabelList[yarnLabelList.length - 1]).hide();
            yarnItemList[yarnItemList.length] = optionListCTRLer.add(contentFrame, {
                title: "Yarn URL",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: false,
                defaultValue: foundPlatformURL
            });
        }
        else if(currentPlatform.type=="spark"){
            var projectNameKeyList = currentPlatform.projectName.toString().split("-");
            if(projectNameKeyList.length >= 4) var projectName = projectNameKeyList[2] + "-" + projectNameKeyList[3];
            else var projectName = projectNameKeyList[2];
            sparkLabelList[sparkLabelList.length] = optionListCTRLer.add(contentFrame, {
                title: "Spark Project",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                editable: false,
                defaultValue: projectName,
            });
            sparkItemList[sparkItemList.length] = optionListCTRLer.add(contentFrame, {
                title: "Spark URL",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                defaultValue: currentPlatform.url
            });
            var foundPlatformProjectName = projectName;
            var foundPlatformURL = "";
            for(var j=0; j<currentPlatforms.length; j++){
                var scanPlatform = currentPlatforms[j];
                if(scanPlatform.type == "zeppelin" && scanPlatform.projectName == currentPlatform.projectName){
                    foundPlatformURL = scanPlatform.url;
                    break;
                }
            }
            zeppelinLabelList[yarnLabelList.length] = optionListCTRLer.add(contentFrame, {
                title: "Zeppelin Project",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: true,
                editable: false,
                defaultValue: foundPlatformProjectName,
            });
            $(zeppelinLabelList[zeppelinLabelList.length - 1]).hide();
            zeppelinItemList[zeppelinItemList.length] = optionListCTRLer.add(contentFrame, {
                title: "Zeppelin URL",
                type: 'input',
                inputType: 'text',
                hideButton: true,
                hideBottomBorder: false,
                defaultValue: foundPlatformURL
            });
        }
    }
    var footerFrame = this.popupPanelCTRLer.getFootFrame();
    var submitButton =
        this.buttonCTRLer.addFreeSingleButton(footerFrame, {type: 'positive', top: 4, right: 10, title: "Edit"});
    $(submitButton).data('parent', this);
    $(submitButton).data('inputDataSet', {
        optionListCTRLer: optionListCTRLer,
        userID: userID,
        k8sDashboarItem: k8sDashboarItem,
        grafanaItem: grafanaItem,
        apexItemList: apexItemList,
        sparkItemList: sparkItemList,
        hasDashboardFlag: hasDashboardFlag,
        hasGrafanaFlag: hasGrafanaFlag,
        hasApexFlag: hasApexFlag,
        hasSparkFlag: hasSparkFlag,
        apexLabelList: apexLabelList,
        sparkLabelList: sparkLabelList,
        hadoopLabelList: hadoopLabelList,
        yarnLabelList: yarnLabelList,
        zeppelinLabelList: zeppelinLabelList,
        hadoopItemList: hadoopItemList,
        yarnItemList: yarnItemList,
        zeppelinItemList: zeppelinItemList,
    });
    $(submitButton).click(function(){
        var parent = $(this).data('parent');
        var inputDataSet = $(this).data('inputDataSet');
        var optionListCTRLer = inputDataSet.optionListCTRLer;
        var inputUserID = inputDataSet.userID
        var inputDashboardURL = optionListCTRLer.getValue(inputDataSet.k8sDashboarItem);
        var inputGrafanaURL = optionListCTRLer.getValue(inputDataSet.grafanaItem);
        var hasDashboardFlag = inputDataSet.hasDashboardFlag;
        var hasGrafanaFlag = inputDataSet.hasGrafanaFlag;
        var hasApexFlag = inputDataSet.hasApexFlag;
        var hasSparkFlag = inputDataSet.hasSparkFlag;
        var apexLabelList = inputDataSet.apexLabelList;
        var sparkLabelList = inputDataSet.sparkLabelList;
        var apexItemList = inputDataSet.apexItemList;
        var sparkItemList = inputDataSet.sparkItemList;
        var apexProjectList = [];
        for(var i=0; i<apexItemList.length; i++){
            var currentProjectItem = apexLabelList[i];
            var projectName = optionListCTRLer.getValue(currentProjectItem);
            var currentItem = apexItemList[i];
            var url = optionListCTRLer.getValue(currentItem);
            var newProject = {
                isManualAdded: !hasApexFlag,
                projectName: projectName,
                url: url,
                type: "apex",
                operation: hasApexFlag? "edit":"add" 
            }
            apexProjectList[apexProjectList.length] = newProject;
        }
        for(var i=0; i<hadoopItemList.length; i++){
            var currentProjectItem = apexLabelList[i];
            var projectName = optionListCTRLer.getValue(currentProjectItem);
            var currentItem = hadoopItemList[i];
            var url = optionListCTRLer.getValue(currentItem);
            var newProject = {
                isManualAdded: !hasApexFlag,
                projectName: projectName,
                url: url,
                type: "hadoop",
                operation: hasApexFlag? "edit":"add" 
            }
            apexProjectList[apexProjectList.length] = newProject;
        }
        for(var i=0; i<yarnItemList.length; i++){
            var currentProjectItem = apexLabelList[i];
            var projectName = optionListCTRLer.getValue(currentProjectItem);
            var currentItem = yarnItemList[i];
            var url = optionListCTRLer.getValue(currentItem);
            var newProject = {
                isManualAdded: !hasApexFlag,
                projectName: projectName,
                url: url,
                type: "yarn",
                operation: hasApexFlag? "edit":"add" 
            }
            apexProjectList[apexProjectList.length] = newProject;
        }
        var sparkProjectList = [];
        for(var i=0; i<sparkItemList.length; i++){
            var currentProjectItem = sparkLabelList[i];
            var projectName = optionListCTRLer.getValue(currentProjectItem);
            var currentItem = sparkItemList[i];
            var url = optionListCTRLer.getValue(currentItem);
            var newProject = {
                isManualAdded: !hasSparkFlag,
                projectName: projectName,
                url: url,
                type: "spark",
                operation: hasSparkFlag? "edit":"add" 
            }
            sparkProjectList[sparkProjectList.length] = newProject;
        }
        for(var i=0; i<zeppelinItemList.length; i++){
            var currentProjectItem = sparkLabelList[i];
            var projectName = optionListCTRLer.getValue(currentProjectItem);
            var currentItem = zeppelinItemList[i];
            var url = optionListCTRLer.getValue(currentItem);
            var newProject = {
                isManualAdded: !hasSparkFlag,
                projectName: projectName,
                url: url,
                type: "zeppelin",
                operation: hasSparkFlag? "edit":"add" 
            }
            sparkProjectList[sparkProjectList.length] = newProject;
        }
        var inputForm = {
            userID: inputUserID,
            dashboardURL: inputDashboardURL,
            grafanaURL: inputGrafanaURL,
            apexProjectList: JSON.stringify(apexProjectList),
            sparkProjectList: JSON.stringify(sparkProjectList)
        }

        var completeCallback = function(Jdata){
            if(Jdata.errorCode==0){
                parent.popupPanelCTRLer.close();
                jLego.toastCTRLer.addSuccess({title: "Success", content: "Manual edit success!"});   
                parent.reDrawUserPanel();
            }
            else if(Jdata.errorCode == 101){
                var win = window.open(jLego.func.getRootPath()+"/login.jsp", "_self");   
            }
            else{
                jLego.toastCTRLer.addError({title: "Error", content: "Failed!"});
            }
        }
        webView.connection.manualEditPlatform(inputForm, completeCallback);
    });
}

userPage.prototype.reDrawUserPanel=function(){
    var loadingCTRLer = new jLego.objectUI.nowLoading();
    webView.constants.userPage.loadingCTRLer = loadingCTRLer;
    loadingCTRLer.add(document.body);
    webView.connection.getAllUsers(function(Jdata){
        if(Jdata.errorCode==0){
            $(webView.userPage.userFrame).remove();
            webView.userPage.addUserPanel(webView.constants.userPage.tempTarget, {
                title: webView.userPage.myLanguage.USER_LIST_TITLE,
                Jdata: Jdata
            });
            webView.userPage.resize();
            setTimeout(function(){
              webView.constants.userPage.loadingCTRLer.close();  
            }, 500);
            //webView.userPage.startUpdateMonitor(false);
        }
    });
}

userPage.prototype.setupInputTextOnly=function(element){
    $(element).data('currentValue', $(element).val());
    $(element).keydown(function (e) {
        var txt = String.fromCharCode(e.which);
        if(e.which==8 || e.which == 37 || e.which == 39 || e.which == 46|| e.which == 36){
            
        }
        else if(!txt.match(/[A-Za-z0-9+#.]/)) {
            return false;
        }
    });
}


userPage.prototype.resize=function(){
    this.userTableCTRLer.resize();
    this.buttonCTRLer.resize();
}  

