/** @description sub objects to validate hebrew date fields.
* built as ko.extenders that are to be linked to an observable
* checks validation on the observable and in case of failure returns a proper error message.
* @module validateHebrewDate
* @throws formExceptions if required params missing .
* @example Example usage of validate field using ko.validation
* var sampleDate=ko.observable().extend({ pastHebrewDate: { compareTo: { year: 5776, month: 7, day: 3 }, compareToName:'ג' אדר ב' תשע"ו'  } });
* var from=ko.observable({ year: 5776, month: 7, day: 3 }); var to=hebrewDateMethods.todayCodes; 
* var sampleDate=ko.observable().extend({ between2HebrewDates: { fromDate: from,  fromDateName: 'תאריך לידה', toDate: to  } });
*/

define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/resources/texts/date',
    'common/utilities/stringExtension',
    'common/utilities/hebrewDateMethods',
    'common/ko/validate/koValidationMethods',
    'common/ko/globals/multiLanguageObservable',
    'common/external/date'
],
function (formExceptions, exceptionToThrow, resources, stringExtension, dateMethods) {//eslint-disable-line max-params

    var messages = ko.multiLanguageObservable({ resource: resources.errors });
    var labels = ko.multiLanguageObservable({ resource: resources.labels });
    /**
    *@function extendDate
    * @description ko.validation
    * @param {observable} target - the observable to validate
    * @param {string} validationName - the validation rule to apply
    * @param {object} params - parameters to pass to the validation rule
    * @returns {observable} target with extender
    */
    var extendDate = function (target, validationName, params) {
        var rule = {};
        rule[validationName] = params;
        target.extend(rule);
        return target;
    };

    /**
 *@function pastHebrewDate
 * @description ko.validation rule to validate if value is hebrew date in the past compared to hebrew date given as parameter
 * @param {string} val - the observable to validate
 * @param {object} params  
 * @param {string} [params.compareTo=hebrewDateMethods.todayCodes] - the hebrew date that value must be earlier than. 
 * @param {string} [params.compareToName=today/היום] - verbal alias to compareTo. used to be chained to the error message
 * @param {string} message - custom error message
 * @returns {string} the error message to display under the field.
 */
    ko.validation.rules.pastHebrewDateRule = {
        validator: function (val, params) {

            return dateMethods.pastHebrewDate(val, params);
        },

        message: function (params) {
            var messageCompare = params.compareToName || labels().today;
            return stringExtension.format(messages().pastDate, messageCompare);
        }
    };
    ko.extenders.pastHebrewDate = function (target, params) {
        return extendDate(target, 'pastHebrewDateRule', params);
    };
    /**
    @function futureHebrewDate
    * @description ko.validation rule to validate if value is hebrew date in the future compared to hebrew date given as parameter
    * @param {string} val - the observable to validate
    * @param {object} params 
    * @param {string} [params.compareTo=hebrewDateMethods.todayCodes] - the hebrew date that value must be later than.
    * @param {string} [params.compareToName=today/היום] - verbal alias to compareTo. used to be chained to the error message
    * @param {string} message - custom error message
    * @returns {string} the error message to display under the field.
    */
    ko.validation.rules.futureHebrewDateRule = {
        validator: function (val, params) {

            return dateMethods.futureHebrewDate(val, params);
        },
        message: function (params) {
            var messageCompare = params.compareToName || labels().today;
            return stringExtension.format(messages().futureDate, messageCompare);
        }
    };

    ko.extenders.futureHebrewDate = function (target, params) {
        return extendDate(target, 'futureHebrewDateRule', params);
    };
    /**
    * @function untilHebrewDate
    * @description ko.validation rule to validate if value is hebrew date same or in the past compared to hebrew date given as parameter
    * @param {string} val - the observable to validate
    * @param {object} params 
    * @param {string} [params.compareTo=hebrewDateMethods.todayCodes] - the hebrew date that value must be later than.
    * @param {string} [params.compareToName=today/היום] - verbal alias to compareTo. used to be chained to the error message
    * @param {string} message - custom error message
    * @returns {string} the error message to display under the field.
    */
    ko.validation.rules.untilHebrewDateRule = {
        validator: function (val, params) {

            return dateMethods.untilHebrewDate(val, params);
        },
        message: function (params) {
            var messageCompare = params.compareToName || labels().today;
            return stringExtension.format(messages().untilDate, messageCompare);
        }
    };
    ko.extenders.untilHebrewDate = function (target, params) {
        return extendDate(target, 'untilHebrewDateRule', params);
    };

    /**
    * @function between2HebrewDates
    * @description ko.validation rule to validate if value is between a range of two hebrew dates or equal to either the start or end dates.
    * @param {string} val - the observable to validate
    * @param {object} params 
    * @param {string} params.fromDate - start of range.
    * @param {string} params.toDate - end of range.
    * @param {string} [params.fromDateName=today/היום] - verbal alias to fromDate. used to be chained to the error message
    * @param {string} [params.toDateName=today/היום] - verbal alias to toDate. used to be chained to the error message
    * @returns {string} the error message to display under the field.
    */
    ko.validation.rules.between2HebrewDatesRule = {
        validator: function (val, params) {

            return dateMethods.between2HebrewDates(val, params);
        },
        message: function (params) {
            var messageFromDate = params.fromDateName || labels().today;
            var messageToDateName = params.toDateName || labels().today;

            return stringExtension.format(messages().between2Dates, [messageFromDate, messageToDateName]);
        }
    };

    ko.extenders.between2HebrewDates = function (target, params) {
        return extendDate(target, 'between2HebrewDatesRule', params);
    };


    ko.validation.registerExtenders();
});

