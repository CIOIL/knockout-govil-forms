define(['common/elements/dateMethods', 'common/external/jquery-ui', 'common/ko/bindingHandlers/tlpDatepicker'], function (dateMethods) {
    describe('govForms - date methods', function () {

        var date1; //OfficeDate, , regularInput, regularInputInDiv;

        beforeEach(function () {
            ko.cleanNode(document.body);
            jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
            loadFixtures('govFormsDateMethods.html');
            ko.applyBindings({ datepickerSettings: {} });
        });
        describe('getButtonElement function', function () {

            it('to be defined', function () {
                expect(dateMethods.getButtonElement).toBeDefined();
            });
            it('call with valid date element', function () {
                expect(dateMethods.getButtonElement($('#datepicker1')).hasClass('datepicker-button')).toBeTruthy();
            });

            it('call with undefined element', function () {
                expect(function () {
                    dateMethods.getButtonElement(date1);
                }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a date element', function () {
                expect(function () {
                    dateMethods.getButtonElement($('#regularInput'));
                }).toThrowError('the parameter "element" must have tlpDatepicker binding');
            });
            it('call with not a date element in the same div of date', function () {
                expect(function () {
                    dateMethods.getButtonElement($('#regularInputInDiv'));
                }).toThrowError('the parameter "element" must have tlpDatepicker binding');
            });
        });

        describe('isDate function', function () {
            it('to be defined', function () {
                expect(dateMethods.isDate).toBeDefined();
            });
            it('call with valid date element', function () {
                expect(dateMethods.isDate($('#datepicker1'))).toBeTruthy();
            });
            it('call with not a date element', function () {
                expect(dateMethods.isDate($('#regularInput'))).toBeFalsy();
            });
            it('call with not a date element in the same div of date', function () {
                expect(dateMethods.isDate($('#regularInputInDiv'))).toBeFalsy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    dateMethods.isDate(date1);
                }).toThrowError('the parameter "element" is undefined');
            });
        });
    });
});