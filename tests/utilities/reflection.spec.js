define(['common/resources/exeptionMessages', 'common/utilities/stringExtension', 'common/utilities/reflection'],
    function (exeptionMessages, stringExtension, commonReflection) {

        describe('extend', function () {
            it('add property ', function () {
                var obj = commonReflection.extend({ name: 'Avi' }, { lastName: 'Cohen' });
                expect(obj.name).toEqual('Avi');
                expect(obj.lastName).toEqual('Cohen');
            });

            it('avoid updating existing property ', function () {
                var obj = commonReflection.extend({ name: 'Avi', lastName: 'Levi' }, { lastName: 'Cohen' });
                expect(obj.name).toEqual('Avi');
                expect(obj.lastName).toEqual('Levi');
            });

            it('return source when ther is no target', function () {
                var obj = commonReflection.extend('', { lastName: 'Cohen' });
                expect(typeof obj).toEqual('object');
                expect(obj.lastName).toEqual('Cohen');
            });

            it('return source when ther is target is empty', function () {
                var obj = commonReflection.extend({}, { lastName: 'Cohen' });
                expect(typeof obj).toEqual('object');
                expect(obj.lastName).toEqual('Cohen');
            });

            it('return target there is no source ', function () {
                var obj = commonReflection.extend({ name: 'Avi' }, '');
                expect(typeof obj).toEqual('object');
                expect(obj.name).toEqual('Avi');
            });

            it('return empty object when there is no source and target ', function () {
                var obj = commonReflection.extend(5, undefined);
                expect(typeof obj).toEqual('object');
                expect(JSON.stringify(obj)).toEqual(JSON.stringify({}));
            });
        });

        describe('extendSettingsWithDefaults', function () {
            it('add property ', function () {
                var obj = commonReflection.extendSettingsWithDefaults({ name: 'Avi' }, { lastName: 'Cohen' });
                expect(obj.name).toEqual('Avi');
                expect(obj.lastName).toEqual('Cohen');
            });

            it('avoid updating existing property ', function () {
                var obj = commonReflection.extendSettingsWithDefaults({ name: 'Avi', lastName: 'Levi' }, { lastName: 'Cohen' });
                expect(obj.name).toEqual('Avi');
                expect(obj.lastName).toEqual('Levi');
            });

            it('delegates to extend function', function () {
                var target = { name: 'Avi', lastName: 'Levi' };
                var source = { age: 30 };
                spyOn(commonReflection, 'extend');
                commonReflection.extendSettingsWithDefaults(target, source);
                expect(commonReflection.extend).toHaveBeenCalledWith(target, source);
            });

            it('target object isnt changed', function () {
                var target = { name: 'Avi', lastName: 'Levi' };
                var targetString = JSON.stringify(target);
                commonReflection.extendSettingsWithDefaults(target, { age: 30 });
                expect(JSON.stringify(target)).toEqual(targetString);
            });

            it('returns new object', function () {
                var target = { name: 'Avi', lastName: 'Levi' };
                var obj = commonReflection.extendSettingsWithDefaults(target, { age: 30 });
                expect(obj).not.toEqual(target);
            });

            describe('deep extend', function () {

                it('between two deep objects', function () {
                    var target = { name: 'Avi', lastName: 'Levi', address: { street: 'Bar Ilan', city: 'Jerusalem' } };
                    var source = { name: 'Avi', lastName: 'Levi', address: { city: 'Jerusalem', houseNumber: '22' } };
                    var targetString = JSON.stringify({ name: 'Avi', lastName: 'Levi', address: { street: 'Bar Ilan', city: 'Jerusalem', houseNumber: '22' } });
                    var obj = commonReflection.extendSettingsWithDefaults(target, source);
                    expect(JSON.stringify(obj)).toEqual(targetString);
                });

                it('maintains computed field', function () {
                    var inTheCity = ko.computed(function () { return true; });
                    var target = { name: 'Avi', lastName: 'Levi', address: { street: 'Bar Ilan', city: 'Jerusalem' } };
                    var source = { name: 'Avi', lastName: 'Levi', address: { city: 'Jerusalem', inCity: inTheCity } };
                    var targetString = JSON.stringify({ name: 'Avi', lastName: 'Levi', address: { street: 'Bar Ilan', city: 'Jerusalem', inCity: inTheCity } });
                    var obj = commonReflection.extendSettingsWithDefaults(target, source);
                    expect(JSON.stringify(obj)).toEqual(targetString);
                    expect(ko.isComputed(obj.address.inCity)).toEqual(true);
                });

                it('extend only when property is not inherited', function () {
                    var animal = {
                        eats: true
                    };

                    var rabbit = Object.create(animal);
                    rabbit.leggs = '4';
                    rabbit.fur = true;

                    var target = { leggs: '6', eyes: '2', animal: { eats: false } };
                    var targetString = JSON.stringify({ leggs: '6', eyes: '2', animal: { eats: false }, fur: true });
                    var obj = commonReflection.extendSettingsWithDefaults(target, rabbit);
                    expect(JSON.stringify(obj)).toEqual(targetString);

                });
            });

        });

        describe('getNestedProperty', function () {

            var container = function () {

                var add = function (x, y) {
                    return parseInt(x, 10) + parseInt(y, 10);
                };

                var calcultor = {
                    divider: {
                        devide: function (x, y) {
                            return parseInt(x, 10) / parseInt(y, 10);
                        }
                    },

                    multiply: function (x, y) {
                        return parseInt(x, 10) * parseInt(y, 10);
                    }
                };

                var firstMessage = 'first level';

                var messages = {
                    secondMessage: 'second level',

                    myStrings: {
                        thirdMessage: 'third level'
                    }
                };

                return {
                    add: add,
                    calcultor: calcultor,
                    firstMessage: firstMessage,
                    messages: messages
                };

            }();

            var invalidParam = stringExtension.format(exeptionMessages.funcInvalidParams, 'getNestedProperty');

            it(' return undefined for non existing property', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'foo.bar')) === 'undefined').toBeTruthy();
            });

            it(' throw when the first parameter is not an object', function () {
                expect(function () {
                    $.type(commonReflection.getNestedProperty('not an object', 'foo.bar')) === 'undefined';
                }).toThrowError(invalidParam);
            });

            it(' throw when the second parameter is not a string', function () {
                expect(function () {
                    $.type(commonReflection.getNestedProperty(container, 5)) === 'undefined';
                }).toThrowError(invalidParam);
            });

            it(' throw when the second parameter is not a specified', function () {
                expect(function () {
                    $.type(commonReflection.getNestedProperty(container)) === 'undefined';
                }).toThrowError(invalidParam);
            });

            it('return function property that is not nested  ', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'add')) === 'function').toBeTruthy();
                expect(commonReflection.getNestedProperty(container, 'add')(4, 3)).toEqual(7);
            });

            it('return nested function property   ', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'calcultor.multiply')) === 'function').toBeTruthy();
                expect(commonReflection.getNestedProperty(container, 'calcultor.multiply')(2, 5)).toEqual(10);
            });

            it('return deeply nested function property', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'calcultor.divider.devide')) === 'function').toBeTruthy();
                expect(commonReflection.getNestedProperty(container, 'add')(6, 2)).toEqual(8);
            });

            it('return string property that is not nested  ', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'firstMessage')) === 'string').toBeTruthy();
                expect(commonReflection.getNestedProperty(container, 'firstMessage')).toEqual('first level');
            });

            it('return nested string property ', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'messages.secondMessage')) === 'string').toBeTruthy();
                expect(commonReflection.getNestedProperty(container, 'messages.secondMessage')).toEqual('second level');
            });

            it('return deeply nested string property ', function () {
                expect($.type(commonReflection.getNestedProperty(container, 'messages.myStrings.thirdMessage')) === 'string').toBeTruthy();
                expect(commonReflection.getNestedProperty(container, 'messages.myStrings.thirdMessage')).toEqual('third level');
            });
        });

    });
define('spec/reflectionSpec.js', function () { });