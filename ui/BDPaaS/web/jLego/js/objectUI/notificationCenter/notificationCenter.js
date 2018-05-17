/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
jLego.objectUI.notificationCenter=function(){
    var myID;
    var myClass;
    var parentElement;
    var mainElement;
    var iconElement;
    var badegElement;
    var centerElement;
    var onCardList;
    var offCardList;
    var onWarningIconURL;
    var offWarningIconURL;
    var badgeRightSpace;
    var buttonSize;
    var buttonHeight;
    var badgeWidth;
    var alignment;
    
    var centerFrameMarginTop;
    
    var shownNotifyFlag;
    this.initialize();
}

jLego.objectUI.notificationCenter.prototype.initialize=function(){
    this.myID = jLego.objectUI.id.notificationCenter;
    this.myClass = jLego.objectUI.cls.notificationCenter;
    this.buttonSize = 30;
    this.badgeRightSpace = 10;
    this.buttonHeight = this.buttonSize;
    this.buttonWidth = this.buttonSize + this.badgeRightSpace;
    this.onWarningIconURL = jLego.func.getImgPath({category: 'notificationCenter', name: 'onWarning', type: 'png'});
    this.offWarningIconURL = jLego.func.getImgPath({category: 'notificationCenter', name: 'offWarning', type: 'png'});
    this.onCardList = [];
    this.offCardList = [];
    this.shownNotifyFlag = false;
    this.centerFrameMarginTop = 0;
}


jLego.objectUI.notificationCenter.prototype.add=function(target, option){
    //check option
    if(target==null) return null;
    if(option==null){
        var option={};
        return null;
    }

    this.parentElement = target;

    if(option.badgeRightSpace!=null){
        this.badgeRightSpace = parseInt(option.badgeRightSpace);
    }
    if(option.buttonSize!=null){
        this.buttonSize = parseInt(option.buttonSize);
        this.buttonHeight = this.buttonSize;
        this.buttonWidth = this.buttonSize + this.badgeRightSpace;
    }

    if(option.onWarningIconURL!=null){
        this.onWarningIconURL = option.onWarningIconURL;
    }
    if(option.offWarningIconURL!=null){
        this.offWarningIconURL = option.offWarningIconURL;
    }
   
    if(option.top==null)  option.top=0;
    if(option.left==null && option.right==null)  option.left=0;
    else if(option.right!=null) option.left=null;
    
    if(option.centerFrameMarginTop!=null)  this.centerFrameMarginTop= parseInt(option.centerFrameMarginTop);
    
    this.mainElement =
            jLego.basicUI.addDiv(this.parentElement, {id: jLego.func.getRandomString(), class: this.myClass.BUTTON_FRAME});
    $(this.mainElement).width(this.buttonWidth);
    $(this.mainElement).height(this.buttonHeight);
    
    if(!option.float){
        $(this.mainElement).css('top', option.top + 'px');
        if(option.right!=null) $(this.mainElement).css('right', option.right + 'px');
        else $(this.mainElement).css('left', option.left + 'px');
    }
    else{
        $(this.mainElement).css('position', 'relative');
        $(this.mainElement).css('float', option.float);
        $(this.mainElement).css('margin-top', option.top + 'px');
        if(option.right!=null) $(this.mainElement).css('margin-right', option.right + 'px');
        else $(this.mainElement).css('margin-left', option.left + 'px');
    }
    
    var targetIconURL = this.offWarningIconURL;
    if(this.onCardList.length > 0) targetIconURL = this.onWarningIconURL;

    this.iconElement =
            jLego.basicUI.addImg(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.ICON_FRAME, src: targetIconURL});
    $(this.iconElement).width(this.buttonHeight);
    $(this.iconElement).width(this.buttonHeight);
    
    this.badgeElement =
            jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.BADGE_FRAME});
    $(this.badgeElement).css('max-width', this.buttonWidth + 'px');
    if(this.onCardList.length <= 0){
        $(this.badgeElement).hide();
    }
    else{
        $(this.badgeElement).text(this.onCardList.length);
    }
    
    this.centerElement = 
            jLego.basicUI.addDiv(document.body, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CENTER_FRAME});
    $(this.centerElement).css({height: 'calc(100% - ' + this.centerFrameMarginTop + 'px)'});
    $(this.centerElement).css('top', this.centerFrameMarginTop + 'px');
    $(this.centerElement).css('right',  "-" + $(this.centerElement).width() + 'px');
    $(this.centerElement).perfectScrollbar();
    if(!TimelineLite){
        $(this.centerElement).hide();
    }
    this.setupNotificationButtonClickEvent();
}

