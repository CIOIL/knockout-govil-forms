/**
* @module hebrewYearRequest
 * @description Object for handle hebrew year requests.
 * these methods handle calls for server, this logic prevents multiple calling to server.
 * there is a global promise 'allYearsRequest' that contains a wide range of years
 * in the first request we call to server with the wide range of years (100 years back to 100 years ahead)
 * and in the following requests we don't accsess to the server but getting the desired years from the global promise
 * if the global promise doesn't contains the desired years, we recalculate the new wide range that will contains the  all new years
 * and update the global promise with the new years range
 */

define(['common/dataServices/hebrewDateRequests',
        'common/utilities/reflection',
        'common/external/q',
        'common/utilities/argumentsChecker',
        'common/utilities/arrayExtensions'
]
    , function (hebrewDateRequests, commonReflection, Q, functionHandler) {//eslint-disable-line max-params

    var allYearsRequest;
    var hebrewAndGregorianDifference = 3760;
    var backYears = 100;
    var defaults = {
        startAtBaseYear: true,
        baseYear: new Date().getFullYear() - backYears,
        numberOfYears: 200
    };


    //#region private functions
    var findDesiredYears = function (allYears, settings) {
        var baseYearAsHebrew = settings.baseYear + hebrewAndGregorianDifference;
        var baseYearIndex = allYears.findIndex(function (item) { return item.dataCode === baseYearAsHebrew; });
        return allYears.slice(baseYearIndex, baseYearIndex + settings.numberOfYears);
    };
    var getCalculatedSettings = function (settings) {
        var newBaseYear = settings.baseYear < defaults.baseYear ? settings.baseYear : defaults.baseYear;
        var newNumOfYears = settings.numberOfYears > defaults.numberOfYears ? settings.numberOfYears : defaults.numberOfYears;
        newNumOfYears += defaults.baseYear - newBaseYear;
        return { baseYear: newBaseYear, numberOfYears: newNumOfYears };
    };
    var getDesiredYears = function (allYears, settings) {
        var desiredYears = [];
        if (functionHandler.checkAllRequiredArgs(settings, ['baseYear', 'numberOfYears'], 'getDesiredYears')) {
            if (allYears.length > 0) {
                desiredYears = findDesiredYears(allYears, settings);
                if (settings.startAtBaseYear === false) {
                    desiredYears = desiredYears.reverse();
                }
            }
        }
        return desiredYears;
    };
    var createAllYearsRequest = function (settings) {
        var request;
        if (functionHandler.checkAllRequiredArgs(settings, ['baseYear', 'numberOfYears'], 'createAllYearsRequest')) {
            var newSettings = getCalculatedSettings(settings);
            request = hebrewDateRequests.getYears(newSettings.baseYear, newSettings.numberOfYears, settings);

            request.baseYear = newSettings.baseYear;
            request.numberOfYears = newSettings.numberOfYears;
        }
        return request;
    };
    var requestContainsDesiredYears = function (settings) {
        if (functionHandler.checkAllRequiredArgs(settings, ['baseYear', 'numberOfYears'], 'requestContainsDesiredYears')) {
            return settings.baseYear >= allYearsRequest.baseYear && settings.numberOfYears <= allYearsRequest.numberOfYears;
        }
        return false;
    };
    //#endregion
    //#region public functions

    var getListRequest = function (settings) {
        settings = commonReflection.extendSettingsWithDefaults(settings, defaults);
        if (!allYearsRequest || !requestContainsDesiredYears(settings)) {
            allYearsRequest = createAllYearsRequest(settings);
        }
        return allYearsRequest.then(function (result) {
            return Q.fcall(function () { return getDesiredYears(result, settings); });
        });
    };
    //#endregion

    return {
        /**
* Get years list promise
* @method getListRequest
* @param {json} settings - should contains month {HebrewMonthPart}, year{HebrewYearPart}, and other settings for $.ajax
* @example Example usage of getListRequest:
* hebrewYearRequest.getListRequest({baseYear:1091,numberOfYears:3})
* @returns {promise} promise that contains a list year request with the desired years.
*/
        getListRequest: getListRequest

    };
});


