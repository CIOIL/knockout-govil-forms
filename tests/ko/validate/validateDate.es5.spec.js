var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/// <reference path="koValidationSpecMatchers.js" />
define(['common/utilities/stringExtension', 'common/ko/validate/koValidationSpecMatchers', 'common/resources/texts/date', 'common/viewModels/languageViewModel', 'common/ko/validate/extensionRules/date', 'common/ko/globals/multiLanguageObservable'], function (stringExtension, matchers, resources, languageViewModel) {
    //eslint-disable-line max-params
    var infsMethods = require('common/infrastructureFacade/tfsMethods');
    var messages = ko.multiLanguageObservable({ resource: resources.errors });

    /*eslint-disable  no-magic-numbers*/
    describe('validate', function () {
        var testObj;
        var customMessage = 'שגיאה';
        beforeEach(function () {
            jasmine.addMatchers(matchers);
        });
        describe('extensionRules Date', function () {
            describe('date', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ date: true });
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ date: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().dateInPattern);
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value too short', function () {
                    testObj('1/02/1990');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });
                it('value contains invalid chars', function () {
                    testObj('10/JAN/1999');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10/10/99');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10.10.1999');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10-10-1999');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10 10 1999');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('2010/10/02');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('13/13/1993');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('35/12/1993');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });
                it('value date not in range', function () {
                    testObj('10/04/1890');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                    testObj('10/04/2130');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                });
                it('value valid date', function () {
                    testObj('10/04/1990');
                    expect(testObj).observableIsValid();
                });
                it('value not in valid pattern', function () {
                    testObj('1990/02/01');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });
                it('value not valid date', function () {
                    testObj('31/02/1990');
                    expect(testObj).observableIsNotValid(messages().date);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ date: { params: true, message: customMessage } });
                    testObj('text#example');
                    expect(testObj).observableIsNotValid(customMessage);
                });
                it('apply rule with null', function () {
                    testObj = ko.observable();
                    testObj.extend({ date: null });
                    testObj('01/01/1900');
                    expect(testObj).observableIsValid();
                });
            });
            describe('pastDate', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    spyOn(infsMethods, 'setFormLanguage');
                    languageViewModel.language('hebrew');
                });

                it('apply rule with null', function () {
                    testObj.extend({ pastDate: null });
                    testObj('01/01/1900');
                    expect(testObj).observableIsValid();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ pastDate: { compareTo: '01/01/1980' } });
                    var conditionalTestObj = ko.observable().extend({ pastDate: { params: { compareTo: '01/01/1980' }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('02/02/2000');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().pastDate, '01/01/1980'.addPrefix('-')));
                });

                it('value undefined, null or empty', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/1980' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value valid', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/1980' } });
                    testObj('01/01/1900');
                    expect(testObj).observableIsValid();
                });

                describe('compareTo undefined, null or empty and value not earlier than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ pastDate: { compareTo: undefined } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, 'היום'));
                    });
                    it('compareTo null', function () {
                        testObj.extend({ pastDate: { compareTo: null } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, 'היום'));
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ pastDate: { compareTo: '' } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, 'היום'));
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ pastDate: true });
                        testObj('01/01/2020');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, 'היום'));
                    });
                });

                describe('compareTo undefined, null or empty and value is earlier than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ pastDate: { compareTo: undefined } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo null', function () {
                        testObj.extend({ pastDate: { compareTo: null } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ pastDate: { compareTo: '' } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ pastDate: null });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                });

                it('compareTo observable empty', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ pastDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2017');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/2014');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, '01/01/2014'.addPrefix('-')));
                    testObj('01/01/2013');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value valid', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ pastDate: { compareTo: testObjcompareTo } });
                    testObjcompareTo('02/01/2015');
                    testObj('01/01/2010');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable not valid', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ pastDate: { compareTo: testObjcompareTo } });
                    testObjcompareTo('01/01/19');
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo observable value not past date', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ pastDate: { compareTo: testObjcompareTo } });
                    testObjcompareTo('01/01/1980');
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, '01/01/1980'.addPrefix('-')));
                });
                it('compareTo observable value not past date custom message', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ pastDate: { params: { compareTo: testObjcompareTo }, message: 'לא ניתן להזין ערך זה' } });
                    testObjcompareTo('01/01/1980');
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid('לא ניתן להזין ערך זה');
                });
                it('compareTo observable with date rule', function () {
                    var testObjcompareTo = ko.observable().extend({ date: true });
                    testObj.extend({ pastDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2017');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/sss');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/2014');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, '01/01/2014'.addPrefix('-')));
                    testObj('01/01/2013');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value valid', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/2015' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value not valid', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/19' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo  value not past date', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/1900' } });
                    testObj('01/01/1900');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, '01/01/1900'.addPrefix('-')));
                });
                it('value not past date', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/1900' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, '01/01/1900'.addPrefix('-')));
                });
                it('compareTo in format d/MM/yyyy', function () {
                    testObj.extend({ pastDate: { compareTo: '1/12/2030' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('value not past date with custom message name', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/1900', compareToName: 'היום' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, 'היום'));
                });
                it('value not valid', function () {
                    testObj.extend({ pastDate: { compareTo: '01/01/19000' } });
                    testObj('01/01/20');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10/04/1890');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                    testObj('10/04/2130');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ pastDate: { compareTo: '01/01/1900', message: customMessage } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('futureDate', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ futureDate: { compareTo: '01/01/1980' } });
                    var conditionalTestObj = ko.observable().extend({ futureDate: { params: { compareTo: '01/01/1980' }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('02/02/1950');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('02/02/1950');
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().futureDate, '01/01/1980'.addPrefix('-')));
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/1980' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                describe('compareTo undefined, null or empty and value not earlier than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ futureDate: { compareTo: undefined } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, 'היום'));
                    });
                    it('compareTo null', function () {
                        testObj.extend({ futureDate: { compareTo: null } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, 'היום'));
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ futureDate: { compareTo: '' } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, 'היום'));
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ futureDate: true });
                        testObj('01/01/2015');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, 'היום'));
                    });
                });

                describe('compareTo undefined, null or empty and value is earlier than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ futureDate: { compareTo: undefined } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo null', function () {
                        testObj.extend({ futureDate: { compareTo: null } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ futureDate: { compareTo: '' } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ futureDate: null });
                        testObj('01/01/2020');
                        expect(testObj).observableIsValid();
                    });
                });

                it('compareTo observable empty', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ futureDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value valid', function () {
                    var testObjcompareTo = ko.observable('01/01/2015');
                    testObj.extend({ futureDate: { compareTo: testObjcompareTo } });
                    testObj('02/01/2015');
                    //testObjcompareTo();
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value not valid', function () {
                    var testObjcompareTo = ko.observable('01/01/19');
                    testObj.extend({ futureDate: { compareTo: testObjcompareTo } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo observable value not past date', function () {
                    var testObjcompareTo = ko.observable('01/01/2000');
                    testObj.extend({ futureDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/1980');
                    // testObjcompareTo();
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, '01/01/2000'.addPrefix('-')));
                });
                it('compareTo observable with date rule', function () {
                    var testObjcompareTo = ko.observable().extend({ date: true });
                    testObj.extend({ futureDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2017');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/sss');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/2050');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, '01/01/2050'.addPrefix('-')));
                    testObj('01/01/2052');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value valid', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/2000' } });
                    testObj('01/01/2015');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value not valid', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/19' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo  value not future date', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/2000' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, '01/01/2000'.addPrefix('-')));
                });
                it('value not future date', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/2000' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, '01/01/2000'.addPrefix('-')));
                });
                it('value not valid', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/1980' } });
                    testObj('01/01/20');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10/04/1890');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                    testObj('10/04/2130');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                });
                it('value not future date custom message name', function () {
                    testObj.extend({ futureDate: { compareTo: '01/01/2000', compareToName: 'היום' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, 'היום'));
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ futureDate: { compareTo: '01/01/1980', message: customMessage } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('untilDate', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ untilDate: { compareTo: '01/01/1980' } });
                    var conditionalTestObj = ko.observable().extend({ untilDate: { params: { compareTo: '01/01/1980' }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('02/02/2000');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().untilDate, '01/01/1980'));
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/1980' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                describe('compareTo undefined, null or empty and value not later than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ untilDate: { compareTo: undefined } });
                        testObj('01/01/2050');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, 'היום'));
                    });
                    it('compareTo null', function () {
                        testObj.extend({ untilDate: { compareTo: null } });
                        testObj('01/01/2050');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, 'היום'));
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ untilDate: { compareTo: '' } });
                        testObj('01/01/2050');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, 'היום'));
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ untilDate: true });
                        testObj('01/01/2050');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, 'היום'));
                    });
                });

                describe('compareTo undefined, null or empty and value is later than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ untilDate: { compareTo: undefined } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo null', function () {
                        testObj.extend({ untilDate: { compareTo: null } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ untilDate: { compareTo: '' } });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ untilDate: true });
                        testObj('01/01/2015');
                        expect(testObj).observableIsValid();
                    });
                });

                it('compareTo null', function () {
                    testObj.extend({ untilDate: { compareTo: null } });
                    testObj('01/01/2010');
                    expect(testObj).observableIsValid();
                });

                it('compareTo observable with date rule', function () {
                    var testObjcompareTo = ko.observable().extend({ date: true });
                    testObj.extend({ untilDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2014');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/sss');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/2012');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, '01/01/2012'));
                    testObj('01/01/2010');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable empty', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ untilDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2020');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/2014');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, '01/01/2014'));
                    testObj('01/01/2014');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value valid', function () {
                    var testObjcompareTo = ko.observable('02/01/2015');
                    testObj.extend({ untilDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2015');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value not valid', function () {
                    var testObjcompareTo = ko.observable('01/01/19');
                    testObj.extend({ untilDate: { compareTo: testObjcompareTo } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo observable value not past date', function () {
                    var testObjcompareTo = ko.observable('01/01/1980');
                    testObj.extend({ untilDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, '01/01/1980'));
                });
                it('compareTo  value valid', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/2000' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value not valid', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/19' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo  value not past date', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/1970' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, '01/01/1970'));
                });
                it('compareTo is equal to value', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/1980' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsValid();
                });
                it('value not past date', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/1900' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, '01/01/1900'));
                });
                it('value not past date with custom message name', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/1900', compareToName: 'היום' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().untilDate, 'היום'));
                });
                it('value not valid', function () {
                    testObj.extend({ untilDate: { compareTo: '01/01/1900' } });
                    testObj('19');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                    testObj('10/04/1890');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                    testObj('10/04/2130');
                    expect(testObj).observableIsNotValid(messages().dateInRange);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ untilDate: { compareTo: '01/01/1900', message: customMessage } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('sinceDate', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ sinceDate: { compareTo: '01/01/1980' } });
                    var conditionalTestObj = ko.observable().extend({ sinceDate: { params: { compareTo: '01/01/1980' }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('02/02/1950');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('02/02/1950');
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().sinceDate, '01/01/1980'.addPrefix('-')));
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/1930' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                describe('compareTo undefined, null or empty and value not later than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ sinceDate: { compareTo: undefined } });
                        testObj('01/01/2010');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, 'היום'));
                    });
                    it('compareTo null', function () {
                        testObj.extend({ sinceDate: { compareTo: null } });
                        testObj('01/01/2010');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, 'היום'));
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ sinceDate: { compareTo: '' } });
                        testObj('01/01/2010');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, 'היום'));
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ sinceDate: null });
                        testObj('01/01/2010');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, 'היום'));
                    });
                });

                describe('compareTo undefined, null or empty and value is later than default', function () {
                    it('compareTo undefined', function () {
                        testObj.extend({ sinceDate: { compareTo: undefined } });
                        testObj('01/01/2050');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo null', function () {
                        testObj.extend({ sinceDate: { compareTo: null } });
                        testObj('01/01/2050');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo empty', function () {
                        testObj.extend({ sinceDate: { compareTo: '' } });
                        testObj('01/01/2050');
                        expect(testObj).observableIsValid();
                    });
                    it('compareTo not sent', function () {
                        testObj.extend({ sinceDate: null });
                        testObj('01/01/2050');
                        expect(testObj).observableIsValid();
                    });
                });

                it('compareTo observable empty', function () {
                    var testObjcompareTo = ko.observable();
                    testObj.extend({ sinceDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2010');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value valid', function () {
                    var testObjcompareTo = ko.observable('02/12/2014');
                    testObj.extend({ sinceDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2015');
                    expect(testObj).observableIsValid();
                });
                it('compareTo observable value not valid', function () {
                    var testObjcompareTo = ko.observable('01/01/19');
                    testObj.extend({ sinceDate: { compareTo: testObjcompareTo } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo observable value not future date', function () {
                    var testObjcompareTo = ko.observable('01/01/2000');
                    testObj.extend({ sinceDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, '01/01/2000'.addPrefix('-')));
                });
                it('compareTo observable with date rule', function () {
                    var testObjcompareTo = ko.observable().extend({ date: true });
                    testObj.extend({ sinceDate: { compareTo: testObjcompareTo } });
                    testObj('01/01/2014');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/sss');
                    expect(testObj).observableIsValid();
                    testObjcompareTo('01/01/2020');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, '01/01/2020'.addPrefix('-')));
                    testObj('01/01/2021');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value valid', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/2000' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('compareTo  value not valid', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/19' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('compareTo  value not future date', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/1990' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, '01/01/1990'.addPrefix('-')));
                });
                it('compareTo is equal to value', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/1980' } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsValid();
                });
                it('value not future date', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/2010' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, '01/01/2010'.addPrefix('-')));
                });
                it('value not past date with custom message name', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/2010', compareToName: 'היום' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().sinceDate, 'היום'));
                });
                it('value not valid', function () {
                    testObj.extend({ sinceDate: { compareTo: '01/01/1900' } });
                    testObj('19');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ sinceDate: { compareTo: '01/01/2000', message: customMessage } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('between2Dates', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: '01/01/2015' } });
                    var conditionalTestObj = ko.observable().extend({ between2Dates: { params: { fromDate: '01/01/1999', toDate: '01/01/2015' }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('02/02/1950');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('02/02/1950');
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().between2Dates, ['01/01/1999', '01/01/2015']));
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ between2Dates: { fromDate: '01/01/1930', toDate: '01/01/1950' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: '01/01/2015' } });
                    testObj('01/01/20');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });
                it('value valid', function () {
                    testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: '01/01/2015' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('value valid and not between the 2 dates', function () {
                    testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: '01/01/2015' } });
                    testObj('01/01/1995');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().between2Dates, ['01/01/1999', '01/01/2015']));
                });
                describe('fromDate/toDate undefined, null or empty', function () {
                    it('fromDate null', function () {
                        testObj.extend({ between2Dates: { fromDate: null, toDate: '01/01/2015' } });
                        expect(function () {
                            testObj('01/01/2000');
                        }).toThrow();
                    });
                    it('toDate null', function () {
                        testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: null } });
                        expect(function () {
                            testObj('01/01/2000');
                        }).toThrow();
                    });
                    it('fromDate undefined', function () {
                        testObj.extend({ between2Dates: { fromDate: undefined, toDate: '01/01/2015' } });
                        expect(function () {
                            testObj('01/01/2000');
                        }).toThrow();
                    });
                    it('toDate undefined', function () {
                        testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: undefined } });
                        expect(function () {
                            testObj('01/01/2000');
                        }).toThrow();
                    });
                    it('fromDate empty', function () {
                        testObj.extend({ between2Dates: { fromDate: '', toDate: '01/01/2015' } });
                        expect(function () {
                            testObj('01/01/2000');
                        }).toThrow();
                    });
                    it('toDate empty', function () {
                        testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: '' } });
                        expect(function () {
                            testObj('01/01/2000');
                        }).toThrow();
                    });
                });

                describe('fromDate or toDate observable', function () {
                    it('fromDate or toDate observable empty', function () {
                        var fromDate = ko.observable('');
                        var toDate = ko.observable('');
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate } });
                        testObj('01/01/2000');
                        expect(testObj).observableIsValid();
                    });

                    it('fromDate observable empty value is before toDate', function () {
                        var fromDate = ko.observable('');
                        var toDate = ko.observable('01/01/2015');
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate } });
                        testObj('01/01/2010');
                        expect(testObj).observableIsValid();
                    });

                    it('fromDate observable empty value is not before toDate', function () {
                        var fromDate = ko.observable('');
                        var toDate = ko.observable('01/01/2015');
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().pastDate, ['01/01/2015']));
                    });

                    it('toDate observable empty value is after fromDate', function () {
                        var fromDate = ko.observable('01/01/2000');
                        var toDate = ko.observable('');
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsValid();
                    });

                    it('toDate observable empty value is not after fromDate', function () {
                        var fromDate = ko.observable('01/01/2000');
                        var toDate = ko.observable('');
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate } });
                        testObj('01/01/1995');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, ['01/01/2000']));
                    });

                    it('fromDate observable valid', function () {
                        var testParam = ko.observable();
                        testObj.extend({ between2Dates: { fromDate: testParam, toDate: '01/01/2015' } });
                        testParam('01/01/1999');
                        testObj('01/01/2010');
                        expect(testObj).observableIsValid();
                    });

                    it('toDate observable valid', function () {
                        var testParam = ko.observable();
                        testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: testParam } });
                        testParam('01/01/2015');
                        expect(testObj).observableIsValid();
                    });

                    it('fromDate observable not valid', function () {
                        var testParam = ko.observable();
                        testObj.extend({ between2Dates: { fromDate: testParam, toDate: '01/01/2015' } });
                        testParam('01/01/19');
                        expect(function () {
                            testObj('01/01/2010');
                        }).toThrow();
                    });

                    it('toDate observable not valid', function () {
                        var testParam = ko.observable();
                        testObj.extend({ between2Dates: { fromDate: testParam, toDate: '01/01/2015' } });
                        testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: testParam } });
                        testParam('01/01/19');
                        expect(function () {
                            testObj('01/01/2010');
                        }).toThrow();
                    });

                    it('value not valid, message params sent', function () {
                        var fromDate = ko.observable('01/01/2000');
                        var toDate = ko.observable('01/01/2015');
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate, fromName: 'תאריך גיוס', toName: 'תאריך שחרור' } });
                        testObj('01/01/2020');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().between2Dates, ['תאריך גיוס', 'תאריך שחרור']));
                    });

                    it('fromDate and toDate observables with date rule', function () {
                        var fromDate = ko.observable('').extend({ date: true });
                        var toDate = ko.observable('').extend({ date: true });
                        testObj.extend({ between2Dates: { fromDate: fromDate, toDate: toDate } });
                        testObj('01/01/2000');
                        expect(testObj).observableIsValid();
                        fromDate('01/01/aaa');
                        expect(testObj).observableIsValid();
                        fromDate('01/01/2005');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().futureDate, ['01/01/2005']));
                        toDate('01/01/aaa');
                        testObj('01/01/2010');
                        expect(testObj).observableIsValid();
                        toDate('01/01/2020');
                        expect(testObj).observableIsValid();
                    });
                });

                it('value valid and toDate not set', function () {
                    testObj.extend({ between2Dates: { fromDate: '01/01/1999' } });
                    expect(function () {
                        testObj('10/10/2000');
                    }).toThrow();
                });
                it('value valid and fromDate not set', function () {
                    testObj.extend({ between2Dates: { toDate: '01/01/1999' } });
                    expect(function () {
                        testObj('10/10/2000');
                    }).toThrow();
                });
                it('fromDate is not earlier than toDate', function () {
                    testObj.extend({ between2Dates: { fromDate: '01/01/2015', toDate: '01/01/1999' } });
                    testObj('01/01/2010');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().between2Dates, ['01/01/2015', '01/01/1999']));
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ between2Dates: { fromDate: '01/01/1999', toDate: '01/01/2015', message: customMessage } });
                    testObj('01/01/1980');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('isOlder', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    var conditionalTestObj = ko.observable().extend({ isOlder: { params: { currentDate: '25/01/2016', age: 18, subject: 'התובע' }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('02/02/2020');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('02/02/2020');
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().isOlder, ['התובע', 18]));
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ isOlder: { currentDate: '01/01/2016', age: 18, subject: 'התובע' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    testObj('01/01/20');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });
                it('value valid', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    testObj('01/01/1994');
                    expect(testObj).observableIsValid();
                });
                it('currentDate undefined', function () {
                    testObj.extend({ isOlder: { currentDate: undefined, age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate null', function () {
                    testObj.extend({ isOlder: { currentDate: null, age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate empty', function () {
                    testObj.extend({ isOlder: { currentDate: '', age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate invalid', function () {
                    testObj.extend({ isOlder: { currentDate: '01/11111', age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate observable', function () {
                    var currentTest = ko.observable('01/01/2016');
                    testObj.extend({ isOlder: { currentDate: currentTest, age: 18, subject: 'התובע' } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('age null', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: null, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age undefined', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: undefined, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age empty', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: '', subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age invalid', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 'aa', subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age observable', function () {
                    var ageTest = ko.observable(18);
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: ageTest, subject: 'התובע' } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('subject null', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: null } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('subject undefined', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: undefined } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('subject empty', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: '' } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('subject invalid', function () {
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: 32 } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('subject observable', function () {
                    var subjectTest = ko.observable('התובע');
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, subject: subjectTest } });
                    testObj('01/01/1992');
                    expect(testObj).observableIsValid();
                });
                it('parameter missing', function () {
                    testObj.extend({ isOlder: { age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });

                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ isOlder: { currentDate: '25/01/2016', age: 18, message: customMessage } });
                    testObj('01/01/2017');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('isYounger', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value not valid date', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    testObj('01/01/20');
                    expect(testObj).observableIsNotValid(messages().dateInPattern);
                });

                it('subject is not younger', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    testObj('01/01/2020');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().isYounger, ['התובע', 18]));
                });

                it('value valid', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 'התובע' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('currentDate undefined', function () {
                    testObj.extend({ isYounger: { currentDate: undefined, age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate null', function () {
                    testObj.extend({ isYounger: { currentDate: null, age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate empty', function () {
                    testObj.extend({ isYounger: { currentDate: '', age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate invalid', function () {
                    testObj.extend({ isYounger: { currentDate: '01/11111', age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/1995');
                    }).toThrow();
                });
                it('currentDate observable', function () {
                    var currentTest = ko.observable('01/01/2016');
                    testObj.extend({ isYounger: { currentDate: currentTest, age: 18, subject: 'התובע' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('age null', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: null, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age undefined', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: undefined, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age empty', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: '', subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age invalid', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 'aa', subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('age observable', function () {
                    var ageTest = ko.observable(18);
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: ageTest, subject: 'התובע' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('subject null', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: null } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('subject undefined', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: undefined } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('subject empty', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: '' } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('subject invalid', function () {
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: 32 } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('subject observable', function () {
                    var subjectTest = ko.observable('התובע');
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, subject: subjectTest } });
                    testObj('01/01/2000');
                    expect(testObj).observableIsValid();
                });
                it('parameter missing', function () {
                    testObj.extend({ isYounger: { age: 18, subject: 'התובע' } });
                    expect(function () {
                        testObj('01/01/2000');
                    }).toThrow();
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ isYounger: { currentDate: '25/01/2016', age: 18, message: customMessage } });
                    testObj('01/01/1995');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('time', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ time: true });
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ time: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().time);
                });
                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value too long', function () {
                    testObj('10:52:00');
                    expect(testObj).observableIsNotValid(messages().time);
                });
                it('value too short', function () {
                    testObj('10');
                    expect(testObj).observableIsNotValid(messages().time);
                });
                it('value contains invalid chars', function () {
                    testObj('10.10');
                    expect(testObj).observableIsNotValid(messages().time);
                    testObj('10h10');
                    expect(testObj).observableIsNotValid(messages().time);
                    testObj('10-10');
                    expect(testObj).observableIsNotValid(messages().time);
                    testObj('10 10');
                    expect(testObj).observableIsNotValid(messages().time);
                });
                it('value not valid time', function () {
                    testObj('10:70');
                    expect(testObj).observableIsNotValid(messages().time);
                    testObj('25:30');
                    expect(testObj).observableIsNotValid(messages().time);
                });
                it('value valid time', function () {
                    testObj('10:30');
                    expect(testObj).observableIsValid();
                    testObj('00:59');
                    expect(testObj).observableIsValid();
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ time: { message: customMessage, params: true } });
                    testObj('10:70');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
        });
    });
});
/*eslint-enable  no-magic-numbers*/
define('spec/validateDateSpec.js', function () {});