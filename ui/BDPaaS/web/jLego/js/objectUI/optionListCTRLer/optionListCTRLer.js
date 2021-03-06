/* 
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
jLego.objectUI.optionListCTRLer=function(){
    var myID;
    var myClass;
    var myConsts;
        
    var optionList;
    var optionValueList;
    var optionSubmitList;
    
    this.initialize();
}

jLego.objectUI.optionListCTRLer.prototype.initialize=function(){
    this.myID = jLego.objectUI.id.optionListCTRLer;
    this.myClass = jLego.objectUI.cls.optionListCTRLer;
    this.myConsts = jLego.objectUI.constants.optionListCTRLer;
    
    this.optionList = [];
    this.optionValueList = [];
    this.optionSubmitList = [];
}

jLego.objectUI.optionListCTRLer.prototype.add=function(target, option){
    if(option==null) return false;
    var defID = jLego.func.getRandomString();
    var index = this.optionList.length;
    if(!option.subContent){
        this.optionList[index] =
            jLego.basicUI.addDiv(target, {id:defID+"_optionFrame" , class: this.myClass.OPTIONLISTCTRLER_OPTION_FRAME});
        if(option.hideBottomBorder==true)
            $(this.optionList[index]).css('border-bottom', "0px");
    }
    else{
        this.optionList[index] =
            jLego.basicUI.addDiv(target, {id:defID+"_optionFrame" , class: this.myClass.OPTIONLISTCTRLER_OPTION_FRAME_WITH_SUBCONTENT});
    }
    if(option.hasIcon){
         var icon = 
            jLego.basicUI.addImg(this.optionList[index], {id: defID+"_title", class: this.myClass.OPTIONLISTCTRLER_OPTION_ICON, src: option.iconURL});
    }
    var title = 
            jLego.basicUI.addDiv(this.optionList[index], {id: defID+"_title", class: this.myClass.OPTIONLISTCTRLER_OPTION_TITLE});
    $(title).text(option.title);
    
    if(option.type=="input"){
        var inputType;
        if(option.inputType!=null) inputType=option.inputType;
        else inputType="text";
        var element = 
                jLego.basicUI.addInput(this.optionList[index], {id: defID+"_input", class: this.myClass.OPTIONLISTCTRLER_OPTION_INPUT, type: inputType, name: option.title});  
        $(element).attr('autocomplete', 'new-password');
        if(option.editable!= null && option.editable==false){
            $(element).attr('readonly', true);
            $(element).css('opacity', 0.4);
            $(element).css('cursor', 'not-allowed');
        }
        if(option.defaultValue!=null){
            $(element).val(option.defaultValue);
            $(this.optionList[index]).data('value', option.defaultValue);
        }
        $(element).data('relatedObject', this.optionList[index]);
    }
    else if(option.type==="file"){
        $(this.optionList[index]).data('value', null);
        inputType="file";
        var element = 
            jLego.basicUI.addInput(this.optionList[index], {id: defID+"_file", class: this.myClass.OPTIONLISTCTRLER_OPTION_FILE, type: inputType, name: option.title});  
        $(element).attr('accept', option.allowExtension);
        $(element).css('border', '0px solid transparent');
        if(option.editable!= null && option.editable==false){
            $(element).attr('readonly', true);
            $(element).css('opacity', 0.4);
            $(element).css('cursor', 'not-allowed');
        }
        $(element).data('relatedObject', this.optionList[index]);
        $(element).on('change', function(){
            $($(this).data('relatedObject')).data('value', $(this).val());
        });
    }
    else if(option.type==="timeInput"){
        var inputType, dateFormat;
        if(option.inputType!=null) inputType=option.inputType;
        else inputType="text";
        if(option.format!=null) dateFormat=option.format;
        else dateFormat='yy-mm-dd';
        var element = 
                jLego.basicUI.addInput(this.optionList[index], {id: defID+"_timeInput", class: this.myClass.OPTIONLISTCTRLER_OPTION_INPUT, type: inputType, name: option.title});  
        
        if(option.editable== null || option.editable==true){
            $(element).datetimepicker({dateFormat: 'yy-mm-dd', timeFormat: 'HH:mm:ss'});
        }
        else{
            $(element).css('opacity', 0.4);
            $(element).css('cursor', 'not-allowed');
        }
        if(option.defaultValue!=null){
            $(element).val(option.defaultValue);
            $(this.optionList[index]).data('value', option.defaultValue);
        }
        $(element).on('change', function(){
            $($(this).data('relatedObject')).data('value', $(this).val());
        });
        $(element).data('relatedObject', this.optionList[index]);
    }
    else if(option.type==="select"){
        if(option.selectionValue!=null)    $(this.optionList[index]).data('value', option.selectionValue[0]);
        else $(this.optionList[index]).data('value', null);
        var element = 
                jLego.basicUI.addSelectOption(this.optionList[index], {id: defID+"_select", class: this.myClass.OPTIONLISTCTRLER_OPTION_SELECT, nameList: option.selectionName, valueList: option.selectionValue});
        if(option.defaultValue!=null){
            var selectOption=document.getElementById(defID+"_select").options;
            for(var i=0; i<selectOption.length; i++){
                if(selectOption[i].value==option.defaultValue){
                    selectOption.selectedIndex=i;
                    $(this.optionList[index]).data('value', selectOption[i].value);
                    break;
                }
            }
        }
        if(option.editable!= null && option.editable==false){
            $(element).attr('readonly', true);
            $(element).css('opacity', 0.4);
            $(element).css('cursor', 'not-allowed');
        }
        $(element).data('relatedObject', this.optionList[index]);
        $(element).on('change', function(){
            $($(this).data('relatedObject')).data('value', $(this).val());
        });
    }
    else if(option.type=="label"){
        var element = 
                jLego.basicUI.addDiv(this.optionList[index], {id: defID+"_label", class: this.myClass.OPTIONLISTCTRLER_OPTION_LABEL});  
        $(element).text(option.defaultValue);
        if(option.valueColor){
            $(element).css('color', option.valueColor);
        }
    }
    if(option.hideButton!=true){
        if(option.buttonClass=="warning"){
             var button = 
                jLego.basicUI.addDiv(this.optionList[index], {id: defID+"_button", class: this.myClass.OPTIONLISTCTRLER_OPTION_BUTTON_WARNING});
        }
        else{
            var button = 
                jLego.basicUI.addDiv(this.optionList[index], {id: defID+"_button", class: this.myClass.OPTIONLISTCTRLER_OPTION_BUTTON});
        }
        $(button).text(option.buttonText);
        $(this.optionList[index]).data('button', button);
    }
    
    if(option.subContent){
        var subContentFrame =
            jLego.basicUI.addDiv(this.optionList[index], {id:defID+"_subContentFrame" , class: this.myClass.OPTIONLISTCTRLER_OPTION_SUBCONTENT_FRAME});    
        $(subContentFrame).text(option.subContent);
        if(option.hideBottomBorder==true)
            $(subContentFrame).css('border-bottom', "0px");
        $(this.optionList[index]).data('subContentFrame', subContentFrame);
    }
     $(this.optionList[index]).data('element', element);
    return this.optionList[index];
}

jLego.objectUI.optionListCTRLer.prototype.getButton = function(optionFrame){
    return $(optionFrame).data('button');
}

jLego.objectUI.optionListCTRLer.prototype.getValue = function(optionFrame){
    var element = $(optionFrame).data('element');
    return $(element).val();
}

jLego.objectUI.optionListCTRLer.prototype.getElement = function(optionFrame){
    var element = $(optionFrame).data('element');
    return element;
}

jLego.objectUI.optionListCTRLer.prototype.setValue = function(optionFrame, newValue){
    var subContentFrame = $(optionFrame).data('element');
    return $(element).val(newValue);
}

jLego.objectUI.optionListCTRLer.prototype.updateSubContent = function(optionFrame, subContent){
    var subContentFrame = $(optionFrame).data('subContentFrame');
    if(subContentFrame){
        $(subContentFrame).text(subContent);
    }
}

jLego.objectUI.optionListCTRLer.prototype.setOptionButtonClick=function(optionFrame, onCallbackObject){
    var parent=this;
    var onCallback, onArg;
    if(onCallbackObject!=null){
        onCallback=onCallbackObject.callback;
        onArg=onCallbackObject.arg;
    }
    
    var button = $(optionFrame).data('button');
    if(button==null) return;
    $(button).off('click');
    $(button).data('onCallback', onCallback);
    $(button).data('onArg', onArg);
    $(button).click(function(){
        if($(this).data('onArg')!=null)   $(this).data('onCallback')($(this).data('onArg'));
        else    $(this).data('onCallback')();
    });
}