define(['common/components/elements/FormElement',
        'common/entities/entityBase',
        'common/utilities/reflection',
        'common/utilities/propertyExtendersFactory',
        'common/resources/bindingProperties',
        'common/components/elements/street/resources',
        'common/ko/validate/extensionRules/address',
        'common/ko/bindingHandlers/tlpAttributes',
        'common/ko/bindingHandlers/tlpLookUp',
        'common/ko/bindingHandlers/tlpBindList',
        'common/ko/bindingHandlers/lookupOptions',
        'common/ko/bindingHandlers/accessibility',
        'common/ko/globals/multiLanguageObservable'
],
    function (FormElement, entityBase, commonReflection, propertyExtendersFactory, bindingProperties, resources) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                value: {
                },
                forceValueFromOptions: true
            },
            
            texts: resources.texts
        };

        var Street = function (settings) {

            var self = this;

            settings = settings || {};

            FormElement.call(self, defaultSettings, settings);

            var modelSettings = self.settings.model;

            modelSettings.value.extenders = propertyExtendersFactory(modelSettings.value.extenders || {}, modelSettings.value.ignore, modelSettings.isModelRequired);

            var model = {
                value: new entityBase.ExtendableEntityBase(modelSettings.value)
            };

            self.setModel(model);

            self.loadStreet = ko.observable();

            self.streetList = ko.observableArray();

            var filter = ko.computed(function () {
                return ko.unwrap(settings.filter)|| '-1';
            });
       
            filter.subscribe(function () {
                model.value.dataText('');
                self.loadStreet(true);
            });

            self.bindStreetListSettings = {
                settings: {
                    url: 'GetComboValuesWS.asmx/getXMLDocForComboByFilter?tableName=streets&addEmptyValue=false',
                    environmentName: 'production',
                    method: 'POST',
                    dataType: 'XML',
                    filter: filter
                },
                functionName: 'getListByWebServiceWithFilter',
                listAccessor: self.streetList,
                xmlNodeName: 'Streets',
                value: self.loadStreet
            };
            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });

        };

        Street.prototype = Object.create(FormElement.prototype);
        Street.prototype.constructor = Street;
        Street.defaultSettings = defaultSettings;

        return Street;
    });