
define(['common/components/date/hebrew/hebrewBasePartViewModel',
        'common/external/q',
        'common/dataServices/hebrewDateRequests',
        'common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/resources/texts/date',
        'common/utilities/reflection',
        'common/utilities/stringExtension',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/validate/extensionRules/number'
], function (HebrewBasePart, Q, hebrewDateRequests, exceptions, exceptionMessages, dateResources, commonReflection, stringExtension) {//eslint-disable-line max-params


    var defaults = {
        list: [{ 'dataCode': 1, 'dataText': 'תשרי' }, { 'dataCode': 2, 'dataText': 'חשון' }, { 'dataCode': 3, 'dataText': 'כסלו' }, { 'dataCode': 4, 'dataText': 'טבת' }, { 'dataCode': 5, 'dataText': 'שבט' }, { 'dataCode': 6, 'dataText': 'אדר' }, { 'dataCode': 7, 'dataText': 'אדר ב' }, { 'dataCode': 8, 'dataText': 'ניסן' }, { 'dataCode': 9, 'dataText': 'אייר' }, { 'dataCode': 10, 'dataText': 'סיון' }, { 'dataCode': 11, 'dataText': 'תמוז' }, { 'dataCode': 12, 'dataText': 'אב' }, { 'dataCode': 13, 'dataText': 'אלול' }],
        settings: {
            isRequired: false,
            title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().month; })
        }
    };
    /** A view model of hebrew date month part.
 * @class  hebrew~MonthViewModel
  * @param {json} settings - object that contain the params.
   * @param {promise} settings.request - request to months list from server.
   *  @param {boolean} [settings.isRequired=false] - parameter means if month should be required
    * @param {string/computed/observable} [settings.title=חודש/Month] - the title to display
 */
    var MonthViewModel = function (settings) {
        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaults.settings);
       
        self.handleRequest(settings.request);
        HebrewBasePart.call(self, settings);
        self.data.dataCode.extend({ range: { min: 0, max: 13 } });

    };

    MonthViewModel.prototype = Object.create(HebrewBasePart.prototype);
    MonthViewModel.prototype.constructor = MonthViewModel;

    var handleLeapYear = function (list, that) {
        var value = that.data.dataCode;
        if (list.length !== that.list().length && value() >= 7) {
            if (list.length > that.list().length) {
                value(value() + 1);
            } else {
                value(value() - 1);
            }
        }
    };
    /**
     * get months list promise
     * @memberOf MonthViewModel
     * @method getListRequest
     * @param {json} settings - should contains year{HebrewYearPart}, and other settings for $.ajax
     * @example Example usage of getListRequest:
     * MonthViewModel.getListRequest(year)
     * @returns {Promise}  promise that contains a list day request.
     */
    MonthViewModel.getListRequest = function (settings) {
        if (!settings || !HebrewBasePart.isFull(settings.year)) {
            return Q.fcall(function () { return defaults.list; });
        } else {
            return hebrewDateRequests.getMonths(settings.year.data.dataCode(), settings);
        }
    };

    /**
    * Updating list property with the request result with leap year handling
    * @memberOf MonthViewModel
    * @method handleRequestResult
    * @param {list} result - list of {dataCode,dataText} that contains new months list.
    * @example Example usage of handleRequestResult:
    * month.handleRequestResult(result)
    * @returns {undefined}.
    */
    MonthViewModel.prototype.handleRequestResult = function (result) {
        handleLeapYear(result, this);
        HebrewBasePart.prototype.handleRequestResult.call(this, result);
        
    };
    /**
* Updating list property with new request 
* @memberOf MonthViewModel
* @method updateList
* @param {json} settings for $.ajax 
* @param {HebrewYearPart} year - year that the new days list dependent on it
* @example Example usage of updateList:
* month.updateList(settings,year)
* @returns {promise}.
*/
    MonthViewModel.prototype.updateList = function (settings, year) {
        if (!(typeof settings === 'object')) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.invalidElementTypeParam, ['settings', 'object']));
        }
        settings.year = year;
        var monthsListRequest = MonthViewModel.getListRequest(settings);
        this.handleRequest(monthsListRequest);
        return monthsListRequest;
    };

    return MonthViewModel;

});

