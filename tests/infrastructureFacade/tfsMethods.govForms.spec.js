/* global spyOn agform2Html jasmine*/

define(['common/infrastructureFacade/tfsMethods',
    'common/infrastructureFacade/govFormMethods',
    'common/resources/infrastructureEnums',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/core/language',
    'common/elements/selectMethods',
    'common/components/dialog/dialog',
    'common/utilities/userBrowser',
    'common/external/q'
],
    function (tfsMethods, govformMethods, infrastructureEnum, formExceptions, exceptionsMessages, language, selectMethods, dialog, userBrowser, Q) {//eslint-disable-line max-params
        var AgatEngine = {};
        describe('Test global methods', function () {
            //const notInitializedException = 'govForm methods is not initialized, function "language.toggleLanguageDiv" is therfore missing'
            describe('"TFS" methods', function () {
                it('tfsMethods returns govformMethods when type is govform', function () {
                    expect(tfsMethods).toBe(govformMethods);
                });


                it('not supported methods should throw', function () {
                    expect(function () { tfsMethods.ajaxRequest(); }).toThrowError();
                    expect(function () { tfsMethods.callServer(); }).toThrowError();
                    expect(function () { tfsMethods.lookup.doBind(); }).toThrowError();
                    expect(function () { tfsMethods.getElementById(); }).toThrowError();
                    expect(function () { tfsMethods.getElementsByName(); }).toThrowError();
                    expect(function () { tfsMethods.getValue(); }).toThrowError();
                    expect(function () { tfsMethods.importData(); }).toThrowError();
                    expect(function () { tfsMethods.lock(); }).toThrowError();
                    expect(function () { tfsMethods.lockForm(); }).toThrowError();
                    expect(function () { tfsMethods.resetForm(); }).toThrowError();
                    expect(function () { tfsMethods.setValue(); }).toThrowError();
                    expect(function () { tfsMethods.submitForm(); }).toThrowError();
                    expect(function () { tfsMethods.AgatToolbar.submitFormSuccessCallbackHandler(); }).toThrowError();
                    expect(function () { tfsMethods.AgatToolbar.saveFormAsPDF(); }).toThrowError();
                    expect(function () { tfsMethods.AgatToolbar.printForm(); }).toThrowError();
                    expect(function () { tfsMethods.AgatXML.getXML(); }).toThrowError();
                    expect(function () { tfsMethods.AgatTables.clearTable(); }).toThrowError();
                    expect(function () { AgatEngine.setFormLanguage.getXML(); }).toThrowError();
                    expect(function () { tfsMethods.attributes.getElementAction(); }).toThrowError();
                    expect(function () { tfsMethods.attributes.setElementAction(); }).toThrowError();
                    expect(function () { tfsMethods.attributes.getElementType(); }).toThrowError();
                    expect(function () { tfsMethods.attributes.getName(); }).toThrowError();
                    expect(function () { tfsMethods.attributes.setElementUploaded(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.getTotalAttachmentsSize(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.formAllAttachmentsTotalSize(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.clearAttachment(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.viewAttachment(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.getAttachmentInfo(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.getAttachmentsUniqueNames(); }).toThrowError();
                    expect(function () { tfsMethods.attachment.isAttachmentInput(); }).toThrowError();
                    expect(function () { tfsMethods.dialog.openDialog(); }).toThrowError();
                    expect(function () { tfsMethods.dialog.openSubmitPopup(); }).toThrowError();
                    expect(function () { tfsMethods.dialog.closeSubmitPopup(); }).toThrowError();
                    expect(function () { tfsMethods.toolbar.hideToolbar(); }).toThrowError();
                    expect(function () { tfsMethods.browser.getName(); }).toThrowError();
                    expect(function () { tfsMethods.browser.getBrowserVersion(); }).toThrowError();
                    expect(function () { tfsMethods.browser.getDocumentMode(); }).toThrowError();
                });

                describe('supported methods', function () {
                   

                    it('tfsMethods.toggleLanguageDiv should call language.toggleLanguageDiv', function () {
                        spyOn(language, 'toggleLanguageDiv');
                        tfsMethods.toggleLanguageDiv();
                        expect(language.toggleLanguageDiv).toHaveBeenCalled();
                    });
                    it('tfsMethods.setFormLanguage should call language.setFormLanguage', function () {
                        spyOn(language, 'setFormLanguage');
                        tfsMethods.setFormLanguage();
                        expect(language.setFormLanguage).toHaveBeenCalled();
                    });
                    it('tfsMethods.fixElements should call selectMethods.replaceSelectsWithInputs', function () {
                        spyOn(selectMethods, 'replaceSelectsWithInputs');
                        tfsMethods.fixElements();
                        expect(selectMethods.replaceSelectsWithInputs).toHaveBeenCalled();
                    });
                    it('tfsMethods.rollBackChanges should call selectMethods.rollbackSelect', function () {
                        spyOn(selectMethods, 'rollbackSelect');
                        tfsMethods.rollBackChanges();
                        expect(selectMethods.rollbackSelect).toHaveBeenCalled();
                    });
                    it('tfsMethods.dialog.alert should call dialog.alert', function () {
                        spyOn(dialog, 'alert');
                        tfsMethods.dialog.alert();
                        expect(dialog.alert).toHaveBeenCalled();
                    });
                    it('tfsMethods.isMobile should call userBrowser.isMobile', function () {
                        spyOn(userBrowser, 'isMobile');
                        tfsMethods.isMobile();
                        expect(userBrowser.isMobile).toHaveBeenCalled();
                    });
                    describe('tfsMethods.alert', function () {
                        var fakeCallback, getResolveDialogPromise, delay;
                        beforeAll(function () {
                            fakeCallback = jasmine.createSpy();
                            getResolveDialogPromise = function () {
                                const defer = Q.defer();
                                defer.resolve();
                                return defer.promise;
                            };
                            delay = 500;
                        });
                        
                        it('should call with correct parmas object', function () {
                            spyOn(dialog, 'alert');
                            tfsMethods.dialog.alert('bla', 'bla');
                            expect(dialog.alert.calls.mostRecent().args[0]).toEqual({message: 'bla', title: 'bla'});
                        });
                        it('pass only message - ', function () {
                            spyOn(dialog, 'alert');
                            tfsMethods.dialog.alert('bla');
                            expect(dialog.alert.calls.mostRecent().args[0]).toEqual({ message: 'bla', title: undefined });
                        });
                        it('not pass any parameter ', function () {
                            spyOn(dialog, 'alert');
                            tfsMethods.dialog.alert();
                            expect(dialog.alert).toHaveBeenCalled();
                        });
                        it('pass callback -  callback is call when dialog resolve', function (done) {
                            spyOn(dialog, 'alert').and.callFake(getResolveDialogPromise);
                            tfsMethods.dialog.alert('bla', 'bla', fakeCallback);
                            setTimeout(function () {
                                expect(fakeCallback).toHaveBeenCalled();
                                done();
                            }, delay);
                        });
                    });
                    describe('tfsMethods.confirm', function () {
                        var fakeCallback, getResolveDialogPromise, delay;
                        beforeAll(function () {
                            fakeCallback = jasmine.createSpy();
                            getResolveDialogPromise = function () {
                                const defer = Q.defer();
                                defer.resolve();
                                return defer.promise;
                            };
                            delay = 500;
                        });

                        it('should call with correct parmas object', function () {
                            spyOn(dialog, 'confirm');
                            tfsMethods.dialog.confirm('bla', 'bla');
                            expect(dialog.confirm.calls.mostRecent().args[0]).toEqual({ message: 'bla', title: 'bla' });
                        });
                        it('pass only message - ', function () {
                            spyOn(dialog, 'confirm');
                            tfsMethods.dialog.confirm('bla');
                            expect(dialog.confirm.calls.mostRecent().args[0]).toEqual({ message: 'bla', title: undefined });
                        });
                        it('not pass any parameter ', function () {
                            spyOn(dialog, 'confirm');
                            tfsMethods.dialog.confirm();
                            expect(dialog.confirm).toHaveBeenCalled();
                        });
                        it('pass callback -  callback is call when dialog resolve', function (done) {
                            spyOn(dialog, 'confirm').and.callFake(getResolveDialogPromise);
                            tfsMethods.dialog.confirm('bla', 'bla', fakeCallback);
                            setTimeout(function () {
                                expect(fakeCallback).toHaveBeenCalled();
                                done();
                            }, delay);
                        });
                    });
                });
              
            });
        });
    });
