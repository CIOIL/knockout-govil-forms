define(['common/components/date/basePartViewModel', 'common/viewModels/ModularViewModel'], function (BasePartViewModel, ModularViewModel) {
    describe('BasePartViewModel', function () {
        it('should be defined', function () {
            expect(BasePartViewModel).toBeDefined();
        });
        var basePartViewModel;
        var settings = undefined;
        beforeEach(function () {
            basePartViewModel = new BasePartViewModel(settings);
        });
        it('should be innherited from baseViewModel class', function () {
            expect(Object.getPrototypeOf(basePartViewModel) instanceof ModularViewModel).toBeTruthy();
        });
        it('prototype.constructor is  BasePartViewModel class', function () {
            expect(Object.getPrototypeOf(basePartViewModel).constructor).toBe(BasePartViewModel);
        });

        it('properties shuold be definde', function () {
            expect(basePartViewModel.list).toBeDefined();
            expect(basePartViewModel.title).toBeDefined();
            expect(basePartViewModel.isRequired).toBeDefined();
        });
        it('settings doesn\'t recived', function () {
            expect(basePartViewModel.title()).toEqual('');
            expect(basePartViewModel.isRequired()).toBeFalsy();
        });
        it('settings recived', function () {
            basePartViewModel = new BasePartViewModel({ isRequired: true, title: 'תאריך פטירה' });
            expect(basePartViewModel.title()).toEqual('תאריך פטירה');
            expect(basePartViewModel.isRequired()).toBeTruthy();
        });
        it('settings recived - unwrap isRequired', function () {
            basePartViewModel = new BasePartViewModel({ isRequired: function isRequired() {
                    return true;
                }, title: 'תאריך פטירה' });
            expect(basePartViewModel.title()).toEqual('תאריך פטירה');
            expect(basePartViewModel.isRequired()).toBeTruthy();
        });
        it('contains an empty model', function () {
            var model = basePartViewModel.getModel();
            expect(model).toBeDefined();
            expect(Object.keys(model).length).toEqual(0);
        });
    });

    //$(document).ready(function () {
    //    window.executeTests();
    //});
});