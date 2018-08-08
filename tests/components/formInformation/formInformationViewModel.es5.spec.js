define(['common/components/formInformation/formInformationViewModel', 'common/viewModels/ModularViewModel', 'common/external/q', 'common/core/readyToRequestPromise', 'common/utilities/stringExtension', 'common/infrastructureFacade/tfsMethods', 'common/dataServices/currentTime', 'common/core/mappingManager'], function (formInformationViewModel, ModularViewModel, Q, readyToRequestPromise, stringExtension, tfsMethods, currentTime, mappingManager) {
    //eslint-disable-line max-params
    //todo:   jsdoc

    //todo: ask?? takeout  document.ready??

    describe('formInformationViewModel', function () {

        it('should be defined', function () {
            expect(formInformationViewModel).toBeDefined();
        });

        it('should be innherited from baseViewModel class', function () {
            //todo: change the test to typeOf baseViewModel
            expect(formInformationViewModel).toEqual(jasmine.any(ModularViewModel));
        });
        describe('properties', function () {

            it('shuold be definde', function () {
                expect(formInformationViewModel).toBeDefined();
                expect(formInformationViewModel.referenceNumber).toBeDefined();
                expect(formInformationViewModel.stageStatus).toBeDefined();
                expect(formInformationViewModel.pdfMode()).toEqual(false);
                expect(formInformationViewModel.isFormSent()).toEqual(false);
                expect(formInformationViewModel.printMode()).toEqual(false);
                expect(formInformationViewModel.loadingDate).toBeDefined();
                expect(formInformationViewModel.firstLoadingDate).toBeDefined();
                expect(formInformationViewModel.deviceType).toBeDefined();
                expect(formInformationViewModel.dataModelSaver).toBeDefined();
                expect(formInformationViewModel.feedback).toBeDefined();
            });

            it('isFormSent should be changed according to "sendingForm" event', function () {
                ko.postbox.publish(formInformationViewModel.resources.events.sendingForm, true);
                expect(formInformationViewModel.isFormSent()).toBeTruthy();
            });

            it('stageStatus should not changed to pdf status ', function () {
                formInformationViewModel.stageStatus(formInformationViewModel.resources.events.pdf);
                expect(formInformationViewModel.stageStatus()).not.toEqual(formInformationViewModel.resources.events.pdf);
            });
            describe('isMobile', function () {
                beforeEach(function () {
                    spyOn(tfsMethods, 'isMobile').and.returnValue(true);
                });
                it('should be true when the form opened with mobile', function () {
                    expect(formInformationViewModel.isMobile()).toBeTruthy;
                });
                describe('should not changed after mapping', function () {
                    it('using mappingRules', function () {
                        var saverVal = '{"isMobile":false}';
                        ko.mapping.fromJSON(saverVal, formInformationViewModel.getMappingRules(), formInformationViewModel);
                        expect(formInformationViewModel.isMobile()).not.toEqual(false);
                    });
                    it('using mappingManager', function () {
                        var saverVal = '{"isMobile":false}';
                        ko.mapping.fromJSON(saverVal, mappingManager.get(), formInformationViewModel);
                        expect(formInformationViewModel.isMobile()).not.toEqual(false);
                    });
                });
            });
        });
        describe('functions', function () {

            it('should be defined', function () {
                expect(formInformationViewModel.getModel).toBeDefined();
                expect(formInformationViewModel.setModel).toBeDefined();
                expect(formInformationViewModel.toJSON).toBeDefined();
                expect(formInformationViewModel.isFirstLoad).toBeDefined();
                expect(formInformationViewModel.currentDateRequest).toBeDefined();
                expect(formInformationViewModel.updateToCurrentDate).toBeDefined();
                expect(formInformationViewModel.updateHeaderResources).toBeDefined();
            });

            describe('deviceType ', function () {
                it('Mobile', function () {
                    formInformationViewModel.isMobile(true);
                    expect(formInformationViewModel.deviceType()).toEqual('Mobile');
                });
                it('PC', function () {
                    formInformationViewModel.isMobile(false);
                    expect(formInformationViewModel.deviceType()).toEqual('PC');
                });
            });
            describe('year', function () {
                it('year should return the year from date', function () {
                    var year = 2005;
                    formInformationViewModel.loadingDate('10/10/' + year);
                    expect(formInformationViewModel.year()).toEqual(year);
                });
                it('year should return \'\' when date is empty', function () {
                    formInformationViewModel.loadingDate('');
                    expect(formInformationViewModel.year()).toEqual('');
                });
            });
            describe('isFirstLoad', function () {
                it('should return true dataModelSaver contain wasn\'t changed', function () {
                    //todo:take to functions
                    expect(formInformationViewModel.isFirstLoad()).toBeTruthy();
                });
                it('should return false after save data in dataModelSaver', function () {
                    //todo:take to functions
                    formInformationViewModel.dataModelSaver('{}');
                    expect(formInformationViewModel.isFirstLoad()).toBeFalsy();
                });
            });
            describe('updateToCurrentDate', function () {
                var fakeUnValidResponse = '76767';
                var baseYear = 2015,
                    baseMonth = 9,
                    baseDay = 23;
                var baseTime = new Date(baseYear, baseMonth, baseDay);

                var fakedDateTimeResponse = '11/12/2015'; //todo check change the format of the response

                var fakedDateTimeRequest = function fakedDateTimeRequest() {
                    return Q.fcall(function () {
                        return fakedDateTimeResponse;
                    });
                };

                var fakedErrorRequest = function fakedErrorRequest() {
                    return Q.fcall(function () {
                        throw new Error();
                    });
                };

                var fakeUnValidRequest = function fakeUnValidRequest() {
                    return Q.fcall(function () {
                        return fakeUnValidResponse;
                    });
                };
                afterEach(function () {
                    formInformationViewModel.resources.generalDateFormat = 'dd/MM/yyyy';
                });

                describe('sucsses response from server', function () {

                    beforeEach(function (done) {
                        formInformationViewModel.currentDateRequest = fakedDateTimeRequest();
                        spyOn(currentTime, 'getDateInGeneralFormatPromise').and.callFake(fakedDateTimeRequest);
                        ko.postbox.publish('documentReady');
                        formInformationViewModel.updateToCurrentDate();
                        formInformationViewModel.currentDateRequest.then(function () {
                            done();
                        });
                    });
                    it('should update loadingDate', function (done) {
                        readyToRequestPromise.then().done(function () {
                            formInformationViewModel.currentDateRequest.then(function () {
                                expect(formInformationViewModel.loadingDate()).toEqual(fakedDateTimeResponse);
                                done();
                            });
                        });
                    });
                });

                describe('update according by publishOn isUpdateDate', function () {

                    var isUpdateDate = ko.observable(true).publishOn('isUpdateDate');
                    var fakedDateTime = '01/01/2016';

                    beforeEach(function () {
                        formInformationViewModel.currentDateRequest = fakedDateTimeRequest();

                        spyOn(currentTime, 'getDateInGeneralFormatPromise').and.callFake(fakedDateTimeRequest);
                        formInformationViewModel.loadingDate(fakedDateTime);
                    });

                    describe('should not update loadingDate when publish false', function () {

                        beforeEach(function (done) {
                            isUpdateDate(false);
                            formInformationViewModel.updateToCurrentDate();
                            formInformationViewModel.currentDateRequest.then(function () {
                                done();
                            });
                        });

                        it('should not update loadingDate', function (done) {
                            readyToRequestPromise.then().done(function () {
                                formInformationViewModel.currentDateRequest.then(function () {
                                    expect(formInformationViewModel.loadingDate()).toEqual(fakedDateTime);
                                    done();
                                });
                            });
                        });
                    });

                    describe('should not update loadingDate when publish string', function () {

                        beforeEach(function (done) {
                            isUpdateDate('AAA');
                            formInformationViewModel.updateToCurrentDate();
                            formInformationViewModel.currentDateRequest.then(function () {
                                done();
                            });
                        });

                        it('should not update loadingDate', function (done) {
                            readyToRequestPromise.then().done(function () {
                                formInformationViewModel.currentDateRequest.then(function () {
                                    expect(formInformationViewModel.loadingDate()).toEqual(fakedDateTime);
                                    done();
                                });
                            });
                        });
                    });

                    describe('should update loadingDate when publish true', function () {

                        beforeEach(function (done) {
                            isUpdateDate(true);
                            formInformationViewModel.updateToCurrentDate();
                            formInformationViewModel.currentDateRequest.then(function () {
                                done();
                            });
                        });

                        it('should update loadingDate', function (done) {
                            readyToRequestPromise.then().done(function () {
                                formInformationViewModel.currentDateRequest.then(function () {
                                    expect(formInformationViewModel.loadingDate()).toEqual(fakedDateTimeResponse);
                                    done();
                                });
                            });
                        });
                    });

                    afterEach(function () {
                        isUpdateDate(true);
                    });
                });

                describe('error response from server', function () {

                    beforeEach(function () {
                        ko.postbox.publish('documentReady');

                        spyOn(window, 'Date').and.callFake(function () {
                            return baseTime;
                        });
                        currentTime.request.isSpy = false;
                        spyOn(currentTime, 'getDateInGeneralFormatPromise').and.callFake(fakedErrorRequest);
                        formInformationViewModel.updateToCurrentDate();
                    });

                    it('should update loadingDate with date from client', function (done) {
                        readyToRequestPromise.then().done(function () {
                            currentTime.getDateInGeneralFormatPromise().fail(function () {
                                expect(formInformationViewModel.loadingDate()).toEqual(baseTime.toString(formInformationViewModel.resources.generalDateFormat));
                                done();
                            });
                        });
                    });

                    it('should add error handling to the request', function (done) {
                        readyToRequestPromise.then().done(function () {
                            currentTime.getDateInGeneralFormatPromise().fail(function (response) {
                                expect(response).toEqual(new Error());
                                done();
                            });
                        });
                    });
                });
                describe('when parse error loadingDate', function () {
                    beforeEach(function () {
                        ko.postbox.publish('documentReady');
                        spyOn(window, 'Date').and.callFake(function () {
                            return baseTime;
                        });

                        spyOn(currentTime, 'getDateInGeneralFormatPromise').and.callFake(fakeUnValidRequest);
                        formInformationViewModel.updateToCurrentDate();
                    });
                    it('should update with date from client', function (done) {
                        readyToRequestPromise.then().done(function () {
                            currentTime.getDateInGeneralFormatPromise().then(function () {
                                expect(formInformationViewModel.loadingDate()).toEqual(baseTime.toString(formInformationViewModel.resources.generalDateFormat));
                                done();
                            });
                        });
                    });
                });

                //xit('should sucsses convert the response when the format changed', function (done) {
                //    currentTime.resources.format = 'dd-MM-yyyy';
                //    fakedDateTimeResponse = '12-11-2015';

                //    formInformationViewModel.updateToCurrentDate('production')
                //    .done(function () {
                //        expect(formInformationViewModel.loadingDate()).toEqual(fakeDateResponse);
                //        done();
                //    });
                //});
            });

            describe('updateHeaderResources', function () {
                it('no params send officeName should not be defained', function () {
                    formInformationViewModel.updateHeaderResources();
                    expect(formInformationViewModel.resources.labels().officeName).not.toBeDefined();
                });
                it('send object of resources should extend with formInformation resources', function () {
                    var headerResources = {
                        hebrew: { officeName: 'משרד העליה והקליטה', division: '' },
                        english: { officeName: 'The Ministry of Aliyah and Integration', division: '' }
                    };
                    formInformationViewModel.updateHeaderResources(headerResources);
                    expect(formInformationViewModel.resources.labels().officeName).toBeDefined();
                });
            });

            describe('isMultiLanguage', function () {
                it('should be defined', function () {
                    expect(formInformationViewModel.isMultiLanguage).toBeDefined();
                });
                it('should return true if availableLanguages length is above 1', function () {
                    formInformationViewModel.availableLanguages(['hebrew', 'english']);
                    expect(formInformationViewModel.isMultiLanguage()).toBeTruthy();
                });
                it('should return false if availableLanguages length is not above 1', function () {
                    formInformationViewModel.availableLanguages(['hebrew']);
                    expect(formInformationViewModel.isMultiLanguage()).toBeFalsy();
                    formInformationViewModel.availableLanguages(undefined);
                    expect(formInformationViewModel.isMultiLanguage()).toBeFalsy();
                });
            });
        });
    });
});