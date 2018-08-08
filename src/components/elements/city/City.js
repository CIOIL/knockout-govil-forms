define(['common/components/elements/FormElement',
        'common/utilities/reflection',
        'common/entities/entityBase',
        'common/utilities/propertyExtendersFactory',
        'common/components/elements/city/resources',
        'common/dataServices/cityProvider',
        'common/ko/validate/extensionRules/address',
        'common/ko/bindingHandlers/tlpAttributes',
        'common/ko/bindingHandlers/tlpLookUp',
        'common/ko/bindingHandlers/tlpBindList',
        'common/ko/bindingHandlers/accessibility',
        'common/ko/bindingHandlers/lookupOptions',
        'common/ko/globals/multiLanguageObservable'
       
],
    function (FormElement, commonReflection, entityBase, propertyExtendersFactory, resources,cityProvider) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                value: {
                }
            },
            texts: resources.texts
        };

        var City = function (settings) {

            var self = this;

            settings = settings || {};

            FormElement.call(self, defaultSettings, settings);

            var modelSettings = self.settings.model;

            modelSettings.value.extenders = propertyExtendersFactory(modelSettings.value.extenders || {}, modelSettings.value.ignore, modelSettings.isModelRequired);

            var model = {
                value: new entityBase.ExtendableEntityBase(modelSettings.value)
            };

            self.setModel(model);
            self.citylist = cityProvider.cityList;
            self.bindCityListSettings = cityProvider.bindCityListSettings;
            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });

        };

        City.prototype = Object.create(FormElement.prototype);
        City.prototype.constructor = City;
        City.defaultSettings = defaultSettings;

        return City;
    });