define(['common/dataServices/hebrewDateRequests', 'common/networking/services', 'common/networking/ajax'], function (hebrewDateRequests, services, ajax) {

    var year = 5775;
    var outOfRangeMonth = 14;
    var outOfRangeYear = 6001;
    var outOfRangeNumberOfYears = 1000;
    var belowOfRangeNumberOfYears = -1;
    var month = 2;
    var settings = {
        serverName: 'test'
    };

    describe('hebrewDateRequests', function () {

        it('should be defined', function () {
            expect(hebrewDateRequests).toBeDefined();
        });

        beforeAll(function () {
            spyOn(ajax, 'request');
            spyOn(services, 'govServiceListRequest').and.callThrough();
        });

        describe('getDays method', function () {

            it('should be defined', function () {
                expect(hebrewDateRequests.getDays).toBeDefined();
            });

            describe('parameters', function () {
                describe('month', function () {
                    it('is mandatory ', function () {
                        expect(function () {
                            hebrewDateRequests.getDays();
                        }).toThrow();
                    });
                    it('numeric value is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(3, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('numeric value by string type is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays('3', year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('un-numeric string is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays('aaa', year);
                        }).toThrow();
                    });
                    it('in range 1-13 is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(1, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('less than 1 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(0, year);
                        }).toThrow();
                    });
                    it('grater than 13 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(outOfRangeMonth, year);
                        }).toThrow();
                    });
                });
                describe('year', function () {

                    it('is mandatory ', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month);
                        }).toThrow();
                    });
                    it('numeric value is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('numeric value by string type is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, '5775');
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('un-numeric string is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month, 'aaa');
                        }).toThrow();
                    });
                    it('in range 5344-5999 is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('less than 5344 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month, 0);
                        }).toThrow();
                    });
                    it('grater than 5999 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month, outOfRangeYear);
                        }).toThrow();
                    });
                });
                describe('settings', function () {
                    it('is not mandatory ', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                });
            });

            describe('logic', function () {
                it('settings received - all settings pass to request', function () {
                    hebrewDateRequests.getDays(month, year, settings);
                    expect(services.govServiceListRequest).toHaveBeenCalledWith(settings);
                });
                it('settings wasn"t received - only route settings was pass to request', function () {
                    hebrewDateRequests.getDays(month, year);
                    expect(services.govServiceListRequest).toHaveBeenCalledWith({ route: 'DateTimeConverter/GetListOfHebrewDays?year=5775&month=2&type=json' });
                });
            });
        });

        describe('getMonths method', function () {

            it('should be defined', function () {
                expect(hebrewDateRequests.getMonths).toBeDefined();
            });

            describe('parameters', function () {
                describe('year', function () {

                    it('is mandatory ', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month);
                        }).toThrow();
                    });
                    it('numeric value is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('numeric value by string type is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, '5775');
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('un-numeric string is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month, 'aaa');
                        }).toThrow();
                    });
                    it('in range 5344-5999 is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDays(month, year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('less than 5344 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month, 0);
                        }).toThrow();
                    });
                    it('grater than 5999 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDays(month, outOfRangeYear);
                        }).toThrow();
                    });
                });
                describe('settings', function () {
                    it('is not mandatory ', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getMonths(year);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                });
            });

            describe('logic', function () {
                it('settings received - all settings pass to request', function () {
                    hebrewDateRequests.getMonths(year, settings);
                    expect(services.govServiceListRequest).toHaveBeenCalledWith(settings);
                });
                it('settings wasn"t received - only route settings was pass to request', function () {
                    hebrewDateRequests.getMonths(year);
                    expect(services.govServiceListRequest).toHaveBeenCalledWith({ route: 'DateTimeConverter/GetListOfHebrewMonths?year=5775&type=json' });
                });
            });
        });
        describe('getYears method', function () {
            var baseYear = 1901;
            var numberOfYears = 3;
            it('should be defined', function () {
                expect(hebrewDateRequests.getYears).toBeDefined();
            });

            describe('parameters', function () {
                describe('baseYear', function () {
                    it('is mandatory ', function () {
                        expect(function () {
                            hebrewDateRequests.getYears();
                        }).toThrow();
                    });

                    it('numeric value is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, numberOfYears);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('numeric value by string type is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getYears('5775', numberOfYears);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('un-numeric string is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears('aaa', numberOfYears);
                        }).toThrow();
                    });
                    it('in range 1000-6000 is valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, numberOfYears);
                        }).not.toThrow();
                    });
                    it('less than 1000 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(0);
                        }).toThrow();
                    });
                    it('grater than 6000 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(outOfRangeYear, numberOfYears);
                        }).toThrow();
                    });
                });
                describe('numberOfYears', function () {
                    it('is mandatory ', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear);
                        }).toThrow();
                    });
                    it('numeric value is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, numberOfYears);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('numeric value by string type is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, '140');
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('un-numeric string is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, 'aaa');
                        }).toThrow();
                    });
                    it('in range 0-140 is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, numberOfYears);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                    it('less than 0 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, belowOfRangeNumberOfYears);
                        }).toThrow();
                    });
                    it('grater than 140 is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, outOfRangeNumberOfYears);
                        }).toThrow();
                    });
                    it('should be in range 0-140 ', function () {});
                });
                describe('settings', function () {
                    it('is not mandatory ', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getYears(baseYear, numberOfYears);
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                });
            });

            describe('logic', function () {
                it('settings received - all settings pass to request', function () {
                    hebrewDateRequests.getYears(baseYear, numberOfYears, settings);
                    expect(services.govServiceListRequest).toHaveBeenCalledWith(settings);
                });
                it('settings wasn"t received - only route settings was pass to request', function () {
                    hebrewDateRequests.getYears(baseYear, numberOfYears);
                    expect(services.govServiceListRequest).toHaveBeenCalledWith({ route: 'DateTimeConverter/GetListOfHebrewYears?dateTimeModel={day:"1",month:"1",year:1901,startYear:0,endYear:3,type:1}' });
                });
            });
        });

        describe('getDate method', function () {

            it('should be defined', function () {
                expect(hebrewDateRequests.getDate).toBeDefined();
            });

            describe('parameters', function () {
                describe('date', function () {

                    it('is mandatory ', function () {
                        expect(function () {
                            hebrewDateRequests.getDate();
                        }).toThrow();
                    });
                    it('Date  is valid', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDate(new Date());
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });

                    it('formatted date is not valid', function () {
                        expect(function () {
                            hebrewDateRequests.getDate('01/10/1991');
                        }).toThrow();
                    });
                });
                describe('settings', function () {
                    it('is not mandatory ', function (done) {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/dataServices/templates';
                        loadFixtures('hebrewDateRequests.html');
                        expect(function () {
                            hebrewDateRequests.getDate(new Date());
                        }).not.toThrow();
                        setTimeout(function () {
                            done();
                        }, 1);
                    });
                });
            });

            describe('logic', function () {
                it('The route is built according to the date received ', function () {
                    hebrewDateRequests.getDate(new Date(2011, 10, 30)); //eslint-disable-line no-magic-numbers
                    expect(services.govServiceListRequest).toHaveBeenCalledWith({ route: 'DateTimeConverter/ConvertDateToComplexDate?dateTimeModel={ "type": 1, "day": 30, "month": 11, "year": 2011 }' });
                });
            });
        });
    });
});