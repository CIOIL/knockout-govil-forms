define(['common/components/groups/FormComponent',
        'common/ko/validate/utilities/areaCodesDefer',
        'common/components/groups/contactDetails/resources',
        'common/ko/validate/extensionRules/address',
        'common/ko/validate/extensionRules/phone',
        'common/ko/BindingHandlers/tlpAttributes',
        'common/ko/BindingHandlers/accessibility',
        'common/ko/globals/defferedObservable',
        'common/ko/globals/multilanguageobservable'],
    function (FormComponent, areaCodesDefer, resources) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                phone: { extenders: { phoneOrMobile: true } },
                otherPhone: { extenders: { phoneOrMobile: true } },
                email: { extenders: { email: true } }
            },
            texts: resources.texts
        };


        /**
      * @class  ContactDetails
      * @description Group of fields usually used as a unit to perform contact details. 
      * <br /> Contains fields: <b>phone</b>, <b>otherPhone</b> and <b>email</b>. each comes with it's specific validation rule, unless otherwise requested. 
      * @property {number} phone
      * @property {number} otherPhone
      * @property {alphaNumeric} email
      * @param {object} [settings] - 
      * @param {object} settings.phone -
      * @param {object} settings.phone.extenders- the validation rules for this field
      * @param {number} settings.phone.defaultValue - default value to initialize the field
      * @param {array} settings.phone.ignore - array of unwanted validation rules for this field 
      * @param {object} settings.otherPhone -
      * @param {object} settings.otherPhone.extenders- the validation rules for this field
      * @param {number} settings.otherPhone.defaultValue - default value to initialize the field
      * @param {array} settings.otherPhone.ignore - array of unwanted validation rules for this field
      * @param {object} settings.email -
      * @param {object} settings.email.extenders- the validation rules for this field
      * @param {alphaNumeric} settings.email.defaultValue - default value to initialize the field
      * @param {array} settings.email.ignore - array of unwanted validation rules for this field
      * @param {(boolean|function)} settings.isModelRequired - an indicator whether all the fields are required/ not required/ required under the same condition
      * @param {object} settings.texts - labels for the components view
      * @example 
      * var contactSettings = {
      * model: {
      *     phone: { extenders: { phoneNumber: true, required: true }, defaultValue: '089799909', ignore: ['phoneOrMobile'] },
      *     otherPhone: {},
      *     email: { extenders: { tlpTrim: true } }
      * },
      * texts: {
      *     hebrew: {
      *         phone: 'טלפון בבית',
      *         otherPhone: 'טלפון במשרד'
      *     }
      * }
      * }   
      * contactDetails: new ContactDetails(contactSettings)
      */
        var ContactDetails = function (settings) {

            settings = settings || {};

            var self = this;

            FormComponent.call(self, defaultSettings, settings);

            var model = {
                phone: self.extendModelProperty(ko.defferedObservable({ deferred: areaCodesDefer }), 'phone'),
                otherPhone: self.extendModelProperty(ko.defferedObservable({ deferred: areaCodesDefer }), 'otherPhone'),
                email: self.extendModelProperty(ko.observable(), 'email')
            };

            self.setModel(model);

            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });
        };

        ContactDetails.prototype = Object.create(FormComponent.prototype);
        ContactDetails.prototype.constructor = ContactDetails;
        ContactDetails.defaultSettings = defaultSettings;

        return ContactDetails;
    });