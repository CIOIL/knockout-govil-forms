
define(['common/components/date/gregorian/gregorianBasePartViewModel',
        'common/resources/texts/date',
        'common/utilities/reflection',
        'common/utilities/stringExtension',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/validate/extensionRules/number'],
    function (GregorianBasePart, dateResources, commonReflection, stringExtension) { //eslint-disable-line max-params

        var defaults = {
            settings: {
                isRequired: false,
                title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().day; })
            }
        };

        /** 
       * A view model of gregorian date day part.
      *  @class Gregorian~DayViewModel
    * @param {json} settings - object that contain the params.
    * @param {boolean} [settings.isRequired=false] - parameter means if day should be required
    * @param {string/computed/observable} [settings.title=יום/Day] - the title to display
    */
        var DayViewModel = function (settings) {
            var self = this;
            settings = commonReflection.extendSettingsWithDefaults(settings, defaults.settings);

            GregorianBasePart.call(self, settings);
            self.list(self.getList());


            self.data.dataCode.extend({ range: { min: 1, max: 31 } });
        };

        DayViewModel.prototype = Object.create(GregorianBasePart.prototype);
        DayViewModel.prototype.constructor = DayViewModel;

        /**
        * Get days list   
        * @memberof DayViewModel
        * @param {GregorianMonthPart} month month that the new days list dependent on it
        * @param {GregorianYearPart} year year that the new days list dependent on it
        * @example Example usage of getList:
        * day.getList(monthViewModel,yearViewModel)
        * @returns {List} list of {dataCode,dateText} that contains a list day .
        */
        DayViewModel.prototype.getList = function (month, year) {
            var daysValues = [];
            var value;
            var numDaysOfMonth = this.getNumDaysOfMonth(month, year);
            for (var i = 1; i <= numDaysOfMonth; i++) {
                value = stringExtension.padLeft(i);
                daysValues.push({ dataCode: i, dataText: value });
            }
            return daysValues;

        };
        /**
         * gets the number of days in a month depend on the received month and year
         * @memberof DayViewModel
         * @param {HebrewMonthPart} month the specific month to calculate its days
         * @param {HebrewYearPart} year the specific year to calculate its month's days
         * @example Example usage of getNumDaysOfMonth:
         * day.getNumDaysOfMonth(monthViewModel,yearViewModel)
         * @returns {number} numDaysOfMonth.
         */
        DayViewModel.prototype.getNumDaysOfMonth = function (month, year) {
            var numDaysOfMonth = 31;
            if (GregorianBasePart.isFull(month) && GregorianBasePart.isFull(year)) {
                numDaysOfMonth = new Date(year.data.dataCode(), month.data.dataCode(), 0).getDate();
            }
            return numDaysOfMonth;
        };
        /**
          * recalculate the days list and update list property with it
          * @memberof DayViewModel
          * @param {HebrewMonthPart} month month that the new days list dependent on it
          * @param {HebrewYearPart} year year that the new days list dependent on it
          * @example Example usage of updateList:
          * day.updateList(monthViewModel,yearViewModel)
          * @returns {undefined} void.
          */
        DayViewModel.prototype.updateList = function (month, year) {
            this.list(this.getList(month, year));

        };

        return DayViewModel;

    });

