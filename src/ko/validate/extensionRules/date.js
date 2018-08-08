
define(['common/components/formInformation/formInformationViewModel',
        'common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/resources/regularExpressions',
        'common/resources/texts/date',
        'common/utilities/stringExtension',
        'common/utilities/dateMethods',
        'common/utilities/tryParse',
        'common/ko/validate/utilities/paramsFactories',
        'common/ko/validate/koValidationMethods',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/validate/extensionRules/general',
        'common/external/date'
],
    function (formInformation, formExceptions, exceptionToThrow, regexSource, resources, stringExtension, dateMethods, parser, createFactories) { //eslint-disable-line max-params

        var messages = ko.multiLanguageObservable({ resource: resources.errors });
        var labels = ko.multiLanguageObservable({ resource: resources.labels });

        var factories = createFactories(messages);
        var validationParamsFactory = factories.validationParamsFactory;


        function isEmptyObservable(param) {
            return ko.isObservable(param) && (!ko.unwrap(param) || param.isValid && !param.isValid());
        }

        String.prototype.addPrefix = function (char) { //eslint-disable-line
            return char + this;
        };

        ko.validation.rules.dateRule = {
            validator: function (val) {
                if (val) {
                    return dateMethods.isDate(val);
                }
                return true;
            },
            message: function () {
                return messages().date;
            }
        };

        ko.validation.rules.dateInPattern = {
            validator: function (val) {
                if (val) {
                    return regexSource.datePattern.test(val);
                }
                return true;
            },
            message: function () {
                return messages().dateInPattern;
            }
        };

        ko.validation.rules.pastDateRule = {
            validator: function (val, params) {
                params = params.params || params;
                //!params || typeof params !== 'object' ? {} : params;
                if (!params.compareTo) {
                    return dateMethods.pastDate(val, {
                        compareTo: new Date()
                    });
                }
                if (isEmptyObservable(params.compareTo)) {
                    return true;
                }
                return dateMethods.pastDate(val, params);
            },
            message: function (params) { //eslint-disable-line complexity
                params = params.params || params;
                var messageCompare;
                if (!params || !params.compareTo) {
                    messageCompare = labels().today;
                }
                else {
                    messageCompare = params.compareToName || ko.unwrap(params.compareTo).toString('d/M/yyyy').addPrefix('-');
                }
                return stringExtension.format(messages().pastDate, messageCompare);
            }
        };

        ko.validation.rules.futureDateRule = {
            validator: function (val, params) {
                params = params.params || params;
                // params = !params || typeof params !== 'object' ? {} : params;
                if (!params.compareTo) {
                    return dateMethods.futureDate(val, { compareTo: new Date() });
                }
                if (isEmptyObservable(params.compareTo)) {
                    return true;
                }
                return dateMethods.futureDate(val, params);
            },
            message: function (params) { //eslint-disable-line complexity
                params = params.params || params;
                var messageCompare;
                if (!params || !params.compareTo) {
                    messageCompare = labels().today;
                }
                else {
                    messageCompare = params.compareToName || ko.unwrap(params.compareTo).toString('d/M/yyyy').addPrefix('-');
                }
                return stringExtension.format(messages().futureDate, messageCompare);
            }
        };

        ko.validation.rules.sinceDateRule = {
            validator: function (val, params) {
                params = params.params || params;
                // params = !params || typeof params !== 'object' ? {} : params;
                if (!params.compareTo) {
                    return dateMethods.sinceDate(val, { compareTo: new Date() });
                }
                if (isEmptyObservable(params.compareTo)) {
                    return true;
                }
                return dateMethods.sinceDate(val, params);
            },
            message: function (params) { //eslint-disable-line complexity
                params = params.params || params;
                var messageCompare;
                if (!params || !params.compareTo) {
                    messageCompare = labels().today;
                }
                else {
                    messageCompare = params.compareToName || ko.unwrap(params.compareTo).toString('d/M/yyyy').addPrefix('-');
                }
                return stringExtension.format(messages().sinceDate, messageCompare);
            }
        };

        ko.validation.rules.untilDateRule = {
            validator: function (val, params) {
                params = params.params || params;
                // params = !params || typeof params !== 'object' ? {} : params;
                if (!params.compareTo) {
                    return dateMethods.untilDate(val, { compareTo: new Date() });
                }
                if (isEmptyObservable(params.compareTo)) {
                    return true;
                }
                return dateMethods.untilDate(val, params);
            },
            message: function (params) { //eslint-disable-line complexity
                params = params.params || params;
                var messageCompare;
                if (!params || !params.compareTo) {
                    messageCompare = labels().today;
                }
                else {
                    messageCompare = params.compareToName || ko.unwrap(params.compareTo).toString('d/M/yyyy');
                }
                return stringExtension.format(messages().untilDate, messageCompare);
            }
        };

        ko.validation.rules.between2DatesRule = {
            validator: function (val, params) { //eslint-disable-line
                params = params.params || params;
                if (params) {
                    if (isEmptyObservable(params.fromDate) && isEmptyObservable(params.toDate)) {
                        return true;
                    }
                    if (isEmptyObservable(params.fromDate)) {
                        return dateMethods.pastDate(val, { compareTo: params.toDate });
                    }
                    if (isEmptyObservable(params.toDate)) {
                        return dateMethods.futureDate(val, { compareTo: params.fromDate });
                    }
                    return dateMethods.between2Dates(val, params);
                }
            },
            message: function (params) { //eslint-disable-line complexity
                params = params.params || params;
                var messageFrom = params.fromName || ko.unwrap(params.fromDate);
                var messageTo = params.toName || ko.unwrap(params.toDate);
                if (isEmptyObservable(params.fromDate)) {
                    return stringExtension.format(messages().pastDate, messageTo);
                }
                if (isEmptyObservable(params.toDate)) {
                    return stringExtension.format(messages().futureDate, messageFrom);
                }
                return stringExtension.format(messages().between2Dates, [messageFrom, messageTo]);
            }
        };

        ko.validation.rules.isYoungerRule = {
            validator: function (val, params) {
                params = params.params || params;
                return dateMethods.isYounger(val, params);
            },
            message: function (params) {
                params = params.params || params;
                try {
                    parser('string', (ko.unwrap(params.subject)));

                } catch (e) {
                    formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'isYounger'));
                }
                return stringExtension.format(messages().isYounger, [ko.unwrap(params.subject), ko.unwrap(params.age)]);
            }
        };

        ko.validation.rules.isOlderRule = {
            validator: function (val, params) {
                params = params.params || params;
                return dateMethods.isOlder(val, params);
            },
            message: function (params) {
                params = params.params || params;
                try {
                    parser('string', (ko.unwrap(params.subject)));
                } catch (e) {
                    formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'isOlder'));
                }
                return stringExtension.format(messages().isOlder, [ko.unwrap(params.subject), ko.unwrap(params.age)]);
            }
        };

        ko.validation.registerExtenders();

        var extendDate = function (target, validationName, params) {
            params = params && typeof params === 'object' ? params : { params: params };
            params.ruleName = params.ruleName || 'date';
            var dateValidation = {
                dateInPattern: validationParamsFactory(params, true, ''),
                dateRule: validationParamsFactory(params, true, ''),
                pattern: validationParamsFactory(params, regexSource.date, 'dateInRange'),
                length: validationParamsFactory(params, 10, 'date')
            };
            target.extend(dateValidation);
            var rule = {};
            rule[validationName] = validationParamsFactory(params, params.params || params, validationName);
            target.extend(rule);
            return target;
        };

    /* @memberof ko         
    * @function "ko.extenders.date"
    * @description extender to validate date field 
    * checks validation on the observable and in case of failure applies a proper error message.
    * @example  
    * var sampleDate = ko.observable().extend({ date: null });
    * sampleDate('10/02/2010');
    */
        ko.extenders.date = function (target, params) {
            return extendDate(target, '', params);
        };

    /* @memberof ko         
    * @function "ko.extenders.pastDate"
    * @description ko.validation rule to validate if value is a past date compared to date given as parameter
    * @param {object} params  
    * @param {string} params.compareTo - the date that value must be earlier than. 
    * @param {string} [params.compareToName] - verbal alias to compareTo. used to be chained to the error message
    * @param {string} message - custom error message
    * @example  
    * var sampleDate = ko.observable().extend({ pastDate: '30/02/2010' });
    * sampleDate('10/02/2010');
    */
        ko.extenders.pastDate = function (target, params) {
            params = params || {};
            return extendDate(target, 'pastDateRule', params);
        };

   /* @memberof ko         
   * @function "ko.extenders.futureDate"
   * @description ko.validation rule to validate if value is a future date compared to date given as parameter
   * @param {object} params  
   * @param {string} params.compareTo - the date that value must be later than. 
   * @param {string} [params.compareToName] - verbal alias to compareTo. used to be chained to the error message
   * @param {string} message - custom error message
   * @example  
   * var sampleDate = ko.observable().extend({ futureDate: '01/02/2010' });
   * sampleDate('10/02/2010');
   */


        ko.extenders.futureDate = function (target, params) {
            params = params || {};
            return extendDate(target, 'futureDateRule', params);
        };

      /* @memberof ko         
      * @function "ko.extenders.sinceDate"
      * @description ko.validation rule to validate if value is date same or in the future compared to date given as parameter
      * @param {object} params  
      * @param {string} params.compareTo - the date that value must be earlier than. 
      * @param {string} [params.compareToName] - verbal alias to compareTo. used to be chained to the error message
      * @param {string} message - custom error message
      * @example  
      * var sampleDate = ko.observable().extend({ sinceDate: '01/02/2010' });
      * sampleDate('10/02/2010');
      */


        ko.extenders.sinceDate = function (target, params) {
            params = params || {};
            return extendDate(target, 'sinceDateRule', params);
        };


        /* @memberof ko         
        * @function "ko.extenders.untilDate"
        * @description ko.validation rule to validate if value is date same or in the past compared to date given as parameter
        * @param {object} params  
        * @param {string} params.compareTo - the date that value must be earlier than. 
        * @param {string} [params.compareToName] - verbal alias to compareTo. used to be chained to the error message
        * @param {string} message - custom error message
        * @example  
        * var sampleDate = ko.observable().extend({ untilDate: '01/02/2010' });
        * sampleDate('10/02/2010');
        */

        ko.extenders.untilDate = function (target, params) {
            params = params || {};
            return extendDate(target, 'untilDateRule', params);
        };

        /* @memberof ko         
        * @function "ko.extenders.between2Dates"
        * @description ko.validation rule to validate if value is between a range of two dates or equal to either the start or end dates.
        * @param {object} params  
        * @param {string} params.fromDate - start of range.
        * @param {string} params.toDate - end of range.
        * @param {string} message - custom error message
        * @example  
        * var sampleDate = ko.observable().extend({ between2Dates: {fromDate:'01/02/2010',toDate:'01/02/2015'} });
        * sampleDate('10/02/2013');
        */
        ko.extenders.between2Dates = function (target, params) {
            params = params || {};
            return extendDate(target, 'between2DatesRule', params);
        };


      /* @memberof ko         
      * @function "ko.extenders.isYounger"
      * @description ko.validation rule to validate if value is valid birth date according to age requirements
      * @param {object} params  
      * @param {string} params.currentDate -  the current date (from server).
      * @param {string} params.age - the age that the subject must be younger than.
      * @param {string} params.subject - the subject to chain to the error message
      * @param {string} message - custom error message
      * @example  
      * var sampleDate = ko.observable().extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
      * sampleDate('10/02/2013');
      */

        ko.extenders.isYounger = function (target, params) {
            params = params || {};
            return extendDate(target, 'isYoungerRule', params);
        };

        /* @memberof ko         
        * @function "ko.extenders.isOlder"
        * @description ko.validation rule to validate if value is valid birth date according to age requirements
        * @param {object} params  
        * @param {string} params.currentDate -  the current date (from server).
        * @param {string} params.age - the age that the subject must be older than.
        * @param {string} params.subject - the subject to chain to the error message
        * @param {string} message - custom error message
        * @example  
        * var sampleDate = ko.observable().extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
        * sampleDate('10/02/2013');
        */
        ko.extenders.isOlder = function (target, params) {
            params = params || {};
            return extendDate(target, 'isOlderRule', params);
        };


        ko.extenders.time = function (target, params) {
            target.extend({
                pattern: validationParamsFactory(params, regexSource.time, 'time'),
                length: validationParamsFactory(params, 5, '')
            });
            return target;
        };

    });


