define(['common/components/date/hebrew/monthViewModel', 'common/external/q'],
function (MonthViewModel, Q) {

    var HebrewBasePartViewModel = require('common/components/date/hebrew/hebrewBasePartViewModel');
    var hebrewDateRequests = require('common/dataServices/hebrewDateRequests');

    describe('MonthViewModel', function () {
        var nonLeapYear = [{ 'dataCode': 1, 'dataText': 'תשרי' }, { 'dataCode': 2, 'dataText': 'חשון' }, { 'dataCode': 3, 'dataText': 'כסלו' }, { 'dataCode': 4, 'dataText': 'טבת' }, { 'dataCode': 5, 'dataText': 'שבט' }, { 'dataCode': 6, 'dataText': 'אדר' }, { 'dataCode': 7, 'dataText': 'ניסן' }, { 'dataCode': 8, 'dataText': 'אייר' }, { 'dataCode': 9, 'dataText': 'סיון' }, { 'dataCode': 10, 'dataText': 'תמוז' }, { 'dataCode': 11, 'dataText': 'אב' }, { 'dataCode': 12, 'dataText': 'אלול' }];
        var leapYear = [{ 'dataCode': 1, 'dataText': 'תשרי' }, { 'dataCode': 2, 'dataText': 'חשון' }, { 'dataCode': 3, 'dataText': 'כסלו' }, { 'dataCode': 4, 'dataText': 'טבת' }, { 'dataCode': 5, 'dataText': 'שבט' }, { 'dataCode': 6, 'dataText': 'אדר' }, { 'dataCode': 7, 'dataText': 'אדר ב' }, { 'dataCode': 8, 'dataText': 'ניסן' }, { 'dataCode': 9, 'dataText': 'אייר' }, { 'dataCode': 10, 'dataText': 'סיון' }, { 'dataCode': 11, 'dataText': 'תמוז' }, { 'dataCode': 12, 'dataText': 'אב' }, { 'dataCode': 13, 'dataText': 'אלול' }];
        var inValidMonth = 14;
        var nonLeapYearLength = 12;
        var defaultListLength = 13;
        var validYear = 5775;
        var fakePromiseListFromServer = Q.fcall(function () {
            return nonLeapYear;
        });

        var monthViewModel;
        var settings = { request: fakePromiseListFromServer };
        it('should be defined', function () {
            expect(MonthViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(HebrewBasePartViewModel, 'call').and.callThrough();
            spyOn(HebrewBasePartViewModel.prototype, 'handleRequest').and.callThrough();

            monthViewModel = new MonthViewModel(settings);

        });
        it('should be innherited from HebrewBasePartViewModel class', function () {
            expect(MonthViewModel.prototype instanceof HebrewBasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is MonthViewModel class', function () {
            expect(MonthViewModel.prototype.constructor).toBe(MonthViewModel);
        });
        it('return an instance of MonthViewModel class', function () {
            expect(monthViewModel instanceof MonthViewModel).toBeTruthy();
        });
        it('handle the request in the constructor', function () {
            expect(HebrewBasePartViewModel.prototype.handleRequest).toHaveBeenCalled();
        });
        
        describe('validation', function () {
            it('valid code month', function (done) {
                monthViewModel.data.dataCode(5);
                fakePromiseListFromServer.then(function () {
                    expect(monthViewModel.data.dataCode.isValid()).toBeTruthy();
                    done();
                });
            });
            it('invalid code month', function (done) {
                monthViewModel.data.dataCode(inValidMonth);
                fakePromiseListFromServer.then(function () {
                    expect(monthViewModel.data.dataCode.isValid()).toBeFalsy();
                    done();
                });

            });
        });
        describe('functions', function () {
            describe('getListRequest', function () {
                describe('invalid parameters ', function () {
                    describe('settings is undefined ', function () {
                        var request;
                        beforeEach(function (done) {
                            request = MonthViewModel.getListRequest();
                            done();
                        });
                        it('return a promise', function () {
                            expect(typeof request === 'object').toBeTruthy();
                            expect(typeof request.then === 'function').toBeTruthy();
                        });
                        it('return promise with default list', function (done) {
                            request.then(function (result) {
                                expect(result.length).toEqual(defaultListLength);
                                done();
                            });
                        });
                    });
                    describe('settings.year is invalid ', function () {
                        var request;
                        beforeEach(function (done) {
                            request = MonthViewModel.getListRequest({ year: '5775' });
                            done();
                        });
                        it('return a promise', function () {
                            expect(typeof request === 'object').toBeTruthy();
                            expect(typeof request.then === 'function').toBeTruthy();
                        });
                        it('return promise with default list', function (done) {
                            request.then(function (result) {
                                expect(result.length).toEqual(defaultListLength);
                                done();
                            });
                        });
                    });
                });
                describe('valid parameters', function () {
                    var request;
                    var year = new HebrewBasePartViewModel({ request: fakePromiseListFromServer });
                    fakePromiseListFromServer.then(function () {
                        year.data.dataCode(validYear);
                    });
                   
                    beforeEach(function (done) {
                        spyOn(hebrewDateRequests, 'getMonths').and.returnValue(fakePromiseListFromServer);
                        request = MonthViewModel.getListRequest({ year: year });
                        done();
                    });
                    it('return a promise', function () {
                        expect(typeof request === 'object').toBeTruthy();
                        expect(typeof request.then === 'function').toBeTruthy();

                    });
                    it('return promise with list from server', function (done) {
                        expect(hebrewDateRequests.getMonths).toHaveBeenCalled();
                        request.then(function (result) {
                            expect(result.length).toEqual(nonLeapYearLength);
                            done();
                        });
                    });

                });
            });

            describe('handleRequestResult', function () {
                it('valid parameter - update list from leap year to non-leap year', function () {
                    monthViewModel.list(leapYear);
                    monthViewModel.data.dataCode(8);
                    monthViewModel.handleRequestResult(nonLeapYear);

                    expect(monthViewModel.list()).toBe(nonLeapYear);
                    expect(monthViewModel.data.dataCode()).toEqual(7);
                });
                it('valid parameter - update list from non-leap year to leap year', function () {
                    monthViewModel.list(nonLeapYear);
                    monthViewModel.data.dataCode(8);
                    monthViewModel.handleRequestResult(leapYear);

                    expect(monthViewModel.list()).toBe(leapYear);
                    expect(monthViewModel.data.dataCode()).toEqual(9);
                });
                it('valid parameter - update list from leap year to leap year', function () {
                    monthViewModel.list(leapYear);
                    monthViewModel.data.dataCode(8);
                    monthViewModel.handleRequestResult(leapYear);

                    expect(monthViewModel.list()).toBe(leapYear);
                    expect(monthViewModel.data.dataCode()).toEqual(8);
                });
                it('undefined parameter', function () {
                    expect(function () { monthViewModel.handleRequestResult(); }).toThrow();
                });
            });

            describe('updateList', function () {
                describe('parameters', function () {
                    it('settings should be object', function () {
                        expect(function () { monthViewModel.updateList(); }).toThrow();
                    });
                    it('month and year are optionals', function () {
                        expect(function () { monthViewModel.updateList({}); }).not.toThrow();
                    });
                });
                it('logic - list updated', function (done) {
                    var request = monthViewModel.updateList({});
                    request.then(function () {
                        expect(monthViewModel.list().length).toEqual(defaultListLength);
                        done();
                    });

                });
                it('return a promise', function () {
                    var request = monthViewModel.updateList({});
                    expect(typeof request === 'object').toBeTruthy();
                    expect(typeof request.then === 'function').toBeTruthy();

                });
            });
        });

    });

});
