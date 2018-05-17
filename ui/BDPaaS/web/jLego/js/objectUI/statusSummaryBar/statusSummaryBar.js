/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */

jLego.objectUI.statusSummaryBar=function(option){
    var myID;
    var myClass;
    var myConsts;

    var parentElement;
    var mainElement;
    var statusElementList;
    
    var statusColorMap;
    var unknownStatusColor;
    var statusItemList;
    var leftSpace;
    var topSpace;
    
    var scrollFrame;
    var scrollFrameHeight;
    var scrollFrameTop;
    var scrollFrameWidth;
    var scrollTextHeight;
    var scrollCallbackObject;

    var minStartTime;
    var maxEndTime;
    this.initialize();
    if(option != null) this.parseOption(option);
    
}

jLego.objectUI.statusSummaryBar.prototype.initialize=function(){
    this.myID=jLego.objectUI.id.statusSummaryBar;
    this.myClass=jLego.objectUI.cls.statusSummaryBar;
    this.myConsts=jLego.objectUI.constants.statusSummaryBar;
    this.statusItemList = [];
    this.statusElementList = [];
    this.leftSpace = 10;
    this.topSpace = 5;
    this.scrollFrameHeight = 20;
    this.scrollFrameTop = 5;
    this.scrollTextHeight = 18;
    this.statusColorMap = {
        ok: '#46886e',
        error: '#922934',
        degraded: '#edc211'
    };
    this.unknownStatusColor = "#a0a0a0";
}

jLego.objectUI.statusSummaryBar.prototype.parseOption=function(option){
    if(option.leftSpace!=null) this.leftSpace = option.leftSpace;
    if(option.topSpace!=null) this.topSpace = option.topSpace;
    if(option.scrollFrameHeight!=null) this.scrollFrameHeight = option.scrollFrameHeight;
    if(option.statusColorMap!=null) this.statusColorMap = option.statusColorMap;
    if(option.unknownStatusColor!=null) this.unknownStatusColor = option.unknownStatusColor;
}

jLego.objectUI.statusSummaryBar.prototype.add=function(target, option){
    if(target == null) return;
    else this.parentElement = target;
    if(option != null) this.parseOption(option);
    
    //organize data
    this.minStartTime = 0;
    this.maxEndTime = 0;
    for(var i=0; i<option.statusList.length; i++){
        var newStatusItem = option.statusList[i];
        //analyze minStartTime and maxEndTime
        if(this.minStartTime==0) this.minStartTime = newStatusItem.startTime;
        else if(this.minStartTime > newStatusItem.startTime) this.minStartTime = newStatusItem.startTime;
        if(this.maxEndTime==0) this.maxEndTime = newStatusItem.endTime;
        else if(this.maxEndTime < newStatusItem.endTime) this.maxEndTime = newStatusItem.endTime;
        //find postion for currentStatusData
        var targetIndex = this.statusItemList.length;
        for(var j=0; j<this.statusItemList.length; j++){
            var currentStatusItem = this.statusItemList[j];
            if(currentStatusItem.startTime > newStatusItem.startTime){
                targetIndex = j; 
                break;
            }
        }
        this.statusItemList.splice(targetIndex, 0, newStatusItem);
    }
    //create main element
    this.mainElement = 
            jLego.basicUI.addDiv(target, {id: jLego.func.getRandomString(), class: this.myClass.MAIN_FRAME});
    var mainElementWidth = $(target).width() - (2 * this.leftSpace);
    var mainElementHeight = $(target).height() - (2 * this.topSpace) - this.scrollFrameHeight - this.scrollFrameTop - this.scrollTextHeight; 
    $(this.mainElement).width(mainElementWidth);
    $(this.mainElement).height(mainElementHeight);
    $(this.mainElement).css('margin-left', this.leftSpace + "px");
    $(this.mainElement).css('margin-top', this.topSpace + "px");
    //create status element
    this.scrollFrameWidth = 0;
    for(var i=0; i<this.statusItemList.length; i++){
        var currentStatusItem = this.statusItemList[i];
        var statusElement =
               jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.STATUS_FRAME});
        var ratio = (currentStatusItem.endTime - currentStatusItem.startTime) / (this.maxEndTime - this.minStartTime);
        var statusElementWidth = parseInt(mainElementWidth * ratio);
        $(statusElement).width(statusElementWidth);
        $(statusElement).height(mainElementHeight);
        this.scrollFrameWidth = this.scrollFrameWidth + statusElementWidth;
        if(this.statusColorMap[currentStatusItem.status] != null){
            $(statusElement).css('background-color', this.statusColorMap[currentStatusItem.status]);
        }
        else{
            $(statusElement).css('background-color', this.unknownStatusColor);
        }
        this.statusElementList[this.statusElementList.length] = statusElement;
    }
    this.addTimeTravelScrollBar();
}

