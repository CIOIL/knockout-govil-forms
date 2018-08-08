define(['common/components/saveForm/saveFormVM', 'common/components/formInformation/formInformationViewModel', 'common/networking/ajax', 'common/components/dialog/dialog', 'common/external/q', 'common/events/userEventHandler', 'common/core/MWResponse', 'common/actions/validate'], function (saveForm, formInformation, ajax, dialog, Q, userEventHandler, MWResponse, validateAction) {
    //eslint-disable-line  max-params
    var delay = 500;
    var subscriber;
    var saveSuccededFake = function saveSuccededFake() {
        var deferred = Q.defer();
        deferred.resolve({
            statusCode: 0,
            processID: '7f765b0f-d64d-4478-872e-075023d82e08'
        });
        return deferred.promise;
    };
    var saveFailedFake = function saveFailedFake() {
        var deferred = Q.defer();
        deferred.resolve({
            statusCode: 1
        });
        return deferred.promise;
    };
    var validateSucceded = function validateSucceded(deffer) {
        deffer.resolve();
    };
    var validateFailed = function validateFailed(deffer) {
        deffer.reject();
    };

    describe('saveFormVM', function () {
        beforeEach(function () {
            if (subscriber) {
                subscriber.dispose();
            }

            formInformation.dataModelSaver('{}');
        });
        describe('openSaveModal -', function () {
            describe('validate succeded -', function () {
                beforeEach(function () {
                    saveForm.visiblePopup(false);
                    spyOn(validateAction, 'validateForm').and.callFake(validateSucceded);
                });
                it('save modal open', function (done) {
                    setTimeout(function () {
                        expect(ko.unwrap(saveForm.visiblePopup)).toEqual(true);
                        done();
                    }, delay);
                    saveForm.openSaveModal();
                });
            });
            describe('validate failed -', function () {
                beforeEach(function () {
                    saveForm.visiblePopup(false);
                    spyOn(validateAction, 'validateForm').and.callFake(validateFailed);
                });
                it('save modal not open', function (done) {
                    setTimeout(function () {
                        expect(ko.unwrap(saveForm.visiblePopup)).toEqual(false);
                        done();
                    }, delay);
                    saveForm.openSaveModal();
                });
            });
            it('pass settings to the save action - settings identified by invokeSaveEvent action', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeSave', function (data) {
                    expect(data.publishedData).toEqual({ a: 1 });
                    done();
                });
                saveForm.openSaveModal({ publishedData: { a: 1 } });
                saveForm.invokeSaveEvent();
            });
        });
        describe('invokeSaveEvent', function () {
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(saveSuccededFake);
            });
            it('userBeforeSave is trigger', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeSave', function (data) {
                    setTimeout(function () {
                        expect(data.deferred).toBeDefined();
                        done();
                    }, delay);
                });
                saveForm.invokeSaveEvent();
            });
            it('userBeforeSave get settings', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeSave', function (data) {
                    setTimeout(function () {
                        expect(data.publishedData).toEqual({ a: 1 });
                        done();
                    }, delay);
                });
                saveForm.openSaveModal({ publishedData: { a: 1 } });
                saveForm.invokeSaveEvent();
            });
            it('saveProcess is called when userBeforeSave reslove promise', function (done) {
                // spyOn(saveForm, 'saveProcess');
                subscriber = ko.postbox.subscribe('userBeforeSave', function (data) {
                    data.deferred.resolve();
                    setTimeout(function () {
                        expect(ajax.request).toHaveBeenCalled();
                        done();
                    }, delay);
                });
                saveForm.invokeSaveEvent();
            });
            it('saveProcess is not called when userBeforeSave reject promise', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeSave', function (data) {
                    data.deferred.reject();
                    setTimeout(function () {
                        expect(ajax.request).not.toHaveBeenCalled();
                        done();
                    }, delay);
                });
                saveForm.invokeSaveEvent();
            });
            it('settings.fcallback is call when userBeforeSave reject promise', function (done) {
                var fcallback = jasmine.createSpy('sdada');
                subscriber = ko.postbox.subscribe('userBeforeSave', function (data) {
                    data.deferred.reject();
                    setTimeout(function () {
                        expect(fcallback).toHaveBeenCalled();
                        done();
                    }, delay);
                });
                saveForm.openSaveModal({ fcallback: fcallback });
                saveForm.invokeSaveEvent({});
            });
        });
        describe('saveProcess', function () {

            it('promise resolve with statusCode 0', function (done) {
                spyOn(ajax, 'request').and.callFake(saveSuccededFake);
                saveForm.saveProcess();
                setTimeout(function () {
                    expect(formInformation.formParams.process.processID).toEqual('7f765b0f-d64d-4478-872e-075023d82e08');
                    done();
                }, delay);
            });
            it('promise resolve with statusCode deifferent 0 - ', function (done) {
                spyOn(ajax, 'request').and.callFake(saveFailedFake);
                spyOn(MWResponse, 'defaultBehavior');
                saveForm.saveProcess();
                setTimeout(function () {
                    expect(MWResponse.defaultBehavior).toHaveBeenCalled();
                    done();
                }, delay);
            });
        });
        describe('sendMail', function () {
            beforeEach(function () {
                spyOn(saveForm, 'invokeSaveEvent');
            });
            describe('email fields validation', function () {
                it('email field failed', function () {
                    saveForm.email('asfdassd');
                    saveForm.sendMail();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
                it('emailValidation field failed', function () {
                    saveForm.email('asfdassd@fasd.dsa');
                    saveForm.emailValidation('asfdassd');
                    saveForm.sendMail();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
                it('emailValidation field failed', function () {
                    saveForm.email('asfdassd@fasd.dsa');
                    saveForm.emailValidation('asfdassd');
                    saveForm.sendMail();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
                it('email fields is empty', function () {
                    saveForm.sendMail();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
            });
        });
        describe('sendSMS', function () {
            beforeEach(function () {
                spyOn(saveForm, 'invokeSaveEvent');
            });
            describe('cellNumber fields validation', function () {
                it('cellNumber field failed', function () {
                    saveForm.cellNumber('05266');
                    saveForm.sendSMS();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
                it('cellNumberValidation field failed', function () {
                    saveForm.cellNumber('0527662888');
                    saveForm.cellNumberValidation('asfdassd');
                    saveForm.sendSMS();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
                it('cellNumber fields is empty', function () {
                    saveForm.sendSMS();
                    expect(saveForm.invokeSaveEvent).not.toHaveBeenCalled();
                });
            });
        });
    });
});