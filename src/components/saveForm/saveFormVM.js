define(['common/components/saveForm/texts',
    'common/components/inlinePopup/inlinePopup',
    'common/components/dialog/dialog',
    'common/networking/ajax',
    'common/core/generalAttributes',
    'common/events/userEventHandler',
    'common/resources/endpointsUrl',
    'common/external/q',
    'common/components/loader/loader',
    'common/core/exceptions',
    'common/components/formInformation/formInformationViewModel',
    'common/core/MWResponse',
    'common/actions/validate',
    'common/components/fileUpload/filesManager',
    'common/resources/texts/indicators',
    'common/utilities/resourceFetcher',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/validate/extensionRules/phone',
    'common/ko/validate/extensionRules/address',
    'common/ko/bindingHandlers/togglePopupModal'
],
    function (texts, inlinePopup, dialog, ajax, generalAttributes, userEventHandler, endpointsUrl, Q, loader, formExceptions, formInformation, MWResponse, validateAction, filesManager, indicatorsTexts, resourceFetcher) {//eslint-disable-line  max-params
        let saveActionSettings = {};
        const processID = ko.observable(formInformation.formParams.process.processID);
        const currentStep = ko.observable();
        const selectedOption = ko.observable();
        const labels = ko.multiLanguageObservable({ resource: texts });
        const popupSettings = new inlinePopup('save-service-template');
        const { visiblePopup, templateName } = popupSettings;
        const stepsEnums = {
            selectOption: 'selectOption',
            byEmail: 'byEmail',
            bySMS: 'bySMS',
            end: 'end'
        };


        const updateStep = function (stepKey) {
            currentStep(stepsEnums[stepKey]);
        };
        const viewSelectOption = ko.computed(() => {
            return currentStep() === stepsEnums.selectOption;
        });
        const viewEmailDetails = ko.computed(() => {
            return currentStep() === stepsEnums.byEmail;
        });
        const viewCellNumberDetails = ko.computed(() => {
            return currentStep() === stepsEnums.bySMS;
        });
        const processEnd = ko.computed(() => {
            return currentStep() === stepsEnums.end;
        });
        currentStep(stepsEnums.selectOption);

        const cellNumber = ko.observable('').extend({ mobile: true, required: { onlyIf: viewCellNumberDetails } });
        const cellNumberValidation = ko.observable('').extend({ required: { onlyIf: viewCellNumberDetails }, mobile: true, equalIgnoreCase: { params: cellNumber, message: labels().cellNumberIsRequire } });
        const email = ko.observable('').extend({ email: true, required: { onlyIf: viewEmailDetails } });
        const emailValidation = ko.observable('').extend({ required: { onlyIf: viewEmailDetails }, email: true, equalIgnoreCase: { params: email, message: labels().emailValidationMessage } });
        const emptyFields = function () {
            const fields = [email, emailValidation, cellNumber, cellNumberValidation];
            fields.forEach((field) => {
                field('');
                field.isModified(false);
            });
        };

        const pasted = function () {
            dialog.alert({ message: labels().manualTyping });
            return false;
        };

        const toggleSaveModal = function (state) {
            updateStep(stepsEnums.selectOption);
            visiblePopup(state);
        };

        const linkSentCallback = function () {
            updateStep(stepsEnums.end);
            emptyFields();
        };
        const sendSavedFormLink = function (data, endpoint) {
            Object.assign(data, {
                processID: formInformation.formParams.process.processID,
                requestID: formInformation.formParams.process.requestID,
                formUniqueID: formInformation.formParams.process.formUniqueID
            });
            ajax.request({
                url: endpoint,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data, 0)
            }).then(response => {
                loader.close();
                MWResponse.defaultBehavior(response, linkSentCallback);
            }).catch(() => {
                loader.close();
                dialog.alert({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });
            });
        };

        const saveCallback = function (response, sendLinkSettings) {
            formInformation.formParams.process.processID = response.processID;
            processID(response.processID);
            sendSavedFormLink(sendLinkSettings.data, sendLinkSettings.url);
        };

        const saveProcess = function (sendLinkSettings) {
            loader.open(labels().pending);
            const savePromise = ajax.request({
                url: endpointsUrl.saveForm,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    processID: formInformation.formParams.process.processID,
                    requestID: formInformation.formParams.process.requestID,
                    formData: JSON.parse(formInformation.dataModelSaver())
                })
            });
            savePromise.then(response => {
                MWResponse.defaultBehavior(response, saveCallback, undefined, sendLinkSettings);
            })
                .catch(() => {
                    loader.close();
                    dialog.alert({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });
                });
            return savePromise;
        };

        const invokeSaveEvent = function (sendLinkSettings) {
            userEventHandler.invoke({
                event: 'save',
                callback: function () {
                    saveProcess(sendLinkSettings);
                },
                fcallback: saveActionSettings.fcallback,
                afterEvent: true,
                publishedData: saveActionSettings.publishedData || {}
            });
        };

        const validateBeforeSave = function () {
            const validationDefer = Q.defer();
            validateAction.validateForm(validationDefer, { context: 'saveForm', validationExcludeRequire: true });
            return validationDefer;
        };

        const openSaveModal = function (settings = {}) {
            saveActionSettings = settings;
            const validationDeffer = validateBeforeSave();
            validationDeffer.promise.then(function () {
                ko.postbox.publish('validationExcludeRequire', { val: false, updateStateOnly: true });
                toggleSaveModal(true);
            });
        };

        const validateFields = function (fields) {
            const validatedFields = ko.validatedObservable(fields);
            if (validatedFields.errors && validatedFields.errors().length > 0) {
                validatedFields.errors.showAllMessages();
                return false;
            }
            return true;
        };

        const isCellnumberFieldValid = function () {
            return validateFields({ cellNumber, cellNumberValidation });
        };

        const sendSMS = function () {
            if (!isCellnumberFieldValid()) {
                return;
            }
            selectedOption(stepsEnums.bySMS);
            invokeSaveEvent({
                data: { cellNumber: cellNumber() },
                url: endpointsUrl.sendSms
            });
        };

        const isEmailFieldValid = function () {
            return validateFields({ email, emailValidation });
        };

        const sendMail = function () {
            if (!isEmailFieldValid()) {
                return;
            }

            selectedOption(stepsEnums.byEmail);
            invokeSaveEvent({
                data: { email: email() },
                url: endpointsUrl.sendMail
            });
        };

        const resend = function () {
            emptyFields();
            updateStep(selectedOption());
        };

        const cancelSave = function () {
            const confirmPromise = dialog.confirm({ message: labels().cancelMessage });
            confirmPromise.then(() => {
                toggleSaveModal(false);
                emptyFields();
            });
        };

        return {
            updateStep,
            viewSelectOption,
            /** validate the form without check reuire rules. when validation succed open the save modal
            * the function get settings  for the save event that will trigger when user insert fields and confirm.
            * @method <b>openSaveModal</b>
            * @param (object) settings - settings pass to the userBeforeSave subscriber
            **/
            openSaveModal,
            viewEmailDetails,
            viewCellNumberDetails,
            cellNumber,
            labels,
            emailValidation,
            email,
            cellNumberValidation,
            toggleSaveModal,
            visiblePopup,
            templateName,
            /** run saveProcess as callback of  userBeforeSave event(by use userEventHandler.invoke). 
             * call by sendSMS/sendMail methods.           
             * @method <b>invokeSaveEvent</b>
             * @param (object) settings - settigns of sendSMS/sendMail.
             **/
            invokeSaveEvent,
            cancelSave,
            /** call by DOM. run invokeSaveEvent and pass it the mail and endpoint as params. 
            * @method <b>sendMail</b>
            **/
            sendMail,
            /** call MW save action. if the save succeded save the processID and call MW sendSMS/sendMail methods by use MWResponse.defaultBehavior callback param.   
            * @method <b>saveProcess</b>
            * @param (object) settings - use settings that got in openSaveModal function . pass them to  userBeforeSave event in the form as publishedData parameter
            **/
            saveProcess,
            resend,
            /** call by DOM. run invokeSaveEvent and pass it the cellNumber and endpoint as params. 
            * @method <b>sendSMS</b>
            **/
            sendSMS,
            pasted,
            processEnd
        };
    });
