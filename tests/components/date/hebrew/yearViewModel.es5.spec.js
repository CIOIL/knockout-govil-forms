define(['common/components/date/hebrew/yearViewModel', 'common/external/q'], function (YearViewModel, Q) {

    var HebrewBasePartViewModel = require('common/components/date/hebrew/hebrewBasePartViewModel');
    describe('YearViewModel', function () {

        var fakeListFromServer = [{ 'dataCode': 5776, 'dataText': 'תשע"ו' }, { 'dataCode': 5777, 'dataText': 'תשע"ז' }, { 'dataCode': 5778, 'dataText': 'תשע"ח' }];

        var fakePromiseListFromServer = Q.fcall(function () {
            return fakeListFromServer;
        });

        var yearViewModel;
        var settings = { request: fakePromiseListFromServer };
        it('should be defined', function () {
            expect(YearViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(HebrewBasePartViewModel, 'call').and.callThrough();
            spyOn(HebrewBasePartViewModel.prototype, 'handleRequest').and.callThrough();

            yearViewModel = new YearViewModel(settings);
        });
        it('should be innherited from HebrewBasePartViewModel class', function () {
            expect(YearViewModel.prototype instanceof HebrewBasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is YearViewModel class', function () {
            expect(YearViewModel.prototype.constructor).toBe(YearViewModel);
        });
        it('return an instance of YearViewModel class', function () {
            expect(yearViewModel instanceof YearViewModel).toBeTruthy();
        });
        it('handle the request in the constructor', function () {
            expect(HebrewBasePartViewModel.prototype.handleRequest).toHaveBeenCalled();
        });

        //describe('validation', function () {

        //    it('valid year text', function () {
        //        yearViewModel.data.dataText('תשע"ו');
        //        expect(yearViewModel.data.dataText.isValid()).toBeTruthy();
        //    });
        //    it('invalid year text', function () {
        //        yearViewModel.data.dataText('תשע@ו');
        //        expect(yearViewModel.data.dataText.isValid()).toBeFalsy();

        //    });
        //});
    });
});