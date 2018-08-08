define(['common/core/generalAttributes'
    , 'common/actions/validate'
    , 'common/utilities/resourceFetcher'
    , 'common/components/loader/loader'
    , 'common/events/userEventHandler'
    , 'common/resources/eventNames'
    , 'common/resources/endpointsUrl'
    , 'common/networking/ajax'
    , 'common/external/q'
    , 'common/components/formInformation/formInformationViewModel'
    , 'common/components/fileUpload/filesManager'],
    function (formConfiguration, validate, resourceFetcher, loader, userEventHandler, eventNames, endpointsUrl, ajax, Q, formInformation, filesManager) { //eslint-disable-line max-params
        const resources = {
            hebrew: {
                validationText: 'בודק תקינות הטופס',
                xmlText: 'קבלת נתונים של הטופס',
                reviewModeText: 'פותח את הטופס בתצוגה רגילה',
                sendingText: 'שולח את הטופס',
                waitFilesUploading: 'השירות ישלח מיד בסיום טעינת הקבצים'
            },
            english: {
                validationText: 'Validating the form...',
                xmlText: 'Getting the form data as xml...',
                reviewModeText: 'Opening the form ...',
                sendingText: 'Sending the form...',
                waitFilesUploading: 'Your application will be sent when the documents have finished uploading.'
            },
            arabic: {
                validationText: 'يفحص صلاحية النموذج',
                xmlText: 'الحصول على بينانت النموذج',
                reviewModeText: 'يفتح النموذج بعرض عادي ',
                sendingText: 'يرسل النموذج',
                waitFilesUploading: 'سيتم إرسال الخدمة مباشرة بعد تحميل الملفات'
            }
        };

        const getSendMessage = () => { //submitsetup: { submitMessage: 'שליחת טופס התחילה' }
            const submitSettings = formConfiguration.get('submitsetup');
            if (submitSettings && submitSettings.get('submitMessage')) {
                return submitSettings.get('submitMessage');
            }
            return resourceFetcher.get(resources).sendingText;
        };

        const submitFormSuccessHandler = function () {

            loader.open(getSendMessage());
            const formParams = formInformation.formParams;
            const formData = JSON.parse(formInformation.dataModelSaver());

            const settings = {
                url: endpointsUrl.submit,
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    requestID: formParams.process.requestID,
                    formData: formData,
                    attachments: filesManager.attachedFilesIds()
                })
                , headers: { 'Content-Type': 'application/json' }

            };

            ajax.request(settings).then(response => {
                loader.close();
                ko.postbox.publish('userAfterSubmitForm', response);
            }).fail(err => {
                loader.close();
                ko.postbox.publish('userAfterSubmitForm', err.responseText);//noagForms:tag as rejection
            });
            return false;
        };

        const submitForm = function () {

            var validationDefer = Q.defer();
            var beforeSubmitDefer = Q.defer();

            validate.validateForm(validationDefer, { context: 'submit' });

            //fire beforeSubmit if validation succeeded
            validationDefer.promise.then(function () {
                userEventHandler.invoke({
                    event: eventNames.submitForm,
                    callback: function (reqponse) {
                        beforeSubmitDefer.resolve(reqponse);
                    }, fcallback: function (err) {
                        beforeSubmitDefer.reject(err);
                    },
                    afterEvent: false,
                    publishedData: {}
                });
            }).catch(function (reason) {
                beforeSubmitDefer.reject(reason);
            });

            beforeSubmitDefer.promise.then(function () {
                loader.open(resources.waitFilesUploading);
                filesManager.allUploadsCompleted().then(function () {
                    loader.close();
                    submitFormSuccessHandler();
                });
            }).fail(function () {
                loader.close();
                return;
            });
        };

        return { submitForm: submitForm };
    });