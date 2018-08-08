define(['common/utilities/stringExtension',
    'common/resources/exeptionMessages',
    'common/ko/validate/koValidationSpecMatchers',
    'common/resources/texts/basicValidation',
    'common/ko/validate/extensionRules/general',
    'common/ko/globals/multiLanguageObservable'],

    function (stringExtension, exceptionMessages, matchers, resources) {//eslint-disable-line max-params
        var messages = ko.multiLanguageObservable({ resource: resources });

        const getRule = function (rules, ruleName) {
            return rules().find((item) => item.ruleName === ruleName || item.rule === ruleName);
        };

        describe('validate', function () {
            var testObj;
            beforeEach(function () {
                jasmine.addMatchers(matchers);

            });

            describe('extensionRules General', function () {
                describe('length', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ length: 6 });
                    });


                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ length: { params: 6, onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('1');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().length, 6));
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
                        testObj('123456');
                        expect(testObj).observableIsValid();
                    });
                    it('value shorter than ', function () {
                        testObj('123');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().length, 6));
                    });
                    it('value longer than ', function () {
                        testObj('12345678');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().length, 6));
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ length: { params: 6, message: 'שגיאה' } });
                        testObj('123');
                        expect(testObj).observableIsNotValid('שגיאה');
                    });

                });
                describe('atLeastOneChecked', function () {
                    beforeEach(function () {
                        testObj = ko.observableArray();
                        testObj.extend({ atLeastOneChecked: 1 });
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observableArray().extend({ atLeastOneChecked: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(testObj).observableIsNotValid(messages().atLeastOneRequired);
                    });
                    it('default minItems is 1', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ atLeastOneChecked: undefined });
                        testObj.push('checked_1');
                        expect(testObj).observableIsValid();
                        testObj.extend({ validatable: false });
                        testObj.extend({ atLeastOneChecked: true });
                        testObj.push('checked_1');
                        expect(testObj).observableIsValid();
                    });

                    it('use custom minItems if sent', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ atLeastOneChecked: { minItems: 2 } });
                        testObj.push('checked_1');
                        expect(testObj).observableIsNotValid(messages().atLeastOneRequired);
                    });
                    it('minItems not numeric should throw', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ atLeastOneChecked: { minItems: '@' } });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minItems'));
                    });
                    it('should have required rule name', function () {
                        expect(function () {
                            return testObj.rules().filter(function (rule) {
                                return rule.ruleName === 'required';
                            });
                        }).not.toBeNull();
                    });
                    it('one item should be valid', function () {
                        testObj.push('checked_1');
                        expect(testObj).observableIsValid();
                    });
                    it('no checked items should be not valid', function () {
                        expect(testObj).observableIsNotValid(messages().atLeastOneRequired);
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ atLeastOneChecked: { params: true, message: 'שגיאה' } });
                        expect(testObj).observableIsNotValid('שגיאה');
                    });
                });
                describe('requiredRadio', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                    });
                    it('should be defined', function () {
                        expect(ko.extenders.requiredRadio).toBeDefined();
                    });
                    it('should assign required with true', function () {
                        testObj.extend({ requiredRadio: true });
                        expect(testObj.rules()[0].rule).toEqual('required');
                        expect(testObj.rules()[0].params).toBe(true);
                        expect(testObj.rules()[0].condition).toBeUndefined();
                    });
                    it('should assign required with false', function () {
                        testObj.extend({ requiredRadio: false });
                        expect(testObj.rules()[0].rule).toEqual('required');
                        expect(testObj.rules()[0].params).toBe(false);
                        expect(testObj.rules()[0].condition).toBeUndefined();
                        expect(testObj).observableIsValid();
                    });
                    it('should assign required with onliIf', function () {
                        testObj.extend({
                            requiredRadio: {
                                onlyIf: function () {
                                    return true;
                                }
                            }
                        });
                        expect(testObj.rules()[0].rule).toEqual('required');
                        expect(testObj.rules()[0].params).toBe(true);
                        expect(testObj.rules()[0].condition).toBeDefined();
                    });
                    it('should use custom message when sent', function () {
                        testObj.extend({
                            requiredRadio: {
                                params: true,
                                message: 'forbidden'
                            }
                        });
                        expect(testObj).observableIsNotValid('forbidden');
                    });
                });

                describe('equalIgnoreCase', function () {

                    beforeEach(function () {
                        testObj = ko.observable();
                    });

                    it('conditional validation', function () {
                        testObj.extend({ equalIgnoreCase: { compareTo: 'testEqual' } });
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ equalIgnoreCase: { params: 'equal', onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('aaa');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().equal, 'equal'));
                    });

                    it('value undefined, null or empty', function () {
                        testObj.extend({ equalIgnoreCase: { compareTo: 'testEqual' } });
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });

                    describe('compareTo', function () {
                        it('undefined', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: undefined } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                        it('null', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: null } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                        it('empty', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: '' } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                    });

                    describe('compareTo observable', function () {

                        it('empty', function () {
                            var testObjcompareTo = ko.observable();
                            testObj.extend({ equalIgnoreCase: { compareTo: testObjcompareTo } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                        it('undefined', function () {
                            var testObjcompareTo = ko.observable(undefined);
                            testObj.extend({ equalIgnoreCase: { compareTo: testObjcompareTo } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                        it('null', function () {
                            var testObjcompareTo = ko.observable(null);
                            testObj.extend({ equalIgnoreCase: { compareTo: testObjcompareTo } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                        it('value valid', function () {
                            var testObjcompareTo = ko.observable();
                            testObj.extend({ equalIgnoreCase: { compareTo: testObjcompareTo } });
                            testObjcompareTo('test');
                            testObj('test');
                            expect(testObj).observableIsValid();
                        });
                        it('not valid', function () {
                            var testObjcompareTo = ko.observable();
                            testObj.extend({ equalIgnoreCase: { compareTo: testObjcompareTo } });
                            testObjcompareTo('test1');
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, 'test1'));
                        });
                    });

                    describe('compareTo type', function () {

                        it('string', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'test' } });
                            testObj('test');
                            expect(testObj).observableIsValid();
                        });
                        it('integer', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 1 } });
                            testObj('1');
                            expect(testObj).observableIsValid();
                        });
                        it('boolean true', function () {
                            testObj.extend({ equalIgnoreCase: true });
                            testObj('true');
                            expect(testObj).observableIsValid();
                        });
                        it('boolean false', function () {
                            testObj.extend({ equalIgnoreCase: false });
                            testObj('false');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, ''));
                        });
                    });

                    describe('equalIgnoreCase observable is valid', function () {
                        it('value upperCase compareTo lowerCase', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'test' } });
                            testObj('TEST');
                            expect(testObj).observableIsValid();
                        });
                        it('value lowerCase compareTo upperCase', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'TEST' } });
                            testObj('test');
                            expect(testObj).observableIsValid();
                        });
                        it('value & compareTo contains upperCase & lowerCase', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'Test' } });
                            testObj('tEst');
                            expect(testObj).observableIsValid();
                        });
                    });

                    describe('message - value not valid with', function () {
                        it('default message', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'test' } });
                            testObj('notEqual');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, 'test'));
                        });
                        it('custom message', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'test', message: 'Not Equal To Me' } });
                            testObj('notEqual');
                            expect(testObj).observableIsNotValid('Not Equal To Me');
                        });
                        it('custom message name', function () {
                            testObj.extend({ equalIgnoreCase: { compareTo: 'Test', compareToName: 'FieldName' } });
                            testObj('notEqual');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().equal, 'FieldName'));
                        });
                    });
                });

                describe('notEqual', function () {

                    beforeEach(function () {
                        testObj = ko.observable();
                    });

                    describe('conditional validation', function () {
                        it('rule without condition', function () {
                            testObj.extend({ notEqual: { compareTo: 'testNotEqual' } });
                            expect(getRule(testObj.rules, 'notEqual').condition).toBeUndefined();
                        });
                        it('rule with condition', function () {
                            const condition = ko.observable();
                            const conditionalTestObj = ko.observable().extend({ notEqual: { params: 'notEqual', onlyIf: condition } });
                            expect(typeof getRule(conditionalTestObj.rules, 'notEqual').condition).toBe('function');
                            conditionalTestObj('notEqual');
                            condition(false);
                            expect(conditionalTestObj).observableIsValid();
                            condition(true);
                            expect(conditionalTestObj).observableIsNotValid(stringExtension.format(messages().notEqual, 'אחר'));
                        });
                    });

                    it('observable value is undefined, null or empty', function () {
                        testObj.extend({ notEqual: { compareTo: 'testEqual' } });
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });

                    describe('compareTo type', function () {
                        it('undefined', function () {
                            expect(function () {
                                testObj.extend({ notEqual: { compareTo: undefined } });
                                testObj('test');
                            }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'notEqual'));
                        });
                        it('null', function () {
                            expect(function () {
                                testObj.extend({ notEqual: { compareTo: null } });
                                testObj('test');
                            }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'notEqual'));
                        });
                        it('empty', function () {
                            expect(function () {
                                testObj.extend({ notEqual: { compareTo: '' } });
                                testObj('test');
                                expect(testObj).observableIsValid();
                            }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'notEqual'));

                        });
                        it('observable', function () {
                            var testObjcompareTo = ko.observable('');
                            testObj.extend({ notEqual: { compareTo: testObjcompareTo } });
                            testObjcompareTo('testCompareTo');
                            testObj('test');
                            expect(testObj).observableIsValid();
                            testObjcompareTo('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().notEqual, 'אחר'));
                        });
                        
                        it('boolean', function () {
                            testObj.extend({ notEqual: true });
                            testObj('aaa');
                            expect(testObj).observableIsValid();
                            testObj('true');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().notEqual, 'אחר'));
                        });
                    });

                    describe('error message', function () {
                        it('default message', function () {
                            testObj.extend({ notEqual: { compareTo: 'test' } });
                            testObj('test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().notEqual, 'אחר'));
                        });
                        it('message with compareToName', function () {
                            testObj.extend({ notEqual: { compareTo: 'Test', compareToName: 'FieldName' } });
                            testObj('Test');
                            expect(testObj).observableIsNotValid(stringExtension.format(messages().notEqual, 'FieldName'));
                        });
                        it('custom message', function () {
                            testObj.extend({ notEqual: { compareTo: 'test', message: 'value not valid' } });
                            testObj('test');
                            expect(testObj).observableIsNotValid('value not valid');
                        });
                    });
                });
            });
        });
    });
define('spec/validateGeneralRulesSpec.js', function () { });