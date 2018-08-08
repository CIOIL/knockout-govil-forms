var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/ko/fn/minLength'], function (minLength) {
    //eslint-disable-line no-unused-vars
    describe('fn  minLength', function () {
        it('should create the minLength on ko.observableArray', function () {
            expect(ko.observableArray().minLength).toBeDefined();
        });
        it('should create the minLength as function', function () {
            expect(_typeof(ko.observableArray().minLength)).toBe('function');
        });
        it('get minLength', function () {
            var observableArray = ko.observableArray([]).minLength(3);
            expect(observableArray.minLengthVal).toBe(3);
        });
        it('return right this', function () {
            var observableArray = ko.observableArray([]);
            var minLengthObj = observableArray.minLength(1);
            expect(observableArray).toEqual(minLengthObj);
        });
        describe('types', function () {
            var error = 'One or more of the parameters sent to function "minLength" are missing or have the wrong type';
            it('with negative number value', function () {
                var negative = -1;
                expect(function () {
                    ko.observableArray([]).minLength(negative);
                }).toThrowError(error);
            });
            it('with string value', function () {
                expect(function () {
                    ko.observableArray([]).minLength('aaa');
                }).toThrowError(error);
            });
            it('with null value', function () {
                expect(function () {
                    ko.observableArray([]).minLength(null);
                }).toThrowError(error);
            });
            it('with undefined value', function () {
                expect(function () {
                    ko.observableArray([]).minLength(undefined);
                }).toThrowError(error);
            });
        });
    });
});
define('spec/minLengthSpec.js', function () {});