
define(['common/components/date/gregorian/gregorianBasePartViewModel',
    'common/resources/texts/date',
    'common/resources/texts/month',
    'common/utilities/reflection',
    'common/viewModels/languageViewModel',
    'common/utilities/stringExtension',
    'common/resources/regularExpressions',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/validate/extensionRules/number'

], function (GregorianBasePart, dateResources, monthResources, commonReflection, languageViewModel, stringExtension, regularExpressions) {//eslint-disable-line max-params

    var defaults = {
        settings: {
            isRequired: false,
            title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().month; }),
            isNumericMonth: true
        }
    };
    /** A view model of gregorian date month part.
 * @class  Gregorian~MonthViewModel
  * @param {json} settings - object that contain the params.
   * @param {boolean} [settings.isNumericMonth=true] - if months list should be [01,02..12] or [ינואר, פברואר...דצמבר].
   *  @param {boolean} [settings.isRequired=false] - parameter means if month should be required
    * @param {string/computed/observable} [settings.title=חודש/Month] - the title to display
 */
    var MonthViewModel = function (settings) {
        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaults.settings);
        self.isNumericMonth = ko.computed(function () {
            return ko.unwrap(settings.isNumericMonth);
        });

        GregorianBasePart.call(self, settings);
        self.list(self.getList());
        self.data.dataCode.extend({ range: { min: 1, max: 12 } });

        languageViewModel.language.subscribe(function () {
            if (self.isNumericMonth() === false) {
                self.list(self.getList());
            }
        });
    };

    MonthViewModel.prototype = Object.create(GregorianBasePart.prototype);
    MonthViewModel.prototype.constructor = MonthViewModel;

    /**
    * Get months list 
    * @memberof MonthViewModel
    * @example Example usage of getList:
    * month.getList()
    * @returns {List} list of {dataCode,dateText} that contains a list month depended on isNumericMonth value.
    */
    MonthViewModel.prototype.getList = function () {
        var text;
        var monthsValues = [];

        var isNumeric = this.isNumericMonth();
        for (var i = 1; i <= 12; i++) {//eslint-disable-line no-magic-numbers
            if (isNumeric) {
                text = stringExtension.padLeft(i);
            }
            else {
                text = this.getLiteralMonthName(i);
            }
            monthsValues.push({ dataCode: i, dataText: text });
        }
        return monthsValues;
    };
    /**
 *get Literal Month Name
* @memberof MonthViewModel
 * @param {numOfMonth} numOfMonth the month number 
 * @example Example usage of getLiteralMonthName:
 * month.getLiteralMonthName(2) //return february
 * @returns {List} list of {dataCode,dateText} that contains numeric months list.

 */
    MonthViewModel.prototype.getLiteralMonthName = function (numOfMonth) {
        if (numOfMonth < 1 || numOfMonth > 12) {//eslint-disable-line no-magic-numbers
            return '';
        }
        var months = ko.multiLanguageObservable({ resource: monthResources })();
        return months[numOfMonth - 1].replace(regularExpressions.nonPrintableCharacters, '');
       
    };

    return MonthViewModel;

});

