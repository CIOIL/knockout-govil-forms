define(['common/components/date/hebrew/viewModel', 'common/external/q'],
function (HebrewDateViewModel, Q) {

    var ModularViewModel = require('common/viewModels/ModularViewModel');
    var DayViewModel = require('common/components/date/hebrew/dayViewModel');
    var MonthViewModel = require('common/components/date/hebrew/monthViewModel');
    var entityBase = require('common/entities/entityBase');
    describe('HebrewDateViewModel', function () {

        var validYear = 5775;
        var yearFakeListFromServer = [{ 'dataCode': 5776, 'dataText': 'תשע"ו' }, { 'dataCode': 5777, 'dataText': 'תשע"ז' }, { 'dataCode': 5778, 'dataText': 'תשע"ח' }];
        var yearFakePromiseListFromServer = Q.fcall(function () {
            return yearFakeListFromServer;
        });
        var monthFakeListFromServer = [{ 'dataCode': 1, 'dataText': 'תשרי' }, { 'dataCode': 2, 'dataText': 'חשון' }, { 'dataCode': 3, 'dataText': 'כסלו' }];
        var monthFakePromiseListFromServer = Q.fcall(function () {
            return monthFakeListFromServer;
        });
        var dayFakeListFromServer = [{ 'dataCode': 1, 'dataText': 'א\'' }, { 'dataCode': 2, 'dataText': 'ב\'' }, { 'dataCode': 3, 'dataText': 'ג\'' }];
        var dayFakePromiseListFromServer = Q.fcall(function () {
            return dayFakeListFromServer;
        });

        var hebrewDateViewModel;
        var settings = {
            title: 'תאריך פטירה עברי',
            isRequired: true,
            day: { title: 'ייי' },
            month: { title: 'חחח', isRequired: false },
            year: { title: 'ששש', request: yearFakePromiseListFromServer }

        };
        it('should be defined', function () {
            expect(HebrewDateViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(DayViewModel, 'getListRequest').and.returnValue(dayFakePromiseListFromServer);
            spyOn(MonthViewModel, 'getListRequest').and.returnValue(monthFakePromiseListFromServer);
            spyOn(entityBase, 'DeferredEntityBase').and.callThrough();

            hebrewDateViewModel = new HebrewDateViewModel(settings);

        });
        it('should be innherited from ModularViewModel class', function () {
            expect(HebrewDateViewModel.prototype instanceof ModularViewModel).toBeTruthy();
        });
        it('prototype.constructor is HebrewDateViewModel class', function () {
            expect(HebrewDateViewModel.prototype.constructor).toBe(HebrewDateViewModel);
        });
        it('return an instance of HebrewDateViewModel class', function () {
            expect(hebrewDateViewModel instanceof HebrewDateViewModel).toBeTruthy();
        });

        it('properties shuold be definde', function () {
            expect(hebrewDateViewModel.day).toBeDefined();
            expect(hebrewDateViewModel.month).toBeDefined();
            expect(hebrewDateViewModel.year).toBeDefined();
            expect(hebrewDateViewModel.fullDate).toBeDefined();
            expect(hebrewDateViewModel.isRequired).toBeDefined();
            expect(hebrewDateViewModel.title).toBeDefined();
        });
        describe('logic', function () {
            it('global isRequired set to part that haven\'t specific isRequired', function () {
                expect(hebrewDateViewModel.day.isRequired()).toBeTruthy();
                expect(hebrewDateViewModel.month.isRequired()).toBeFalsy();
                expect(hebrewDateViewModel.year.isRequired()).toBeTruthy();
            });
            it('part\'s settings contain the request', function () {
                expect(entityBase.DeferredEntityBase.calls.argsFor(0)).toEqual([{ deferred: dayFakePromiseListFromServer }]);
                expect(entityBase.DeferredEntityBase.calls.argsFor(1)).toEqual([{ deferred: monthFakePromiseListFromServer }]);
                expect(entityBase.DeferredEntityBase.calls.argsFor(2)).toEqual([{ deferred: yearFakePromiseListFromServer }]);
               
            });
            it('month.isRequired is changed to true if day is full', function () {
                hebrewDateViewModel.day.data.dataCode(2);
                expect(hebrewDateViewModel.month.isRequired).toBeTruthy();


            });
            it('year.isRequired is changed to true if day or month are full', function () {
                hebrewDateViewModel.day.data.dataCode(2);
                expect(hebrewDateViewModel.year.isRequired).toBeTruthy();
            });
            it('days list is updated when month is changed', function (done) {
                hebrewDateViewModel.day.list([]);
                hebrewDateViewModel.month.data.dataCode(2);
                monthFakePromiseListFromServer.then(function () {
                    expect(hebrewDateViewModel.day.list()).toBe(dayFakeListFromServer);
                    done();
                });
            });
            it('days list is updated when year is changed', function (done) {
                hebrewDateViewModel.day.list([]);
                hebrewDateViewModel.year.data.dataCode(validYear);
                yearFakePromiseListFromServer.then(function () {
                    expect(hebrewDateViewModel.day.list()).toBe(dayFakeListFromServer);
                    done();
                });
            });
            it('months list is updated when year is changed', function (done) {
                hebrewDateViewModel.month.list([]);
                hebrewDateViewModel.year.data.dataCode(validYear);
                yearFakePromiseListFromServer.then(function () {
                    expect(hebrewDateViewModel.month.list()).toBe(monthFakeListFromServer);
                    done();
                });
            });
            describe('fullDate', function () {
                it('only year is Full', function () {
                    hebrewDateViewModel.year.data.dataText('תשע"ה');
                    expect(hebrewDateViewModel.fullDate()).toBe('תשע"ה');
                });
                it('month and year are Full', function () {
                    hebrewDateViewModel.year.data.dataText('תשע"ה');
                    hebrewDateViewModel.month.data.dataText('אב');
                    expect(hebrewDateViewModel.fullDate()).toBe('אב תשע"ה');
                });
                it('day, month and year are Full', function () {
                    hebrewDateViewModel.year.data.dataText('תשע"ה');
                    hebrewDateViewModel.month.data.dataText('אב');
                    hebrewDateViewModel.day.data.dataText('ג\'');
                    expect(hebrewDateViewModel.fullDate()).toBe('ג\' אב תשע"ה');
                });
                it('only day is Full', function () {
                    hebrewDateViewModel.day.data.dataText('ט"ז');
                    expect(hebrewDateViewModel.fullDate()).toBe('ט"ז  ');
                });
            });
        });
    });
});
