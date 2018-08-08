define(['common/ko/utils/isObservableArray'],
function (tlpReset) {//eslint-disable-line no-unused-vars
    var viewModel = function () {
        return {
            observable: ko.observable(),
            computed: ko.computed(function () { }),
            observableArray: ko.observableArray([]),
            array: [],
            string: 'aaa'
        };
    }();
    describe('isObservableArray', function () {
        it('toBeDefined', function () {
            expect(ko.utils.isObservableArray).toBeDefined();
        });
        it('observable', function () {
            expect(ko.utils.isObservableArray(viewModel.observable)).toBeFalsy();
        });
        it('computed', function () {
            expect(ko.utils.isObservableArray(viewModel.computed)).toBeFalsy();
        });
        it('array', function () {
            expect(ko.utils.isObservableArray(viewModel.observableArray)).toBeTruthy();
        });
        it('array', function () {
            expect(ko.utils.isObservableArray(viewModel.array)).toBeFalsy();
        });
        it('string', function () {
            expect(ko.utils.isObservableArray(viewModel.string)).toBeFalsy();
        });
        it('undefined', function () {
            expect(ko.utils.isObservableArray(undefined)).toBeFalsy();
        });
        it('null', function () {
            expect(ko.utils.isObservableArray(null)).toBeFalsy();
        });
        it('empty', function () {
            expect(ko.utils.isObservableArray()).toBeFalsy();
        });
        it('notExist', function () {
            expect(ko.utils.isObservableArray(viewModel.notExist)).toBeFalsy();
        });
    });

});
define('spec/isObservableArray.spec.js', function () { });