jLego.objectUI.notificationCenter.prototype.setupNotificationButtonClickEvent=function(){
    $(this.mainElement).data('parent', this);
    $(this.mainElement).click(function(){
       var parent = $(this).data('parent');
       if(parent.shownNotifyFlag){
           if(TimelineLite){
               var myTimeline = new TimelineLite({});
               myTimeline.fromTo(parent.centerElement, 0.5, {css:{right: 0}}, {css:{right: -$(parent.centerElement).width()}});
           }
           else{
               $(parent.centerElement).hide();
           }
       }
       else{
           if(TimelineLite){
               var myTimeline = new TimelineLite({});
               myTimeline.fromTo(parent.centerElement, 0.5, {css:{right: -$(parent.centerElement).width()}}, {css:{right: 0}});
           }
           else $(parent.centerElement).show();
       }
       parent.shownNotifyFlag = !parent.shownNotifyFlag;
    });
}

jLego.objectUI.notificationCenter.prototype.addNotificationCard=function(option){
    if(option==null) return;
    if(option.cardUUID == null) return;
    else{
        for(var i=0; i<this.onCardList.length; i++){
            if($(this.onCardList[i]).data('cardUUID') == option.cardUUID) return;
        }
    }
    
    var newCard = 
        jLego.basicUI.addDiv(this.centerElement, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD});
    $(newCard).data('cardUUID', option.cardUUID);
    this.onCardList[this.onCardList.length] = newCard;
    
    var titleFrame = 
        jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TITLE});
    $(titleFrame).text(option.title);
    if(option.time){
           var timeFrame = 
                jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TIME});
           var startTimeMoment = new moment(option.time).format('YYYY-MM-DD hh:mm:ss');
            $(timeFrame).text(startTimeMoment);
    }
    if(option.startTime){
        var startTimeFrame = 
            jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TIME});
        var startTimeMoment = new moment(option.startTime).format('YYYY-MM-DD hh:mm:ss');
        $(startTimeFrame).text("Start: " + startTimeMoment);
    }
    
    if(option.endTime){
        var endTimeFrame = 
            jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TIME});
        var endTimeMoment = new moment(option.endTime).format('YYYY-MM-DD hh:mm:ss');
        $(endTimeFrame).text("End: " + endTimeMoment);
    }
    if(option.alarmInfo){
        /*if(option.alarmInfo.alarmCount){
            if(option.alarmInfo.alarmCount > 0){
                var alarmCountBadge = 
                    jLego.basicUI.addDiv(titleFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TITLE_BADGE});
                $(alarmCountBadge).text(option.alarmInfo.alarmCount);
            }
        }*/
        if(option.alarmInfo.applicationList){
            var applicationList = option.alarmInfo.applicationList;
            for(var i=0; i<applicationList.length; i++){
                var appFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var appTitle = 
                    jLego.basicUI.addDiv(appFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(appTitle).text("APP: ");
                var appContent = 
                    jLego.basicUI.addDiv(appFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT});
                $(appContent).text(applicationList[i]);
            }
        }
    }
    if(option.description){
            var descriptionFrame = 
                jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_DESCRIPTION});
            $(descriptionFrame).text(option.description);
    }
    if(option.alarmInfo){
        if(option.alarmInfo.alarmCount){
            if(option.alarmInfo.alarmCount > 0){
                var trajectoryCountFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var countTitle = 
                    jLego.basicUI.addDiv(trajectoryCountFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(countTitle).text("#Transaction");
                var countContent = 
                    jLego.basicUI.addDiv(trajectoryCountFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TITLE_BADGE});
                $(countContent).text(option.alarmInfo.alarmCount);
            }
        }
        var reasonFrame = 
            jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_TIME});
        $(reasonFrame).text('Troubleshoot');
        $(reasonFrame).css('text-align', 'center');
        $(reasonFrame).css('background-color', '#7b040f');
        $(reasonFrame).hide();
        var hasTroubleshoot = false;
        if(option.alarmInfo.cpuErrorCount != null){
            if(option.alarmInfo.cpuErrorCount > 0){
                var cpuErrorFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var infoIcon =
                    jLego.basicUI.addImg(cpuErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_ICON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'info4', type: 'png'})});    
                var cpuErrorTitle = 
                    jLego.basicUI.addDiv(cpuErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(cpuErrorTitle).text("CPU Error");
                var cpuErrorContent = 
                    jLego.basicUI.addDiv(cpuErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_BADGE});
                $(cpuErrorContent).text(option.alarmInfo.cpuErrorCount);
                hasTroubleshoot = true;
            }
        }
        
        if(option.alarmInfo.cpuTooBusyCount != null){
            if(option.alarmInfo.cpuTooBusyCount > 0){
                var cpuTooBusyFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var infoIcon =
                    jLego.basicUI.addImg(cpuTooBusyFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_ICON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'info4', type: 'png'})});    
                var cpuTooBusyTitle = 
                    jLego.basicUI.addDiv(cpuTooBusyFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(cpuTooBusyTitle).text("CPU is too busy");
                var cpuTooBusyContent = 
                    jLego.basicUI.addDiv(cpuTooBusyFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_BADGE});
                $(cpuTooBusyContent).text(option.alarmInfo.cpuTooBusyCount);
                hasTroubleshoot = true;
            }
        }
        
        if(option.alarmInfo.memoryErrorCount != null){
            if(option.alarmInfo.memoryErrorCount > 0){
                var memoryErrorFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var infoIcon =
                    jLego.basicUI.addImg(memoryErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_ICON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'info4', type: 'png'})});    
                var memoryErrorTitle = 
                    jLego.basicUI.addDiv(memoryErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(memoryErrorTitle).text("MEM Error");
                var memoryErrorContent = 
                    jLego.basicUI.addDiv(memoryErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_BADGE});
                $(memoryErrorContent).text(option.alarmInfo.memoryErrorCount);
                hasTroubleshoot = true;
            }
        }
        
        if(option.alarmInfo.memoryTooBusyCount != null){
            if(option.alarmInfo.memoryTooBusyCount > 0){
                var memoryTooBusyFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var infoIcon =
                    jLego.basicUI.addImg(memoryTooBusyFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_ICON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'info4', type: 'png'})});    
                var cpuTooBusyTitle = 
                    jLego.basicUI.addDiv(memoryTooBusyFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(cpuTooBusyTitle).text("MEM is too full");
                var memoryTooBusyContent = 
                    jLego.basicUI.addDiv(memoryTooBusyFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_BADGE});
                $(memoryTooBusyContent).text(option.alarmInfo.memoryTooBusyCount);
                hasTroubleshoot = true;
            }
        }
        
        if(option.alarmInfo.storageErrorCount != null){
            if(option.alarmInfo.storageErrorCount > 0){
                var storageErrorFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var infoIcon =
                    jLego.basicUI.addImg(storageErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_ICON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'info4', type: 'png'})});    
                var storageErrorTitle = 
                    jLego.basicUI.addDiv(storageErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(storageErrorTitle).text("Storage Error");
                var memoryErrorContent = 
                    jLego.basicUI.addDiv(storageErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_BADGE});
                $(memoryErrorContent).text(option.alarmInfo.storageErrorCount);
                hasTroubleshoot = true;
            }
        }
        
        if(option.alarmInfo.networkErrorCount != null){
            if(option.alarmInfo.networkErrorCount > 0){
                var networkErrorFrame = 
                    jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_FRAME});
                var infoIcon =
                    jLego.basicUI.addImg(networkErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_ICON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'info4', type: 'png'})});    
                var networkErrorTitle = 
                    jLego.basicUI.addDiv(networkErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_TITLE});
                $(networkErrorTitle).text("Network Error");
                var networkErrorContent = 
                    jLego.basicUI.addDiv(networkErrorFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_CONTENT_BADGE});
                $(networkErrorContent).text(option.alarmInfo.networkErrorCount);
                hasTroubleshoot = true;
            }
        }
    }
    
    if(hasTroubleshoot == true){
        $(reasonFrame).show();
    }
    if(option.hasFunction != false){
        var functionFrame = 
            jLego.basicUI.addDiv(newCard, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_FUNCTION});    
        //function button
        var targetButton =
            jLego.basicUI.addImg(functionFrame, {id: jLego.func.getRandomString(), class: this.myClass.NOTIFICATION_CARD_FUNCTION_BUTTON, src: jLego.func.getImgPath({category: 'notificationCenter', name: 'menu2', type: 'png'})});      
        $(newCard).data('targetButton', targetButton);
    }
    
    
    $(newCard).addClass(this.myClass.NOTIFICATION_CARD_WARNING);
    $(titleFrame).addClass(this.myClass.NOTIFICATION_CARD_WARNING_TITLE);
    if(this.onCardList.length > 0){
        $(this.iconElement).attr('src', this.onWarningIconURL);
        $(this.badgeElement).show();
        $(this.badgeElement).text(this.onCardList.length);
    }
    else{
        $(this.iconElement).attr('src', this.offWarningIconURL);
        $(this.badgeElement).hide();
    }
    
    return newCard;
}

jLego.objectUI.notificationCenter.prototype.getNotificationCard=function(cardUUID){
    
}

jLego.objectUI.notificationCenter.prototype.getTargetButtonOfCard=function(card){
    return $(card).data('targetButton');
}



jLego.objectUI.notificationCenter.prototype.offNotificationCard=function(cardUUID){
    
}

jLego.objectUI.notificationCenter.prototype.removeNotificationCard=function(cardUUID){
    
}
