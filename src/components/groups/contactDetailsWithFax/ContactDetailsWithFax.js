﻿define(['common/components/groups/FormComponent',
        'common/components/groups/contactDetails/ContactDetails',
        'common/utilities/reflection',
        'common/ko/validate/utilities/areaCodesDefer',
        'common/components/groups/contactDetailsWithFax/resources',
        'common/ko/validate/extensionRules/address',
        'common/ko/validate/extensionRules/phone',
        'common/ko/BindingHandlers/tlpAttributes',
        'common/ko/globals/defferedObservable',
        'common/ko/globals/multilanguageobservable'],
    function (FormComponent, ContactDetails, reflection, areaCodesDefer, resources) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                fax: { extenders: { fax: true } }
            },
            texts: resources.texts
        };

        reflection.extend(defaultSettings, ContactDetails.defaultSettings);


        /**
   * @class  ContactDetailsWithFax
   * @augments ContactDetails
   * @description Group of fields usually used as a unit to perform contact details with field fax. 
   * <br /> Contains fields: <b>phone</b>, <b>otherPhone</b>, <b>fax</b> and <b>email</b>. each comes with it's specific validation rule, unless otherwise requested. 
   * @property {number} phone
   * @property {number} otherPhone
   * @property {number} fax
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
   * @param {object} settings.fax -
   * @param {object} settings.fax.extenders- the validation rules for this field
   * @param {number} settings.fax.defaultValue - default value to initialize the field
   * @param {array} settings.fax.ignore - array of unwanted validation rules for this field
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
   *     email: { extenders: { tlpTrim: true } },
   *     otherPhone: {extenders:{ required: true}},
   * },
   * texts: {
   *     hebrew: {
   *         phone: 'טלפון בבית',
   *         otherPhone: 'טלפון במשרד'
   *     }
   * }
   * }   
   * fullContactDetails: new ContactDetailsWithFax(contactSettings)
   */
        var ContactDetailsWithFax = function (settings) {

            settings = settings || {};

            var self = this;

            FormComponent.call(self, defaultSettings, settings);

            var model = {
                fax: self.extendModelProperty(ko.defferedObservable({ deferred: areaCodesDefer }), 'fax')
            };

            ContactDetails.call(self, self.settings);
            var jointModel = reflection.extend(model, self.getModel());

            self.setModel(jointModel);

            self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });
        };

        ContactDetailsWithFax.prototype = Object.create(FormComponent.prototype);
        ContactDetailsWithFax.prototype.constructor = ContactDetailsWithFax;
        ContactDetailsWithFax.defaultSettings = defaultSettings;

        return ContactDetailsWithFax;
    });