jLego.objectUI.statusSummaryBar.prototype.updateStatusData=function(option){
    for(var i=0; i<option.statusList.length; i++){
        var newStatusItem = option.statusList[i];
        //analyze minStartTime and maxEndTime
        if(this.minStartTime==0) this.minStartTime = newStatusItem.startTime;
        else if(this.minStartTime > newStatusItem.startTime) this.minStartTime = newStatusItem.startTime;
        if(this.maxEndTime==0) this.maxEndTime = newStatusItem.endTime;
        else if(this.maxEndTime < newStatusItem.endTime) this.maxEndTime = newStatusItem.endTime;
        //find postion for currentStatusData
        var targetIndex = this.statusItemList.length;
        for(var j=0; j<this.statusItemList.length; j++){
            var currentStatusItem = this.statusItemList[j];
            if(currentStatusItem.startTime > newStatusItem.startTime){
                targetIndex = j; 
                break;
            }
        }
        
        if((targetIndex - 1) > 0){
            var lastStatusItem = this.statusItemList[targetIndex - 1];
            if(lastStatusItem.status == newStatusItem.status){
                lastStatusItem.endTime = newStatusItem.endTime;
            }
            else{
                this.statusItemList.splice(targetIndex, 0, newStatusItem);
            }
        }
        else{
            this.statusItemList.splice(targetIndex, 0, newStatusItem);
        }
    }
    
    var mainElementWidth = $(this.parentElement).width() - (2 * this.leftSpace);
    var mainElementHeight = $(this.parentElement).height() - (2 * this.topSpace) - this.scrollFrameHeight - this.scrollFrameTop - this.scrollTextHeight; 
    
    for(var i=0; i<this.statusItemList.length; i++){
        if(i < this.statusElementList.length){
            var currentStatusItem = this.statusItemList[i];
            var statusElement = this.statusElementList[i];
            var ratio = (currentStatusItem.endTime - currentStatusItem.startTime) / (this.maxEndTime - this.minStartTime);
            var statusElementWidth = parseInt(mainElementWidth * ratio);
            $(statusElement).width(statusElementWidth);
        }
        else{
            var currentStatusItem = this.statusItemList[i];
            var statusElement =
                   jLego.basicUI.addDiv(this.mainElement, {id: jLego.func.getRandomString(), class: this.myClass.STATUS_FRAME});
            var ratio = (currentStatusItem.endTime - currentStatusItem.startTime) / (this.maxEndTime - this.minStartTime);
            var statusElementWidth = parseInt(mainElementWidth * ratio);
            $(statusElement).width(statusElementWidth);
            $(statusElement).height(mainElementHeight);
            this.scrollFrameWidth = this.scrollFrameWidth + statusElementWidth;
            if(this.statusColorMap[currentStatusItem.status] != null){
                $(statusElement).css('background-color', this.statusColorMap[currentStatusItem.status]);
            }
            else{
                $(statusElement).css('background-color', this.unknownStatusColor);
            }
            this.statusElementList[this.statusElementList.length] = statusElement;
        }
    }
}

