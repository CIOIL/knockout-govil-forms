var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/ko/fn/allowEmptyTable', 'common/resources/exeptionMessages', 'common/utilities/stringExtension'], function (allowEmptyTable, exceptionMessages, stringExtension) {
    //eslint-disable-line no-unused-vars
    describe('fn  allowEmptyTable', function () {
        it('should create the allowEmptyTable on ko.observableArray', function () {
            expect(ko.observableArray().allowEmptyTable).toBeDefined();
        });
        it('should create the allowEmptyTable as function', function () {
            expect(_typeof(ko.observableArray().allowEmptyTable)).toBe('function');
        });
        it('get correct allowEmptyTableVal', function () {
            var observableArray = ko.observableArray([]).allowEmptyTable(true);
            expect(observableArray.allowEmptyTableVal).toBe(true);
        });
        it('return correct this', function () {
            var observableArray = ko.observableArray([]);
            var allowEmptyTableObj = observableArray.allowEmptyTable(false);
            expect(observableArray).toEqual(allowEmptyTableObj);
        });
        describe('types', function () {
            var error = stringExtension.format(exceptionMessages.funcInvalidParams, 'allowEmptyTable');
            it('with numeric value', function () {
                var number = 1;
                expect(function () {
                    ko.observableArray([]).allowEmptyTable(number);
                }).toThrowError(error);
            });
            it('with string value', function () {
                expect(function () {
                    ko.observableArray([]).allowEmptyTable('false');
                }).toThrowError(error);
            });
            it('with null value', function () {
                expect(function () {
                    ko.observableArray([]).allowEmptyTable(null);
                }).toThrowError(error);
            });
            it('with undefined value', function () {
                expect(function () {
                    ko.observableArray([]).allowEmptyTable(undefined);
                }).toThrowError(error);
            });
        });
    });
});
define('spec/allowEmptyTableSpec.js', function () {});