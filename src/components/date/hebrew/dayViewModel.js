
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
], function (HebrewBasePart, Q, hebrewDateRequests, exceptions, exceptionMessages, dateResources,//eslint-disable-line max-params
    commonReflection, stringExtension) {


    var defaults = {
        list: [{ 'dataCode': 1, 'dataText': 'א\'' }, { 'dataCode': 2, 'dataText': 'ב\'' }, { 'dataCode': 3, 'dataText': 'ג\'' }, { 'dataCode': 4, 'dataText': 'ד\'' }, { 'dataCode': 5, 'dataText': 'ה\'' }, { 'dataCode': 6, 'dataText': 'ו\'' }, { 'dataCode': 7, 'dataText': 'ז\'' }, { 'dataCode': 8, 'dataText': 'ח\'' }, { 'dataCode': 9, 'dataText': 'ט\'' }, { 'dataCode': 10, 'dataText': 'י\'' }, { 'dataCode': 11, 'dataText': 'י"א' }, { 'dataCode': 12, 'dataText': 'י"ב' }, { 'dataCode': 13, 'dataText': 'י"ג' }, { 'dataCode': 14, 'dataText': 'י"ד' }, { 'dataCode': 15, 'dataText': 'ט"ו' }, { 'dataCode': 16, 'dataText': 'ט"ז' }, { 'dataCode': 17, 'dataText': 'י"ז' }, { 'dataCode': 18, 'dataText': 'י"ח' }, { 'dataCode': 19, 'dataText': 'י"ט' }, { 'dataCode': 20, 'dataText': 'כ\'' }, { 'dataCode': 21, 'dataText': 'כ"א' }, { 'dataCode': 22, 'dataText': 'כ"ב' }, { 'dataCode': 23, 'dataText': 'כ"ג' }, { 'dataCode': 24, 'dataText': 'כ"ד' }, { 'dataCode': 25, 'dataText': 'כ"ה' }, { 'dataCode': 26, 'dataText': 'כ"ו' }, { 'dataCode': 27, 'dataText': 'כ"ז' }, { 'dataCode': 28, 'dataText': 'כ"ח' }, { 'dataCode': 29, 'dataText': 'כ"ט' }, { 'dataCode': 30, 'dataText': 'ל\'' }],
        settings: {
            isRequired: false,
            title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().day; })
        }
    };
    /** A view model of hebrew date day part.
    * @class hebrew~DayViewModel
    * @param {json} settings - object that contain the params.
   * @param {promise} settings.request - request to days list from server.
   *  @param {boolean} [settings.isRequired=false] - parameter means if day should be required
    * @param {string/computed/observable} [settings.title=יום/Day] - the title to display
    
 */
    var DayViewModel = function (settings) {
        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaults.settings);
      
        self.handleRequest(settings.request);
        HebrewBasePart.call(self, settings);
       
        self.data.dataCode.extend({ range: { min: 1, max: 30 } });

    };

    DayViewModel.prototype = Object.create(HebrewBasePart.prototype);
    DayViewModel.prototype.constructor = DayViewModel;
    
     /**
     * Static function - Get days list promise
     * @memberof DayViewModel
     * @param {json} settings - should contains month {HebrewMonthPart}, year{HebrewYearPart}, and other settings for $.ajax
     * @example Example usage of getListRequest:
     * DayViewModel.getListRequest(month,year)
     * @returns {object} promise that contains a list day request.
     */
    DayViewModel.getListRequest = function (settings) {
        if (!settings || !HebrewBasePart.isFull(settings.month) || !HebrewBasePart.isFull(settings.year)) {
            return Q.fcall(function () { return defaults.list; });
        } else {
            return hebrewDateRequests.getDays(settings.month.data.dataCode(), settings.year.data.dataCode(), settings); 
        }
    };
   
    /**
   * Getting new request, and updating the list property with its result
   * @memberof DayViewModel
   * @param {json} settings settings for $.ajax 
   * @param {HebrewMonthPart} month month that the new days list dependent on it
   * @param {HebrewYearPart} year year that the new days list dependent on it
   * @throws when settings different than object
   * @example Example usage of updateList:
   * day.updateList(settings,month,year)
   * @returns {promise} void.
   */
    DayViewModel.prototype.updateList = function (settings, month, year) { 
        if (!(typeof settings === 'object')) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.invalidElementTypeParam, ['settings', 'object']));
        }
        settings.month = month;
        settings.year = year;
        var daysListRequest = DayViewModel.getListRequest(settings);
        this.handleRequest(daysListRequest);
        return daysListRequest;
    };

    return DayViewModel;
   
});