jLego.objectUI.statusSummaryBar.prototype.addTimeTravelScrollBar=function(){
    this.scrollFrame = 
            jLego.basicUI.addDiv(this.parentElement, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_FRAME});
    $(this.scrollFrame).width(this.scrollFrameWidth);
    $(this.scrollFrame).height(this.scrollFrameHeight + this.scrollTextHeight);
    $(this.scrollFrame).css('margin-left', this.leftSpace + "px");
    $(this.scrollFrame).css('margin-top', this.scrollFrameTop + "px");
    
    var scrollBackground = 
            jLego.basicUI.addDiv(this.scrollFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_BACKGROUND_FRAME});
    var backgroundMarginTop = parseInt(this.scrollFrameHeight / 4);
    $(scrollBackground).height(this.scrollFrameHeight / 2);
    $(scrollBackground).width(this.scrollFrameWidth);
    $(scrollBackground).css('top', backgroundMarginTop + "px");
    $(scrollBackground).css('border-radius', backgroundMarginTop + "px");
    
    var thumbImageURL = jLego.func.getImgPath({category: "statusSummaryBar", name: "thumb", type: "png"});
    
    //left track and thumb
    var leftTrack = 
            jLego.basicUI.addDiv(this.scrollFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_FRONTGROUND_FRAME});
    $(leftTrack).height(this.scrollFrameHeight / 2);
    $(leftTrack).width(this.scrollFrameHeight / 2);
    $(leftTrack).css('top', backgroundMarginTop + "px");
    $(leftTrack).css('left', '0px');
    $(leftTrack).css('border-radius', backgroundMarginTop + "px");
    
    var leftThumb = 
            jLego.basicUI.addImg(this.scrollFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_THUMB, src: thumbImageURL});
    $(leftThumb).width(this.scrollFrameHeight);
    $(leftThumb).height(this.scrollFrameHeight);
    $(leftThumb).css('left', '0px');
    //right track and thumb
    var rightTrack = 
            jLego.basicUI.addDiv(this.scrollFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_FRONTGROUND_FRAME});
    $(rightTrack).height(this.scrollFrameHeight / 2);
    $(rightTrack).width(this.scrollFrameHeight / 2);
    $(rightTrack).css('top', backgroundMarginTop + "px");
    $(rightTrack).css('right', '0px');
    $(rightTrack).css('border-radius', backgroundMarginTop + "px");
    
    var rightThumb = 
            jLego.basicUI.addImg(this.scrollFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_THUMB, src: thumbImageURL});
    $(rightThumb).width(this.scrollFrameHeight);
    $(rightThumb).height(this.scrollFrameHeight);
    $(rightThumb).css('right', '0px');
    
    var scrollTextFrame = 
            jLego.basicUI.addDiv(this.scrollFrame, {id: jLego.func.getRandomString(), class: this.myClass.SCROLLBAR_FRAME});
    $(scrollTextFrame).width(this.scrollFrameWidth);
    $(scrollTextFrame).height(this.scrollTextHeight);
    $(scrollTextFrame).css('top', this.scrollFrameHeight + 'px');
    
    var leftTimeText = 
            jLego.basicUI.addDiv(scrollTextFrame, {id: jLego.func.getRandomString(), class: this.myClass.TIME_TEXT});
    $(leftTimeText).height(this.scrollTextHeight);
    $(leftTimeText).css('left', '0px');
    var startTimeMoment = new moment(this.minStartTime).format('hh:mm:ss.SSS');
    $(leftTimeText).text(startTimeMoment);
    var rightTimeText = 
            jLego.basicUI.addDiv(scrollTextFrame, {id: jLego.func.getRandomString(), class: this.myClass.TIME_TEXT});
    $(rightTimeText).height(this.scrollTextHeight);
    $(rightTimeText).css('right', '0px');
    var endTimeMoment = new moment(this.maxEndTime).format('hh:mm:ss.SSS');
    $(rightTimeText).text(endTimeMoment);
    
    $(this.scrollFrame).data('scrollBackground', scrollBackground);
    $(this.scrollFrame).data('scrollTextFrame', scrollTextFrame);
    $(this.scrollFrame).data('leftThumb', leftThumb);
    $(this.scrollFrame).data('rightThumb', rightThumb);
    $(this.scrollFrame).data('leftTrack', leftTrack);
    $(this.scrollFrame).data('rightTrack', rightTrack);
    $(this.scrollFrame).data('leftTimeText', leftTimeText);
    $(this.scrollFrame).data('rightTimeText', rightTimeText);
    this.setupThumbDrag();
}

