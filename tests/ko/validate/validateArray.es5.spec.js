define(['common/utilities/stringExtension', 'common/ko/validate/koValidationSpecMatchers', 'common/resources/texts/array', 'common/resources/exeptionMessages', 'common/ko/validate/extensionRules/array', 'common/ko/globals/multiLanguageObservable'], function (stringExtension, matchers, resources, exceptionMessages) //eslint-disable-line max-params
{
    var messages = ko.multiLanguageObservable({ resource: resources });
    describe('validate', function () {

        var testArray;
        var customMessage = 'custom message invalid array';
        var customMessageObservable = ko.observable(customMessage);
        beforeEach(function () {
            jasmine.addMatchers(matchers);
        });
        describe('extensionRules Array', function () {
            describe('minItems', function () {
                describe('setting a limit', function () {
                    beforeEach(function () {
                        testArray = ko.observableArray(['thunder', 'lightning']);
                    });

                    it('minRows object undefined', function () {
                        var y = undefined;
                        expect(function () {
                            testArray.extend({ minItems: y });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minItems'));
                    });
                    it('minRows null', function () {
                        expect(function () {
                            testArray.extend({ minItems: null });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minItems'));
                    });
                    it('minRows empty', function () {
                        expect(function () {
                            testArray.extend({ minItems: '' });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minItems'));
                    });
                    it('minRows not valid ', function () {
                        expect(function () {
                            testArray.extend({ minItems: '2w' });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minItems'));
                    });
                    it('minRows valid string', function () {
                        testArray.extend({ minItems: '2' });
                        expect(testArray).observableIsValid();
                    });
                    it('minRows valid numeric', function () {
                        testArray.extend({ minItems: 2 });
                        expect(testArray).observableIsValid();
                    });
                    it('below threshold', function () {
                        testArray.extend({ minItems: { params: 2, message: 'aaa' } });
                        testArray.remove('thunder');
                        expect(testArray).observableIsNotValid('aaa');
                    });
                    it('in range', function () {
                        testArray.extend({ minItems: { params: 2, message: 'aaa' } });
                        testArray.remove('thunder');
                        testArray.push('thunder');
                        expect(testArray).observableIsValid();
                    });
                });
                describe('checking the limit', function () {});
                describe('error message of invalid array', function () {
                    beforeEach(function () {
                        testArray = ko.observableArray(['thunder', 'lightning']);
                    });
                    it('minItems custom error message', function () {
                        testArray.extend({ minItems: { params: { minRows: 3, message: customMessage } } });
                        expect(testArray).observableIsNotValid(customMessage);
                    });
                    it('minItems custom error message observable', function () {
                        testArray.extend({ minItems: { params: { minRows: 3, message: customMessageObservable } } });
                        expect(testArray).observableIsNotValid(customMessage);
                    });
                });
                //TODO: add test to message custom message default message anf computed message
            });

            describe('maxItems', function () {
                describe('setting a limit', function () {
                    beforeEach(function () {
                        testArray = ko.observableArray();
                    });

                    it('maxRows object undefined', function () {
                        var y = undefined;
                        expect(function () {
                            testArray.extend({ maxItems: y });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'maxItems'));
                    });
                    it('maxRows null', function () {
                        expect(function () {
                            testArray.extend({ maxItems: null });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'maxItems'));
                    });
                    it('maxRows empty', function () {
                        expect(function () {
                            testArray.extend({ maxItems: '' });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'maxItems'));
                    });
                    it('maxRows not valid ', function () {
                        expect(function () {
                            testArray.extend({ maxItems: '2w' });
                        }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, 'maxItems'));
                    });
                    it('maxRows valid string ', function () {
                        testArray.extend({ maxItems: '2' });
                        expect(testArray).observableIsValid();
                    });
                    it('maxRows valid numeric ', function () {
                        testArray.extend({ maxItems: 2 });
                        expect(testArray).observableIsValid();
                    });
                });
                describe('checking the limit', function () {
                    beforeEach(function () {
                        testArray = ko.observableArray(['thunder', 'lightning']).extend({ maxItems: 2 });
                    });

                    it('exceed', function () {
                        testArray.push('weather');
                        expect(testArray).observableIsNotValid(stringExtension.format(messages().maxRows, 2));
                    });
                    it('in range', function () {
                        testArray.remove('thunder');
                        expect(testArray).observableIsValid();
                    });
                });
                describe('error message of invalid array', function () {
                    beforeEach(function () {
                        testArray = ko.observableArray(['thunder', 'lightning']);
                    });
                    it('maxItems custom error message', function () {
                        testArray.extend({ maxItems: { params: { maxRows: 1, message: customMessage } } });
                        expect(testArray).observableIsNotValid(customMessage);
                    });
                    it('maxItems custom error message observable', function () {
                        testArray.extend({ maxItems: { params: { maxRows: 1, message: customMessageObservable } } });
                        expect(testArray).observableIsNotValid(customMessage);
                    });
                });
            });

            describe('check uniqe in one level', function () {
                var Pet = function Pet(name, color) {
                    this.name = name;
                    this.color = color;
                };

                var Owner = function Owner(name, id) {
                    this.name = ko.observable(name);
                    this.id = ko.observable(id);
                    this.petsArray = ko.observableArray([new Pet()]);
                };

                var testArray = ko.observableArray([new Owner('Mark', '123'), new Owner('Bob', '456')]);
                describe('apply the extender on observableArray', function () {
                    it('parameter not sent', function () {
                        expect(function () {
                            testArray.extend({
                                uniqueItems: null
                            });
                        }).toThrowError('One or more of the parameters sent to function "uniqueItems" are missing or have the wrong type');
                    });

                    it('item in array not anonymous function', function () {
                        expect(function () {
                            testArray.extend({
                                uniqueItems: {
                                    fields: ['name']
                                }
                            });
                        }).toThrowError('the parameter "getUniqueItem" must be of function type');
                    });
                });
                it('"items" array contains not function value', function () {});

                describe('one item unique', function () {
                    beforeAll(function () {
                        testArray.extend({
                            uniqueItems: {
                                fields: [{
                                    getUniqueItem: function getUniqueItem(item) {
                                        return item.name;
                                    }
                                }]
                            }
                        });
                    });
                    it('add uniqe item', function () {
                        var testOwner = new Owner('Paul', '124');
                        testArray.push(testOwner);
                        expect(testOwner.name).observableIsValid();
                    });

                    it('add duplicate item', function () {
                        var testOwner = new Owner('Paul', '123');
                        testArray.push(testOwner);
                        expect(testOwner.name).observableIsNotValid(messages().uniqeItems);
                    });

                    it('change value to duplicate', function () {
                        testArray()[0].name('Bob');
                        expect(testArray()[0].name).observableIsNotValid(messages().uniqeItems);
                    });

                    it('change duplicate value', function () {
                        testArray()[0].name('Isaac');
                        expect(testArray()[0].name).observableIsValid();
                    });

                    it('duplicate empty value', function () {
                        testArray()[1].name('');
                        expect(testArray()[1].name).observableIsValid();
                    });
                });

                describe('custom message in item unique', function () {
                    var array = ko.observableArray([new Owner('Mark', '123'), new Owner('Bob', '456')]);
                    beforeAll(function () {
                        array.extend({
                            uniqueItems: {
                                message: 'custom message in item unique',
                                fields: [{
                                    getUniqueItem: function getUniqueItem(item) {
                                        return item.name;
                                    }
                                }]
                            }
                        });
                    });

                    it('add duplicate item', function () {
                        var testOwner = new Owner('Bob', '457');
                        array.push(testOwner);
                        expect(testOwner.name.rules()[0].message === 'custom message in item unique').toBeTruthy();
                    });
                });
                describe('multiple items unique', function () {
                    beforeAll(function () {
                        testArray.extend({
                            uniqueItems: {
                                fields: [{
                                    getUniqueItem: function getUniqueItem(item) {
                                        return item.name;
                                    }
                                }, {
                                    getUniqueItem: function getUniqueItem(item) {
                                        return item.id;
                                    }
                                }]
                            }
                        });
                    });

                    it('isUnique applied on all items', function () {
                        var testOwner = new Owner('Brian', '222');
                        testArray.push(testOwner);
                        expect(testOwner.name.rules()[0].rule === 'isUnique').toBeTruthy();
                        expect(testOwner.id.rules()[0].rule === 'isUnique').toBeTruthy();
                    });
                });
            });
        });
        define('spec/validateDateSpec.js', function () {});
    });
});