define(['common/components/restoreForm/texts',
        'common/networking/ajax',
        'common/components/formInformation/formInformationViewModel',
        'common/core/generalAttributes',
        'common/resources/govFormsPages',
        'common/resources/regularExpressions',
        'common/external/q',
        'common/viewModels/languageViewModel',
        'common/resources/endpointsUrl',
        'common/core/MWResponse',
        'common/core/exceptions',
        'common/utilities/stringExtension',
        'common/resources/exeptionMessages',
        'common/components/dialog/dialog',
        'common/components/support/supportViewModel',
        'common/ko/globals/multiLanguageObservable'
],
    function (texts, ajax, formInformation, generalAttributes, govFormsPagesEnum, regularExpressions, Q, languageViewModel, endpointsUrl, MWResponse, formExceptions, stringExtension, exceptionsMessages, dialog, supportViewModel) {//eslint-disable-line  max-params

        const initRestoreFormVM = function (loadViewModel) {
            if (!loadViewModel) {
                formExceptions.throwFormError(stringExtension.format(exceptionsMessages.undefinedParam, 'loadViewModel'));
            }
            const labels = ko.multiLanguageObservable({ resource: texts });
            const formName = generalAttributes.get('formname');
            const referenceNumber = formInformation.referenceNumber();
            const supportPhone = ko.computed(() => {
                return ko.unwrap(supportViewModel.phone());
            });
            const code = ko.observable('');
            const isCodeInserted = ko.computed(() => {
                return !!code();
            });
            const urlParts = window.location.href.split('/');
            const lastParameter = urlParts[urlParts.length - 1];
            if (regularExpressions.guid.test(lastParameter)) {
                formInformation.currentVisiblePage(govFormsPagesEnum.restoreForm);
            }

            const visibleRestoreFormContainer = ko.computed(() => {
                return formInformation.currentVisiblePage() === govFormsPagesEnum.restoreForm;
            });

            const setDataCallback = function (response) {
                loadViewModel(response.formData);
                formInformation.formUniqueID(ko.unwrap(code));
                formInformation.govFormsInfo.formUniqueID = ko.unwrap(code);
                formInformation.currentVisiblePage(govFormsPagesEnum.tabs);
            };
            const restoreFormProcess = function () {
                if (!ko.unwrap(code)) {
                    dialog.alert({
                        message: 'נא להזין קוד'
                    });
                    return;
                    //TODO replace with labels
                }
                const restoreProcessSettings = {
                    url: endpointsUrl.restoreForm,
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        processID: formInformation.govFormsInfo.processID,
                        formUniqueID: code()
                    })
                };
                ajax.request(restoreProcessSettings).then(response => {
                    MWResponse.defaultBehavior(response, setDataCallback);
                });
                //    .catch(ex=> {
                //    console.log(ex);
                //});
            };
            return {
                formName,
                referenceNumber,
                labels,
                supportPhone,
                visibleRestoreFormContainer,
                code,
                restoreFormProcess,
                isCodeInserted
            };
        };
        return {
            initRestoreFormVM
        };
    });