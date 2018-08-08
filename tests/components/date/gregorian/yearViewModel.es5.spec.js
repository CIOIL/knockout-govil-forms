define(['common/components/date/gregorian/yearViewModel'], function (YearViewModel) {

    var GregorianBasePartViewModel = require('common/components/date/gregorian/gregorianBasePartViewModel');
    describe('YearViewModel', function () {

        var yearViewModel;
        it('should be defined', function () {
            expect(YearViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(GregorianBasePartViewModel, 'call').and.callThrough();
            yearViewModel = new YearViewModel();
        });
        it('should be innherited from GregorianBasePartViewModel class', function () {
            expect(YearViewModel.prototype instanceof GregorianBasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is YearViewModel class', function () {
            expect(YearViewModel.prototype.constructor).toBe(YearViewModel);
        });
        it('return an instance of YearViewModel class', function () {
            expect(yearViewModel instanceof YearViewModel).toBeTruthy();
        });
        it('fill list in the constructor', function () {
            expect(yearViewModel.list()).toBeDefined();
        });

        describe('', function () {
            it('use defaults if no settings sent', function () {
                yearViewModel = new YearViewModel();
                var baseYear = new Date().getFullYear() - 100; //eslint-disable-line no-magic-numbers
                expect(yearViewModel.list().length).toEqual(200); //eslint-disable-line no-magic-numbers
                expect(yearViewModel.list()[0]).toEqual({ dataCode: baseYear, dataText: baseYear.toString() });
            });
            it('use setting if sent', function () {
                yearViewModel = new YearViewModel({ baseYear: 2000, numberOfYears: 3 });
                expect(yearViewModel.list()).toEqual([{ dataCode: 2000, dataText: '2000' }, { dataCode: 2001, dataText: '2001' }, { dataCode: 2002, dataText: '2002' }]);
            });
            it('use ko.observable in setting', function () {
                yearViewModel = new YearViewModel({ baseYear: ko.observable(2000), numberOfYears: ko.observable(3) }); //eslint-disable-line no-magic-numbers
                expect(yearViewModel.list().length).toEqual(3); //eslint-disable-line no-magic-numbers
                expect(yearViewModel.list()[0]).toEqual({ dataCode: 2000, dataText: '2000' });
            });
            it('computed parameter- list changes when computed reevaluated', function () {
                var dep = ko.observable(2000); //eslint-disable-line no-magic-numbers
                var sampleDep = ko.computed(function () {
                    return dep();
                });
                yearViewModel = new YearViewModel({ baseYear: sampleDep, numberOfYears: 3 }); //eslint-disable-line no-magic-numbers
                expect(yearViewModel.list().length).toEqual(3);
                expect(yearViewModel.list()[0]).toEqual({ dataCode: 2000, dataText: '2000' });
                dep(2006); //eslint-disable-line no-magic-numbers
                expect(yearViewModel.list()[0]).toEqual({ dataCode: 2006, dataText: '2006' });
                expect(yearViewModel.list()[2]).toEqual({ dataCode: 2008, dataText: '2008' });
            });
            it('use empty ko.observable in setting not throwing', function () {
                expect(function () {
                    yearViewModel = new YearViewModel({ baseYear: ko.observable(), numberOfYears: ko.observable(3) }); //eslint-disable-line no-magic-numbers
                }).not.toThrow();
                expect(yearViewModel.list().length).toEqual(0);
            });
        });

        describe('functions', function () {
            describe('getList', function () {
                it('valid parameters', function () {
                    var baseYear = 2016;
                    var numberOfYears = 3;
                    var startAtBaseYear = true;
                    var list = yearViewModel.getList(baseYear, numberOfYears, startAtBaseYear);
                    expect(list[0].dataCode).toEqual(baseYear);
                    expect(list.length).toEqual(numberOfYears);
                });
                it('valid parameters startAtBaseYear false reverse the list', function () {
                    var baseYear = 2016;
                    var numberOfYears = 3;
                    var startAtBaseYear = false;
                    var list = yearViewModel.getList(baseYear, numberOfYears, startAtBaseYear);
                    expect(list[2].dataCode).toEqual(baseYear);
                });
                it('without parameters - throw an error', function () {
                    expect(function () {
                        yearViewModel.getList();
                    }).toThrow();
                });

                it('invalid parameters - throw exception', function () {
                    expect(function () {
                        yearViewModel.getList('2016', '3', true);
                    }).toThrow();
                });
            });
        });
    });

    //$(document).ready(function () {
    //    window.executeTests();
    //});
});