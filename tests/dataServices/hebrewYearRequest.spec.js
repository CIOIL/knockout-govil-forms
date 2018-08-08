define(['common/dataServices/hebrewYearRequest'],
function (hebrewYearRequest) {
    var Q = require('common/external/q');
    var hebrewDateRequests = require('common/dataServices/hebrewDateRequests');

    describe('hebrewYearRequest', function () {

        it('should be defined', function () {
            expect(hebrewYearRequest).toBeDefined();
        });
        var settings = {
            baseYear: 1091,
            numberOfYears: 3
        };
        var fakeListFromServer = [{ 'dataCode': 5776, 'dataText': 'תשע"ו' }, { 'dataCode': 5777, 'dataText': 'תשע"ז' }, { 'dataCode': 5778, 'dataText': 'תשע"ח' }];
        var fakedPromise = function () {
            return Q.fcall(function () {
                return fakeListFromServer;
            });
        };
        beforeEach(function () {
            spyOn(hebrewDateRequests, 'getYears').and.callFake(fakedPromise);
            // hebrewYearRequest.allYearsRequest = undefined;
        });
        describe('getListRequest', function () {

            it('should be defined', function () {
                expect(hebrewYearRequest.getListRequest).toBeDefined();
            });

            describe('parameter setting', function () {
                it('is optional', function () {
                    expect(function () { hebrewYearRequest.getListRequest(); }).not.toThrow();
                });

            });
            describe('logic', function () {
                //todo: how to reset allYearsRequest?
                //xit('allYearsRequest is undefined - create a new request', function (done) {
                //    var hebrewYearRequest1 = require('common/dataServices/hebrewYearRequest');
                //    var result = hebrewYearRequest1.getListRequest();
                //    result.then(function () {
                //        expect(hebrewYearRequest1.allYearsRequest).toBeDefined();
                //        done();
                //    });
                //});
                it('allYearsRequest isn\'t contains desired years - create new request', function () {
                    hebrewYearRequest.getListRequest(settings);
                    expect(hebrewDateRequests.getYears).toHaveBeenCalled();
                });
                it('returned value is a promise', function () {
                    var result = hebrewYearRequest.getListRequest();
                    expect(typeof result === 'object').toBeTruthy();
                    expect(typeof result.then === 'function').toBeTruthy();
                });

                it('returned promise contains desired years', function (done) {
                    var request = hebrewYearRequest.getListRequest({ baseYear: 2016, numberOfYears: 2 });
                    request.then(function (result) {
                        expect(result.length).toEqual(2);
                        expect(result[0].dataText).toEqual('תשע"ו');
                        expect(result[1].dataText).toEqual('תשע"ז');

                        done();
                    });
                });
            });

        });

    });
});
