var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/networking/services'], function (services) {
    var ajax = require('common/networking/ajax');
    var domains = require('common/resources/domains');
    var generalAttributes = require('common/core/generalAttributes');
    var Q = require('common/external/q');
    var domReadyPromise = require('common/core/domReadyPromise');

    describe('services', function () {

        var successResult = 10;
        var fakedPromise = function fakedPromise() {
            return Q.fcall(function () {
                return successResult;
            });
        };

        it('should be defined', function () {
            expect(services).toBeDefined();
        });

        beforeEach(function () {
            spyOn(ajax, 'request').and.callFake(fakedPromise);
            ko.postbox.publish('documentReady');
        });
        describe('govServiceListRequest method', function () {
            var route = 'TSA/GetTime';
            it('should be defined', function () {
                expect(services.govServiceListRequest).toBeDefined();
            });

            describe('parameters', function () {

                it('settings object is mandatory ', function () {
                    expect(function () {
                        services.govServiceListRequest().toThrow();
                    });
                });

                it('settings must be an object', function () {
                    expect(function () {
                        services.govServiceListRequest('aaa').toThrow();
                    });
                });

                it('route is mandatory ', function () {
                    expect(function () {
                        services.webServiceListRequest({ method: 'POST' }).toThrow();
                    });
                });

                it('only route is mandatory ', function (done) {
                    jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                    loadFixtures('services.html');
                    expect(function () {
                        services.govServiceListRequest({ route: route });
                    }).not.toThrow();
                    setTimeout(function () {
                        done();
                    }, 1);
                });
            });
            var settings = {};
            beforeEach(function () {
                settings = {
                    route: route
                };
            });
            describe('logic', function () {

                var productionServerName = 'production';

                it('serverName received', function (done) {
                    jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                    loadFixtures('services.html');
                    settings.serverName = productionServerName;
                    services.govServiceListRequest(settings);
                    spyOn(generalAttributes, 'getTargetServerName').and.callThrough();
                    expect(generalAttributes.getTargetServerName).not.toHaveBeenCalled();
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].url).toContain(domains.govServiceListDomains.production);
                        done();
                    });
                });
                it('serverName wasn"t received - the url of shuold be according to the tfssubmitactionparam in generalAttributes', function (done) {
                    spyOn(generalAttributes, 'getTargetServerName').and.returnValue(productionServerName);
                    services.govServiceListRequest(settings);
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].url).toContain(domains.govServiceListDomains.production);
                        done();
                    });
                });
                it('invalid serverName received throw an error', function () {
                    settings.serverName = 'aaa';
                    expect(function () {
                        services.govServiceListRequest(settings).toThrow();
                    });
                });
                it('use default settings', function (done) {
                    jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                    loadFixtures('services.html');
                    services.govServiceListRequest(settings);
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].method).toEqual('GET');
                        expect(ajax.request.calls.first().args[0].dataType).toEqual('json');
                        expect(ajax.request.calls.first().args[0].cache).toBeTruthy();
                        expect(ajax.request.calls.first().args[0].crossDomain).toBeTruthy();
                        done();
                    });
                });
                it('settings.url concatenates domain + route', function (done) {
                    spyOn(generalAttributes, 'getTargetServerName').and.returnValue(productionServerName);
                    services.govServiceListRequest(settings);
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].url).toEqual(domains.govServiceListDomains.production + settings.route);
                        done();
                    });
                });
            });
            it('returned value is a promise', function (done) {
                jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                loadFixtures('services.html');
                var promise = services.govServiceListRequest(settings);
                setTimeout(function () {
                    expect((typeof promise === 'undefined' ? 'undefined' : _typeof(promise)) === 'object').toBeTruthy();
                    expect(typeof promise.then === 'function').toBeTruthy();
                    done();
                }, 1);
            });
        });
        describe('webServiceListRequest method', function () {
            var route = 'xxx/xxx/xxx.aspx/?ID=1';
            it('should be defined', function () {
                expect(services.webServiceListRequest).toBeDefined();
            });

            describe('parameters', function () {

                it('settings object is mandatory ', function () {
                    expect(function () {
                        services.webServiceListRequest().toThrow();
                    });
                });

                it('settings must be an object', function () {
                    expect(function () {
                        services.webServiceListRequest('aaa').toThrow();
                    });
                });

                it('route is mandatory ', function () {
                    expect(function () {
                        services.webServiceListRequest({ method: 'POST' }).toThrow();
                    });
                });

                it('only route is mandatory ', function (done) {
                    jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                    loadFixtures('services.html');
                    expect(function () {
                        services.webServiceListRequest({ route: route });
                    }).not.toThrow();
                    setTimeout(function () {
                        done();
                    }, 1);
                });
            });
            var settings = {};
            beforeEach(function () {
                settings = {
                    route: route
                };
            });
            describe('logic', function () {

                var productionServerName = 'production';

                it('serverName received', function (done) {
                    jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                    loadFixtures('services.html');
                    settings.serverName = productionServerName;
                    services.webServiceListRequest(settings);
                    spyOn(generalAttributes, 'getTargetServerName').and.callThrough();
                    expect(generalAttributes.getTargetServerName).not.toHaveBeenCalled();
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].url).toContain(domains.listManagerDomains.production);
                        done();
                    });
                });
                it('serverName wasn"t received - the url of shuold be according to the tfssubmitactionparam in generalAttributes', function (done) {
                    spyOn(generalAttributes, 'getTargetServerName').and.returnValue(productionServerName);
                    services.webServiceListRequest(settings);
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].url).toContain(domains.listManagerDomains.production);
                        done();
                    });
                });
                it('invalid serverName received throw an error', function () {
                    settings.serverName = 'aaa';
                    expect(function () {
                        services.govServiceListRequest(settings).toThrow();
                    });
                });
                it('use default settings', function (done) {
                    jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                    loadFixtures('services.html');
                    services.webServiceListRequest(settings);
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].method).toEqual('GET');
                        expect(ajax.request.calls.first().args[0].dataType).toEqual('xml');
                        expect(ajax.request.calls.first().args[0].cache).toBeTruthy();
                        expect(ajax.request.calls.first().args[0].crossDomain).toBeTruthy();
                        done();
                    });
                });
                it('settings.url concatenates domain + route', function (done) {
                    spyOn(generalAttributes, 'getTargetServerName').and.returnValue(productionServerName);
                    services.webServiceListRequest(settings);
                    domReadyPromise.promise.then(function (response) {
                        result = response;
                    }) //eslint-disable-line
                    .done(function () {
                        expect(ajax.request.calls.first().args[0].url).toEqual(domains.listManagerDomains.production + settings.route);
                        done();
                    });
                });
            });
            it('returned value is a promise', function (done) {
                jasmine.getFixtures().fixturesPath = 'base/Tests/networking/templates';
                loadFixtures('services.html');
                var promise = services.webServiceListRequest(settings);
                setTimeout(function () {
                    expect((typeof promise === 'undefined' ? 'undefined' : _typeof(promise)) === 'object').toBeTruthy();
                    expect(typeof promise.then === 'function').toBeTruthy();
                    done();
                }, 1);
            });
        });
    });
});
//define('services.spec.js', function () { });