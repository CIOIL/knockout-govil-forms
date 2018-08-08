define(['common/ko/validate/koValidationSpecMatchers', 'common/utilities/stringExtension', 'common/resources/texts/date', 'common/utilities/hebrewDateMethods', 'common/viewModels/languageViewModel', 'common/ko/validate/extensionRules/hebrewDate', 'common/ko/globals/multiLanguageObservable'], function (matchers, stringExtension, resources, hebrewDateMethods, languageViewModel) {
    //eslint-disable-line max-params
    var infsMethods = require('common/infrastructureFacade/tfsMethods');
    var messages = ko.multiLanguageObservable({ resource: resources.errors });

    /*eslint-disable  no-magic-numbers*/
    describe('validate', function () {
        var testObj;
        hebrewDateMethods.todayCodes({ year: 5776, month: 11, day: 22 });
        beforeEach(function () {
            jasmine.addMatchers(matchers);
        });
        describe('extensionRules HebrewDate', function () {
            describe('pastHebrewDate', function () {
                var compareTo = { year: 5776, month: 7, day: 3 };
                var compareToName = 'ג\' אדר ב\' תשע"ו';
                beforeEach(function () {
                    testObj = ko.observable();
                    spyOn(infsMethods, 'setFormLanguage');
                    languageViewModel.language('hebrew');
                });

                it('value valid', function () {
                    testObj.extend({ pastHebrewDate: { compareTo: compareTo } });
                    testObj({ year: 5776, month: 7, day: 1 });
                    expect(testObj).observableIsValid();
                });

                it('value undefined', function () {
                    testObj.extend({ pastHebrewDate: { compareTo: compareTo } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj.extend({ pastHebrewDate: { compareTo: compareTo, compareToName: compareToName } });
                    testObj({ year: 5776, month: 8, day: 3 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, compareToName));
                });
                it('use default message', function () {
                    testObj.extend({ pastHebrewDate: { compareTo: compareTo } });
                    testObj({ year: 5776, month: 8, day: 3 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, 'היום'));
                });

                it('params is undefined', function () {
                    testObj.extend({ pastHebrewDate: undefined });
                    expect(function () {
                        testObj({ year: 5776, month: 7, day: 1 });
                    }).toThrow();
                });
                it('compareTo is undefined', function () {
                    testObj.extend({ pastHebrewDate: {} });
                    testObj({ year: 5776, month: 7, day: 1 });
                    expect(testObj).observableIsValid();
                });

                it('value empty', function () {
                    testObj.extend({ pastHebrewDate: { compareTo: compareTo } });
                    testObj('');
                    expect(testObj).observableIsValid();
                });
            });
            describe('futureHebrewDate', function () {
                var compareTo = { year: 5776, month: 2, day: 2 };
                var compareToName = 'ב\' חשון תשע"ו';

                beforeEach(function () {
                    testObj = ko.observable();
                });
                it('value valid', function () {
                    testObj.extend({ futureHebrewDate: { compareTo: compareTo } });
                    testObj({ year: 5776, month: 7, day: 1 });
                    expect(testObj).observableIsValid();
                });
                it('value undefined', function () {
                    testObj.extend({ futureHebrewDate: { compareTo: compareTo } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj.extend({ futureHebrewDate: { compareTo: compareTo, compareToName: compareToName } });
                    testObj({ year: 5776, month: 1, day: 1 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, compareToName));
                });
                it('use default message', function () {
                    testObj.extend({ futureHebrewDate: { compareTo: compareTo } });
                    testObj({ year: 5776, month: 1, day: 1 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, 'היום'));
                });
                it('params is undefined', function () {
                    testObj.extend({ futureHebrewDate: undefined });
                    expect(function () {
                        testObj({ year: 5776, month: 7, day: 1 });
                    }).toThrow();
                });
                it('compareTo is undefined', function () {
                    testObj.extend({ futureHebrewDate: {} });
                    testObj({ year: 5876, month: 7, day: 1 });
                    expect(testObj).observableIsValid();
                });
                it('value empty', function () {
                    testObj.extend({ futureHebrewDate: { compareTo: compareTo } });
                    testObj('');
                    expect(testObj).observableIsValid();
                });
            });
            describe('untilHebrewDate', function () {
                var compareTo = { year: 5776, month: 7, day: 3 };
                var compareToName = 'ג\' אדר ב\' תשע"ו'; //eslint-disable-line no-unused-vars
                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('value valid', function () {
                    testObj.extend({ untilHebrewDate: { compareTo: compareTo } });
                    testObj(compareTo);
                    expect(testObj).observableIsValid();
                });

                it('value undefined', function () {
                    testObj.extend({ untilHebrewDate: { compareTo: compareTo } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj.extend({ untilHebrewDate: { compareTo: compareTo, compareToName: compareToName } });
                    testObj({ year: 5776, month: 8, day: 3 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, compareToName));
                });
                it('use default message', function () {
                    testObj.extend({ untilHebrewDate: { compareTo: compareTo } });
                    testObj({ year: 5776, month: 8, day: 3 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, 'היום'));
                });

                it('params is undefined', function () {
                    testObj.extend({ untilHebrewDate: undefined });
                    expect(function () {
                        testObj({ year: 5776, month: 7, day: 1 });
                    }).toThrow();
                });
                it('compareTo is undefined', function () {
                    testObj.extend({ untilHebrewDate: {} });
                    testObj({ year: 5776, month: 7, day: 1 });
                    expect(testObj).observableIsValid();
                });

                it('value empty', function () {
                    testObj.extend({ untilHebrewDate: { compareTo: compareTo } });
                    testObj('');
                    expect(testObj).observableIsValid();
                });
            });

            describe('between2HebrewDates', function () {
                var fromDate = { year: 5776, month: 7, day: 3 };
                var fromDateName = 'ג\' אדר ב\' תשע"ו';
                var toDate = { year: 5776, month: 8, day: 3 };
                var toDateName = 'ג\' ניסן תשע"ו';
                beforeEach(function () {
                    testObj = ko.observable();
                });
                it('value valid', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: toDate } });
                    testObj({ year: 5776, month: 7, day: 5 });
                    expect(testObj).observableIsValid();
                });
                it('value undefined', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: toDate } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                });
                it('value null', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: toDate } });
                    testObj(null);
                    expect(testObj).observableIsValid();
                });
                it('value empty', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: toDate } });
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid and not between the 2 dates', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, fromDateName: fromDateName, toDateName: toDateName, toDate: toDate } });
                    testObj({ year: 5776, month: 6, day: 3 });
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().between2Dates, [fromDateName, toDateName]));
                });

                it('value not valid ', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, fromDateName: fromDateName, toDateName: toDateName, toDate: toDate } });
                    testObj('fffff');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().between2Dates, [fromDateName, toDateName]));
                });
                it('fromDate null', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: null, toDate: toDate } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).toThrow();
                });
                it('toDate null', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: null } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).toThrow();
                });

                it('fromDate undefined', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: undefined, toDate: toDate } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).not.toThrow();
                });
                it('toDate undefined', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: undefined } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).not.toThrow();
                });
                it('fromDate empty', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: '', toDate: toDate } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).toThrow();
                });
                it('toDate empty', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate, toDate: '' } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).toThrow();
                });

                it('value valid and toDate not set', function () {
                    testObj.extend({ between2HebrewDates: { fromDate: fromDate } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).not.toThrow();
                });
                it('value valid and fromDate not set', function () {
                    testObj.extend({ between2HebrewDates: { toDate: '01/01/1999' } });
                    expect(function () {
                        testObj({ year: 5776, month: 6, day: 3 });
                    }).not.toThrow();
                });
            });
        });
    });
});
/*eslint-enable  no-magic-numbers*/
define('spec/validateDateSpec.js', function () {});