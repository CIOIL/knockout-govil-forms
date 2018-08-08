define(['common/components/elements/FormElement',
        'common/entities/entityBase',
        'common/utilities/propertyExtendersFactory',
        'common/components/elements/cityAutoComplete/resources',
        'common/dataServices/cityProviderAutoComplete',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/bindingHandlers/tlpAutocomplete'
],
    function (FormElement, entityBase, propertyExtendersFactory, resources, cityProviderAutoComplete) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                value: {
                }
            },
            texts: resources.texts
        };


        var CityAutoComplete = function (settings) {

            var self = this;

            settings = settings || {};

            FormElement.call(self, defaultSettings, settings);

            var modelSettings = self.settings.model;

            modelSettings.value.extenders = propertyExtendersFactory(modelSettings.value.extenders || {}, modelSettings.value.ignore, modelSettings.isModelRequired);

            var model = {
                value: new entityBase.ExtendableEntityBase(modelSettings.value)
            };

            self.setModel(model);
            self.autocompleteSettings = {
                listAccessor: cityProviderAutoComplete.cityList,
                mappingObject: { dataCode: 'dataCode', dataText: 'dataText' },
                value: model.value
            };
            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });
        };

        CityAutoComplete.prototype = Object.create(FormElement.prototype);
        CityAutoComplete.prototype.constructor = CityAutoComplete;
        CityAutoComplete.defaultSettings = defaultSettings;

        return CityAutoComplete;
    });