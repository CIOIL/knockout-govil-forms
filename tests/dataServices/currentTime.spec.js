define(['common/dataServices/currentTime',
        'common/resources/domains',
        'common/networking/ajax',
        'common/core/generalAttributes',
        'common/external/q',
        'common/core/domReadyPromise',
        'common/external/date'
], function (currentTime, domains, ajax, generalAttributes, Q, domReadyPromise) {//eslint-disable-line


    describe('currentTime', function () {

        it('should be defined', function () {
            expect(currentTime).toBeDefined();
        });

        describe('request', function () {
            var fakedTimeResponse = '\'15/12/2015 10:46:06 PM\'';
            var fakedPromiseResolver = function () {
                var d = Q.defer();
                d.resolve(fakedTimeResponse);
                return d.promise;
            };

            var productionServerName = 'production';
            var testServerName = 'test';
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(fakedPromiseResolver);
                ko.postbox.publish('documentReady');
            });
            it('should be defined', function () {
                expect(currentTime.request).toBeDefined();
                expect(currentTime.request).toEqual(jasmine.any(Function));
            });
            it('should return promise', function (done) {
                var currentTimeRequest = currentTime.request(productionServerName);
                currentTimeRequest.then(function (response) {
                    expect(typeof response).toEqual('string');
                    expect(response).toEqual(fakedTimeResponse);
                    done();
                });
            });
            it('the url of the request shuold be according to the tfssubmitactionparam in generalAttributes', function (done) {//todo: add validate of serverName parameter
                spyOn(generalAttributes, 'getTargetEnvoirment').and.returnValue(productionServerName);
                var currentTimeRequest = currentTime.request('');
                expect(currentTimeRequest).toEqual(jasmine.any(Object));
                currentTimeRequest.then(function () {
                    expect(ajax.request.calls.first().args[0].url).toContain(domains.govServiceListDomains.production);
                    done();
                });
            });

            it('should throw error from generalAttributes manager', function () {
                spyOn(generalAttributes, 'getTargetEnvoirment').and.throwError('error');
                expect(function () { currentTime.request().toThrowError('error'); });
            });

            it('serverName parameter should be exits server name of govServiceList domain', function () {
                expect(function () { currentTime.request('ddd').toThrow(); });
            });

            it('the url of the request shuold be according to the server name param', function (done) {
                spyOn(generalAttributes, 'getTargetEnvoirment').and.returnValue(productionServerName);
                var currentTimeRequest = currentTime.request(testServerName);
                currentTimeRequest.then(function () {
                    expect(ajax.request.calls.first().args[0].url).toContain(domains.govServiceListDomains.test);
                    done();
                });
            });
        });
        describe('request params', function () {
            var productionServerName = 'production';
            beforeEach(function () {
                spyOn($, 'ajax');
            });
            it('serverName is optional', function () {
                //expect(function () { currentTime.request(); }).not.toThrow();
                expect(function () { currentTime.request(productionServerName); }).not.toThrow();
            });

        });
        describe('getDateInGeneralFormatPromise - get date from server and parse it to general format', function () {
            var fakedTimeResponse = "\"03/07/2017 15:13:23 PM\"";//eslint-disable-line

            var fakedPromiseResolver = function () {
                var d = $.Deferred();
                d.resolve(fakedTimeResponse);
                return d.promise();
            };

            describe('success response from server', function () {
                beforeEach(function () {
                    spyOn(ajax, 'request').and.callFake(fakedPromiseResolver);
                });
                it('reponse in generalDate format', function (done) {
                    var promise = currentTime.getDateInGeneralFormatPromise('production');
                    promise.then(function (response) {
                        expect(response).toEqual('07/03/2017');
                        done();
                    });
                });
            });

            describe('error response from server', function () {
                var promise;
                var fakedErrorRequest = function () {
                    return Q.fcall(function () {
                        throw new Error();
                    });
                };
                beforeEach(function (done) {
                    spyOn(ajax, 'request').and.callFake(fakedErrorRequest);
                    promise = currentTime.getDateInGeneralFormatPromise('production');
                    promise.fail(function () {
                        done();
                    });

                });

                it('should add error handling to the request', function (done) {
                    promise.fail(function (response) {
                        expect(response).toEqual(new Error());
                        done();
                    });

                });
            });

            describe('response format can be change by pass theneeded format to getDateInGeneralFormatPromise function', function () {
                beforeEach(function () {
                    spyOn(ajax, 'request').and.callFake(fakedPromiseResolver);
                });

                it('returned data should be in generalDateFormat', function (done) {
                    var promise = currentTime.getDateInGeneralFormatPromise('production', 'dd-MM-yy');
                    promise.then(function (response) {
                        expect(response).toEqual('07-03-17');
                        done();
                    });

                });
            });

        });

    });


}
);
