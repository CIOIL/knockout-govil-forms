define(['common/utilities/typeParser'], function (typeParser) {
    describe('typeParserTest', function () {

        describe('string', function () {
            it('number to string', function () {
                var testObj = typeParser.string(1234);//eslint-disable-line no-magic-numbers 
                expect(testObj).toEqual('1234');
            });

            it('boolean to string', function () {
                var testObj = typeParser.string(true);
                expect(testObj).toEqual('true');
            });
        });

        it('int', function () {
            var testObj = typeParser.int('1234');
            expect(testObj).toEqual(1234);//eslint-disable-line no-magic-numbers 
        });

        describe('number', function () {
            it('decimalStringToNumber', function () {
                var testObj = typeParser.number('1234.12');
                expect(testObj).toEqual(1234.12);//eslint-disable-line no-magic-numbers 
            });
        });

        describe('date', function () {
            it('is instanceofDate', function () {
                var testObj = typeParser.date('04/02/2000');
                expect(testObj instanceof Date).toBeTruthy();
            });

            it('object is instanceofDate', function () {
                var testObj = typeParser.date(new Date('01/01/2000'));
                expect(testObj instanceof Date).toBeTruthy();
            });

            it('string to Date type using default Format', function () {
                var testObj = typeParser.date('04/02/2000');
                expect(testObj.getDate()).toEqual(4);
                expect(testObj.getMonth() + 1).toEqual(2);
                expect(testObj.getFullYear()).toEqual(2000);//eslint-disable-line no-magic-numbers 
            });

            it('value not valid date', function () {
                var testObj = typeParser.date('31/02/2000');
                expect(testObj).toBeNull();

            });

            it('parse date between 12:00-13:00', function () {
                var twelveOclockPM = 12, twelveOclockAM = 0;
                var testObj = typeParser.date('1/8/2017 12:07:00 PM', 'M/d/yyyy H:mm:ss tt');
                expect(testObj.getDate()).toEqual(8);
                expect(testObj.getHours()).toEqual(twelveOclockPM);
                testObj = typeParser.date('1/8/2017 12:00:00 PM', 'M/d/yyyy H:mm:ss tt');
                expect(testObj.getDate()).toEqual(8);
                expect(testObj.getHours()).toEqual(twelveOclockPM);
                testObj = typeParser.date('1/8/2017 12:07:00 AM', 'M/d/yyyy H:mm:ss tt');
                expect(testObj.getDate()).toEqual(8);
                expect(testObj.getHours()).toEqual(twelveOclockAM);
                testObj = typeParser.date('1/8/2017 12:00:00 AM', 'M/d/yyyy H:mm:ss tt');
                expect(testObj.getDate()).toEqual(8);
                expect(testObj.getHours()).toEqual(twelveOclockAM);
            });

            it('parse date not between 12:00-13:00', function () {
                var tenOclockPM = 22, tenOclockAM = 10;
                var testObj = typeParser.date('1/8/2017 10:07:00 PM', 'M/d/yyyy H:mm:ss tt');
                expect(testObj.getDate()).toEqual(8);
                expect(testObj.getHours()).toEqual(tenOclockPM);
                testObj = typeParser.date('1/8/2017 10:07:00 AM', 'M/d/yyyy H:mm:ss tt');
                expect(testObj.getDate()).toEqual(8);
                expect(testObj.getHours()).toEqual(tenOclockAM);
            });

            it('string to Date type using format parameter', function () {
                var testObj = typeParser.date('04-02-2000', 'dd-MM-yyyy');
                expect(testObj.getDate()).toEqual(4);
                expect(testObj.getMonth() + 1).toEqual(2);
                expect(testObj.getFullYear()).toEqual(2000);//eslint-disable-line no-magic-numbers 
            });

            it('string with unadjusted format', function () {
                var testObj = typeParser.date('04-02-2000');
                expect(testObj).toBeNull();
            });

        });
    });
});