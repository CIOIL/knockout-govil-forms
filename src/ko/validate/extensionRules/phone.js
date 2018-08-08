/**
* @description sub objects to validate phone fields.
* built as ko.extenders that are to be linked to an observable
* checks validation on the observable and in case of failure returns a proper error message.
* @module validatePhone
* @example Example usage of validate field using ko.validation
* var sampleMobile = ko.observable().extend({ mobile: null });
* sampleMobile('0548412204');
*/

define(['common/resources/regularExpressions',
    'common/resources/texts/phone',
    'common/ko/validate/utilities/phoneMethods',
    'common/utilities/stringExtension',
    'common/ko/validate/utilities/paramsFactories',
    'common/ko/validate/koValidationMethods',
    'common/ko/globals/multiLanguageObservable'
],
    function (regexSource, resources, phoneMethods, stringExtension, createFactories) {//eslint-disable-line max-params

        var messages = ko.multiLanguageObservable({ resource: resources });
        var factories = createFactories(messages);
        var validationParamsFactory = factories.validationParamsFactory;
        var lengthNumbersEnums = {
            nine: 9,
            ten: 10,
            eleven: 11,
            twelve: 12,
            thrteen: 13
        };
        var setvalidationParams = function (target, messageType, ruleType) {//eslint-disable-line max-params
            if (regexSource.phoneNineDigits.test(target()) && ruleType !== 'mobile') {
                messageType('nineDigitsLengthNumber');
            }
            else if (regexSource.phoneTenDigits.test(target())) {
                messageType('tenDigitsLengthNumber');
            }
            else if (regexSource.phoneTwelveDigits.test(target()) && ruleType === 'fax') {
               messageType('twelveDigitsLengthNumber');
            }
        };


        function updateExtenderValue(target, phoneType, setvalidationParamsCallbak) {
            target.subscribe(function (newValue) {
                newValue = phoneMethods.displayPhoneNumber(newValue, phoneType);
                target(newValue);
                if (setvalidationParamsCallbak) {
                    setvalidationParamsCallbak();
                }
            });
        }

        ko.validation.rules.areaCodes = {
            validator: function (val, params) {
                if (val) {
                    return phoneMethods.isAreaCodeValid(val, params.phoneType);
                }
                return true;
            },
            message: function () {
                return messages().areaCodeNotExist;
            }
        };
        ko.validation.rules.phoneNumberRule = {
            validator: function (val) {
                if (val) {
                    return regexSource.phoneOrMobile.test(val);
                }
                return true;
            },
            message: function (params) {
                return messages()[phoneMethods.getPhoneType(params.phoneType)];
            }
        };

        ko.validation.rules.faxNumberRule = {
            validator: function (val) {
                if (val) {
                    return regexSource.phoneNumber153.test(val) || regexSource.phoneOrMobile.test(val);
                }
                return true;
            },
            message: function (params) {
                return messages()[phoneMethods.getPhoneType(params.phoneType)];
            },
            ruleName: 'phoneNumber'
        };

        ko.validation.rules.phoneValidChars = {
            validator: function (val) {
                if (val) {
                    return regexSource.phoneValidChars.test(val);
                }
                return true;
            },
            message: function () {
                return messages().phoneValidChars;
            },
            ruleName: 'phoneValidChars'
        };

        ko.extenders.phoneNumber = function (target, params) {
            var phoneType = phoneMethods.phoneTypeEnum.phoneNumber;
            var minLengthValue = ko.observable(lengthNumbersEnums.nine),
                maxLengthValue = ko.observable(lengthNumbersEnums.eleven),
                messageType = ko.observable('phoneValidation');

            var phoneValidationParams = function () {
                setvalidationParams(target, messageType, 'phone');
            };

            updateExtenderValue(target, phoneType, phoneValidationParams);
            target.extend({
                phoneValidChars: validationParamsFactory(params, {}, ''),
                areaCodes: validationParamsFactory(params, { phoneType: phoneType }, ''),
                minLength: validationParamsFactory(params, minLengthValue, messageType),
                maxLength: validationParamsFactory(params, maxLengthValue, messageType),//eslint-disable-line no-magic-numbers
                pattern: validationParamsFactory(params, regexSource.phoneOrMobile, 'phoneValidation')
            });
            return target;
        };

        ko.extenders.mobile = function (target, params) {
            var phoneType = phoneMethods.phoneTypeEnum.mobile;

            var minLengthValue = ko.observable(lengthNumbersEnums.ten),
                maxLengthValue = ko.observable(lengthNumbersEnums.eleven),
                messageType = ko.observable('phoneValidation');

            var mobileValidationParams = function () {
                setvalidationParams(target, messageType, 'mobile');
            };

            updateExtenderValue(target, phoneType, mobileValidationParams);
            target.extend({
                phoneValidChars: validationParamsFactory(params, {}, ''),
                areaCodes: validationParamsFactory(params, { phoneType: phoneType }, ''),
                minLength: validationParamsFactory(params, minLengthValue, messageType),
                maxLength: validationParamsFactory(params, maxLengthValue, messageType),//eslint-disable-line no-magic-numbers
                pattern: validationParamsFactory(params, regexSource.phoneOrMobile, 'phoneValidation')
            });
            return target;
        };

        ko.extenders.phoneOrMobile = function (target, params) {
            var phoneType = phoneMethods.phoneTypeEnum.phoneOrMobile;
            var minLengthValue = ko.observable(lengthNumbersEnums.nine),
                maxLengthValue = ko.observable(lengthNumbersEnums.eleven),
                messageType = ko.observable('phoneValidation');

            var phoneOrMobileValidationParams = function () {
                setvalidationParams(target, messageType, 'phoneOrMobile');
            };
            updateExtenderValue(target, phoneType, phoneOrMobileValidationParams);
            target.extend({
                phoneValidChars: validationParamsFactory(params, {}, ''),
                areaCodes: validationParamsFactory(params, { phoneType: phoneType }, ''),//??? target: target
                minLength: validationParamsFactory(params, minLengthValue, messageType),
                maxLength: validationParamsFactory(params, maxLengthValue, messageType),//eslint-disable-line no-magic-numbers
                pattern: validationParamsFactory(params, regexSource.phoneOrMobile, 'phoneValidation')
            });
            return target;
        };

        ko.extenders.internationalPhone = function (target) {
            target.extend({
                pattern: {
                    params: regexSource.internationalPhone,
                    message: function () {
                        return messages().internationalPhone;
                    }
                }
            });
            return target;
        };

        ko.extenders.fax = function (target, params) {
            var phoneType = phoneMethods.phoneTypeEnum.fax;
            var minLengthValue = ko.observable(lengthNumbersEnums.nine),
                maxLengthValue = ko.observable(lengthNumbersEnums.thrteen),
                messageType = ko.observable('phoneValidation');

            var faxValidationParams = function () {
                setvalidationParams(target, messageType, 'fax');
            };
            updateExtenderValue(target, phoneType, faxValidationParams);
            target.extend({
                phoneValidChars: validationParamsFactory(params, {}, ''),
                areaCodes: validationParamsFactory(params, { phoneType: phoneType }, ''),
                minLength: validationParamsFactory(params, minLengthValue, messageType),
                maxLength: validationParamsFactory(params, maxLengthValue, messageType),//eslint-disable-line no-magic-numbers
                faxNumberRule: validationParamsFactory(params, regexSource.phoneOrMobile, 'phoneValidation')
            });
            return target;
        };

        ko.validation.registerExtenders();
    });