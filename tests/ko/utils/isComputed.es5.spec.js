define(['common/ko/utils/isComputed'], function (tlpReset) {
    //eslint-disable-line no-unused-vars
    var viewModel = function () {
        return {
            observable: ko.observable(),
            computed: ko.computed(function () {}),
            array: ko.observableArray([]),
            string: 'aaa'
        };
    }();
    describe('isComputed', function () {
        it('toBeDefined', function () {
            expect(ko.utils.isComputed).toBeDefined();
        });
        it('observable', function () {
            expect(ko.utils.isComputed(viewModel.observable)).toBeFalsy();
        });
        it('computed', function () {
            expect(ko.utils.isComputed(viewModel.computed)).toBeTruthy();
        });
        it('array', function () {
            expect(ko.utils.isComputed(viewModel.array)).toBeFalsy();
        });
        it('string', function () {
            expect(ko.utils.isComputed(viewModel.string)).toBeFalsy();
        });
        it('undefined', function () {
            expect(ko.utils.isComputed(undefined)).toBeFalsy();
        });
        it('null', function () {
            expect(ko.utils.isComputed(null)).toBeFalsy();
        });
        it('empty', function () {
            expect(ko.utils.isComputed()).toBeFalsy();
        });
        it('notExist', function () {
            expect(ko.utils.isComputed(viewModel.notExist)).toBeFalsy();
        });
    });
});
define('spec/isComputed.spec.js', function () {});