define(['common/components/date/gregorian/viewModel'], function (GregorianDateViewModel) {

    var ModularViewModel = require('common/viewModels/ModularViewModel');
    describe('GregorianDateViewModel', function () {

        var validYear = 2013;

        var defaultNumOfDays = 31;

        var gregorianDateViewModel;
        var settings = {
            title: 'תאריך פטירה לועזי',
            isRequired: true,
            day: { title: 'ייי' },
            month: { title: 'חחח', isRequired: false },
            year: { title: 'ששש' }

        };
        it('should be defined', function () {
            expect(GregorianDateViewModel).toBeDefined();
        });

        beforeEach(function () {
            gregorianDateViewModel = new GregorianDateViewModel(settings);
        });
        it('should be innherited from ModularViewModel class', function () {
            expect(GregorianDateViewModel.prototype instanceof ModularViewModel).toBeTruthy();
        });
        it('prototype.constructor is GregorianDateViewModel class', function () {
            expect(GregorianDateViewModel.prototype.constructor).toBe(GregorianDateViewModel);
        });
        it('return an instance of GregorianDateViewModel class', function () {
            expect(gregorianDateViewModel instanceof GregorianDateViewModel).toBeTruthy();
        });

        it('properties shuold be definde', function () {
            expect(gregorianDateViewModel.day).toBeDefined();
            expect(gregorianDateViewModel.month).toBeDefined();
            expect(gregorianDateViewModel.year).toBeDefined();
            expect(gregorianDateViewModel.fullDate).toBeDefined();
            expect(gregorianDateViewModel.isRequired).toBeDefined();
            expect(gregorianDateViewModel.title).toBeDefined();
        });
        describe('logic', function () {
            it('global isRequired set to part that haven\'t specific isRequired', function () {
                expect(gregorianDateViewModel.day.isRequired()).toBeTruthy();
                expect(gregorianDateViewModel.month.isRequired()).toBeFalsy();
                expect(gregorianDateViewModel.year.isRequired()).toBeTruthy();
            });

            it('month.isRequired is changed to true if day is full', function () {
                gregorianDateViewModel.day.data.dataCode(2);
                expect(gregorianDateViewModel.month.isRequired).toBeTruthy();
            });
            it('year.isRequired is changed to true if day or month are full', function () {
                gregorianDateViewModel.day.data.dataCode(2);
                expect(gregorianDateViewModel.year.isRequired).toBeTruthy();
            });
            it('days list is updated when month is changed', function () {
                gregorianDateViewModel.day.list([]);
                gregorianDateViewModel.month.data.dataCode(2);
                expect(gregorianDateViewModel.day.list().length).toEqual(defaultNumOfDays);
            });
            it('days list is updated when year is changed', function () {
                gregorianDateViewModel.day.list([]);
                gregorianDateViewModel.year.data.dataCode(validYear);
                expect(gregorianDateViewModel.day.list().length).toEqual(defaultNumOfDays);
            });

            describe('fullDate', function () {
                it('only year is Full', function () {
                    gregorianDateViewModel.year.data.dataCode(validYear);
                    expect(gregorianDateViewModel.fullDate()).toEqual('2013');
                });
                it('month and year are Full', function () {
                    gregorianDateViewModel.year.data.dataCode(validYear);
                    gregorianDateViewModel.month.data.dataCode(2);

                    expect(gregorianDateViewModel.fullDate()).toEqual('02/2013');
                });
                it('day, month and year are Full', function () {
                    gregorianDateViewModel.year.data.dataCode(validYear);
                    gregorianDateViewModel.month.data.dataCode(2);
                    gregorianDateViewModel.day.data.dataCode(4);
                    expect(gregorianDateViewModel.fullDate()).toEqual('04/02/2013');
                });
                it('only day is Full', function () {
                    gregorianDateViewModel.day.data.dataCode(4);
                    expect(gregorianDateViewModel.fullDate()).toEqual('04//');
                });
                it('recieved concatenatedDateFormat', function () {
                    gregorianDateViewModel = new GregorianDateViewModel({ concatenatedDateFormat: '-' });

                    gregorianDateViewModel.year.data.dataCode(validYear);
                    gregorianDateViewModel.month.data.dataCode(2);
                    gregorianDateViewModel.day.data.dataCode(4);
                    expect(gregorianDateViewModel.fullDate()).toEqual('04-02-2013');
                });
            });
        });
    });
});