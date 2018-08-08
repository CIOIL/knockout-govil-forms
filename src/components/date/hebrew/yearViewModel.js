
define(['common/components/date/hebrew/hebrewBasePartViewModel',
        'common/resources/texts/date',
        'common/utilities/reflection',
        'common/ko/globals/multiLanguageObservable'],
function (HebrewBasePart, dateResources, commonReflection) {//eslint-disable-line max-params

    var defaultSettings = {
        isRequired: false,
        title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().year; })
    };
    /** A view model of hebrew date year part.
 * @class  hebrew~YearViewModel
 *   @param {json} settings - object that contain the params.
   * @param {promise} settings.request - request to years list from server.
   *  @param {boolean} [settings.isRequired=false] - parameter means if year should be required
    * @param {string/computed/observable} [settings.title=שנה/Year] - the title to display
 
 */
    var YearViewModel = function (settings) {
        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);

        self.handleRequest(settings.request);
        HebrewBasePart.call(self, settings);

    };

    YearViewModel.prototype = Object.create(HebrewBasePart.prototype);
    YearViewModel.prototype.constructor = YearViewModel;

    return YearViewModel;

});

