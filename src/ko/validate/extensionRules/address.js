define(['common/resources/regularExpressions',
    'common/resources/texts/address',
    'common/ko/validate/utilities/paramsFactories',
    'common/ko/validate/koValidationMethods',
    'common/ko/validate/extensionRules/number',
    'common/ko/validate/extensionRules/general',
    'common/ko/validate/extensionRules/language',
    'common/ko/globals/multiLanguageObservable'
],
    function (regexSource, resources, createFactories) {

        var messages = ko.multiLanguageObservable({ resource: resources });
        var factories = createFactories(messages);
        var validationParamsFactory = factories.validationParamsFactory;
        var validationMessageFactory = factories.validationMessageFactory;

        /*eslint-disable valid-jsdoc*/
        /**
        * @memberof ko
        * @function "ko.extenders.url"
        * @description extender to validate url field 
        * checks validation on the observable and in case of failure applies a proper error message.
        * @example  
        * var sampleUrl = ko.observable().extend({ url: true });
        * sampleUrl('www.example.com');
        */
        ko.extenders.url = function (target, params) {
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.url, 'url'),
                minLength: validationParamsFactory(params, 4, 'url')
            });
            return target;
        };

        /**     
        * @memberof ko         
        * @function "ko.extenders.email"
        * @description extender to validate email field 
        * checks validation on the observable and in case of failure applies a proper error message.
        * @example  
        * var sampleEmail = ko.observable().extend({ email: true });
        * sampleEmail('example@email.com');
        */
        ko.extenders.email = function (target, params) {
            var nim = 6, max = 50;
            params = params || {};
            target.extend({
                minLength: validationParamsFactory(params, nim, ''),
                maxLength: validationParamsFactory(params, max, ''),
                pattern: validationParamsFactory(params, regexSource.email, 'email')
            });
            return target;
        };

        /**     
        * @memberof ko         
        * @function "ko.extenders.IPAddress"
        * @description extender to validate IP field 
        * checks validation on the observable and in case of failure applies a proper error message.
        * @example  
        * var sampleIP = ko.observable().extend({ IPAddress: null });
        * sampleIP('10.101.101.70');
        */
        ko.extenders.IPAddress = function (target, params) {
            var min = 7, max = 19;
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.IPAddresses, 'IPAddress'),
                minLength: validationParamsFactory(params, min, ''),
                maxLength: validationParamsFactory(params, max, '')
            });
            return target;
        };
        /**     
         * @memberof ko         
         * @function ko.validation.rules.isUnique
         * @description rule to validate that a value is unique for all rows in a given array
         * @param {object} params -
         * @param {array} params.getUniqueItem - arrow function to fetch the right field 
         */
        ko.validation.rules.notZeroDigits = {
            validator: function (val) {
                if (val) {
                    return ! regexSource.zeroDigits.test(val);
                }
                return true;
            },
            message: validationMessageFactory('zeroDigits'),
            ruleName: 'notZeroDigits'
        };
        ko.validation.rules.startWithZero = {
            validator: function (val) {
                if (val) {
                    return !regexSource.startWithZero.test(val);
                }
                return true;
            },
            message: validationMessageFactory('startWithZero'),
            ruleName: 'startWithZero'
        };
        /**     
        * @memberof ko         
        * @function "ko.extenders.houseNumber"
        * @description extender to validate houseNumber field 
        * checks validation on the observable and in case of failure applies a proper error message.
        * @example  
        * var sampleHouseNumber = ko.observable().extend({ houseNumber: true });
        * sampleHouseNumber('19א');
        */
        ko.extenders.houseNumber = function (target, params) {
            params = params || {};
            target.extend({
                notZeroDigits: validationParamsFactory(params, true, ''),
                startWithZero: validationParamsFactory(params, true, ''),
                noFinalLetters: validationParamsFactory(params, true, ''),
                startWithDigit: validationParamsFactory(params, true, ''),
                pattern: validationParamsFactory(params, regexSource.houseNumber, 'houseNumber'),
                maxLength: validationParamsFactory(params, 4, 'houseNumber')
            });
            return target;
        };

        /**     
        * @memberof ko         
        * @function "ko.extenders.street"
        * @description extender to validate street field 
        * checks validation on the observable and in case of failure applies a proper error message.
        * @example  
        * var sampleStreet = ko.observable().extend({ street: true });
        * sampleStreet('דוגמא');
        */
        ko.extenders.street = function (target, params) {
            var min = 2, max = 25;
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.street, 'street'),
                apostropheAfterLetters: validationParamsFactory(params, true, ''),
                finalLetters: validationParamsFactory(params, true, ''),
                minLength: validationParamsFactory(params, min, ''),
                maxLength: validationParamsFactory(params, max, '')
            });
            return target;
        };


        /**     
        * @memberof ko         
        * @function "ko.extenders.city"
        * @description extender to validate city field 
        * checks validation on the observable and in case of failure applies a proper error message.
        * @example  
        * var sampleCity = ko.observable().extend({ city: true });
        * sampleCity('דוגמא');
        */
        ko.extenders.city = function (target, params) {
            var min = 2, max = 25;
            params = params || {};
            target.extend({
                hebrew: validationParamsFactory(params, true, ''),
                apostropheAfterLetters: validationParamsFactory(params, true, ''),
                finalLetters: validationParamsFactory(params, true, ''),
                minLength: validationParamsFactory(params, min, ''),
                maxLength: validationParamsFactory(params, max, '')
            });
            return target;
        };

        /**     
         * @memberof ko         
         * @function "ko.extenders.zipCode"
         * @description extender to validate zipCode field 
         * checks validation on the observable and in case of failure applies a proper error message.
         * @example  
         * var sampleZipCode = ko.observable().extend({ zipCode: true });
         * sampleZipCode('1234567');
         */
        ko.extenders.zipCode = function (target, params) {
            params = params || {};
            target.extend({
                notZeroDigits: validationParamsFactory(params, true, ''),
                integer: validationParamsFactory(params, true, 'zipCode'),
                length: validationParamsFactory(params, 7, 'zipCode')
            });
            return target;
        };

        /**     
       * @memberof ko         
       * @function "ko.extenders.apartment"
       * @description extender to validate apartment field 
       * checks validation on the observable and in case of failure applies a proper error message.
       * @example  
       * var sampleAparatment = ko.observable().extend({ apartment: true });
       * sampleAparatment('3');
       */

        ko.extenders.apartment = function (target, params) {
            params = params || {};
            target.extend({
                integer: validationParamsFactory(params, true, 'apartment'),
                maxLength: validationParamsFactory(params, 4, 'apartment')
            });
            return target;
        };

        /**     
      * @memberof ko         
      * @function "ko.extenders.mailbox"
      * @description extender to validate mailbox field 
      * checks validation on the observable and in case of failure applies a proper error message.
      * @example  
      * var sampleMailbox = ko.observable().extend({ mailbox: true });
      * sampleMailbox('721');
      */
        ko.extenders.mailbox = function (target, params) {
            params = params || {};
            target.extend({
                integer: validationParamsFactory(params, true, 'mailbox'),
                maxLength: validationParamsFactory(params, 5, 'mailbox'),
                minLength: validationParamsFactory(params, 2, 'mailbox')
            });
            return target;
        };
        ko.validation.registerExtenders();
    });