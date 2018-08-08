/**
@module radioGroup 
@description component to replace radio in dynamic table
*/
define(function(require){

    var ModularViewModel = require('common/viewModels/ModularViewModel')
    , reflection = require('common/utilities/reflection')
    , typeVerifier = require('common/utilities/typeVerifier')
    , exceptions = require('common/core/exceptions')
    , argumentsChecker = require('common/utilities/argumentsChecker')
    , exeptionMessages = require('common/resources/exeptionMessages')
    , stringExtension = require('common/utilities/stringExtension')
    , accessibilityMethods = require('common/accessibility/utilities/accessibilityMethods');
    require('common/ko/fn/defaultValue');
   
    /**
    * @class RadioViewModel
    * @classdesc define any radio in group
    * @param {object} settings - object that contain the params
    * @param {primitive} settings.code - the code that will save on selectedValue, get primitive type
    * @param {string/computed} settings.text - the text to display
    * @param {string/computed} [settings.title] - tooltip for radio
    * @example  
    * var settings = { code: 1, text: 'yes',title:'yes answer' };
    * radioViewModel = new radioGroup.RadioViewModel(settings);
    **/
    
    var RadioViewModel =function (settings) {
        var self = this;

        argumentsChecker.checkAllRequiredArgs(settings, ['code', 'text'], 'RadioViewModel');

        var dataText = ko.computed(function () {
            return ko.unwrap(settings.text);
        });

        var dataTitle = ko.computed(function () {
            return ko.unwrap(settings.title);
        });

        self.optionsBinding = settings.optionsBinding || {};
        self.dataText = dataText;
        self.dataCode = settings.code;
        self.dataTitle = dataTitle;
    };

   /**
   * @class RadioGroupViewModel
   * @classdesc component to define a group of radio
   * @param {object} settings - object that contain the params
   * @param {array}  settings.radioArray - array of RadioViewModel type
   * @param {object} [settings.extend] - extend for validation
   * @param {primitive} [settings.defaultValue] - default Value for selected value
   * @property {primitive} selectedValue - returns the value of selected radio
   * @example  
   * var radioArray= [new radioGroup.RadioViewModel({code:1, text:'yes'}), new radioGroup.RadioViewModel({code:2, text:'no'})]
   * var args = { radioArray:radioArray,{required:true},defaultValue:4} };
   * radioGroupViewModel = new radioGroup.RadioGroupViewModel(args);
   **/
    var RadioGroupViewModel = function (settings) {

        var defaultSettings = {
            extend: {}
            ,defaultValue: undefined
        };

        settings = reflection.extendSettingsWithDefaults(settings, defaultSettings);
  
        var self = this;

        var radioArray;

        var model = {
            selectedValue: ko.observable(settings.defaultValue).defaultValue(settings.defaultValue).extend(settings.extend)
        };
        
        function isValidArray() {
            return typeVerifier.array(settings.radioArray) && settings.radioArray.length > 0 && settings.radioArray[0] instanceof RadioViewModel;
        }

        if (isValidArray()) {
            radioArray =settings.radioArray;
        }
        else {
            exceptions.throwFormError(stringExtension.format(exeptionMessages.invalidParam, 'radioArray'));
        }

        var isSelected = function (data) {
            return data.dataCode === model.selectedValue();
        };

        var getAriaCheckedVal = function (data) {
            return isSelected(data) ? 'true' : 'false';
        };

        var getTabindexVal = function (data, index) {
            return isSelected(data) ||  (model.selectedValue() === settings.defaultValue && ko.unwrap(index) === 0) ? '0' : '-1';
        };

        var isFocusOnFirst = function (index) {
            return typeof (model.selectedValue()) === 'undefined' && index === 0;
        };

        var isFocus = function (index) {
            index = ko.unwrap(index);
            return isSelected(radioArray[index]) || isFocusOnFirst(index);
        };

        var setSelectedValue = function (data) {
            model.selectedValue(data.dataCode);
        };

        ModularViewModel.call(self, model);

        self.isFocus = isFocus;
        self.setSelectedValue = setSelectedValue;
        self.isSelected = isSelected;
        self.radioArray = radioArray;
        self.getTabindexVal = getTabindexVal;
        self.getAriaCheckedVal = getAriaCheckedVal;
    };
    RadioGroupViewModel.prototype = Object.create(ModularViewModel.prototype);
    RadioGroupViewModel.prototype.constructor = RadioGroupViewModel;

   /**
   * @class RadioGroupFieldViewModel
   * @classdesc component to define a field with group of radio
   * @param {object} settings - object that contain the params
   * @param {array}  settings.radioArray - array of RadioViewModel type
   * @param {array}  settings.text - the name of the field for using in label
   * @param {object} [settings.extend] -extends for validation
   * @param {primitive} [settings.defaultValue] - default Value for selected value
   * @extends RadioGroupViewModel
   * @example  
   * var radioArray= [new radioGroup.RadioViewModel({code:1, text:'תז'}), new radioGroup.RadioViewModel({code:2, text:'ח.פ.'})]
   *  var args = {text:'סוג זיהוי',radioArray:radioArray,{extend:{required:true}},defaultValue:1 };
   *  radioGroupViewModel = new radioGroup.RadioGroupViewModel(args);
   **/
    var RadioGroupFieldViewModel = function (settings) {

        var self = this;


        var text = ko.computed(function () {
            return ko.unwrap(settings.text);
        });

        RadioGroupViewModel.call(self, settings);

        self.text = text;
    };

    RadioGroupFieldViewModel.prototype = Object.create(RadioGroupViewModel.prototype);
    RadioGroupFieldViewModel.prototype.constructor = RadioGroupFieldViewModel;

    ko.bindingHandlers.radioLabel = {
        init: function (element, valueAccessor) {
            valueAccessor();
            var radioButton = $(element).siblings('button');
            $(element).off('click').on('click',function () {
                radioButton[0].click();
            });            
        }
    };

    ko.bindingHandlers.ariaLabelForContainer = {
        init: function (element, valueAccessor) {
            valueAccessor();
            var radiogroupFieldContainer = $(element).closest('.radiogroup-field-container');
            if (!radiogroupFieldContainer) {
                exceptions.throwFormError('wrong HTML structure - there no container with radiogroup-field-container class');
            }
            var label = $(radiogroupFieldContainer).find('label')[0];
            accessibilityMethods.addingAriaLabelledBy(label, element);
        }
    };

    ko.bindingHandlers.addBindings = {
        init: function (element, valueAccessor) {
            var bindingsObject = valueAccessor();
            for (var bindingName in bindingsObject) {
                if (bindingsObject.hasOwnProperty(bindingName)) {
                    var binding = {};
                    binding[bindingName] = bindingsObject[bindingName];
                    ko.applyBindingsToNode(element, binding);
                }
            }
        }
    };

    return {
        RadioGroupViewModel: RadioGroupViewModel
        , RadioViewModel: RadioViewModel
        ,RadioGroupFieldViewModel:RadioGroupFieldViewModel
    };
});