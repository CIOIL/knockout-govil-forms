
define(['common/components/date/gregorian/gregorianBasePartViewModel',
        'common/resources/texts/date',
        'common/utilities/reflection',
        'common/utilities/stringExtension',
        'common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/typeVerifier',
        'common/ko/globals/multiLanguageObservable'],
    function (GregorianBasePart, dateResources, commonReflection, stringExtension, exceptions,//eslint-disable-line max-params
                exceptionMessages, typeVerifier) {

        var backYears = 100;

        var defaults = {
            settings: {
                isRequired: false,
                title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().year; }),
                baseYear: new Date().getFullYear() - backYears,
                numberOfYears: 200,
                startAtBaseYear: true
            }
        };

        var isEmptyObservable = function (obs) {
            return ko.isObservable(obs) && !ko.unwrap(obs);
        };

        /** A view model of gregorian date year part.
     * @class  Gregorian~YearViewModel
     *   @param {json} settings - object that contain the params.
        *  @param {boolean} [settings.isRequired=false] - parameter means if year should be required
        * @param {string/computed/observable} [settings.title=שנה/Year] - the title to display
       * @param {number} [settings.baseYear=100 years back] - the first year in the years list.
       * @param {number} [settings.numberOfYears=200] -the number of years in the list.
       * @param {boolean} [settings.startAtBaseYear=true] -if the base year will be the first item (true) or the last(false).
     */
        var YearViewModel = function (settings) {
            var self = this;
            settings = commonReflection.extendSettingsWithDefaults(settings, defaults.settings);

            GregorianBasePart.call(self, settings);

            self.list = ko.computed(function () {
                if (isEmptyObservable(settings.baseYear) || isEmptyObservable(settings.numberOfYears)) {
                    return [];
                }
                return self.getList(settings.baseYear, settings.numberOfYears, settings.startAtBaseYear);
            });

        };

        YearViewModel.prototype = Object.create(GregorianBasePart.prototype);
        YearViewModel.prototype.constructor = YearViewModel;

        var verifierParameters = function (baseYear, numberOfYears) {

            if (!typeVerifier.int(baseYear) || !typeVerifier.int(numberOfYears)) {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'YearViewModel.getList'));
            }
        };


        /**
        * Get years list 
        * @memberof YearViewModel
        * @param {number} baseYear - the base year to load
        * @param {number} numberOfYears - number of years to load
        * @param {boolean} startAtBaseYear - if return the list from the earlier to the later or the later to the earlier 
        * @example Example usage of getList:
        * year.getList(2016,3,true)
        * @returns {List} list of {dataCode,dateText} that contains a list years .
        */
        YearViewModel.prototype.getList = function (baseYear, numberOfYears, startAtBaseYear) {

            var years = [];

            baseYear = ko.unwrap(baseYear);
            numberOfYears = ko.unwrap(numberOfYears);
            verifierParameters(baseYear, numberOfYears);

            for (var i = baseYear; i < baseYear + numberOfYears; i++) {
                years.push({ dataCode: i, dataText: i.toString() });
            }
            return startAtBaseYear ? years : years.reverse();
        };

        return YearViewModel;

    });

