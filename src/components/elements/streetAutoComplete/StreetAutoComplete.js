define(['common/components/elements/FormElement',
        'common/entities/entityBase',
        'common/utilities/propertyExtendersFactory',
        'common/components/elements/street/resources',
        'common/ko/bindingHandlers/autocompleteBindList'
],
    function (FormElement, entityBase, propertyExtendersFactory, resources) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                value: {
                }
            },
            texts: resources.texts
        };

        var StreetAutoComplete = function (settings) {

            var self = this;

            settings = settings || {};

            FormElement.call(self, defaultSettings, settings);

            var modelSettings = self.settings.model;

            modelSettings.value.extenders = propertyExtendersFactory(modelSettings.value.extenders || {}, modelSettings.value.ignore, modelSettings.isModelRequired);

            var model = {
                value: new entityBase.ExtendableEntityBase(modelSettings.value)
            };

            self.setModel(model);
           
            self.streetList = ko.observableArray();
            var filter = ko.computed(function () {
                return ko.unwrap(settings.filter) || '-1';
            });

            filter.subscribe(function () {
                model.value.dataText('');
              
            });

            self.autocompleteSettings = {
                autocompleteParams: {
                    listAccessor: self.streetList,
                    value: self.value
                },
                listParams: {
                    filters: [{ key: 'CityCode', value: settings.filter }],
                    listName: 'Streets',
                    dataTextColumn: 'NAME',
                    dataCodeColumn: 'CODE'
                }
            };
            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });

        };

        StreetAutoComplete.prototype = Object.create(FormElement.prototype);
        StreetAutoComplete.prototype.constructor = StreetAutoComplete;
        StreetAutoComplete.defaultSettings = defaultSettings;

        return StreetAutoComplete;
    });