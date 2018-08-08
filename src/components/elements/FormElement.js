define(['common/viewModels/ModularViewModel',
    'common/utilities/tryParse',
    'common/utilities/typeVerifier',
    'common/utilities/reflection',
    'common/utilities/stringExtension',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/propertyExtendersFactory',
    'common/ko/fn/defaultValue'
],
    function (ModularViewModel, parser, typeVerifier, commonReflection, stringExtension, exceptions, exceptionMessages, propertyExtendersFactory) {//eslint-disable-line max-params

        var baseSettings = {
            extenders: {
                required: true
            },
            defaultValue: '',
            ignore: []
        };

        function extendSettingsWithBase(param) {
            commonReflection.extend(param, baseSettings);
        }

        var mergeSettings = function (defaultSettings, settings) {
            settings = commonReflection.extendSettingsWithDefaults(settings.hasOwnProperty('model') ? settings : { model: settings }, defaultSettings);
            var modelSettings = settings.model;
            extendSettingsWithBase(modelSettings.value);
            modelSettings.value.extenders = propertyExtendersFactory(modelSettings.value.extenders, modelSettings.value.ignore, settings.isModelRequired);
            return settings;
        };

        var FormElement = function (defaultSettings, settings) {

            settings = settings || {};

            var self = this;

            settings = mergeSettings(defaultSettings, settings);

            ModularViewModel.call(self, {});

            self.settings = settings;
        };

        FormElement.prototype = Object.create(ModularViewModel.prototype);
        FormElement.prototype.constructor = FormElement;

        return FormElement;

    });
