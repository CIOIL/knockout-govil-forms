define(['common/core/biztalkJsonHandler', 'common/infrastructureFacade/tfsMethods', 'common/resources/texts/indicators', 'common/utilities/resourceFetcher', 'common/utilities/stringExtension'], function (biztalkJsonHandler, tfsMethods, indicators, resourceFetcher, stringExtension) {
    //eslint-disable-line max-params 

    describe('biztalkJsonHandler', function () {
        var formInformation, formErrors, title;
        var successResponse = '{"ResponseCode": 0}',
            syncResponse = '{"ResponseCode": -1}',
            applicativeError = '{"ResponseCode": -700}',
            failureResponse = '{"ResponseCode": 1}',
            jsonSuccessResponse = { 'ResponseCode': 0 },
            jsonErrorResponse = { 'ResponseCode': 1 },
            duplicateResponse = '{"ResponseCode": 7}',
            jsonDuplicateResponse = { 'ResponseCode': 7 };

        describe('isSendingSucceeded', function () {
            it('should be defined', function () {
                expect(biztalkJsonHandler.isSendingSucceeded).toBeDefined();
            });

            describe('should return true', function () {
                it('async submit, ResponseCode is -1', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded(syncResponse)).toBeTruthy();
                });
                it('success response ResponseCode is 0', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded(successResponse)).toBeTruthy();
                });
                it('applicativeError ResponseCode is -700', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded(applicativeError)).toBeTruthy();
                });
                it('response success in json format', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded(jsonSuccessResponse)).toBeTruthy();
                });
            });
            describe('should return false', function () {
                it('failure response ResponseCode is 1', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded(failureResponse)).not.toBeTruthy();
                });
                it('failure response in json format', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded(jsonErrorResponse)).not.toBeTruthy();
                });
                it('response is empty', function () {
                    expect(biztalkJsonHandler.isSendingSucceeded('')).not.toBeTruthy();
                });
                it('response is undefined', function () {
                    var x;
                    expect(biztalkJsonHandler.isSendingSucceeded(x)).not.toBeTruthy();
                });
            });
        });

        describe('isNotUniqueReference', function () {
            it('should be defined', function () {
                expect(biztalkJsonHandler.isNotUniqueReference).toBeDefined();
            });

            it('should return true if reference already exist', function () {
                expect(biztalkJsonHandler.isNotUniqueReference(duplicateResponse)).toBeTruthy();
                expect(biztalkJsonHandler.isNotUniqueReference(jsonDuplicateResponse)).toBeTruthy();
            });
            it('should return false if error', function () {
                expect(biztalkJsonHandler.isNotUniqueReference(failureResponse)).not.toBeTruthy();
            });
            it('should return false if success', function () {
                expect(biztalkJsonHandler.isNotUniqueReference(jsonSuccessResponse)).not.toBeTruthy();
            });
            it('should return false if empty', function () {
                expect(biztalkJsonHandler.isNotUniqueReference('')).not.toBeTruthy();
            });
            it('should return false if undefined', function () {
                var x;
                expect(biztalkJsonHandler.isNotUniqueReference(x)).not.toBeTruthy();
            });
        });

        describe('showMessage', function () {
            beforeAll(function () {
                formInformation = resourceFetcher.get(indicators.information);
                formErrors = resourceFetcher.get(indicators.errors);
                title = formInformation.sendTheForm;
            });

            it('should be defined', function () {
                expect(biztalkJsonHandler.showMessage).toBeDefined();
            });
            describe('when sending success', function () {

                beforeEach(function () {
                    spyOn(tfsMethods.dialog, 'alert');
                });

                it('should throw error if not sent custom message or reference number', function () {
                    expect(function () {
                        biztalkJsonHandler.showMessage(successResponse);
                    }).toThrowError('Invalid settings: Default success message require referenceNumber. You must send settings.referenceNumber or settings.customMessages.success');
                });
                it('should display custom success message if sent', function () {
                    var customMessage = 'Form sent';

                    biztalkJsonHandler.showMessage(successResponse, { customMessages: { success: customMessage } });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(customMessage, title);
                });
                it('should display default success message if custom message is not sent', function () {
                    var refNumber = 'XXX';
                    var message = stringExtension.format(formInformation.SendingSuccsess, refNumber);

                    biztalkJsonHandler.showMessage(successResponse, { referenceNumber: refNumber });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title);
                });
            });
            describe('when sending is not unique', function () {

                beforeEach(function () {
                    spyOn(tfsMethods.dialog, 'alert');
                });

                it('should display custom message if sent', function () {
                    var customMessage = 'Form not unique';

                    biztalkJsonHandler.showMessage(duplicateResponse, { customMessages: { unique: customMessage } });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(customMessage, title);
                });
                it('should display default message if custom message is not sent', function () {
                    var message = formErrors.uniqSubmitMessage;

                    biztalkJsonHandler.showMessage(duplicateResponse);
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title);
                });
            });
            describe('when sending failed', function () {

                beforeEach(function () {
                    spyOn(tfsMethods.dialog, 'alert');
                });

                it('should display custom message if sent', function () {
                    var customMessage = 'Form submit failed';
                    biztalkJsonHandler.showMessage(failureResponse, { customMessages: { error: customMessage } });
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(customMessage, title);
                });
                it('should display default message if custom message is not sent', function () {
                    var message = formErrors.biztalkError;
                    biztalkJsonHandler.showMessage(failureResponse);
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title);
                });
            });
        });

        describe('getMessageByResponse', function () {
            it('should be defined', function () {
                expect(biztalkJsonHandler.getMessageByResponse).toBeDefined();
            });
            describe('when async sending success', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 1},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';

                it('should throw error if not sent custom message or reference number', function () {
                    expect(function () {
                        biztalkJsonHandler.getMessageByResponse(biztalkResponse);
                    }).toThrowError('Invalid settings: Default success message require referenceNumber. You must send settings.referenceNumber or settings.customMessages.success');
                });
                it('should return custom success message if sent', function () {
                    var customMessage = 'Form sent';
                    expect(biztalkJsonHandler.getMessageByResponse(biztalkResponse, { customMessages: { success: customMessage } })).toEqual(customMessage);
                });
                it('should return default success message if custom message is not sent', function () {
                    var refNumber = 'XXX';
                    var message = stringExtension.format(formInformation.SendingSuccsess, refNumber);
                    expect(biztalkJsonHandler.getMessageByResponse(biztalkResponse, { referenceNumber: refNumber })).toEqual(message);
                });
            });
            describe('when sync sending success', function () {

                it('should throw error if not sent custom message or reference number', function () {
                    expect(function () {
                        biztalkJsonHandler.getMessageByResponse(syncResponse);
                    }).toThrowError('Invalid settings: Default success message require referenceNumber. You must send settings.referenceNumber or settings.customMessages.success');
                });
                it('should return custom success message if sent', function () {
                    var customMessage = 'Form sent';
                    expect(biztalkJsonHandler.getMessageByResponse(syncResponse, { customMessages: { success: customMessage } })).toEqual(customMessage);
                });
                it('should return default success message if custom message is not sent', function () {
                    var refNumber = 'XXX';
                    var message = stringExtension.format(formInformation.SendingSuccsess, refNumber);
                    expect(biztalkJsonHandler.getMessageByResponse(syncResponse, { referenceNumber: refNumber })).toEqual(message);
                });
            });
            describe('when sending is not unique', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 7 }';

                it('should return custom message if sent', function () {
                    var customMessage = 'Form not unique';
                    var message = biztalkJsonHandler.getMessageByResponse(biztalkResponse, { customMessages: { unique: customMessage } });
                    expect(message).toEqual(customMessage);
                });
                it('should return default message if custom message is not sent', function () {
                    var defaultError = formErrors.uniqSubmitMessage;
                    expect(biztalkJsonHandler.getMessageByResponse(biztalkResponse)).toEqual(defaultError);
                });
            });
            describe('when sending failed', function () {

                it('should return custom message if sent', function () {
                    var customMessage = 'Form submit failed';
                    expect(biztalkJsonHandler.getMessageByResponse(failureResponse, { customMessages: { error: customMessage } })).toEqual(customMessage);
                });
                it('should return default message if custom message is not sent', function () {
                    var message = formErrors.biztalkError;
                    expect(biztalkJsonHandler.getMessageByResponse(failureResponse)).toEqual(message);
                });
            });
        });

        describe('isSuccessTask', function () {
            it('should be defined', function () {
                expect(biztalkJsonHandler.isSuccessTask).toBeDefined();
            });

            it('should return true when task success', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 1},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isSuccessTask('MailToUser', biztalkResponse)).toBeTruthy();

                var biztalkJsonResponse = { 'ProjectNickName': 'ModularTemplate@test.gov.il', 'StageStatus': 'UserToOffice', 'ResponseCode': 0, 'MailToUser': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 1 }, 'updateStageStatus': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 1 } };
                expect(biztalkJsonHandler.isSuccessTask('MailToUser', biztalkJsonResponse)).toBeTruthy();
            });
            it('should return false when task failed', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 0},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isSuccessTask('MailToUser', biztalkResponse)).not.toBeTruthy();

                var biztalkJsonResponse = { 'ProjectNickName': 'ModularTemplate@test.gov.il', 'StageStatus': 'UserToOffice', 'ResponseCode': 0, 'MailToUser': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 0 }, 'updateStageStatus': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 1 } };
                expect(biztalkJsonHandler.isSuccessTask('MailToUser', biztalkJsonResponse)).not.toBeTruthy();
            });
            it('should return false if empty', function () {
                expect(biztalkJsonHandler.isSuccessTask('')).not.toBeTruthy();
            });
            it('should return false if undefined', function () {
                var x;
                expect(biztalkJsonHandler.isSuccessTask(x)).not.toBeTruthy();
            });
        });

        describe('isFailedTask', function () {
            it('should be defined', function () {
                expect(biztalkJsonHandler.isFailedTask).toBeDefined();
            });

            it('should return true when task failed', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 0},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isFailedTask('MailToUser', biztalkResponse)).toBeTruthy();

                var biztalkJsonResponse = { 'ProjectNickName': 'ModularTemplate@test.gov.il', 'StageStatus': 'UserToOffice', 'ResponseCode': 0, 'MailToUser': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 0 }, 'updateStageStatus': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 1 } };
                expect(biztalkJsonHandler.isFailedTask('MailToUser', biztalkJsonResponse)).toBeTruthy();
            });
            it('should return false when task success or aplicative error', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 1},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isFailedTask('MailToUser', biztalkResponse)).not.toBeTruthy();

                var biztalkResponse2 = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 6},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isFailedTask('MailToUser', biztalkResponse2)).not.toBeTruthy();

                var biztalkJsonResponse = { 'ProjectNickName': 'ModularTemplate@test.gov.il', 'StageStatus': 'UserToOffice', 'ResponseCode': 0, 'MailToUser': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 6 }, 'updateStageStatus': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 1 } };
                expect(biztalkJsonHandler.isFailedTask('MailToUser', biztalkJsonResponse)).not.toBeTruthy();
            });
            it('should return true if empty', function () {
                expect(biztalkJsonHandler.isFailedTask('')).toBeTruthy();
            });
            it('should return true if undefined', function () {
                var x;
                expect(biztalkJsonHandler.isFailedTask(x)).toBeTruthy();
            });
        });

        describe('isApplicativeErrorTask', function () {
            it('should be defined', function () {
                expect(biztalkJsonHandler.isApplicativeErrorTask).toBeDefined();
            });

            it('should return true when task failed with applicative error', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 6},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isApplicativeErrorTask('MailToUser', biztalkResponse)).toBeTruthy();

                var biztalkJsonResponse = { 'ProjectNickName': 'ModularTemplate@test.gov.il', 'StageStatus': 'UserToOffice', 'ResponseCode': 0, 'MailToUser': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 6 }, 'updateStageStatus': { 'ReasonCode': 0, 'ReasonText': '', 'TaskStatus': 1 } };
                expect(biztalkJsonHandler.isApplicativeErrorTask('MailToUser', biztalkJsonResponse)).toBeTruthy();
            });
            it('should return false when task failed or success', function () {
                var biztalkResponse = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 1},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isApplicativeErrorTask('MailToUser', biztalkResponse)).not.toBeTruthy();

                var biztalkResponse2 = '{"ProjectNickName": "ModularTemplate@test.gov.il","StageStatus": "UserToOffice","ResponseCode": 0,"MailToUser": {"ReasonCode": 0,"ReasonText": "", "TaskStatus": 0},"updateStageStatus": { "ReasonCode": 0, "ReasonText": "","TaskStatus": 1}}';
                expect(biztalkJsonHandler.isApplicativeErrorTask('MailToUser', biztalkResponse2)).not.toBeTruthy();
            });
            it('should return false if empty', function () {
                expect(biztalkJsonHandler.isApplicativeErrorTask('')).not.toBeTruthy();
            });
            it('should return false if undefined', function () {
                var x;
                expect(biztalkJsonHandler.isApplicativeErrorTask(x)).not.toBeTruthy();
            });
        });
    });
});
define('spec/biztalkJsonHandlerSpec.js', function () {});