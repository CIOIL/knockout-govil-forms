define(['common/components/date/hebrew/dayViewModel', 'common/external/q'],
function (DayViewModel, Q) {

    var HebrewBasePartViewModel = require('common/components/date/hebrew/hebrewBasePartViewModel');
    var hebrewDateRequests = require('common/dataServices/hebrewDateRequests');

    describe('DayViewModel', function () {
        var fakeListFromServer = [{ 'dataCode': 1, 'dataText': 'א\'' }, { 'dataCode': 2, 'dataText': 'ב\'' }, { 'dataCode': 3, 'dataText': 'ג\'' }];
        var defaultListLength = 30;
        var validYear = 5775;
        var inValidDay = 31;
        var fullfieldPromise = Q.fcall(function () {
            return fakeListFromServer;
        });
        var fakePromiseListFromServer = Q.fcall(function () {
            return fakeListFromServer;
        });
      
        var dayViewModel;
        var settings = { title: 'יום בחודש', request: fullfieldPromise };
        it('should be defined', function () {
            expect(DayViewModel).toBeDefined();
        });
      
        beforeEach(function () {
            spyOn(HebrewBasePartViewModel, 'call').and.callThrough();
            spyOn(HebrewBasePartViewModel.prototype, 'handleRequest').and.callThrough();

            dayViewModel = new DayViewModel(settings);

        });
        it('should be innherited from HebrewBasePartViewModel class', function () {
            expect(Object.getPrototypeOf(dayViewModel) instanceof HebrewBasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is DayViewModel class', function () {
            expect(Object.getPrototypeOf(dayViewModel).constructor).toBe(DayViewModel);
        });
        it('return an instance of DayViewModel class', function () {
            expect(dayViewModel instanceof DayViewModel).toBeTruthy();
        });
        it('handle the request in the constructor', function () {
            expect(HebrewBasePartViewModel.prototype.handleRequest).toHaveBeenCalled();
        });
        describe('validation', function () {
            it('valid code day', function (done) {
                dayViewModel.data.dataCode(5);
                fullfieldPromise.then(function () {
                    expect(dayViewModel.data.dataCode.isValid()).toBeTruthy();
                    done();
                });
            });
            it('invalid code day', function (done) {
                dayViewModel.data.dataCode(inValidDay);
                fullfieldPromise.then(function () {
                    expect(dayViewModel.data.dataCode.isValid()).toBeFalsy();
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
                            request = DayViewModel.getListRequest();
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
                    describe('settings.month / settings.year is invalid ', function () {
                        var request;
                        beforeEach(function (done) {
                            request = DayViewModel.getListRequest({month:'12',year:'5775'});
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
                    var month = new HebrewBasePartViewModel({ request: fullfieldPromise });
                    var year = new HebrewBasePartViewModel({ request: fullfieldPromise });

                    fullfieldPromise.then(function () {
                        month.data.dataCode(5);
                        year.data.dataCode(validYear);
                    });
                    beforeEach(function (done) {
                        spyOn(hebrewDateRequests, 'getDays').and.returnValue(fakePromiseListFromServer);
                        request = DayViewModel.getListRequest({ month: month, year: year });
                        done();
                    });
                    it('return a promise', function () {
                        expect(typeof request === 'object').toBeTruthy();
                        expect(typeof request.then === 'function').toBeTruthy();

                    });
                    it('return promise with list from server', function (done) {
                        expect(hebrewDateRequests.getDays).toHaveBeenCalled();
                        request.then(function (result) {
                            expect(result.length).toEqual(3);
                            done();
                        });
                    });

                });
            });
            describe('handleRequestResult', function () {
                it('valid parameter', function () {
                    dayViewModel.handleRequestResult(fakeListFromServer);
                    expect(dayViewModel.list()).toBe(fakeListFromServer);
                });
                it('undefined parameter', function () {
                    dayViewModel.handleRequestResult();
                    expect(dayViewModel.list()).toBeUndefined();
                });
            });
           
            describe('updateList', function () {
                describe('parameters', function () {
                    it('settings should be object', function () {
                        expect(function () { dayViewModel.updateList(); }).toThrow();
                    });
                    it('month and year are optionals', function () {
                        expect(function () { dayViewModel.updateList({}); }).not.toThrow();
                    });
                });
                it('logic - list updated', function (done) {
                    var request = dayViewModel.updateList({});
                    request.then(function () {
                        expect(dayViewModel.list().length).toEqual(defaultListLength);
                        done();
                    });
                   
                });
                it('return a promise', function () {
                    var request = dayViewModel.updateList({});
                    expect(typeof request === 'object').toBeTruthy();
                    expect(typeof request.then === 'function').toBeTruthy();

                });
            });
        });

    });

    //$(document).ready(function () {
    //    window.executeTests();
    //});

});
