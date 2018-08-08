/**
 * @module dateMethods
 * @description utility functions used to 
 */
define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/dataServices/hebrewDateRequests'
],

   function (formExceptions, exceptionToThrow, stringExtension, hebrewDateRequests) {//eslint-disable-line max-params

       var todayCodes = ko.observable();
       var todayTexts = ko.observable();


       var loadDate = function (date, settings) {
           var request = hebrewDateRequests.getDate(date, settings)
               .then(function (result) {
                   if (typeof (result) === 'string') {
                       result = $.parseJSON(result);
                   }
                   todayCodes({ year: result.hebrewDate.year, month: Number(result.hebrewDate.month), day: result.hebrewDate.day });
                   todayTexts({ year: result.hebrewDate.sYear, month: result.hebrewDate.sMonth, day: result.hebrewDate.sDay });

               }, function (error) {
                   throw stringExtension.format(exceptionToThrow.serverCallFailed, error.url);
               });

           return request;
       };
       var isEarlier = function (tested, compareTo) {
           if (tested.year === compareTo.year) {
               if (tested.month === compareTo.month) {
                   return tested.day < compareTo.day;
               }
               return tested.month < compareTo.month;
           }
           return tested.year < compareTo.year;

       };
       var isCorrectProperty = function (tested, functionName) {//eslint-disable-line complexity

           if (!tested || !tested.hasOwnProperty('year') || !tested.hasOwnProperty('month') || !tested.hasOwnProperty('day')) {
               formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, functionName));
           }

       };
       var checkParams = function (params) {
           if (typeof params !== 'object') {
               formExceptions.throwFormError(stringExtension.format(exceptionToThrow.invalidParam, 'params'));
           }

       };
       var getCompareTo = function (compareToFromParams) {
           var compareTo;
           if (compareToFromParams !== undefined) {
               compareTo = ko.unwrap(compareToFromParams);

           } else {
               compareTo = todayCodes();
           }
           return compareTo;

       };

       var pastHebrewDate = function (val, params) {
           var functionName = 'pastHebrewDate';
           if (!val) { return true; }
           checkParams(params);
           var compareTo = getCompareTo(params.compareTo);
           isCorrectProperty(compareTo, functionName);
           return isEarlier(val, compareTo);

       };

       var futureHebrewDate = function (val, params) {
           var functionName = 'futureHebrewDate';

           if (!val) { return true; }
           checkParams(params);
           var compareTo = getCompareTo(params.compareTo);
           isCorrectProperty(compareTo, functionName);
           return isEarlier(compareTo, val);
       };

       var untilHebrewDate = function (val, params) {
           var functionName = 'untilHebrewDate';
           if (!val) { return true; }
           checkParams(params);
           var compareTo = getCompareTo(params.compareTo);
           isCorrectProperty(compareTo, functionName);
           return !isEarlier(compareTo, val);

       };

       var between2HebrewDates = function (val, params) {
           if (!val) { return true; }
           checkParams(params);
           var fromDate = ko.unwrap(params.fromDate), toDate = ko.unwrap(params.toDate);
           if (fromDate === undefined || toDate === undefined) {
               return true;
           }
           isCorrectProperty(fromDate, 'between2HebrewDates');
           isCorrectProperty(toDate, 'between2HebrewDates');

           return isEarlier(val, toDate) && isEarlier(fromDate, val);

       };

       return {
           /**
   *@function pastDate
   * @description checks if value is earlier than date given as parameter
   * @param {string} val - the value to validate
   * @param {object} params  
   * @param {string} [params.compareTo=todayCodes] - the date that value must be earlier than. 
   * @returns {boolian} true if value meets the condition, false if not  
   */
           pastHebrewDate: pastHebrewDate,
           /**
   @function futureDate
   * @description checks if value is later than date given as parameter
   * @param {string} val - the value to validate
   * @param {object} params 
   * @param {string} [params.compareTo=todayCodes] - the date that value must be later than.
   * @returns {boolian} true if value meets the condition, false if not 
   */
           futureHebrewDate: futureHebrewDate,
           /**
   * @function untilDate
   * @description checks if value is equal or earlier than date given as parameter
   * @param {string} val - the value to validate
   * @param {object} params 
   * @param {string} [params.compareTo=todayCodes] - the date that value must be equal to or earlier than.
   * @returns {boolian} true if value meets the condition, false if not 
   */
           untilHebrewDate: untilHebrewDate,
           /**
   * @function between2Dates
   * @description checks if value is between a range of two dates or equal to either the start or end dates.
   * @param {string} val - the value to validate
   * @param {object} params 
   * @param {string} params.fromDate - start of range.
   * @param {string} params.toDate - end of range.
   * @returns {boolian} true if value meets the condition, false if not 
   */
           between2HebrewDates: between2HebrewDates,
           /**
       * @function loadDate
       * @description performs an ajax request to retrieve an Hebrew date for the recieved date
       * @param {object} date - the recieved date by Date object
       * @param {json} settings - settings for $.ajax
       * loads the returning codes data into 'todayCodes' and texts data into 'todayTexts' 
       * example :todayCodes{year: 5776, month: 10, day: 9}, todayTexts{year: "תשע"ו", month: "סיון", day: "ט'"}
       */
           loadDate: loadDate,
           todayCodes: todayCodes,
           todayTexts: todayTexts


       };

   });

