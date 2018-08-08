define(['common/resources/exeptionMessages', 'common/utilities/stringExtension', 'common/core/exceptions', 'common/viewModels/languageViewModel', 'common/infrastructureFacade/tfsMethods', 'common/ko/globals/multiLanguageObservable'],

function (exeptionMessages, stringExtension, exceptions, languageViewModel, infsMethods) { //eslint-disable-line max-params

    var datesResources = {
        labels: {
            hebrew: {
                day: 'יום',
                month: 'חודש',
                year: 'שנה'
            },
            english: {
                day: 'day',
                month: 'month',
                year: 'year'
            }
        }

    };

    describe('ko.multiLanguageObservable', function () {

        beforeEach(function () {

            var fakeAgatAccess = function (language) {
                return language;
            };

            spyOn(infsMethods, 'setFormLanguage').and.callFake(fakeAgatAccess);
        });

        it('should be defined', function () {
            expect(ko.multiLanguageObservable).toBeDefined();
        });

        describe('returns language resource', function () {

            it('as computed observable', function () {
                expect(ko.isComputed(ko.multiLanguageObservable({ language: 'english', resource: datesResources.labels }))).toBeTruthy();
            });

            it('for static language parameter', function () {
                expect(ko.multiLanguageObservable({ language: 'english', resource: datesResources.labels })().day).toEqual(datesResources.labels.english.day);
                expect(ko.multiLanguageObservable({ language: 'hebrew', resource: datesResources.labels })().day).toEqual(datesResources.labels.hebrew.day);
            });

            it('for dynamic language parameter', function () {
                expect(ko.multiLanguageObservable({ language: ko.observable('english'), resource: datesResources.labels })().day).toEqual(datesResources.labels.english.day);
                expect(ko.multiLanguageObservable({ language: ko.observable('hebrew'), resource: datesResources.labels })().day).toEqual(datesResources.labels.hebrew.day);
            });

            it('language parameter is taken before languageViewModel', function () {
                languageViewModel.language('hebrew');
                expect(ko.multiLanguageObservable({
                    language: ko.observable('english'),
                    resource: datesResources.labels
                })().day).toEqual(datesResources.labels.english.day);
            });

            it('for dynamic language in language viewModel', function () {
                languageViewModel.language('english');
                expect(ko.multiLanguageObservable({
                    resource: datesResources.labels
                })().day).toEqual(datesResources.labels.english.day);

                languageViewModel.language('hebrew');
                expect(ko.multiLanguageObservable({
                    resource: datesResources.labels
                })().day).toEqual(datesResources.labels.hebrew.day);
            });


            it('and notify subscribers uppon parameter language change', function (done) {
                var _day,
                    delay = 500,
                    viewModel = {
                        language: ko.observable('english')
                    };
                viewModel.labels = ko.multiLanguageObservable({ language: viewModel.language, resource: datesResources.labels });

                viewModel.labels.subscribe(function (labels) {
                    _day = labels.day;
                });

                expect(viewModel.labels().day).toEqual(datesResources.labels.english.day);

                viewModel.language('hebrew');

                setTimeout(function () {
                    expect(_day).toEqual(datesResources.labels.hebrew.day);
                    done();
                }, delay);
            });

            it('and notify derived computed subscribers uppon parameter language change', function (done) {
                var _day,
                    delay = 500,
                    viewModel = {
                        language: ko.observable('english')
                    };

                viewModel.day = ko.computed(function () {
                    return ko.multiLanguageObservable({ language: viewModel.language, resource: datesResources.labels })().day;
                });

                viewModel.day.subscribe(function (newValue) {
                    _day = newValue;
                });

                expect(viewModel.day()).toEqual(datesResources.labels.english.day);

                viewModel.language('hebrew');

                setTimeout(function () {
                    expect(_day).toEqual(datesResources.labels.hebrew.day);
                    done();
                }, delay);
            });

            it('change to invalid language in viewModel will not affect', function (done) {
                var _day,
                    delay = 500,
                    viewModel = {};

                languageViewModel.language('english');

                viewModel.labels = ko.multiLanguageObservable({
                    resource: datesResources.labels
                });

                viewModel.labels.subscribe(function (labels) {
                    _day = labels.day;
                });

                expect(viewModel.labels().day).toEqual(datesResources.labels.english.day);

                languageViewModel.language('aramic');

                setTimeout(function () {
                    expect(_day).toEqual(datesResources.labels.english.day);
                    done();
                }, delay);

            });

            it('change from invalid language to valid language in viewModel will affect', function (done) {
                var _day,
                    delay = 500,
                    viewModel = {};

                languageViewModel.language('aramic');

                viewModel.labels = ko.multiLanguageObservable({
                    resource: datesResources.labels
                });

                viewModel.labels.subscribe(function (labels) {
                    _day = labels.day;
                });

                languageViewModel.language('english');

                setTimeout(function () {
                    expect(_day).toEqual(datesResources.labels.english.day);
                    done();
                }, delay);

            });

            it('and notify subscribers uppon languageViewModel change', function (done) {
                var _day,
                    delay = 500,
                    viewModel = {};

                languageViewModel.language('english');

                viewModel.labels = ko.multiLanguageObservable({
                    resource: datesResources.labels
                });

                viewModel.labels.subscribe(function (labels) {
                    _day = labels.day;
                });

                expect(viewModel.labels().day).toEqual(datesResources.labels.english.day);

                languageViewModel.language('hebrew');

                setTimeout(function () {
                    expect(_day).toEqual(datesResources.labels.hebrew.day);
                    done();
                }, delay);
            });

            it('and notify derived computed subscribers uppon languageViewModel change', function (done) {
                var _day,
                    delay = 500,
                    viewModel = {};

                languageViewModel.language('english');

                viewModel.day = ko.computed(function () {
                    return ko.multiLanguageObservable({ resource: datesResources.labels })().day;
                });

                viewModel.day.subscribe(function (newValue) {
                    _day = newValue;
                });

                expect(viewModel.day()).toEqual(datesResources.labels.english.day);

                languageViewModel.language('hebrew');

                setTimeout(function () {
                    expect(_day).toEqual(datesResources.labels.hebrew.day);
                    done();
                }, delay);
            });
        });

        describe('exceptions', function () {
            it('settings should be defined', function () {
                expect(function () {
                    ko.multiLanguageObservable();
                }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'multiLanguageObservable'));
            });

            it('settings should be object', function () {
                expect(function () {
                    ko.multiLanguageObservable('some text');
                }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'multiLanguageObservable'));
            });

            it('settings.resource - should be defined', function () {                
                expect(function () {
                    ko.multiLanguageObservable({ language: 'english' });
                }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'multiLanguageObservable'));
            });

            it('throw when  the language is not found ', function () {
                expect(function () {
                    ko.multiLanguageObservable({ language: 'english', resource: { } });
                }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'multiLanguageObservable'));
            });

            it('throw when the language is not found - incorrect language', function () {
                expect(function () {
                    ko.multiLanguageObservable({ language: 'xxxx', resource: datesResources.labels });
                }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'multiLanguageObservable'));
            });

            it('change language after binding to multiLanguageObservable', function () {
                
                expect(function () {
                    languageViewModel.language('english');
                }).not.toThrowError();
            });
        });

    });
   
});
define('spec/multiLanguageObservable.js', function () { });
