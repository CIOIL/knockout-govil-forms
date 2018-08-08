define(['common/core/biztalkHandler',
        'common/infrastructureFacade/tfsMethods',
        'common/resources/texts/indicators',
        'common/utilities/resourceFetcher',
        'common/utilities/stringExtension'
],
function (biztalkHandler, tfsMethods, indicators, resourceFetcher, stringExtension) {//eslint-disable-line max-params 

    describe('biztalkHandler', function () {
        var formInformation, formErrors, title;

        describe('isSendingSucceeded', function () {
            it('should be defined', function () {
                expect(biztalkHandler.isSendingSucceeded).toBeDefined();
            });

            it('should return true if succeeded', function () {
                expect(biztalkHandler.isSendingSucceeded('res:ok')).toBeTruthy();
            });
            it('should return false if error', function () {
                expect(biztalkHandler.isSendingSucceeded('err:error')).not.toBeTruthy();
            });
            it('should return false if empty', function () {
                expect(biztalkHandler.isSendingSucceeded('')).not.toBeTruthy();
            });
            it('should return false if undefined', function () {
                var x;
                expect(biztalkHandler.isSendingSucceeded(x)).not.toBeTruthy();
            });

        });
        describe('isNotUniqueReference', function () {
            it('should be defined', function () {
                expect(biztalkHandler.isNotUniqueReference).toBeDefined();
            });

            it('should return true if reference exist already', function () {
                var biztalkResponse = 'ERR: מספר סימוכין זה כבר קיים במערכת. (0007)';
                expect(biztalkHandler.isNotUniqueReference(biztalkResponse)).toBeTruthy();
            });
            it('should return false if error', function () {
                expect(biztalkHandler.isNotUniqueReference('err:error')).not.toBeTruthy();
            });
            it('should return false if empty', function () {
                expect(biztalkHandler.isNotUniqueReference('')).not.toBeTruthy();
            });
            it('should return false if undefined', function () {
                var x;
                expect(biztalkHandler.isNotUniqueReference(x)).not.toBeTruthy();
            });

        });

        describe('showMessage', function () {
            beforeAll(function () {
                formInformation = resourceFetcher.get(indicators.information);
                formErrors = resourceFetcher.get(indicators.errors);
                title = formInformation.sendTheForm;
            });


            it('should be defined', function () {
                expect(biztalkHandler.showMessage).toBeDefined();
            });
            describe('when sending success', function () {
                var biztalkResponse = 'res:ok';
                beforeEach(function () {
                    spyOn(tfsMethods.dialog, 'alert');
                });

                it('should throw error if not sent custom message or reference number', function () {
                    expect(function () {
                        biztalkHandler.showMessage(biztalkResponse);
                    }).toThrowError('Invalid settings: Default success message require referenceNumber. You must send settings.referenceNumber or settings.customMessages.success');
                });
                it('should display custom success message if sent', function () {
                    var customMessage = 'Form sent';
                    biztalkHandler.showMessage(biztalkResponse, { customMessages: { success: customMessage } });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(customMessage, title);
                });
                it('should display default success message if custom message is not sent', function () {
                    var refNumber = 'XXX';
                    var message = stringExtension.format(formInformation.SendingSuccsess, refNumber);
                    biztalkHandler.showMessage(biztalkResponse, { referenceNumber: refNumber });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title);
                });

            });
            describe('when sending is not unique', function () {
                var biztalkResponse = 'ERR: מספר סימוכין זה כבר קיים במערכת. (0007)';

                beforeEach(function () {
                    spyOn(tfsMethods.dialog, 'alert');
                });

                it('should display custom message if sent', function () {
                    var customMessage = 'Form not unique';
                    biztalkHandler.showMessage(biztalkResponse, { customMessages: { unique: customMessage } });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(customMessage, title);
                });
                it('should display default message if custom message is not sent', function () {
                    var message = formErrors.uniqSubmitMessage;
                    biztalkHandler.showMessage(biztalkResponse);
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title);
                });


            });
            describe('when sending failed', function () {
                var biztalkResponse = 'ERR: אירעה שגיאה במערכת. אנא פנה לתמיכה. (0001)';

                beforeEach(function () {
                    spyOn(tfsMethods.dialog, 'alert');
                });

                it('should display custom message if sent', function () {
                    var customMessage = 'Form submit failed';
                    biztalkHandler.showMessage(biztalkResponse, { customMessages: { error: customMessage } });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(customMessage, title);
                });
                it('should display default message if custom message is not sent', function () {
                    var message = formErrors.biztalkError;
                    biztalkHandler.showMessage(biztalkResponse);
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title);
                });


            });
        });
    });

});
define('spec/biztalkHandlerSpec.js', function () { });
