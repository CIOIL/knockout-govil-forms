define(['common/components/date/gregorian/monthViewModel'], function (MonthViewModel) {

    var GregorianBasePartViewModel = require('common/components/date/gregorian/gregorianBasePartViewModel');
    var languageViewModel = require('common/viewModels/languageViewModel');
    var infsMethods = require('common/infrastructureFacade/tfsMethods');

    describe('MonthViewModel', function () {
        var invalidMonth = 15;

        var monthViewModel;
        it('should be defined', function () {
            expect(MonthViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(GregorianBasePartViewModel, 'call').and.callThrough();
            spyOn(infsMethods, 'setFormLanguage');

            monthViewModel = new MonthViewModel();
        });
        it('should be innherited from GregorianBasePartViewModel class', function () {
            expect(MonthViewModel.prototype instanceof GregorianBasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is MonthViewModel class', function () {
            expect(MonthViewModel.prototype.constructor).toBe(MonthViewModel);
        });
        it('return an instance of MonthViewModel class', function () {
            expect(monthViewModel instanceof MonthViewModel).toBeTruthy();
        });
        it('fill list in the constructor', function () {
            expect(monthViewModel.list()).toBeDefined();
        });

        describe('validation', function () {
            it('valid code month', function () {
                monthViewModel.data.dataCode(5);
                expect(monthViewModel.data.dataCode.isValid()).toBeTruthy();
            });
            it('invalid code month', function () {
                monthViewModel.data.dataCode(invalidMonth);
                expect(monthViewModel.data.dataCode.isValid()).toBeFalsy();
            });
        });
        it('when language is changed - months names change accordding to the new language ', function () {
            monthViewModel = new MonthViewModel({ isNumericMonth: false });
            var list = monthViewModel.list;
            languageViewModel.language('hebrew');

            expect(list()[0].dataText).toEqual('ינואר');
            languageViewModel.language('english');
            expect(list()[0].dataText).toEqual('January');
            languageViewModel.language('hebrew');
        });
        describe('functions', function () {
            describe('getList', function () {
                it('isNumericMonth true(default) - return numeric list: 01,02..12', function () {
                    var list = monthViewModel.getList();
                    expect(list[0].dataText).toEqual('01');
                    expect(list[11].dataText).toEqual('12'); //eslint-disable-line no-magic-numbers
                });

                it('isNumericMonth false - return literal list: ינואר,פברואר...דצמבר', function () {
                    languageViewModel.language('hebrew');
                    monthViewModel = new MonthViewModel({ isNumericMonth: false });
                    var list = monthViewModel.getList();
                    expect(list[0].dataText).toEqual('ינואר');
                    expect(list[11].dataText).toEqual('דצמבר'); //eslint-disable-line no-magic-numbers
                });
            });
            describe('getLiteralMonthName', function () {
                it('parameter numOfMonth valid - locale he-il', function () {
                    languageViewModel.language('hebrew');
                    var literalMonth = monthViewModel.getLiteralMonthName(2);
                    expect(literalMonth).toEqual('פברואר');
                });
                it('parameter numOfMonth valid - locale en-US', function () {
                    languageViewModel.language('english');
                    var literalMonth = monthViewModel.getLiteralMonthName(2);
                    expect(literalMonth).toEqual('February');
                });
                it('parameter numOfMonth invalid', function () {
                    var literalMonth = monthViewModel.getLiteralMonthName(15); //eslint-disable-line no-magic-numbers
                    expect(literalMonth).toEqual('');
                });
            });
        });
    });
});