jLego.objectUI.statusSummaryBar.prototype.setupThumbDrag=function(){
    var leftThumb = $(this.scrollFrame).data('leftThumb');
    var rightThumb = $(this.scrollFrame).data('rightThumb');
    
    $(leftThumb).data('parent', this);
    $(leftThumb).draggable({ axis: 'x' , 
        containment: this.scrollFrame,
        start: function (e) {
             $(this).data('startX', e.clientX);
        },
        drag: function (e) {
            var parent = $(this).data('parent');
            var leftTrack =  $(parent.scrollFrame).data('leftTrack');
            var rightThumb =  $(parent.scrollFrame).data('rightThumb');
            var leftTimeText = $(parent.scrollFrame).data('leftTimeText');
            var startX = $(this).data('startX');
            if(parent.scrollCallbackObject!=null){
                var callback = parent.scrollCallbackObject.callback;
                var arg = parent.scrollCallbackObject.arg;
                callback(arg);
            }
            if(e.pageX > startX){
                if($(this).position().left + 100 > $(rightThumb).position().left){
                    return false;
                }
            }
            var selectedTime = parent.getSelectedTime();
            var startTimeMoment = new moment(selectedTime.targetStartTime).format('hh:mm:ss.SSS');
            $(leftTimeText).text(startTimeMoment);
            $(leftTimeText).css('left', $(this).position().left + "px");
            $(leftTrack).width($(this).position().left + ($(this).width() / 2));
        },
        stop: function () {
            var parent = $(this).data('parent');
            var leftTrack =  $(parent.scrollFrame).data('leftTrack');
            var leftTimeText = $(parent.scrollFrame).data('leftTimeText');
            $(leftTimeText).css('left', $(this).position().left + "px");
            $(leftTrack).width($(this).position().left + ($(this).width() / 2));
        }
    });
    
    $(rightThumb).data('parent', this);
    $(rightThumb).draggable({ axis: 'x' , 
        containment: this.scrollFrame,
        start: function (e) {
             $(this).data('startX', e.clientX);
        },
        drag: function (e) {
            var parent = $(this).data('parent');
            var rightTrack =  $(parent.scrollFrame).data('rightTrack');
            var leftThumb =  $(parent.scrollFrame).data('leftThumb');
            var rightTimeText = $(parent.scrollFrame).data('rightTimeText');
            var startX = $(this).data('startX');
            if(parent.scrollCallbackObject!=null){
                var callback = parent.scrollCallbackObject.callback;
                var arg = parent.scrollCallbackObject.arg;
                callback(arg);
            }
            if(e.pageX < startX){
                if($(this).position().left - 100 < $(leftThumb).position().left){
                    return false;
                }
            }
            var selectedTime = parent.getSelectedTime();
            var endTimeMoment = new moment(selectedTime.targetEndTime).format('hh:mm:ss.SSS');
            $(rightTimeText).text(endTimeMoment);
            $(rightTimeText).css('right',  parseInt($(parent.scrollFrame).width() - $(this).position().left - $(this).width()) + "px");
            $(rightTrack).width($(parent.scrollFrame).width() - $(this).position().left - ($(this).width() / 2));
        },
        stop: function () {
            var parent = $(this).data('parent');
            var rightTrack =  $(parent.scrollFrame).data('rightTrack');
            var rightTimeText = $(parent.scrollFrame).data('rightTimeText');
            $(rightTimeText).css('right',  parseInt($(parent.scrollFrame).width() - $(this).position().left - $(this).width()) + "px");
            $(rightTrack).width($(parent.scrollFrame).width() - $(this).position().left - ($(this).width() / 2));
        }
    });
}

