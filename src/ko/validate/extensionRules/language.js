define(['common/resources/regularExpressions',
    'common/resources/texts/language',
    'common/ko/validate/utilities/paramsFactories',
    'common/ko/validate/koValidationMethods',
    'common/ko/globals/multiLanguageObservable'
],
function (regexSource, resources, createFactories) {//eslint-disable-line max-params


    var messages = ko.multiLanguageObservable({ resource: resources });
    var factories = createFactories(messages);
    var validationMessageFactory = factories.validationMessageFactory;
    var validationParamsFactory = factories.validationParamsFactory;

    ko.validation.rules.letters = {
        validator: function (val) {
            if (val) {
                var regex = regexSource.hebrew;
                return val.toString().match(regex) !== null;
            }
            return true;
        },
        message: validationMessageFactory('hebrew')
    };
    ko.validation.rules.apostropheAfterLetters = {
        validator: function (val) {
            if (val) {
                var regex = regexSource.apostropheAfterLetters;
                return val.toString().match(regex) === null;
            }
            return true;
        },
        message: validationMessageFactory('apostropheAfterLetters')

    };
    ko.validation.rules.finalLetters = {
        validator: function (val) {
            if (val) {
                var regex = regexSource.finalLetters;
                return val.toString().match(regex) === null;
            }
            return true;
        },
        message: validationMessageFactory('finalLetters')
    };

    ko.validation.rules.noApostrophe = {
        validator: function (val) {
            if (val) {
                var regex = regexSource.apostrophe;
                return val.toString().match(regex) !== null;
            }
            return true;
        },
        message: validationMessageFactory('noApostrophe')
    };

    ko.validation.rules.noFinalLetters = {
        validator: function (val) {
            if (val) {
                var regex = regexSource.onlyFinalLetters;
                return val.toString().match(regex) === null;
            }
            return true;
        },
        message: validationMessageFactory('noFinalLetters')
    };

    ko.validation.rules.startWithDigit = {
        validator: function (val) {
            if (val) {
                return regexSource.startWithDigit.test(val);
            }
            return true;
        },
        message: validationMessageFactory('startWithDigit')
    };

    /* @memberof ko         
    * @function "ko.extenders.hebrew"
    * @description extender to validate hebrew input 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ hebrew: null });
    * sampleDate('אטאטא');
    */
    ko.extenders.hebrew = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.hebrew, 'hebrew')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.hebrewNumber"
    * @description extender to validate hebrew and numeric input 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ hebrewNumber: null });
    * sampleDate('אטאטא333');
    */
    ko.extenders.hebrewNumber = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.hebrewNumber, 'hebrewNumber')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.hebrewExtended"
    * @description extender to validate hebrew, numeric, and with special chars input 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ hebrewExtended: null });
    * sampleDate('אטאטא$$$333');
    */
    ko.extenders.hebrewExtended = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.hebrewExtended, 'hebrewExtended')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.freeHebrew"
    * @description extender to validate hebrew, numeric, and with special chars input 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ freeHebrew: true });
    * sampleDate('א'טאטא33');
    */
    ko.extenders.freeHebrew = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.freeHebrew, 'freeHebrew'),
            apostropheAfterLetters: validationParamsFactory(params, true, ''),
            finalLetters: validationParamsFactory(params, true, '')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.noHebrewLetters"
    * @description extender to validate english, numeric, chars input, and no hebrew letters 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ noHebrewLetters: null });
    * sampleDate('ffgfhg$$$333');
    */
    ko.extenders.noHebrewLetters = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.noHebrewLetters, 'noHebrewLetters')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.english"
    * @description extender to validate english input 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ english: null });
    * sampleDate('abdh');
    */
    ko.extenders.english = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.english, 'english')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.englishNumber"
    * @description extender to validate english and numeric input 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ englishNumber: null });
    * sampleDate('אטאטא333');
    */
    ko.extenders.englishNumber = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.englishNumber, 'englishNumber')
        });
        return target;
    };

    /* @memberof ko         
 * @function "ko.extenders.englishHebrewNumber"
 * @description extender to validate english and hebrew and numeric input 
 * checks validation on the observable and in case of failure applies a proper error message.
 * @example  
 * var sampleValue = ko.observable().extend({ englishHebrewNumber: true });
 * sampleDate('אטאטfggא333');
 */

    ko.extenders.englishHebrewNumber = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.englishHebrewNumber, 'englishHebrewNumber')
        });
        return target;
    };

    ko.extenders.englishExtended = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.englishExtended, 'englishExtended')
        });
        return target;
    };

    ko.extenders.englishHebrew = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.englishHebrew, 'englishHebrew')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.fileName"
    * @description extender to validate file name
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ fileName: true });
    * sampleDate('myPic.jpg');
    */
    ko.extenders.fileName = function (target, params) {
        params = params || {};
        target.extend({
            pattern: validationParamsFactory(params, regexSource.fileName, 'fileName')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.freeText"
    * @description extender to validate free text (in text area)
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleValue = ko.observable().extend({ freeText: true });
    * sampleDate('my free/n text');
    */
    ko.extenders.freeText = function (target, params) {
        params = params || {};
        target.extend({
            minLength: validationParamsFactory(params, 2, ''),
            finalLetters: validationParamsFactory(params, true, ''),
            pattern: validationParamsFactory(params, regexSource.freeText, 'freeText')
        });
        return target;
    };

    ko.validation.registerExtenders();

});