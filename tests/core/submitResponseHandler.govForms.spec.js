define(['common/core/submitResponseHandler',
        'common/utilities/successDialog',
        'common/core/biztalkJsonHandler',
        'common/components/dialog/dialog',
        'common/resources/texts/indicators',
        'common/utilities/resourceFetcher',
        'common/viewModels/languageViewModel'
],
function (submitResponseHandler, successDialog, biztalkHandler, dialog, indicators, resourceFetcher, languageViewModel) {//eslint-disable-line max-params 

    describe('submitResponseHandler', function () {

        var defaultError = resourceFetcher.get(indicators.errors).defaultError;
        var title = resourceFetcher.get(indicators.information).sendTheForm;
      
        describe('showMessage', function () {
            
            it('should be defined', function () {
                expect(submitResponseHandler.showMessage).toBeDefined();
            });
            describe('when success submit', function () {
                var submitResponse = { statusCode: 0, response: 'response from biztalk' };

                it('if biztalk return succeeded response should call successDialog.open', function () {
                    spyOn(biztalkHandler, 'getMessageByResponse').and.returnValue('success');
                    spyOn(biztalkHandler, 'isSendingSucceeded').and.returnValue(true);
                    spyOn(successDialog, 'open');

                    submitResponseHandler.showMessage(submitResponse);
                    expect(successDialog.open).toHaveBeenCalledWith('success');
                });

                it('if biztalk return failed response should call dialog.alert', function () {                    
                    spyOn(biztalkHandler, 'getMessageByResponse').and.returnValue('failed');
                    spyOn(biztalkHandler, 'isSendingSucceeded').and.returnValue(false);
                    spyOn(dialog, 'alert');

                    submitResponseHandler.showMessage(submitResponse);
                    expect(dialog.alert).toHaveBeenCalledWith({ message: 'failed', title: title });
                });
                it('if settings.isBiztalk = false should publish successSubmitForm event', function (done) {                    
                    var subscriber = ko.postbox.subscribe('successSubmitForm', function (data) {
                        setTimeout(function () {
                            expect(data.response).toBeDefined();
                            done();
                        }, 500);//eslint-disable-line no-magic-numbers
                    });
                    submitResponseHandler.showMessage(submitResponse, { isBiztalk: false });
                    ko.postbox.unsubscribeFrom('successSubmitForm');
                    subscriber.dispose();
                });
            });

            describe('when error submit', function () {                

                beforeEach(function () {
                    spyOn(dialog, 'alert');
                });

                it('should display default message if response is undefined', function () {
                    var submitResponse;
                    submitResponseHandler.showMessage(submitResponse);
                    expect(dialog.alert).toHaveBeenCalledWith({ message: defaultError, title: title });
                });

                it('should display default message if response is string', function () {
                    var submitResponse = 'error';
                    submitResponseHandler.showMessage(submitResponse);
                    expect(dialog.alert).toHaveBeenCalledWith({ message: defaultError, title: title });
                });

                it('should display custom message if response is undefined and customMessages is sent', function () {
                    var submitResponse;
                    var customMessage = 'Form submit failed';
                    submitResponseHandler.showMessage(submitResponse, { customMessages: { error: customMessage } });
                    expect(dialog.alert).toHaveBeenCalledWith({ message: customMessage, title: title });
                });

                it('should display custom message if sent', function () {
                    var submitResponse = { statusCode: 1, responseMessages: { he: 'aaa', en: 'bbb' } };
                    var customMessage = 'Form submit failed';
                    submitResponseHandler.showMessage(submitResponse, { customMessages: { error: customMessage } });
                    expect(dialog.alert).toHaveBeenCalledWith({ message: customMessage, title: title });
                });
                it('should display default message if custom message is not sent and responseMessages is not correct', function () {
                    var submitResponse = { statusCode: 1, responseMessages: 'some response' };
                    submitResponseHandler.showMessage(submitResponse);
                    expect(dialog.alert).toHaveBeenCalledWith({ message: defaultError, title: title });
                });

                it('should display respone message by current language', function () {
                    languageViewModel.language('hebrew');
                    var submitResponse = { statusCode: 1, responseMessages: { he: 'aaa', en: 'bbb' } };
                    submitResponseHandler.showMessage(submitResponse);
                    expect(dialog.alert).toHaveBeenCalledWith({ message: 'aaa', title: title });
                });

            });
        });
    });

});
define('spec/submitResponseHandler.js', function () { });
