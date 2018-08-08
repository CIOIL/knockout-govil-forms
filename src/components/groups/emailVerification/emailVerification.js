define(['common/components/groups/FormComponent',
        'common/components/groups/emailVerification/resources',
        'common/infrastructureFacade/tfsMethods',
        'common/utilities/stringExtension',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/validate/extensionRules/address',
        'common/ko/validate/extensionRules/general'],

    function (FormComponent, resources, tfsMethods, stringExtension) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                email: { extenders: { email: true } },
                reEmail: { extenders: {} }
            },
            texts: resources.texts,
            errorMessages: resources.errorMessages
        };

        /**
        * @class EmailVerification
        * @description Group of email & reEmail fields. check reEmail equal to email and avoid paste in reEmail field. reEmail required only if email is full
        * <br /> Contains fields: <b>email</b>, and <b>reEmail</b>. each comes with it's specific validation rule, unless otherwise requested. 
        * @property {email} email
        * @property {reEmail} reEmail
        * @param {Object} [settings] - 
        * @param {Object} settings.email -
        * @param {Object} settings.email.extenders- the validation rules for this field
        * @param {Array} settings.email.ignore - array of unwanted validation rules for this field 
        * @param {Any} settings.isModelRequired - an indicator whether all the fields are required/ not required/ required under the same condition
        * @param {Object} settings.texts - labels for the components view
        * @example    
        * emailVerification: new EmailVerification({ model: { email: { extenders: { required: false } } }, isModelRequired: isPrivateType })
        */

        var EmailVerification = function EmailVerification(settings) {

            settings = settings || {};

            var self = this;

            FormComponent.call(self, defaultSettings, settings);

            var model = {
                email: self.extendModelProperty(ko.observable(), 'email'),
                reEmail: ko.observable()
            };

            var isEmailFull = ko.computed(function () {
                return !!ko.unwrap(model.email);
            });

            var labels = ko.multiLanguageObservable({ resource: self.settings.texts });
            var errorMessages = ko.multiLanguageObservable({ resource: self.settings.errorMessages });

            model.reEmail.extend({
                equalIgnoreCase: {
                    params: model.email, message: function message() {
                        return stringExtension.format(errorMessages().equalEmail, labels().email);
                    }
                },
                required: { onlyIf: isEmailFull }
            });

            model.reEmail = self.extendModelProperty(model.reEmail, 'reEmail');

            self.setModel(model);

            self.labels = labels;
            self.pasted = function () {
                tfsMethods.dialog.alert(stringExtension.format(errorMessages().manualTyping, labels().reEmail));
                return false;
            };
        };

        EmailVerification.prototype = Object.create(FormComponent.prototype);
        EmailVerification.prototype.constructor = EmailVerification;
        EmailVerification.defaultSettings = defaultSettings;

        return EmailVerification;
    });