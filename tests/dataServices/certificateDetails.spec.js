define(['common/dataServices/certificateDetails',
    'common/resources/domains',
    'common/core/generalAttributes',
    'common/core/exceptions',
    'common/networking/ajax',
    'common/external/q',
    'common/networking/services'
],
    function (certificateDetails, domains, generalAttributes, exceptions, ajax, Q, services) {//eslint-disable-line

        describe('certificateDetails', function () {

            it('should be defined', function () {
                expect(certificateDetails).toBeDefined();
            });

            describe('getCertificateDetailsRequest', function () {
                let fakedCertificateDetails, fakedPromiseResolver, keys;

                beforeAll(function () {
                    fakedCertificateDetails = { 'Data': { 'properties': { 'ID': '111111118', 'PrivateCompanyNumber': '', 'LastNameHeb': 'כהן', 'FirstNameHeb': 'אברהם', 'HebrewCompanyName': '' } }, 'ResponseCode': 0, 'ResponseText': 'success' };

                    fakedPromiseResolver = function () {
                        const d = Q.defer();
                        d.resolve(fakedCertificateDetails);
                        return d.promise;
                    };
               
                    keys = ['ID', 'PrivateCompanyNumber', 'LastNameHeb', 'FirstNameHeb', 'HebrewCompanyName'];

                });

                beforeEach(function () {                
                    spyOn(services, 'govServiceListRequest').and.callFake(fakedPromiseResolver);
                });

                it('should be defined', function () {
                    expect(certificateDetails.getCertificateDetailsRequest).toBeDefined();                    
                });

                it('should be typeof function', function () {
                    expect(typeof certificateDetails.getCertificateDetailsRequest).toBe('function');
                });

                it('should return instanceof Q.promise', function () {
                    const certificateDetailsRequest = certificateDetails.getCertificateDetailsRequest(keys);
                    expect(Q.isPromise(certificateDetailsRequest)).toBe(true);
                });

                it('should return the required certificate Details', function (done) {
                    const certificateDetailsRequest = certificateDetails.getCertificateDetailsRequest(keys);
                    certificateDetailsRequest.then(function (response) {                      
                        expect(response).toEqual(fakedCertificateDetails);
                        done();
                    });
                });

                it('keys parameter is not required', function () {
                    expect(function () { certificateDetails.getCertificateDetailsRequest().not.toThrow();});
                   
                });

            });

        });

    });