jLego.objectUI.statusSummaryBar.prototype.registerTimeScrollEvent = function(callbackObject){
    this.scrollCallbackObject = callbackObject;
}

jLego.objectUI.statusSummaryBar.prototype.getSelectedTime=function(){
    var leftTrack = $(this.scrollFrame).data('leftTrack');
    var rightTrack = $(this.scrollFrame).data('rightTrack');
    var totalWidth = $(this.scrollFrame).width();
    var startWidth = $(leftTrack).width() - parseInt(this.scrollFrameHeight / 2);
    var endWidth = $(rightTrack).width() - parseInt(this.scrollFrameHeight / 2);
    var startOffsetRatio = startWidth / totalWidth;
    var endOffsetRatio = endWidth / totalWidth;
    var totalTime = this.maxEndTime - this.minStartTime;
    var targetStartTime = this.minStartTime + parseInt(startOffsetRatio * totalTime);
    var targetEndTime = this.maxEndTime - parseInt(endOffsetRatio * totalTime);
    return {
        targetStartTime: targetStartTime,
        targetEndTime: targetEndTime
    }
}

jLego.objectUI.statusSummaryBar.prototype.resize=function(){
    var totalTime = this.maxEndTime - this.minStartTime;
    var selectedTime = this.getSelectedTime();
    var mainElementWidth = $(this.parentElement).width() - (2 * this.leftSpace);
    $(this.mainElement).width(mainElementWidth);
    this.scrollFrameWidth = 0;
    for(var i=0; i<this.statusItemList.length; i++){
        var currentStatusItem = this.statusItemList[i];
        var ratio = (currentStatusItem.endTime - currentStatusItem.startTime) / (this.maxEndTime - this.minStartTime);
        var statusElementWidth = parseInt(mainElementWidth * ratio);
        this.scrollFrameWidth = this.scrollFrameWidth + statusElementWidth;
        $(this.statusElementList[i]).width(statusElementWidth);
    }
    $(this.scrollFrame).width(this.scrollFrameWidth);
    var scrollBackground = $(this.scrollFrame).data('scrollBackground');
    var scrollTextFrame = $(this.scrollFrame).data('scrollTextFrame');
    var leftThumb = $(this.scrollFrame).data('leftThumb');
    var rightThumb = $(this.scrollFrame).data('rightThumb');
    var leftTrack = $(this.scrollFrame).data('leftTrack');
    var rightTrack = $(this.scrollFrame).data('rightTrack');
    var leftTimeText = $(this.scrollFrame).data('leftTimeText');
    var rightTimeText = $(this.scrollFrame).data('rightTimeText');
    $(scrollBackground).width(this.scrollFrameWidth);
    $(scrollTextFrame).width(this.scrollFrameWidth);
    var startRatio = (selectedTime.targetStartTime - this.minStartTime) / totalTime;
    var endRatio = (this.maxEndTime - selectedTime.targetEndTime) / totalTime;
    var startPosition = parseInt(this.scrollFrameWidth * startRatio);
    var endPosition = parseInt(this.scrollFrameWidth * endRatio);
    $(leftThumb).css('right',  endPosition + "px");
    $(leftTimeText).css('right',  endPosition + "px");
    $(leftTrack).width(startPosition + ($(leftThumb).width() / 2));
    $(rightThumb).css('right',  endPosition + "px");
    $(rightTimeText).css('right',  endPosition + "px");
    $(rightTrack).width(endPosition + ($(rightThumb).width() / 2));
}

jLego.objectUI.statusSummaryBar.prototype.resizeHandler=function(){
    this.resize();
}
