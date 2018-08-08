define(['common/dataServices/referenceNumber',
    'common/resources/domains',
    'common/core/generalAttributes',
    'common/core/exceptions',
    'common/networking/ajax',
    'common/external/q'
],
    function (referenceNumber, domains, generalAttributes, exceptions, ajax, Q) {//eslint-disable-line

        describe('referenceNumber', function () {

            it('should be defined', function () {
                expect(referenceNumber).toBeDefined();
            });

            describe('getReferenceNumberRequest', function () {
                let devServerName, formId, fakedReferenceNumber, fakedPromiseResolver;

                beforeAll(function () {
                    devServerName = 'dev';
                    formId = 'Test@test.gov.il';
                    fakedReferenceNumber = '1000';

                    fakedPromiseResolver = function () {
                        const d = Q.defer();
                        d.resolve(fakedReferenceNumber);
                        return d.promise;
                    };
                });


                beforeEach(function () {
                    ko.postbox.publish('documentReady');

                    spyOn(ajax, 'request').and.callFake(fakedPromiseResolver);
                    spyOn(generalAttributes, 'getTargetServerName').and.returnValue(devServerName);
                });

                it('should be defined', function () {
                    expect(referenceNumber.getReferenceNumberRequest).toBeDefined();
                });

                it('should be typeof function', function () {           
                    expect(typeof referenceNumber.getReferenceNumberRequest).toBe('function');
                });

                it('form id parameter is required', function () {
                    expect(function () { referenceNumber.getReferenceNumberRequest().toThrow(); });
                });

                it('the url of the request should be according to the form id param', function (done) {
                    const referenceNumberRequest = referenceNumber.getReferenceNumberRequest(formId);
                    referenceNumberRequest.then(function () {
                        expect(ajax.request.calls.first().args[0].url).toContain(formId);
                        done();
                    });
                });
            

                it('should return instanceof Q.promise', function () {
                    const referenceNumberRequest = referenceNumber.getReferenceNumberRequest(formId);
                    expect(Q.isPromise(referenceNumberRequest)).toBe(true);
                });

                it('should return reference number', function (done) {
                    const referenceNumberRequest = referenceNumber.getReferenceNumberRequest(formId);
                    referenceNumberRequest.then(function (response) {
                        expect(response).toEqual(fakedReferenceNumber);
                        done();
                    });
                });

            });


        });

    });
