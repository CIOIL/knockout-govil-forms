
define(['common/viewModels/ModularViewModel',
        'common/components/date/gregorian/dayViewModel',
        'common/utilities/reflection',
        'common/resources/texts/date',
        'common/components/date/gregorian/monthViewModel',
        'common/components/date/gregorian/gregorianBasePartViewModel',
        'common/components/date/gregorian/yearViewModel',
        'common/utilities/stringExtension',
        'common/ko/globals/multiLanguageObservable'
], function (ModularViewModel, DayViewModel, commonReflection, dateResources, MonthViewModel, GregorianBasePart, YearViewModel, stringExtension) {//eslint-disable-line max-params

    /** Sub View Model that include gregorian day, month and year.
    * @class GregorianDateViewModel
    * @param {json} settings - object that contain the params, <b>all paramenters are optionals</b>.
    * @param {boolean} [settings.isRequired=false] - parameter means if whole component should be required
    * @param {string/computed/observable} [settings.title=תאריך/Date] - the title to display
    * @param {string} [settings.concatenatedDateFormat=/] - a separator character to  the full date text 
    * @param {json} [settings.day={}] - settings for DayViewModel part
    * @param {json} [settings.month={}] - settings for MonthViewModel part
    * @param {json} [settings.year={}] - settings for YearViewModel part
    * @param {json} [settings.extend] - an object that contains ko.validation rules.
    * @property {ko.computed} fullDate - text of the date for example: 01/07/2016.
    * @property {ko.observable} dateForValidation - an string observable that hold the selected date in dd/MM/yyyy format, this property used for validation.
    * @see https://forms.gov.il/globaldata/getsequence/getHtmlForm.aspx?formType=componentsdemo@test.gov.il
    * 
    */
    var GregorianDateViewModel = function (settings) {
        var self = this;

        var defaultSettings = {
            isRequired: false,
            title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().date; }),
            concatenatedDateFormat: '/',
            day: {},
            month: {},
            year: {}
        };
        settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);

        settings.day.isRequired = settings.day.isRequired !== undefined ? settings.day.isRequired : settings.isRequired;
        settings.month.isRequired = settings.month.isRequired !== undefined ? settings.month.isRequired : settings.isRequired;
        settings.year.isRequired = settings.year.isRequired !== undefined ? settings.year.isRequired : settings.isRequired;

        var model = {
            day: new DayViewModel(settings.day),
            month: new MonthViewModel(settings.month),
            year: new YearViewModel(settings.year)
        };


        ModularViewModel.call(self, model);
        self.title = ko.computed(function () {
            return ko.unwrap(settings.title);
        });

        self.isRequired = ko.computed(function () {
            return ko.unwrap(settings.isRequired);
        });

        self.month.isRequired = ko.computed(function () {
            var required = GregorianBasePart.isFull(self.day);
            var requiredBaseSetting = self.month.isRequired;
            return ko.unwrap(requiredBaseSetting) || required;

        });

        self.year.isRequired = ko.computed(function () {
            var required = GregorianBasePart.isFull(self.day) || GregorianBasePart.isFull(self.month);
            var requiredBaseSetting = self.year.isRequired;

            return ko.unwrap(requiredBaseSetting) || required;
        });
        self.month.data.dataCode.subscribe(function () {
            self.day.updateList(self.month, self.year);
        });


        self.year.data.dataCode.subscribe(function () {
            self.day.updateList(self.month, self.year);
        });

        self.fullDate = ko.computed(function () {
            var res;
            if (typeof (self.day.data.dataText()) !== 'undefined') {
                res = self.day.data.dataText() + settings.concatenatedDateFormat + self.month.data.dataText() + settings.concatenatedDateFormat + self.year.data.dataText();
            }
            else if (typeof (self.month.data.dataText()) !== 'undefined') {
                res = self.month.data.dataText() + settings.concatenatedDateFormat + self.year.data.dataText();
            }
            else {
                res = self.year.data.dataText();
            }
            return res ? res.replace(/undefined/g, '') : '';
        }, this);

        self.dateForValidation = ko.observable().extend(settings.extend);

        var _dateForValidation = ko.computed({ //eslint-disable-line no-unused-vars
            read: function () {
                if (GregorianBasePart.isFull(self.day) && GregorianBasePart.isFull(self.month) && GregorianBasePart.isFull(self.year)) {
                    self.dateForValidation(self.day.data.dataText() + '/' + stringExtension.padLeft(self.month.data.dataCode()) + '/' + self.year.data.dataText());

                } else {
                    self.dateForValidation('');
                }
                return self.dateForValidation();
            },
            write: self.dateForValidation

        });
    };
    GregorianDateViewModel.prototype = Object.create(ModularViewModel.prototype);
    GregorianDateViewModel.prototype.constructor = GregorianDateViewModel;

    return GregorianDateViewModel;
});
