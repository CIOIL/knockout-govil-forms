/**
* @description sub objects to validate personal details.
* built as ko.extenders that are to be linked to an observable
* checks validation on the observable and in case of failure returns a proper error message.
* @module validatePersonalDetails
* @example Example usage of validate field using ko.validation
* var sampleID = ko.observable().extend({ idNum: null });
* sampleID('000000018');
*/

define(['common/resources/regularExpressions',
        'common/resources/texts/personalDetails',
        'common/ko/validate/utilities/paramsFactories',
        'common/ko/validate/koValidationMethods',
        'common/ko/globals/multiLanguageObservable',
        'common/utilities/reflection',
        'common/ko/validate/extensionRules/number',
        'common/ko/validate/extensionRules/general',
        'common/ko/validate/extensionRules/language'
],
    function (regexSource, resources, createFactories) {

        var messages = ko.multiLanguageObservable({ resource: resources });

        var factories = createFactories(messages);
        var validationParamsFactory = factories.validationParamsFactory;
        function checkVal(valueID) {
            return (isNaN(valueID) || Number(valueID) <= 0 || valueID.length > 9);
        }

        function isValidID(valueID) { //TODO: check this function
            if (checkVal(valueID)) {
                return false;
            }
            var sum = 0;
            var arrChars = valueID.split('');
            //text = text.padLeft(text, '0');
            for (var i = 0; i < arrChars.length; i++) {
                var temp = Number(arrChars[i]) * ((i % 2) + 1);
                sum += Math.floor(temp / 10) + temp % 10;
            } 
            return (sum % 10) === 0;
        }

        ko.validation.rules.idNumOrPassportRule = {
            validator: function (val, type) {
                if (val) {
                    if (type === '1') {
                        return isValidID(val);
                    }
                    else {
                        return regexSource.passport.test(val);
                    }
                }
                return true;
            },
            message: function (type) {
                return type === '1' ? messages().idNum : messages().passport;
            }
        };

        ko.validation.rules.idNumRule = {
            validator: function (val) {
                if (val) {
                    return isValidID(val);
                }
                return true;
            },
            message: function () {
                return messages().idNum;
            },
            ruleName: 'idNum'
        };

        ko.extenders.israeliPassport = function (target, params) {
            params = params || {
            };

            target.extend({
                integer: validationParamsFactory(params, true, 'israeliPassport'),
                maxLength: validationParamsFactory(params, 8, 'israeliPassport'),
                minLength: validationParamsFactory(params, 7, 'israeliPassport')
            });
        };

        ko.extenders.foreignPassport = function (target, params) {
            params = params || {
            };

            target.extend({
                pattern: validationParamsFactory(params, regexSource.passport, 'foreignPassport'),
                maxLength: validationParamsFactory(params, 10, 'foreignPassport')
            });
        };

        ko.extenders.idNum = function (target, params) {
            target.extend({
                number: validationParamsFactory(params, true, ''),
                idNumRule: validationParamsFactory(params, true, ''),
                length: validationParamsFactory(params, 9, 'idNum')
            });
        };

        ko.extenders.idNumOrPassport = function (target, params) { //eslint-disable-line complexity
            params = params || {
            };
            var type = params.params ? params.params : params;
            var isTypeId = ko.computed(function () {
                if (params.onlyIf) {
                    return ko.unwrap(params.onlyIf) && ko.unwrap(type) === '1';
                }
                return ko.unwrap(type) === '1';
            });
            var isTypePassport = ko.computed(function () {
                if (params.onlyIf) {
                    return ko.unwrap(params.onlyIf) && ko.unwrap(type) === '1';
                }
                return ko.unwrap(type) === '2';

                //return ko.unwrap(params.onlyIf) && ko.unwrap(params.type) === '2';
            });
            var maxLength = ko.computed(function () {
                return isTypeId() ? 9 : 10;
            });
            var minLength = ko.computed(function () {
                return isTypeId() ? 9 : 1;
            });
            var message = function () {
                return isTypeId() ? messages().idNum : messages().foreignPassport;
            };
            target.extend({
                minLength: validationParamsFactory({ onlyIf: params.onlyIf, message: params.message || message }, minLength, ''),
                maxLength: validationParamsFactory({ onlyIf: params.onlyIf, message: params.message || message }, maxLength, ''),
                idNum: validationParamsFactory({ onlyIf: isTypeId, message: params.message, ruleName: 'idNum' }, true, ''),
                foreignPassport: validationParamsFactory({ onlyIf: isTypePassport, message: params.message }, true, '')
            });
        };

        ko.extenders.englishName = function (target, params) {
            params = params || {
            };
            var twentyFive = 25;
            target.extend({
                noApostrophe: validationParamsFactory(params, true, ''),
                pattern: validationParamsFactory(params, regexSource.englishName, 'englishName'),
                maxLength: validationParamsFactory(params, twentyFive, ''),
                minLength: validationParamsFactory(params, 2, '')
            });
        };

        ko.extenders.hebrewName = function (target, params) {
            params = params && typeof params === 'object' ? params : {
                params: params
            };
            params.ruleName = 'hebrewName';
            var twentyFive = 25;
            target.extend({
                hebrew: validationParamsFactory(params, true, ''),
                apostropheAfterLetters: validationParamsFactory(params, true, ''),
                finalLetters: validationParamsFactory(params, true, ''),
                minLength: validationParamsFactory(params, 2, ''),
                maxLength: validationParamsFactory(params, twentyFive, '')
            });
            return target;
        };

        ko.extenders.militaryIdNumber = function (target, params) {
            params = params || {
            };
            target.extend({
                integer: validationParamsFactory(params, true, 'militaryIdNumber'),
                length: validationParamsFactory(params, 7, 'militaryIdNumber')
            });
            return target;
        };

        ko.extenders.cp = function (target, params) {
            params = params || {
            };
            target.extend({
                pattern: validationParamsFactory(params, regexSource.cp, 'cp'),
                length: validationParamsFactory(params, 9, '')
            });
        };

        ko.extenders.npo = function (target, params) {
            params = params || {
            };
            target.extend({
                pattern: validationParamsFactory(params, regexSource.npo, 'npo'),
                length: validationParamsFactory(params, 9, '')
            });
        };

        ko.extenders.passport = function (target, params) {
            params = params || {
            };
            target.extend({
                foreignPassport: validationParamsFactory(params, true, '')
            });
        };

        ko.extenders.soleTrader = function (target, params) {
            params = params && typeof params === 'object' ? params : { params: params };
            params.ruleName = params.ruleName || 'soleTrader';
            target.extend({
                number: validationParamsFactory(params, true, ''),
                idNum: validationParamsFactory(params, true, 'soleTrader')
            });
        };

        ko.extenders.carNumber = function (target, params) {
            params = params || {
            };
            target.extend({
                integer: validationParamsFactory(params, true, 'carNumber'),
                maxLength: validationParamsFactory(params, 8, 'carNumber'),
                minLength: validationParamsFactory(params, 5, 'carNumber')
            });
        };

        ko.validation.registerExtenders();

        return {
            isValidID: isValidID
        };
    });

