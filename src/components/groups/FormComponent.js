define(['common/viewModels/ModularViewModel',
    'common/utilities/reflection',
    'common/utilities/stringExtension',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/propertyExtendersFactory',
    'common/ko/fn/defaultValue'
],
    function (ModularViewModel, commonReflection, stringExtension, exceptions, exceptionMessages, propertyExtendersFactory) {//eslint-disable-line max-params

        var baseSettings = {
            extenders: {
                required: true
            },
            defaultValue: '',
            ignore: []
        };

        var extendModelSettingsWithBase = function (modelSettings) {
            commonReflection.extend(modelSettings, baseSettings);
        };


        var wrapInModel = function (settings) {
            if (!settings.hasOwnProperty('model')) {
                return { model: settings };
            }
            return settings;
        };

        var actualMerge = function (defaultObj, userObj, prop) {
            if (!userObj.hasOwnProperty(prop)) {
                userObj[prop] = defaultObj[prop];
            }
        };
        var mergeComplexType = function (defaultSettings, settings, prop) {
            if (!settings.hasOwnProperty(prop)) {
                settings[prop] = Array.isArray(defaultSettings[prop]) ? [] : {};
            }
            if (defaultSettings[prop].hasOwnProperty('model')) {
                settings[prop] = wrapInModel(settings[prop]);
            }
        };

        function forceModelAndMerge(defaultSettings, settings) {
            for (var prop in defaultSettings) {
                if (defaultSettings.hasOwnProperty(prop)) {
                    if (typeof defaultSettings[prop] !== 'object') {
                        actualMerge(defaultSettings, settings, prop);
                    }
                    else {
                        mergeComplexType(defaultSettings, settings, prop);
                        forceModelAndMerge(defaultSettings[prop], settings[prop]);
                    }
                }
            }
        }
        var getSettingsInProperStructure = function (settings) {
            return settings.hasOwnProperty('model') ? settings : { model: settings, isModelRequired: settings.isModelRequired };
        };

        var mergeSettings = function (defaultSettings, settings) {
            settings = getSettingsInProperStructure(settings);
            forceModelAndMerge(defaultSettings, settings);
            var modelSettings = settings.model;
            for (var prop in modelSettings) {
                if (modelSettings.hasOwnProperty(prop) && typeof modelSettings[prop] === 'object') {
                    if (!modelSettings[prop].hasOwnProperty('model')) {
                        extendModelSettingsWithBase(modelSettings[prop]);
                        modelSettings[prop].extenders = propertyExtendersFactory(modelSettings[prop].extenders, modelSettings[prop].ignore, settings.isModelRequired);
                    }
                    else {
                        modelSettings[prop].isModelRequired = settings.isModelRequired;
                    }
                }
            }
            return settings;
        };

        var extendModelProperty = function (prop, propName) {
            var settings = this.settings.model[propName] || {};
            if (ko.isSubscribable(prop) === false) {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, ['extendModelProperty']));
            }
            prop.defaultValue(settings.defaultValue);
            return prop.extend(settings.extenders);
        };

        /**
        * @class  FormComponent
        * @description Base Class for group-of-fields components. 
        * @constructs
        * @param {object} defaultSettings -  
        * @param {object} settings - 
        * @example    
        * var personalInformation: new IdentificationInfo({ idNum: { applyExtenders: false }, firstName: { defaultValue: 'משה', extenders: { required: false } } }),
        */
        var FormComponent = function (defaultSettings, settings) {

            settings = settings || {};

            var isModelRequired = settings.isModelRequired;

            var self = this;

            settings = mergeSettings(defaultSettings, settings);

            ModularViewModel.call(self, {});

            self.isModelRequired = isModelRequired;
            self.settings = settings;
        };
        FormComponent.prototype = Object.create(ModularViewModel.prototype);
        /**
        @memberOf FormComponent
        * @constructor
        * @param {object} defaultSettings - 
        * @param {object} defaultSettings.model - 
        * @param {object} settings - settings. will be used as modelSettings if not specified otherwise (see settings.model)
        * @param {object} [settings.model] - model settings nested in settings if other settings are passed, such as texts etc.
        * @param {object} [settings.isModelRequired] - an indicator whether all model properties are required
        */
        FormComponent.prototype.constructor = FormComponent;
        /**
        @memberOf FormComponent
        * @description the baseSettings of each property in the model of any FormComponent instances.
        */
        FormComponent.prototype.baseSettings = baseSettings;
        /**
        @memberOf FormComponent
        * @function extendModelProperty
        * @description extends a model property with setting, set extenders (mainly of validation rules), set default value
        * @param {function} prop
        * @param {string} propName
        * @example 
        * model={ houseNum: self.extendModelProperty(ko.observable(), 'houseNum')}
        */
        FormComponent.prototype.extendModelProperty = extendModelProperty;

        return FormComponent;


    });


