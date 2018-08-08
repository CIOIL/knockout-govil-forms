define(['common/utilities/dateMethods', 'common/external/date'], function (dateMethods) {

    /*eslint-disable*/
    describe('date utility methods', function () {
        var testObj;
        describe('pastDate', function () {
            it('function defined', function () {
                expect(dateMethods.pastDate).toBeDefined();
            });

            it('value valid', function () {
                testObj = dateMethods.pastDate('01/01/1900', { compareTo: '01/01/2005' });
                expect(testObj).toBeTruthy();
            });
            it('value undefined', function () {
                testObj = dateMethods.pastDate(undefined);
                expect(testObj).toBeTruthy();
            });
            it('compareTo undefined', function () {
                expect(function () {
                    testObj = dateMethods.pastDate('01/01/1900', { compareTo: undefined });
                }).toThrow();
            });
            it('value null', function () {
                testObj = dateMethods.pastDate(null);
                expect(testObj).toBeTruthy();
            });
            it('compareTo null', function () {
                expect(function () {
                    testObj = dateMethods.pastDate('01/01/1900', { compareTo: null });
                }).toThrow();
            });
            it('value empty', function () {
                testObj = dateMethods.pastDate('');
                expect(testObj).toBeTruthy();
            });
            it('compareTo empty', function () {
                expect(function () {
                    testObj = dateMethods.pastDate('01/01/1900', { compareTo: '' });
                }).toThrow();
            });
            it('value valid and compareTo not sent', function () {
                expect(function () {
                    testObj = dateMethods.pastDate('01/01/1900');
                }).toThrow();
            });
            it("compareTo observable empty returns true", function () {
                var testObjcompareTo = ko.observable();
                expect(dateMethods.pastDate('01/01/1900', { compareTo: testObjcompareTo })).toBeTruthy();
                expect(dateMethods.pastDate('01/01/2018', { compareTo: testObjcompareTo })).toBeTruthy();
            });
            it('compareTo observable value valid', function () {
                var testObjcompareTo = ko.observable('02/01/2015');
                testObj = dateMethods.pastDate('01/01/2010', { compareTo: testObjcompareTo });
                expect(testObj).toBeTruthy();
            });
            it('compareTo observable value not valid', function () {
                var testObjcompareTo = ko.observable('02/01/20');
                expect(function () {
                    dateMethods.pastDate('01/01/2010', { compareTo: testObjcompareTo });
                }).toThrow();
            });
            it('compareTo observable value not past date', function () {
                var testObjcompareTo = ko.observable('01/01/1980');
                testObj = dateMethods.pastDate('01/01/2010', { compareTo: testObjcompareTo });
                expect(testObj).toBeFalsy();
            });
            it('compareTo  value not valid', function () {
                expect(function () {
                    dateMethods.pastDate('01/01/2010', { compareTo: '02/01/20' });
                }).toThrow();
            });
            it('value not past date', function () {
                testObj = dateMethods.pastDate('01/01/2010', { compareTo: '01/01/1980' });
                expect(testObj).toBeFalsy();
            });
            it('value not valid', function () {
                expect(function () {
                    dateMethods.pastDate('01/01/20d0', { compareTo: '02/01/2000' });
                }).toThrow();
            });
            it('value is equal to parameter', function () {
                expect(function () {
                    testObj = dateMethods.pastDate('01/01/2010', { compareTo: '01/01/2010' });
                    expect(testObj).toBeFalsy();
                });
            });
        });

        describe('futureDate', function () {
            it('function defined', function () {
                expect(dateMethods.futureDate).toBeDefined();
            });

            it('value valid', function () {
                testObj = dateMethods.futureDate('01/01/1900', { compareTo: '01/01/1890' });
                expect(testObj).toBeTruthy();
            });
            it('value undefined', function () {
                testObj = dateMethods.futureDate(undefined);
                expect(testObj).toBeTruthy();
            });
            it('compareTo undefined', function () {
                expect(function () {
                    testObj = dateMethods.futureDate('01/01/1900', { compareTo: undefined });
                }).toThrow();
            });
            it('value null', function () {
                testObj = dateMethods.futureDate(null);
                expect(testObj).toBeTruthy();
            });
            it('compareTo null', function () {
                expect(function () {
                    testObj = dateMethods.futureDate('01/01/1900', { compareTo: null });
                }).toThrow();
            });
            it('value empty', function () {
                testObj = dateMethods.futureDate('');
                expect(testObj).toBeTruthy();
            });
            it('compareTo empty', function () {
                expect(function () {
                    testObj = dateMethods.futureDate('01/01/1900', { compareTo: '' });
                }).toThrow();
            });
            it('value valid and compareTo not sent', function () {
                expect(function () {
                    testObj = dateMethods.futureDate('01/01/1900');
                }).toThrow();
            });
            it("compareTo observable empty returns true", function () {
                var testObjcompareTo = ko.observable();
                expect(dateMethods.futureDate('01/01/2018', { compareTo: testObjcompareTo })).toBeTruthy();
                expect(dateMethods.futureDate('01/01/1900', { compareTo: testObjcompareTo })).toBeTruthy();
            });
            it('compareTo observable value valid', function () {
                var testObjcompareTo = ko.observable('02/01/2015');
                testObj = dateMethods.futureDate('01/01/2020', { compareTo: testObjcompareTo });
                expect(testObj).toBeTruthy();
            });
            it('compareTo observable value not valid', function () {
                var testObjcompareTo = ko.observable('02/01/20');
                expect(function () {
                    dateMethods.futureDate('01/01/2010', { compareTo: testObjcompareTo });
                }).toThrow();
            });
            it('compareTo observable value not future date', function () {
                var testObjcompareTo = ko.observable('01/01/1980');
                testObj = dateMethods.futureDate('01/01/1925', { compareTo: testObjcompareTo });
                expect(testObj).toBeFalsy();
            });
            it('compareTo  value not valid', function () {
                expect(function () {
                    dateMethods.futureDate('01/01/2010', { compareTo: '02/01/20' });
                }).toThrow();
            });
            it('value not future date', function () {
                testObj = dateMethods.futureDate('01/01/1954', { compareTo: '01/01/1980' });
                expect(testObj).toBeFalsy();
            });
            it('value not valid', function () {
                expect(function () {
                    dateMethods.futureDate('01/01/20d0', { compareTo: '02/01/2000' });
                }).toThrow();
            });

            it('value is equal to parameter', function () {
                testObj = dateMethods.futureDate('01/01/2010', { compareTo: '01/01/2010' });
                expect(testObj).toBeFalsy();
            });
        });

        describe('untilDate', function () {
            it('function defined', function () {
                expect(dateMethods.untilDate).toBeDefined();
            });

            it('value valid', function () {
                testObj = dateMethods.untilDate('01/01/1900', { compareTo: '01/01/1990' });
                expect(testObj).toBeTruthy();
            });
            it('value undefined', function () {
                testObj = dateMethods.untilDate(undefined);
                expect(testObj).toBeTruthy();
            });
            it('compareTo undefined', function () {
                expect(function () {
                    testObj = dateMethods.untilDate('01/01/1900', { compareTo: undefined });
                }).toThrow();
            });
            it('value null', function () {
                testObj = dateMethods.untilDate(null);
                expect(testObj).toBeTruthy();
            });
            it('compareTo null', function () {
                expect(function () {
                    testObj = dateMethods.untilDate('01/01/1900', { compareTo: null });
                }).toThrow();
            });
            it('value empty', function () {
                testObj = dateMethods.untilDate('');
                expect(testObj).toBeTruthy();
            });
            it('compareTo empty', function () {
                expect(function () {
                    testObj = dateMethods.untilDate('01/01/1900', { compareTo: '' });
                }).toThrow();
            });
            it('value valid and compareTo not sent', function () {
                expect(function () {
                    testObj = dateMethods.untilDate('01/01/1900');
                }).toThrow();
            });
            it("compareTo observable empty returns true", function () {
                var testObjcompareTo = ko.observable();
                expect(dateMethods.untilDate('01/01/1900', { compareTo: testObjcompareTo })).toBeTruthy();
                expect(dateMethods.untilDate('01/01/2018', { compareTo: testObjcompareTo })).toBeTruthy();
            });
            it('compareTo observable value valid', function () {
                var testObjcompareTo = ko.observable('02/01/2020');
                testObj = dateMethods.untilDate('01/01/2015', { compareTo: testObjcompareTo });
                expect(testObj).toBeTruthy();
            });
            it('compareTo observable value not valid', function () {
                var testObjcompareTo = ko.observable('02/01/20');
                expect(function () {
                    dateMethods.untilDate('01/01/2010', { compareTo: testObjcompareTo });
                }).toThrow();
            });
            it('compareTo observable value not past or same date', function () {
                var testObjcompareTo = ko.observable('01/01/1980');
                testObj = dateMethods.untilDate('01/01/1987', { compareTo: testObjcompareTo });
                expect(testObj).toBeFalsy();
            });
            it('compareTo  value not valid', function () {
                expect(function () {
                    dateMethods.untilDate('01/01/2010', { compareTo: '02/01/20' });
                }).toThrow();
            });
            it('value not past or same date', function () {
                testObj = dateMethods.untilDate('01/01/1990', { compareTo: '01/01/1950' });
                expect(testObj).toBeFalsy();
            });
            it('value not valid', function () {
                expect(function () {
                    dateMethods.untilDate('01/01/20d0', { compareTo: '02/01/2000' });
                }).toThrow();
            });
            it('value is equal to parameter', function () {
                expect(function () {
                    testObj = dateMethods.untilDate('01/01/2010', { compareTo: '01/01/2010' });
                    expect(testObj).toBeTruthy();
                });
            });
        });

        describe('between2Dates', function () {
            beforeEach(function () {
                testObj = ko.observable();
            });

            it('function defined', function () {
                expect(dateMethods.between2Dates).toBeDefined();
            });
            it('value undefined', function () {
                testObj = dateMethods.between2Dates(undefined, { fromDate: '01/01/1999', toDate: '01/01/2015' });
                expect(testObj).toBeTruthy();
            });
            it('value null', function () {
                testObj = dateMethods.between2Dates(null, { fromDate: '01/01/1999', toDate: '01/01/2015' });
                expect(testObj).toBeTruthy();
            });
            it('value empty', function () {
                testObj = dateMethods.between2Dates('', { fromDate: '01/01/1999', toDate: '01/01/2015' });
                expect(testObj).toBeTruthy();
            });
            it('value not valid', function () {
                expect(function () {
                    dateMethods.between2Dates('06/10/ddd', { fromDate: '01/01/1999', toDate: '01/01/2015' });
                }).toThrow();
            });
            it('value valid', function () {
                testObj = dateMethods.between2Dates('10/12/2000', { fromDate: '01/01/1999', toDate: '01/01/2015' });
                expect(testObj).toBeTruthy();
            });
            it('value valid and not between the 2 dates', function () {
                testObj = dateMethods.between2Dates('10/12/1994', { fromDate: '01/01/1999', toDate: '01/01/2015' });
                expect(testObj).toBeFalsy();
            });
            it('fromDate null', function () {
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: null, toDate: '01/01/2015' });
                }).toThrow();
            });
            it('toDate null', function () {
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: '01/01/1999', toDate: null });
                }).toThrow();
            });
            it('fromDate undefined', function () {
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: undefined, toDate: '01/01/2015' });
                }).toThrow();
            });
            it('toDate undefined', function () {
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: '', toDate: '01/01/2015' });
                }).toThrow();
            });
            it('fromDate or toDate empty', function () {
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: '', toDate: '01/01/2015' });
                }).toThrow();
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: '01/01/1999', toDate: '' });
                }).toThrow();
            });

            it('fromDate or toDate not set', function () {
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { toDate: '01/01/2015' });
                }).toThrow();
                expect(function () {
                    dateMethods.between2Dates('10/12/1994', { fromDate: '01/01/1999' });
                }).toThrow();
            });

            it('fromDate is not earlier than toDate', function () {
                testObj = dateMethods.between2Dates('10/12/1994', { fromDate: '01/01/2015', toDate: '01/01/1999' });
                expect(testObj).toBeFalsy();
            });
        });

        describe('isOlder', function () {

            it('function defined', function () {
                expect(dateMethods.isOlder).toBeDefined();
            });

            it('value valid', function () {
                testObj = dateMethods.isOlder('01/01/1994', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });

            it('not older', function () {
                testObj = dateMethods.isOlder('01/01/2015', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeFalsy();
            });

            it('value undefined', function () {
                testObj = dateMethods.isOlder(undefined, { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });

            it('value null', function () {
                testObj = dateMethods.isOlder(null, { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });
            it('value empty', function () {
                testObj = dateMethods.isOlder('', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });
            it('value not valid', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/20', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                }).toThrow();
            });

            it('currentDate undefined', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: undefined, age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate null', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: null, age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate empty', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: '', age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate invalid', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: '01/11111', age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate observable', function () {
                var currentTest = ko.observable('01/01/2016');
                testObj = dateMethods.isOlder('01/01/1992', { currentDate: currentTest, age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });
            it('age null', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: '01/01/2016', age: null, subject: 'התובע' });
                }).toThrow();
            });
            it('age undefined', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: '01/01/2016', age: undefined, subject: 'התובע' });
                }).toThrow();
            });
            it('age empty', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: '01/01/2016', age: '', subject: 'התובע' });
                }).toThrow();
            });
            it('age invalid', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { currentDate: '01/01/2016', age: 'aa', subject: 'התובע' });
                }).toThrow();
            });
            it('age observable', function () {
                var ageTest = ko.observable(18);
                testObj = dateMethods.isOlder('01/01/1992', { currentDate: '25/01/2016', age: ageTest, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });

            it('parameter missing', function () {
                expect(function () {
                    testObj = dateMethods.isOlder('01/01/1994', { age: 'aa', subject: 'התובע' });
                }).toThrow();
            });
        });

        describe('isYounger', function () {

            it('function defined', function () {
                expect(dateMethods.isYounger).toBeDefined();
            });

            it('value valid', function () {
                testObj = dateMethods.isYounger('01/01/2010', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });

            it('not younger', function () {
                testObj = dateMethods.isYounger('01/01/1990', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeFalsy();
            });

            it('value undefined', function () {
                testObj = dateMethods.isYounger(undefined, { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });

            it('value null', function () {
                testObj = dateMethods.isYounger(null, { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });
            it('value empty', function () {
                testObj = dateMethods.isYounger('', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });
            it('value not valid', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/20', { currentDate: '25/01/2016', age: 18, subject: 'התובע' });
                }).toThrow();
            });

            it('currentDate undefined', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/1994', { currentDate: undefined, age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate null', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/1994', { currentDate: null, age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate empty', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/1994', { currentDate: '', age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate invalid', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/2010', { currentDate: '01/11111', age: 18, subject: 'התובע' });
                }).toThrow();
            });
            it('currentDate observable', function () {
                var currentTest = ko.observable('01/01/2016');
                testObj = dateMethods.isYounger('01/01/2010', { currentDate: currentTest, age: 18, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });
            it('age null', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/2010', { currentDate: '01/01/2016', age: null, subject: 'התובע' });
                }).toThrow();
            });
            it('age undefined', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/2010', { currentDate: '01/01/2016', age: undefined, subject: 'התובע' });
                }).toThrow();
            });
            it('age empty', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/2010', { currentDate: '01/01/2016', age: '', subject: 'התובע' });
                }).toThrow();
            });
            it('age invalid', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/2010', { currentDate: '01/01/2016', age: 'aa', subject: 'התובע' });
                }).toThrow();
            });
            it('age observable', function () {
                var ageTest = ko.observable(18);
                testObj = dateMethods.isYounger('01/01/2010', { currentDate: '25/01/2016', age: ageTest, subject: 'התובע' });
                expect(testObj).toBeTruthy();
            });

            it('parameter missing', function () {
                expect(function () {
                    testObj = dateMethods.isYounger('01/01/2010', { age: 'aa', subject: 'התובע' });
                }).toThrow();
            });
        });
        describe('getTimeStamp', function () {
            beforeEach(function () {

                var baseTime = new Date(2017, 9, 24);
                spyOn(window, 'Date').and.callFake(function () {
                    return baseTime;
                });
            });
            it('function defined', function () {
                expect(dateMethods.getTimeStamp).toBeDefined();
            });

            it('value valid', function () {

                var timeStamp = dateMethods.getTimeStamp();
                expect(timeStamp.toString()).toEqual('1508792400000');
            });
        });
    });

    /*eslint-enable  no-magic-numbers*/
    define('spec/validateDateSpec.js', function () {});
});