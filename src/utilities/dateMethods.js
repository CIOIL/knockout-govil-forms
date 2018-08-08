/**
 * @module dateMethods
 * @description utility functions used to 
 */
define(['common/resources/regularExpressions',
        'common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/utilities/tryParse',
        'common/utilities/typeParser'

],
    function (regexSource, formExceptions, exceptionToThrow, stringExtension, tryParse, typeParser) {//eslint-disable-line max-params

        var isDate = function (val) {
            return !!typeParser.date(val);
        };

        var pastDate = function (val, params) {
            if (!val || (ko.isObservable(params.compareTo) && !ko.unwrap(params.compareTo)))
            { return true; }
            try {
                var compareTo = tryParse('date', (ko.unwrap(params.compareTo)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'pastDate'));
            }

            val = tryParse('date', (ko.unwrap(val)));
            return val.compareTo(compareTo) < 0;
        };

        var futureDate = function (val, params) {
            if (!val || (ko.isObservable(params.compareTo) && !ko.unwrap(params.compareTo)))
            { return true; }
            try {
                var compareTo = tryParse('date', (ko.unwrap(params.compareTo)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'futureDate'));
            }
            val = tryParse('date', (ko.unwrap(val)));
            return val.compareTo(compareTo) > 0;
        };

        var untilDate = function (val, params) {
            if (!val || (ko.isObservable(params.compareTo) && !ko.unwrap(params.compareTo)))
            { return true; }
            try {
                var compareTo = tryParse('date', (ko.unwrap(params.compareTo)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'untilDate'));
            }
            val = tryParse('date', (ko.unwrap(val)));
            return val.compareTo(compareTo) <= 0;
        };

        var sinceDate = function (val, params) {
            if (!val || (ko.isObservable(params.compareTo) && !ko.unwrap(params.compareTo)))
            { return true; }
            try {
                var compareTo = tryParse('date', (ko.unwrap(params.compareTo)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'untilDate'));
            }
            val = tryParse('date', (ko.unwrap(val)));
            return val.compareTo(compareTo) >= 0;
        };

        var between2Dates = function (val, params) {
            if (!val) {
                return true;
            }
            try {
                var fromDate = tryParse('date', (ko.unwrap(params.fromDate))), toDate = tryParse('date', (ko.unwrap(params.toDate)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'between2Dates'));
            }
            //TODO: case fromDate is later than toDate?
            val = tryParse('date', (ko.unwrap(val)));
            return val.between(fromDate, toDate);
        };

        var isYounger = function (val, params) {
            if (!val) {
                return true;
            }
            try {
                var currentDate = tryParse('date', (ko.unwrap(params.currentDate))), age = tryParse('int', (ko.unwrap(params.age)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'isYounger'));
            }
            val = tryParse('date', (ko.unwrap(val)));
            var baseDate = new Date(currentDate);
            return val.between(baseDate.addYears(-Math.abs(age)), currentDate);
        };

        var isOlder = function (val, params) {
            if (!val) {
                return true;
            }
            try {
                var currentDate = tryParse('date', (ko.unwrap(params.currentDate))), age = tryParse('int', (ko.unwrap(params.age)));
            } catch (e) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'isOlder'));
            }
            val = tryParse('date', (ko.unwrap(val)));
            var baseDate = new Date(currentDate);
            return baseDate.addYears(-Math.abs(age)).between(val, currentDate);
        };
        const getTimeStamp = () => {
            return new Date().getTime();
        };
        return {
            /**
    *@function pastDate
    * @description checks if value is earlier than date given as parameter
    * @param {string} val - the value to validate
    * @param {object} params  
    * @param {string} params.compareTo - the date that value must be earlier than. 
    * @returns {boolian} true if value meets the condition, false if not  
    */
            pastDate: pastDate,
            /**
    @function futureDate
    * @description checks if value is later than date given as parameter
    * @param {string} val- the value to validate
    * @param {object} params 
    * @param {string} params.compareTo - the date that value must be later than.
    * @returns {boolian} true if value meets the condition, false if not 
    */
            futureDate: futureDate,
            /**
    * @function untilDate
    * @description checks if value is equal or earlier than date given as parameter
    * @param {string} val- the value to validate
    * @param {object} params 
    * @param {string} params.compareTo - the date that value must be equal to or earlier than.
    * @returns {boolian} true if value meets the condition, false if not 
    */
            untilDate: untilDate,
            /**
    * @function sinceDate
    * @description checks if value is equal or later than date given as parameter
    * @param {string} val- the value to validate
    * @param {object} params 
    * @param {string} params.compareTo - the date that value must be equal to or later than.
    * @returns {boolian} true if value meets the condition, false if not 
    */
            sinceDate: sinceDate,

            /**
    * @function between2Dates
    * @description checks if value is between a range of two dates or equal to either the start or end dates.
    * @param {string} val - the value to validate
    * @param {object} params 
    * @param {string} params.fromDate - start of range.
    * @param {string} params.toDate - end of range.
    * @returns {boolian} true if value meets the condition, false if not 
    */
            between2Dates: between2Dates,
            /**
    * @function isYounger
    * @description checks if value is valid birth date according to age requirements
    * @param {string} val - the value to validate
    * @param {object} params 
    * @param {string} params.currentDate -  the current date (from server).
    * @param {string} params.age - the age that the subject must be younger than.
    * @returns {boolian} true if value meets the condition, false if not 
    */
            isYounger: isYounger,
            /**
    * @function isOlder
    * @description checks if value is valid birth date according to age requirements
    * @param {string} val - the value to validate
    * @param {object} params  
    * @param {string} params.currentDate -  the current date (from server).
    * @param {string} params.age - the age that the subject must be younger than.
    * @returns {boolian} true if value meets the condition, false if not 
    */
            isOlder: isOlder,
            isDate: isDate,
            /**
* @function getTimeStamp
* @description return TimeStamp string

* @returns {string} return TimeStamp string due to now
*/
            getTimeStamp: getTimeStamp
        };

    });

