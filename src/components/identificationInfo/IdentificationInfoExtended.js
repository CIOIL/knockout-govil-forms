
define(['common/viewModels/ModularViewModel',
        'common/utilities/reflection',
        'common/components/texts/identificationInfo',
        'common/components/identificationInfo/IdentificationInfo',
        'common/ko/globals/multilanguageobservable',
        'common/ko/BindingHandlers/tlpLockElement',
        'common/accessibility/radioGroupAccessibility'
],

    function (ModularViewModel, commonReflection, resources, IdentificationInfo) {//eslint-disable-line max-params
  
        var defaultSettings = {
            idType: {
                extenders: {
                    required: true
                },
                value: '1',
                isEnabledIdType: false
            },
            version: '1.0.0',
            text: resources
        };
 
        /**   
        * @description Group of fields usually used as a unit to perform identification stage. 
        * <br /> Contains fields: <b>ID number</b>, <b>first name</b> and <b>last Name</b>. each comes with it's specific validation rule, unless otherwise requested. 
        * @class IdentificationInfoExtended
        * @name IdentificationInfoExtended
        * @augments IdentificationInfo
        * @constructs 
        * @param {object} settings -
        * @see <a href="file:///D:/workingFolder/FormsCDN/Forms/Test/ModularCommon/3.0.0.0/JS/components/identificationInfo/out/IdentificationInfo.html">IdentificationInfo</a>
        */
        var IdentificationInfoExtended = function (settings) {

            var self = this;

            settings = $.extend(true, defaultSettings, settings);

            function modelPropertyFactory(settings) {
                var prop = ko.observable().defaultValue(settings.value);
                prop.extend(settings.extenders);
                return prop;
            }

            var model = {
                idType: modelPropertyFactory(settings.idType)
            };

            IdentificationInfo.call(self, settings);
            var extendModel = commonReflection.extend(model, self.getModel());
            self.setModel(extendModel);

            model.idNum.extend({ idNumOrPassport: model.idType });//TODO: try move to settings
            //model.idNum.clearAfterValidation(false);

            self.isEnabledIdType = ko.computed(function () {
                return ko.unwrap(settings.idType.isEnabled);
            });

            self.settings = settings;
            self.labels = ko.multiLanguageObservable({ resource: settings.text, language: settings.language });
        };
        IdentificationInfoExtended.prototype = Object.create(ModularViewModel.prototype);
        IdentificationInfoExtended.prototype.constructor = IdentificationInfoExtended;
        IdentificationInfoExtended.defaultSettings = defaultSettings;

        return IdentificationInfoExtended;
    });