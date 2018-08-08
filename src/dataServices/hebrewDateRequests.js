/** Object for handling hebrew date requests
  @module hebrewDateRequests 
 
 */
define(['common/networking/services',
    'common/utilities/numericExtensions',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
],
function (services, numericExtensions, exceptions, exceptionMessages, stringExtension) {//eslint-disable-line max-params

    var resources = {
        services: {
            getDays: 'DateTimeConverter/GetListOfHebrewDays?year={0}&month={1}&type=json',
            getMonths: 'DateTimeConverter/GetListOfHebrewMonths?year={0}&type=json',
            getYears: 'DateTimeConverter/GetListOfHebrewYears?dateTimeModel={day:"1",month:"1",year:{0},startYear:0,endYear:{1},type:1}',
            convert: 'DateTimeConverter/ConvertDateToComplexDate?dateTimeModel={ "type": {0}, "day": {1}, "month": {2}, "year": {3} }'
        },
        ranges: {// ranges from controller data annotations
            year: {
                min: 5344,
                max: 5999
            },
            month: {
                min: 1,
                max: 13
            },
            baseYear: {
                min: 1000,
                max: 6000
            },
            numberOfYears: {
                min: 0,
                max: 280
            }
        }
    };
  
    //#region private functions
    var getListFromServer = function (route, settings) {
        typeof settings ==='object' ? settings.route = route : settings = { route: route };
        return services.govServiceListRequest(settings);
    };
   
   
    //#endregion

    //#region public functions
   
   
    var getDays = function (month, year, settings) {
        var ranges = resources.ranges;
        if (!numericExtensions.isInRange(month, ranges.month.min, ranges.month.max) || !numericExtensions.isInRange(year, ranges.year.min, ranges.year.max)) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'getDays'));
        }
        var route = stringExtension.format(resources.services.getDays, [year, month]);
        return getListFromServer(route, settings);
    };
  
    var getMonths = function (year, settings) {
        var ranges = resources.ranges;
        if (!numericExtensions.isInRange(year, ranges.year.min, ranges.year.max)) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'getMonths'));
        }
        var route = stringExtension.format(resources.services.getMonths, [year]);
        return getListFromServer(route, settings);
    };
   
    var getYears = function (baseYear, numberOfYears, settings) {
        var ranges = resources.ranges;
        if (!numericExtensions.isInRange(baseYear, ranges.baseYear.min, ranges.baseYear.max) || !numericExtensions.isInRange(numberOfYears, ranges.numberOfYears.min, ranges.numberOfYears.max)) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'getYears'));
        }
        var route = stringExtension.format(resources.services.getYears, [baseYear, numberOfYears]);
        return getListFromServer(route, settings);
    };
       
    var getDate = function (date, settings) {
        if (!date || !date instanceof Date || isNaN(date.getTime())) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'getDate'));
        }
        var route = stringExtension.format(resources.services.convert, [1, date.getDate(), date.getMonth() + 1, date.getFullYear()]);
        return getListFromServer(route, settings);
    };

    //#endregion
   
    return {
      /**
     * get list of months from server     
     * @method getMonths
     * @param {int} year - year to get months for it
     * @param {json} settings - settings for $.ajax
     * @example Example usage of getMonths:
     * hebrewDateRequests.getMonths(5775,settings)
     * @returns {object} promise.
     */
        getMonths: getMonths,
        /**
        * get list of days from server       
        * @method getDays
        * @param {int} month - month to get days for it
        * @param {int} year - year to get days for it
        * @param {json} settings (optional)- settings for $.ajax
        * @example Example usage of getDays:
        * hebrewDateRequests.getDays(2,5775,settings)
        * @returns {object} promise.
        */
        getDays: getDays,
       /**
       * get list of years from server       
       * @method getYears
       * @param {int} baseYear - the base year 
       * @param {int} numberOfYears - num of years 
       * @param {json} settings - settings for $.ajax
       * @example Example usage of getYears:
       * hebrewDateRequests.getYears(1901,3,settings)
       * @returns {object} promise.
       */
        getYears: getYears,
       /**
       * get hebrew date from server      
       * @method getDate
       * @param {Date} date - the gregorian date of the desired hebrew date
       * @param {json} settings - settings for $.ajax
       * @throws Will throw an error if the date is not instance of Date.
       * @example Example usage of getDate:
       * hebrewDateRequests.getDate(new Date())
       * @returns {object} promise.
       */
        getDate: getDate

    };
});

