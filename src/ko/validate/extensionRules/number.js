/**
* @description sub objects to validate numeric inputs.
* built as ko.extenders that are to be linked to an observable
* checks validation on the observable and in case of failure returns a proper error message.
* @module number
* @example Example usage of validate field using ko.validation
* var sampleInput = ko.observable().extend({ decimal: true });
* sampleInput(62);
*/


define(['common/resources/regularExpressions',
        'common/resources/texts/number',
        'common/utilities/stringExtension',
        'common/core/exceptions',
        'common/utilities/tryParse',
        'common/resources/exeptionMessages',
        'common/ko/validate/utilities/paramsFactories',
        'common/ko/validate/koValidationMethods',
        'common/ko/globals/multiLanguageObservable'
],
    function (regexSource, resources, stringExtension, formExceptions, parser, exceptionToThrow, createFactories) {//eslint-disable-line max-params

        var messages = ko.multiLanguageObservable({ resource: resources });
        var factories = createFactories(messages);
        //var validationMessageFactory = factories.validationMessageFactory;
        var validationParamsFactory = factories.validationParamsFactory;

        ko.validation.rules.decimalWithParamRule = {
            validator: function (val, params) {
                params = params.params || params;
                if (!val) {
                    return true;
                }
                var reg = stringExtension.format(regexSource.decimalWithParam.toString(), [params.beforePoint, params.afterPoint]);
                return val.toString().match(reg) !== null;
            },
            message: function (params) {
                params = params.params || params;
                return params.message || stringExtension.format(messages().decimalWithParam, [ko.unwrap(params.beforePoint), ko.unwrap(params.afterPoint)]);
            },
            ruleName: 'decimal'
        };

         /* @memberof ko         
         * @function "ko.extenders.integer"
         * @description extender to validate input is numeric
         * @example  
         * var sampleNum = ko.observable().extend({ integer: true });
         * sampleUrl(2);
         */
        ko.extenders.integer = function (target, params) {
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.integer, 'integer'),
                number: validationParamsFactory(params, true, 'integer')
            });
            return target;
        };

      /* @memberof ko         
      * @function "ko.extenders.decimal"
      * @description extender to validate input is decimal 
      * @example  
      * var sampleNum = ko.observable().extend({ decimal: true });
      * sampleUrl(2.4);
      */
        ko.extenders.decimal = function (target, params) {
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.decimal, 'decimal')
            });
            return target;
        };

     /* @memberof ko         
     * @function "ko.extenders.onlyDecimal"
     * @description extender to validate input is decimal
     * @example  
     * var sampleNum = ko.observable().extend({ onlyDecimal: true });
     * onlyDecimal(2);
     */
        ko.extenders.onlyDecimal = function (target, params) {
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.onlyDecimal, 'decimal'),
                //number: true,
                minLength: validationParamsFactory(params, 3, '')
            });
            return target;
        };
     
         /* @memberof ko         
         * @function "ko.extenders.signedNumber"
         * @description extender to validate input is a signed number
         * @example  
         * var sampleNum = ko.observable().extend({ signedNumber: true });
         * onlyDecimal(-2);
         */
        ko.extenders.signedNumber = function (target, params) {
            params = params || {};
            target.extend({
                pattern: validationParamsFactory(params, regexSource.signedNumber, 'signedNumber')
                //number: true
            });
        };


       /* @memberof ko         
       * @function "ko.extenders.decimalWithParam"
       * @description extender to validate input is a decimal number with specific number of digits before and after the point
       * @param {object} params
       * @param {int} params.beforePoint - represents the number of digits allowed before point
       * @param {int} params.afterPoint - represents the number of digits allowed after point
       *  @example  
       * var sampleNum = ko.observable().extend({ decimalWithParam: { beforePoint: 1, afterPoint: 2 }  });
       * onlyDecimal(1.54);
       */
        ko.extenders.decimalWithParam = function (target, params) { //eslint-disable-line complexity
            params = params || {};

            try {
                var beforePoint = parser('int', params.params ? ko.unwrap(params.params.beforePoint) : ko.unwrap(params.beforePoint)),
                    afterPoint = parser('int', params.params ? ko.unwrap(params.params.afterPoint) : ko.unwrap(params.afterPoint));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'decimalWithParam'));
            }

            target.extend({
                decimal: validationParamsFactory(params, true, ''),
                decimalWithParamRule: validationParamsFactory(params, { beforePoint: beforePoint, afterPoint: afterPoint }, ''),
                maxLength: validationParamsFactory(params, beforePoint + afterPoint + 1, '')
            });
        };

      /* @memberof ko         
      * @function "ko.extenders.range"
      * @description extender to validate input is a numeric input is within a given range
      * @param {object} params
      * @param {int} params.min - min value allowed in input
      * @param {int} params.max - max value allowed in input
      *  @example  
      * var sampleNum = ko.observable().extend({ range: {min:2,max:5} });
      * sampleNum(3);
      */
        ko.extenders.range = function (target, params) { //eslint-disable-line complexity
            params = params || {};

            var min = params.params ?params.params.min : params.min;
            var max = params.params ?params.params.max : params.max;
            (function () {
                try {
                    parser('int', ko.unwrap(min));
                    parser('int', ko.unwrap(max));
                } catch (e) {
                    formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'range'));
                }
            })();
            target.extend({
                number: validationParamsFactory(params, true, ''),
                min: validationParamsFactory(params, min, ''),
                max: validationParamsFactory(params, max, '')
            });
            return target;
        };


         /* @memberof ko         
         * @function "ko.extenders.greaterThan"
         * @description extender to validate input is greater then give number
         * @param {object} params
         *  @example  
         * var sampleNum = ko.observable().extend({ greaterThan:5 });
         * sampleNum(8);
         */
        ko.extenders.greaterThan = function (target, params) {
            params = params && typeof params === 'object' ? params : { params: params };

            target.extend({
                number: validationParamsFactory(params, true, ''),
                greaterThanRule: validationParamsFactory(params, params.params, '')
            });
            return target;
        };


        ko.validation.rules.greaterThanRule = {
            validator: function (val, number) {
                if (ko.validation.utils.isEmptyVal(number) || isNaN(number.toString())) {
                    return true;
                }
                number = parseFloat(number);
                val = parseFloat(val);
                if (isNaN(val)) {
                    return true;
                }
                return val > number;
            }
            ,
            message: function (params) {
                params = params.params || params;
                return params.message || stringExtension.format(messages().greaterThan, [ko.unwrap(params)]);
            }
        };


         /* @memberof ko         
         * @function "ko.extenders.lessThan"
         * @description extender to validate input is less then give number
         * @param {object} params
         *  @example  
         * var sampleNum = ko.observable().extend({ lessThan:5 });
         * sampleNum(3);
         */
        ko.extenders.lessThan = function (target, params) {
            params = params && typeof params === 'object' ? params : { params: params };
            target.extend({
                number: validationParamsFactory(params, true, ''),
                lessThanRule: validationParamsFactory(params, params.params, '')
            });
            return target;
        };


        ko.validation.rules.lessThanRule = {
            validator: function (val, number) {
                if (ko.validation.utils.isEmptyVal(number) || isNaN(number.toString())) {
                    return true;
                }
                number = parseFloat(number);
                val = parseFloat(val);
                if (isNaN(val)) {
                    return true;
                }
                return val < number;
            },
            message: function (params) {
                params = params.params || params;
                return params.message || stringExtension.format(messages().lessThan, [ko.unwrap(params)]);
            }
        };

        ko.validation.registerExtenders();

    });