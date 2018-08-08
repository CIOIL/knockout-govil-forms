define(['common/utilities/stringExtension',
    'common/ko/validate/koValidationSpecMatchers',
    'common/resources/texts/number',
    'common/resources/exeptionMessages',
    'common/ko/validate/extensionRules/number',
    'common/ko/globals/multiLanguageObservable'],

function (stringExtension, matchers, resources) {//eslint-disable-line max-params
    var messages = ko.multiLanguageObservable({ resource: resources });

    var hasRule = function (rules, ruleName) {
        return ko.utils.arrayFirst(rules, function (item) {
            return item.ruleName === ruleName || item.rule === ruleName;
        });
    };

    var customMessage = 'ערך לא תקין!!!';
    describe('validate', function () {
        var testObj;
        beforeEach(function () {
            jasmine.addMatchers(matchers);
        });

        describe('extensionRules Number', function () {
            describe('decimal', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ decimal: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ decimal: null });
                    testWithNull('333');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ decimal: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().decimal);
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid', function () {
                    testObj('3156.66');
                    expect(testObj).observableIsValid();
                    testObj('333');
                    expect(testObj).observableIsValid();
                });

                it('value not valid', function () {
                    testObj('.1');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('fd gfd gfd');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('336.325.14');
                    expect(testObj).observableIsNotValid(messages().decimal);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ decimal: { params: true, message: customMessage } });
                    testObj('text');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('only decimal', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ onlyDecimal: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ onlyDecimal: null });
                    testWithNull('3156.66');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ onlyDecimal: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('333');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().decimal);
                });
                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid', function () {
                    testObj('3156.66');
                    expect(testObj).observableIsValid();
                });

                it('value not valid', function () {
                    testObj('.1');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('333');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('fd gfd gfd');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('336.325.14');
                    expect(testObj).observableIsNotValid(messages().decimal);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ onlyDecimal: { params: true, message: customMessage } });
                    testObj('text');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('integer', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ integer: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ integer: null });
                    testWithNull('21');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ integer: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('336.3');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().integer);
                });
                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid numeric string', function () {
                    testObj('3');
                    expect(testObj).observableIsValid();
                });
                it('value valid string', function () {
                    testObj(3156);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsValid();
                });

                it('value not valid', function () {
                    testObj('fd gfd gfd');
                    expect(testObj).observableIsNotValid(messages().integer);
                });
                it('value not valid numeric string', function () {
                    testObj('336.3');
                    expect(testObj).observableIsNotValid(messages().integer);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ onlyDecimal: { integer: true, message: customMessage } });
                    testObj('text');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('signedNumber', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ signedNumber: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ signedNumber: null });
                    testWithNull('-21');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ signedNumber: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('336.3');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().signedNumber);
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid', function () {
                    testObj('37');
                    expect(testObj).observableIsValid();
                    testObj(-6);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsValid();
                });

                it('value not number', function () {
                    testObj('fd');
                    expect(testObj).observableIsNotValid(messages().signedNumber);
                });
                it('value not valid with .', function () {
                    testObj('6.3');
                    expect(testObj).observableIsNotValid(messages().signedNumber);
                });
                it('value not valid with +', function () {
                    testObj('+77');
                    expect(testObj).observableIsNotValid(messages().signedNumber);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ onlyDecimal: { signedNumber: true, message: customMessage } });
                    testObj('text');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('decimalWithParam', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ decimalWithParam: { beforePoint: 1, afterPoint: 2 } });
                    var conditionalTestObj = ko.observable().extend({ decimalWithParam: { params: { beforePoint: 1, afterPoint: 2 }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj(22.33);//eslint-disable-line no-magic-numbers
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().decimalWithParam, '1', '2'));
                });
                it('obserbale has rule or ruleName "maxLength"', function () {
                    testObj.extend({ decimalWithParam: { beforePoint: 1, afterPoint: 2 } });
                    expect(hasRule(testObj.rules(), 'maxLength')).toBeTruthy();
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ decimalWithParam: { beforePoint: 1, afterPoint: 2 } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid and not sent beforePoint', function () {
                    expect(function () { testObj.extend({ decimalWithParam: { afterPoint: '2' } }); testObj('151'); }).toThrow();
                });
                it('value valid and not sent afterPoint', function () {
                    expect(function () { testObj.extend({ decimalWithParam: { beforePoint: '2' } }); testObj('151'); }).toThrow();
                });
                it('Parameters beforePoint and afterPoint  null', function () {
                    expect(function () { testObj.extend({ decimalWithParam: { beforePoint: null, afterPoint: null } }); testObj('2'); }).toThrow();
                    //expect(testObj).observableIsValid();
                });

                it('Parameters beforePoint and afterPoint  valid', function () {
                    testObj.extend({ decimalWithParam: { beforePoint: 2, afterPoint: '2' } });
                    testObj(22.33);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsValid();
                });
                it('Parameters beforePoint and afterPoint  not valid afterPoint', function () {
                    testObj.extend({ decimalWithParam: { beforePoint: '2', afterPoint: 1 } });
                    testObj(22.33);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().decimalWithParam, '2', 1));
                });
                it('Parameters beforePoint and afterPoint not valid beforePoint', function () {
                    testObj.extend({ decimalWithParam: { beforePoint: '1', afterPoint: '2' } });
                    testObj(22.33);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().decimalWithParam, '1', '2'));
                });
                it('value not number', function () {
                    testObj.extend({ decimalWithParam: { beforePoint: 2, afterPoint: 2 } });
                    testObj('גדג');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('dsadf');
                    expect(testObj).observableIsNotValid(messages().decimal);
                    testObj('-');
                    expect(testObj).observableIsNotValid(messages().decimal);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ decimalWithParam: { params: { beforePoint: 1, afterPoint: 2 }, message: customMessage } });
                    testObj('text');
                    expect(testObj).observableIsNotValid(customMessage);
                    testObj(22.33);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('range', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ range: { min: 1, max: 9 } });
                    var conditionalTestObj = ko.observable().extend({ range: { params: { min: 1, max: 9 }, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('12345678922');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().max, 9));
                });

                it('value undefined, null or empty', function () {
                    testObj.extend({ range: { min: 1, max: 9 } });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value valid and dont send min', function () {
                    expect(function () { testObj.extend({ range: { max: 9 } }); testObj(5); }).toThrow();
                });
                it('value valid and dont send max', function () {
                    expect(function () { testObj.extend({ range: { min: 1 } }); testObj(5); }).toThrow();
                });
                //it('Parameters min and max  null', function () {
                //    expect(function () { testObj.extend({ range: { min: null, max: null } }); testObj(5); }).toThrow();
                //});
                it('Parameters min and max are string with numeric value', function () {
                    var testObjmin = '1';
                    var testObjmax = '9';
                    testObj.extend({ range: { min: testObjmin, max: testObjmax } });
                    testObj(5);
                    expect(testObj.isValid()).toBeTruthy();
                });
                it('Parameters min and max are string with un-numeric value', function () {
                    var testObjmin = 'a';
                    var testObjmax = 'b';
                    expect(function () { testObj.extend({ range: { min: testObjmin, max: testObjmax } }); }).toThrow();

                });

                it('Parameters min and max  valid', function () {
                    testObj.extend({ range: { min: 1, max: 9 } });
                    testObj(5);
                    expect(testObj).observableIsValid();
                });
                it('value equals to min is valid', function () {
                    testObj.extend({ range: { min: 1, max: 9 } });
                    testObj(1);
                    expect(testObj).observableIsValid();
                });
                it('value equals to max is valid', function () {
                    testObj.extend({ range: { min: 1, max: 9 } });
                    testObj(9);
                    expect(testObj).observableIsValid();
                });
                it('value less than min is invalid', function () {
                    testObj.extend({ range: { min: 1, max: 9 } });
                    testObj(0);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().min, 1));
                });
                it('value grater than max is invalid', function () {
                    testObj.extend({ range: { min: 1, max: 8 } });
                    testObj(9);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().max, 8));
                });
                it('value not number', function () {
                    testObj.extend({ range: { min: 1, max: 9 } });
                    testObj('גדג');
                    expect(testObj).observableIsNotValid(messages().number);
                    testObj('dsadf');
                    expect(testObj).observableIsNotValid(messages().number);
                    //testObj('-');
                    //expect(testObj).observableIsNotValid(messages().number);
                });
                it('max & min as computed number value ', function () {
                    var maxComputed = ko.computed(() =>'10');
                    testObj.extend({ range: { min: ko.observable('1'), max: maxComputed } });
                    testObj(9);
                    expect(testObj).observableIsValid();
                });
                it('only max  as computed number value ', function () {
                    var maxComputed = ko.computed(() =>'10');
                    testObj.extend({ range: { min: 3, max: maxComputed } });
                    testObj(9);
                    expect(testObj).observableIsValid();
                });
                it('min as computed and the value less min ', function () {
                    var maxComputed = ko.computed(() =>'10');
                    testObj.extend({ range: { min: ko.observable('4'), max: maxComputed } });
                    testObj(3);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().min, 4));
                });
                it('max as observable not number ', function () {
                    expect(function () { testObj.extend({ range: { min: 3, max: ko.observable('abc') } }); }).toThrow();

                });
            });
            describe('greaterThan', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ greaterThan: 5 });
                    var conditionalTestObj = ko.observable().extend({ greaterThan: { params: 5, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('123456ggg78922');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().number);
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ greaterThan: 5 });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid', function () {

                    testObj.extend({ greaterThan: 5 });
                    testObj(7);
                    expect(testObj).observableIsValid();
                    testObj(99999999);//eslint-disable-line no-magic-numbers
                    expect(testObj).observableIsValid();
                });
                it('value less than or equal ', function () {
                    testObj.extend({ greaterThan: 5 });
                    testObj(2);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().greaterThan, 5));
                    testObj(5);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().greaterThan, 5));
                    testObj(0);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().greaterThan, 5));
                });
                it('value not number ', function () {
                    testObj.extend({ greaterThan: 5 });
                    testObj('fasfdasdf');
                    expect(testObj).observableIsNotValid(messages().number);
                });


                it('param number is valid', function () {

                    expect(function () {
                        testObj.extend({ greaterThan: 5 });
                    }).not.toThrowError();
                    expect(function () {
                        testObj.extend({ greaterThan: 0 });
                    }).not.toThrowError();


                });
                it('param numeric string is valid', function () {
                    expect(function () {
                        testObj.extend({ greaterThan: '5' });
                    }).not.toThrowError();
                });

                it('param decimal is valid', function () {
                 
                    testObj.extend({ greaterThan: '0.55' });
                    testObj('0.66');
                    expect(testObj).observableIsValid();
                });


                it('params is exists', function () {

                    testObj.extend({ greaterThan: undefined });
                    expect(testObj).observableIsValid();

                    testObj.extend({ greaterThan: true });
                    expect(testObj).observableIsValid();
                    //expect(function () {
                    //    testObj.extend({ greaterThan: undefined });
                    //}).toThrowError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'greaterThan'));

                });

                it('param is not is number', function () {
                    testObj.extend({ greaterThan: '55.ghjgjg' });
                    expect(testObj).observableIsValid();
                    //expect(function () {
                    //    testObj.extend({ greaterThan: '55.ghjgjg' });
                    //}).toThrowError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'greaterThan'));

                });
                it('param custom message', function () {
                    var message = 'aaaaaaaa';
                    testObj.extend({ greaterThan: { params: '55', message: message } });
                    testObj(2);
                    expect(testObj).observableIsNotValid(message);
                    testObj('sadfsdafasd');
                    expect(testObj).observableIsNotValid(message);
                });
                it('param is computed', function () {

                    var a = ko.observable(false);
                    var greaterValue = ko.computed(function () {
                        return a() ? 10 : 3;
                    });
                    testObj.extend({ greaterThan: greaterValue });

                    testObj(6);
                    expect(testObj).observableIsValid();
                    a(true);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().greaterThan, ko.unwrap(greaterValue)));
                });

                it('param is invalid computed', function () {

                    var computedParam = ko.observable(false);
                    var greaterValue = ko.computed(function () {
                        return computedParam() ? 'dddd' : 3;
                    });
                    testObj.extend({ greaterThan: greaterValue });

                    testObj(6);
                    expect(testObj).observableIsValid();
                    computedParam(true);
                    expect(testObj).observableIsValid();
                    //expect(function () {
                    //    computedParam(true);
                    //}).toThrowError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'greaterThan'));
                });


            });

            describe('lessThan', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                });

                it('conditional validation', function () {
                    var con = ko.observable(false);
                    testObj.extend({ lessThan: 5 });
                    var conditionalTestObj = ko.observable().extend({ lessThan: { params: 5, onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });
                    conditionalTestObj('123456ggg78922');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    expect(conditionalTestObj).observableIsNotValid(messages().number);
                });
                it('value undefined, null or empty', function () {
                    testObj.extend({ lessThan: 5 });
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value valid', function () {
                    testObj.extend({ lessThan: 5 });
                    testObj(3);
                    expect(testObj).observableIsValid();
                    testObj(0);
                    expect(testObj).observableIsValid();

                });
                it('value greater than or equal ', function () {
                    testObj.extend({ lessThan: 5 });
                    testObj(6);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().lessThan, 5));
                    testObj(5);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().lessThan, 5));

                });
                it('value not number ', function () {
                    testObj.extend({ lessThan: 5 });
                    testObj('fasfdasdf');
                    expect(testObj).observableIsNotValid(messages().number);
                });


                it('param number is valid', function () {
                    expect(function () {
                        testObj.extend({ lessThan: 5 });
                    }).not.toThrowError();
                    expect(function () {
                        testObj.extend({ lessThan: 0 });
                    }).not.toThrowError();
                });
                it('param numeric string is valid', function () {
                    expect(function () {
                        testObj.extend({ lessThan: '5' });
                    }).not.toThrowError();
                });

                it('param decimal is valid', function () {
                    testObj.extend({ lessThan: '55.55' });
                    testObj('0.66');
                    expect(testObj).observableIsValid();
                });

                it('params is exists', function () {
                    testObj.extend({ lessThan: undefined });
                    expect(testObj).observableIsValid();

                    testObj.extend({ lessThan: true });
                    expect(testObj).observableIsValid();
                    //expect(function () {
                    //    testObj.extend({ lessThan: undefined });
                    //}).toThrowError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'lessThan'));

                });

                it('param is not is number', function () {
                    testObj.extend({ lessThan: '55.ghjgjg' });
                    expect(testObj).observableIsValid();
                    //expect(function () {
                   // testObj.extend({ lessThan: '55.ghjgjg' });
                    //}).toThrowError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'lessThan'));

                });
                it('param custom message', function () {
                    var message = 'aaaaaaaa';
                    testObj.extend({ lessThan: { params: '55', message: message } });
                    testObj('afasfsd');
                    expect(testObj).observableIsNotValid(message);
                    testObj('90');
                    expect(testObj).observableIsNotValid(message);
                });

                it('param is computed', function () {
                    var computedParam = ko.observable(false);
                    var lessValue = ko.computed(function () {
                        return computedParam() ? 5 : 9;
                    });

                    testObj.extend({ lessThan: lessValue });
                    testObj(6);
                    expect(testObj).observableIsValid();
                    computedParam(true);
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().lessThan, ko.unwrap(lessValue)));
                });

                it('param is invalid computed', function () {
                    var computedParam = ko.observable(false);
                    var lessValue = ko.computed(function () {
                        return computedParam() ? '45454sdfa' : 9;
                    });

                    testObj.extend({ lessThan: lessValue });
                    testObj(6);
                    expect(testObj).observableIsValid();
                    computedParam(true);
                    expect(testObj).observableIsValid();
                
                });

            });
        });
    });
});
define('spec/validateNumberSpec.js', function () { });