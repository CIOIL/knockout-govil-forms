

define(['common/viewModels/ModularViewModel',
        'common/components/date/hebrew/dayViewModel',
        'common/utilities/reflection',
        'common/resources/texts/date',
        'common/components/date/hebrew/monthViewModel',
        'common/components/date/hebrew/hebrewBasePartViewModel',
        'common/components/date/hebrew/yearViewModel',
        'common/infrastructureFacade/tfsMethods',
        'common/components/formInformation/formInformationViewModel',
        'common/utilities/hebrewDateMethods',
        'common/external/q',
        'common/ko/globals/multiLanguageObservable'],
    function (ModularViewModel, DayViewModel, commonReflection, dateResources, MonthViewModel, HebrewBasePart, YearViewModel, tfsMethods, formInformation, hebrewDateMethods,q) {//eslint-disable-line max-params

        /** Sub View Model that include hebrew day, month and year.
        * @class HebrewDateViewModel
        * @param {json} settings - object that contain the params.<b> only settings.year.request is mandatory property (for create it use hebrewYearRequest.getListRequest method)</b>.
        * @param {boolean} [settings.isRequired=false] - parameter means if whole component should be required
        * @param {string/computed/observable} [settings.title=תאריך/Date] - the title to display
        * @param {string} [settings.concatenatedDateFormat=empty space] - a separator character to  the full date text 
        * @param {json} [settings.ajaxSettings={}] - settings for ajax request
        * @param {json} [settings.day={}] - settings for DayViewModel part.
        * @param {json} [settings.month={}] - settings for MonthViewModel part.
        * @param {json} settings.year={} - settings for YearViewModel part.
        * @param {json} [settings.extend] - an object that contains ko.validation rules.
        * @param {Date/string} [settings.currentDate=formInformation.loadingDate] - for validation: a today gregorgian date, can be a Date object, or string.
        * @param {boolean} [settings.isCalculateToday=true] - for validation: a boolean means if need to calculate today date, if the component doesn't contain a validation extend Should be sent <b>false</b> to this property to prevent unnecessary access to the server.
        * 
        * @property {ko.computed} fullDate - text of the date for example: ד' תשרי תשע"ו.
        * @property {ko.observable} dateForValidation - a json in format:{year:yearCode,month:monthCode,day:dayCode}, that hold the codes of the selected year month and day, this property used for validation.
       * @see https://forms.gov.il/globaldata/getsequence/getHtmlForm.aspx?formType=componentsdemo@test.gov.il
       
        * */
        var HebrewDateViewModel = function (settings) {
            var self = this;
            function getSettings(settings) {
                var defaultSettings = {
                    isRequired: false,
                    title: ko.computed(function () { return ko.multiLanguageObservable({ resource: dateResources.labels })().date; }),
                    concatenatedDateFormat: ' ',
                    ajaxSettings: {},
                    day: {},
                    month: {},
                    year: {},

                    isCalculateToday: true
                };
                settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);

                settings.day.isRequired = settings.day.isRequired !== undefined ? settings.day.isRequired : settings.isRequired;
                settings.month.isRequired = settings.month.isRequired !== undefined ? settings.month.isRequired : settings.isRequired;
                settings.year.isRequired = settings.year.isRequired !== undefined ? settings.year.isRequired : settings.isRequired;

                var dayRequest = DayViewModel.getListRequest(settings.ajaxSettings);
                settings.day.request = dayRequest;

                var monthRequest = MonthViewModel.getListRequest(settings.ajaxSettings);
                settings.month.request = monthRequest;
                return settings;
            }
            settings = getSettings(settings);

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
                var required = HebrewBasePart.isFull(self.day);
                var requiredBaseSetting = self.month.isRequired;
                return ko.unwrap(requiredBaseSetting) || required;

            });

            self.year.isRequired = ko.computed(function () {
                var required = HebrewBasePart.isFull(self.day) || HebrewBasePart.isFull(self.month);
                var requiredBaseSetting = self.year.isRequired;

                return ko.unwrap(requiredBaseSetting) || required;
            });
            self.month.data.dataCode.subscribe(function () {
                self.day.updateList(settings.ajaxSettings, self.month, self.year);
            });


            self.year.data.dataCode.subscribe(function () {

                var daySettings = (JSON.parse(JSON.stringify(settings.ajaxSettings)));//clone the orginal object to avoid overwriting his
                var monthSettings = (JSON.parse(JSON.stringify(settings.ajaxSettings)));

                self.month.updateList(monthSettings, self.year).then(function () {
                    self.day.updateList(daySettings, self.month, self.year);
                });


            });
            //#region calculate current hebrewDate for validation
            self.currentDateObj = function () {
                var currentDate = settings.currentDate || formInformation.loadingDate();
                if (typeof currentDate === 'string') {
                    currentDate = Date.parseExact(currentDate, 'dd/MM/yyyy');
                }
                return currentDate;

            };
            var calculateToday = function () {

                if (HebrewDateViewModel.todayPromise === undefined) {
                    HebrewDateViewModel.todayPromise = formInformation.currentDateRequest.then(function () {
                        return hebrewDateMethods.loadDate(self.currentDateObj());
                    });
                    HebrewDateViewModel.todayPromise.fail(function (error) {
                        tfsMethods.dialog.alert(error);
                    });
                }
            };
            if (settings.isCalculateToday) {
                calculateToday();
            } else {
        
                var todayPromise = q.defer();
                todayPromise.resolve();
                HebrewDateViewModel.todayPromise = todayPromise.promise;
            }
            //#endregion

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

            self.dateForValidation = ko.defferedObservable({ deferred: HebrewDateViewModel.todayPromise }).extend(settings.extend);
            var _dateForValidation = ko.computed({ //eslint-disable-line no-unused-vars
                read: function () {
                    if (HebrewBasePart.isFull(self.day) && HebrewBasePart.isFull(self.month) && HebrewBasePart.isFull(self.year)) {
                        self.dateForValidation({ year: self.year.data.dataCode(), month: self.month.data.dataCode(), day: self.day.data.dataCode() });
                    }
                    else {
                        self.dateForValidation(undefined);
                    }
                    return self.dateForValidation();
                },
                write: self.dateForValidation

            });
        };

        HebrewDateViewModel.prototype = Object.create(ModularViewModel.prototype);
        HebrewDateViewModel.prototype.constructor = HebrewDateViewModel;
        HebrewDateViewModel.todayPromise;


        return HebrewDateViewModel;
    });
