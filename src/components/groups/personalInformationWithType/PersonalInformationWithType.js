define(['common/components/groups/FormComponent',
    'common/components/groups/personalInformation/PersonalInformation',
    'common/utilities/reflection',
    'common/components/groups/personalInformationWithType/resources',
    'common/ko/validate/extensionRules/personalDetails',
    'common/ko/globals/multiLanguageObservable',
    'common/accessibility/radioGroupAccessibility'
],
    function (FormComponent, PersonalInformation, reflection, resources) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                idType: { defaultValue: '1', extenders: { required: true } }
            },
            texts: resources.texts
        };

        reflection.extend(defaultSettings, PersonalInformation.defaultSettings);

        /**
     * @class  PersonalInformation
     * @description Group of fields usually used as a unit to perform identification stage. 
     * <br /> Contains fields: <b>ID number</b>, <b>first name</b> and <b>last Name</b>. each comes with it's specific validation rule, unless otherwise requested. 
     * @property {string} idNum
     * @property {string} firstName
     * @property {string} lastName
     * @constructs 
     * @param {object} settings - 
     * @param {object} settings.idNum -
     * @param {object} settings.idNum.extenders- the validation rules for this field
     * @param {object} settings.idNum.defaultValue - default val to initialize the field
     * @example    
     * var personalInformation: new PersonalInformation({ idNum: { ignore:['required'] }, firstName: { defaultValue: 'משה', extenders: { required: false } } }),
     */
        var PersonalInformationWithType = function (settings) {
            settings = settings || {};

            var self = this;

            FormComponent.call(self, defaultSettings, settings);

            var model = {
                idType: self.extendModelProperty(ko.observable(), 'idType')
            };

            self.settings.model.idNum.extenders.idNumOrPassport = model.idType;

            PersonalInformation.call(self, self.settings);

            var jointModel = reflection.extend(model, self.getModel());

            self.setModel(jointModel);

            model.idType.subscribe(function () {
                model.idNum('');
            });

            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });
        };

        PersonalInformationWithType.prototype = Object.create(FormComponent.prototype);
        PersonalInformationWithType.prototype.constructor = PersonalInformationWithType;
        PersonalInformationWithType.defaultSettings = defaultSettings;

        return PersonalInformationWithType;
    });

