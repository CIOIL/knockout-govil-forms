define(['common/components/date/gregorian/dayViewModel'],
function (DayViewModel) {

    var GregorianBasePartViewModel = require('common/components/date/gregorian/gregorianBasePartViewModel');


    describe('DayViewModel', function () {
        var inValidDay = 32;
        var validYear = 2016;
        var numOfDays = 29;
        var defaultNumOfDays = 31;
        var dayViewModel;
        var settings = { title: 'יום בחודש' };
        it('should be defined', function () {
            expect(DayViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(GregorianBasePartViewModel, 'call').and.callThrough();
            dayViewModel = new DayViewModel(settings);

        });
        it('should be innherited from GregorianBasePartViewModel class', function () {
            expect(Object.getPrototypeOf(dayViewModel) instanceof GregorianBasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is DayViewModel class', function () {
            expect(Object.getPrototypeOf(dayViewModel).constructor).toBe(DayViewModel);
        });
        it('return an instance of DayViewModel class', function () {
            expect(dayViewModel instanceof DayViewModel).toBeTruthy();
        });
        it('fill list in the constructor', function () {
            expect(dayViewModel.list()).toBeDefined();
        });
        describe('validation', function () {
            it('valid code day', function () {
                dayViewModel.data.dataCode(5);
                expect(dayViewModel.data.dataCode.isValid()).toBeTruthy();
            });
            it('invalid code day', function () {
                dayViewModel.data.dataCode(inValidDay);
                expect(dayViewModel.data.dataCode.isValid()).toBeFalsy();

            });
        });
        describe('functions', function () {
            describe('getNumDaysOfMonth', function () {
                it('without parameters - return default 31 days', function () {
                    expect(dayViewModel.getNumDaysOfMonth()).toEqual(defaultNumOfDays);

                });

                it('valid parameters - return the num days of the recieved month ', function () {
                    var month = new GregorianBasePartViewModel({});
                    var year = new GregorianBasePartViewModel({});
                    month.data.dataCode(2);
                    year.data.dataCode(validYear);
                    expect(dayViewModel.getNumDaysOfMonth(month, year)).toEqual(numOfDays);

                });

                it('invalid parameters - return default 31 days', function () {
                    var month = new GregorianBasePartViewModel({});
                    var year = new GregorianBasePartViewModel({});
                    month.data.dataCode(2);
                    expect(dayViewModel.getNumDaysOfMonth(month, year)).toEqual(defaultNumOfDays);
                });

            });
            describe('getList', function () {
                it('without parameters - return default list with 31 days', function () {
                    var list = dayViewModel.getList();
                    expect(list.length).toEqual(defaultNumOfDays);

                });

                it('valid parameters - return list according to the month and year that recieved', function () {
                    var month = new GregorianBasePartViewModel({});
                    var year = new GregorianBasePartViewModel({});
                    month.data.dataCode(2);
                    year.data.dataCode(validYear);
                    var list = dayViewModel.getList(month, year);
                    expect(list.length).toEqual(numOfDays);

                });

                it('invalid parameters - return default list 31 days', function () {
                    var month = new GregorianBasePartViewModel({});
                    var year = new GregorianBasePartViewModel({});
                    month.data.dataCode(2);
                    var list = dayViewModel.getList(month, year);
                    expect(list.length).toEqual(defaultNumOfDays);
                });
                it('return list', function () {
                    var list = dayViewModel.getList();
                    expect(list.length).toBeDefined();
                });
                it('return list with padding dataText', function () {
                    var list = dayViewModel.getList();
                    expect(list[0].dataText).toEqual('01');
                });

            });
            describe('updateList', function () {
                it('without parameters - update the list to be default (31 days)', function () {
                    dayViewModel.updateList();
                    expect(dayViewModel.list().length).toEqual(defaultNumOfDays);

                });

                it('valid parameters -update the list to contains days according to the month and year that recieved', function () {
                    var month = new GregorianBasePartViewModel({});
                    var year = new GregorianBasePartViewModel({});
                    month.data.dataCode(2);
                    year.data.dataCode(validYear);
                    dayViewModel.updateList(month, year);
                    expect(dayViewModel.list().length).toEqual(numOfDays);

                });


            });
         
        });

    });

    //$(document).ready(function () {
    //    window.executeTests();
    //});

});
