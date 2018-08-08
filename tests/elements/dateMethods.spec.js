define(['common/elements/dateMethods'],
function (dateMethods) {
    describe('date methods', function () {

        var OfficeDate, date1, regularInput, regularInputInDiv;

        beforeAll(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
            loadFixtures('dateMethods.html');
            OfficeDate = $('#OfficeDate');
            date1 = $('#date1');
            regularInput = $('#regularInput');
            regularInputInDiv = $('#regularInputInDiv');
        });
        describe('getButtonElement function', function () {

            it('to be defined', function () {
                expect(dateMethods.getButtonElement).toBeDefined();
            });
            it('call with valid date element', function () {
                expect(dateMethods.getButtonElement(OfficeDate).attr('class')).toBe('tfsCalendar');
            });

            it('call with undefined element', function () {
                expect(function () { dateMethods.getButtonElement(date1); }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a date element', function () {
                expect(function () { dateMethods.getButtonElement(regularInput); }).toThrowError('the parameter "element" must be of date type');
            });
            it('call with not a date element in the same div of date', function () {
                expect(function () { dateMethods.getButtonElement(regularInputInDiv); }).toThrowError('the parameter "element" must be of date type');
            });

        });

        describe('isDate function', function () {
            it('to be defined', function () {
                expect(dateMethods.isDate).toBeDefined();
            });
            it('call with valid date element', function () {
                expect(dateMethods.isDate(OfficeDate)).toBeTruthy();
            });
            it('call with not a date element', function () {
                expect(dateMethods.isDate(regularInput)).toBeFalsy();
            });
            it('call with not a date element in the same div of date', function () {
                expect(dateMethods.isDate(regularInputInDiv)).toBeFalsy();
            });
            it('call with undefined element', function () {
                expect(function () { dateMethods.isDate(date1); }).toThrowError('the parameter "element" is undefined');
            });
        });


    });
});
define('spec/dateMethodsSpec.js', function () { });