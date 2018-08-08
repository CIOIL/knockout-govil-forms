define(['common/networking/ajax', 'common/core/formMode'],
function (ajax, formMode) {


    describe('ajax', function () {

        var fakedSuccessResponse = { name: 'Avi' };

        var fakedFailureResponse = { responseText: 'invalid request' };

        var fakedPromiseResolver = function () {
            var d = $.Deferred();
            d.resolve(fakedSuccessResponse);
            return d.promise();
        };

        var fakedPromiseRejector = function () {
            var d = $.Deferred();
            d.reject(fakedFailureResponse);
            return d.promise();
        };


        it('should be defined', function () {
            expect(ajax).toBeDefined();
        });


        describe('request method', function () {

            var result;

            var settings = {};

            beforeEach(function () {
                settings = {
                    url: 'fakedURL',
                    method: 'GET'
                };
                formMode.mode('client');
            });

            it('should be defined', function () {
                expect(ajax.request).toBeDefined();
            });

            describe('params', function () {
                beforeEach(function () {
                    spyOn($, 'ajax').and.callFake(fakedPromiseResolver);
                });

                it('settings object is mandatory ', function () {
                    expect(function () { ajax.request().toThrow(); });
                });

                it('settings must be an object', function () {
                    expect(function () { ajax.request(JSON.stringify(settings)).toThrow(); });
                });

                it('url is mandatory ', function () {
                    expect(function () { ajax.request({ method: settings.method }); }).toThrow();
                });

                it('method is mandatory ', function () {
                    expect(function () { ajax.request({ url: settings.url }); }).toThrow();
                });

                it('method is case sensitive ', function () {
                    expect(function () { ajax.request({ url: settings.url, METHOD: settings.method }); }).toThrow();
                });

                it('url is case sensitive ', function () {
                    expect(function () { ajax.request({ URL: settings.url, method: settings.method }); }).toThrow();
                });

                it('only url and method are mandatory ', function () {
                    expect(function () { ajax.request(settings); }).not.toThrow();
                });

                it('POST method is valid ', function () {
                    expect(function () { ajax.request({ url: settings.url, method: 'POST' }); }).not.toThrow();
                });

                it('DELETE method is invalid ', function () {
                    expect(function () { ajax.request({ url: settings.url, method: 'DELETE' }); }).toThrow();
                });

                it('PUT method is invalid ', function () {
                    expect(function () { ajax.request({ url: settings.url, method: 'PUT' }); }).toThrow();
                });

                it('sync request is denied ', function () {
                    expect(function () { ajax.request({ url: settings.url, method: 'POST', 'async': false }); }).toThrowError('only async requests are supported');
                });

                it('method is copied to type in old jQuery versions ', function () {
                    var originaljQueryVersion = jQuery.fn.jquery;
                    jQuery.fn.jquery = '1.8.2';
                    expect(function () { ajax.request(settings); }).not.toThrow();
                    expect(settings.type).toBeDefined();
                    expect(settings.method).toEqual(settings.type);
                    jQuery.fn.jquery = originaljQueryVersion;
                });


                it('method is not copied to type in new jQuery versions ', function () {
                    var originaljQueryVersion = jQuery.fn.jquery;
                    jQuery.fn.jquery = '1.9.2';
                    expect(function () { ajax.request(settings); }).not.toThrow();
                    expect(settings.type).not.toBeDefined();
                    jQuery.fn.jquery = originaljQueryVersion;
                });

            });

            describe('block callbacks', function () {

                var settings1;

                beforeEach(function () {
                    spyOn($, 'ajax').and.callFake(fakedPromiseResolver);
                    settings1 = Object.create(settings);
                });

                it('no callback no exception ', function () {
                    expect(function () { ajax.request(settings1); }).not.toThrow();
                });

                it('success callback is not allowed ', function () {
                    settings1.success = function () { };
                    expect(function () { ajax.request(settings1); }).toThrow();
                });

                it('error callback is not allowed ', function () {
                    settings1.error = function () { };
                    expect(function () { ajax.request(settings1); }).toThrow();
                });
            });

            describe('block request if in server mode', function () {

                it('ajax request when running on server returns an empty promise', function (done) {
                    spyOn($, 'ajax').and.callFake(fakedPromiseResolver);
                    spyOn(formMode, 'isServer').and.callFake(function () {
                        return true;
                    });
                    //formMode.mode('server');
                    var emptyPromise = ajax.request(settings);
                    expect(emptyPromise.then).toBeDefined();
                    spyOn(emptyPromise, 'then').and.callFake(function () {
                        return true;
                    });
                    expect(emptyPromise.then).not.toHaveBeenCalled();
                    done();
                });

            });

            describe('return a promise', function () {

                it('success handler is called when promise is resolved', function (done) {

                    spyOn($, 'ajax').and.callFake(fakedPromiseResolver);

                    ajax.request(settings)
                        .then(function (response) { result = response; }, function (jqXHR) { result = jqXHR; })
                        .done(function () {
                            expect(typeof result).toEqual('object');
                            expect(result.name).toEqual(fakedSuccessResponse.name);
                            done();
                        });
                });

                it('compose resolved promises', function (done) {

                    spyOn($, 'ajax').and.callFake(fakedPromiseResolver);

                    var moreResults;

                    ajax.request(settings)
                        .then(function (response) { result = response; return ajax.request(settings); }, function (jqXHR) { result = jqXHR; })
                        .then(function (response) { moreResults = response; }, function (jqXHR) { result = jqXHR; })
                        .done(function () {
                            expect(typeof result).toEqual('object');
                            expect(result.name).toEqual(fakedSuccessResponse.name);
                            expect(moreResults.name).toEqual(fakedSuccessResponse.name);
                            done();
                        });
                });

                it('failure handler callback is called when promise is rejected', function (done) {

                    spyOn($, 'ajax').and.callFake(fakedPromiseRejector);

                    ajax.request(settings)
                        .then(function (response) { result = response; }, function (jqXHR) { result = jqXHR; })
                        .done(function () {
                            expect(typeof result).toEqual('object');
                            expect(result.responseText).toEqual(fakedFailureResponse.responseText);
                            done();
                        });
                });

                it('failure handler is called when promise is rejected', function (done) {

                    spyOn($, 'ajax').and.callFake(fakedPromiseRejector);

                    ajax.request(settings)
                        .then(function (response) { result = response; })
                        .fail(function (jqXHR) { result = jqXHR; })
                        .done(function () {
                            expect(typeof result).toEqual('object');
                            expect(result.responseText).toEqual(fakedFailureResponse.responseText);
                            done();
                        });
                });
                it('url and method set on error object when promise is rejected', function (done) {
                    spyOn($, 'ajax').and.callFake(fakedPromiseRejector);
                    ajax.request(settings)
                        .fail(function (jqXHR) {
                            expect(jqXHR.url).toEqual(settings.url);
                            expect(jqXHR.method).toEqual(settings.method);
                            done();
                        });

                });

            });
        });

    });

});
