
define(['common/components/toolbar/texts',
        'common/infrastructureFacade/tfsMethods',
        'common/utilities/userBrowser',
        'common/components/navigation/containersViewModel',
        'common/actions/validate',
        'common/actions/submit',
        'common/actions/print',
        'common/actions/saveAsPdf',
        'common/events/userEventHandler',
        'common/external/q',
        'common/core/exceptions',
        'common/components/toolbar/toolbarButtons',
        'common/components/formInformation/formInformationViewModel',
        'common/components/saveForm/saveFormVM',
        'common/components/fileUpload/filesManager',
        'common/utilities/arrayExtensions',
        'common/ko/globals/multiLanguageObservable'],
    function (texts, tfsMethods, userBrowser, containersViewModel, validateAction, submitAction, printAction,pdfAction, userEventHandler, Q, formExceptions, defaultToolbarButtons, formInformation, saveFormVM,filesManager) {//eslint-disable-line  max-params
        /**
        * @class initToolbarVM
        * @classdesc return viewModel of toolbar manager
        * @param {function} toggleInformationMenue - function to toggole help and information menue
        * @param {object} toolbarButtons - object of toolbar buttons visibility
        * @param {object } actionsSettings - object that include the settings for invoke actions
        * const toolbarButtons = {
        *     submit: submit: ko.computed(function () { return submitEnable(); }),
        *    print: false
        *};
          @returns {object} object that contains: 
            computeds of buttons visibility, 
            functions that trigger the actions
        **/
    
        const initToolbarVM = function ({toggleInformationMenue, toolbarButtons, actionsSettings = {}}) {
            
            if(!toggleInformationMenue) {
                formExceptions.throwFormError('initToolbarVM missing required parameter');
            }
            const labels = ko.multiLanguageObservable({ resource: texts });
            const toolbarSelector = '#header .toolbar';
            const isActionsMenueOpen = ko.observable(false);
            const isActionsPartOpen = ko.observable(true);
            const isViewActionsPartOpen = ko.observable(true);
            const isInformationPartOpen = ko.observable(true);
            const actionsMenueWidth = ko.observable(0);
            const actionsMenueHeight = ko.observable(0);
           
            toolbarButtons = Object.assign({},defaultToolbarButtons,toolbarButtons); 
            const isSubmitEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.submit);
            });

            const toggleViewActionsPart = function () {
                const currentVal = ko.unwrap(isViewActionsPartOpen);
                isViewActionsPartOpen(!currentVal);            
            };

            const toggleInformationPart = function () {
                const currentVal = ko.unwrap(isInformationPartOpen);
                isInformationPartOpen(!currentVal);            
            };
            const toggleActionsPart = function () {
                const currentVal = ko.unwrap(isActionsPartOpen);
                isActionsPartOpen(!currentVal);            
            };
            const isDrawersEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.changeView)&& containersViewModel.isTabsMode();
            });

            const isTabsEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.changeView) && !containersViewModel.isTabsMode();
            });

            const isPrintEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.print);
            });
            const isSaveAsPdfEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.saveAsPdf) && !userBrowser.isMobile();
            });
            const isValidateEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.validate);
            });

            const isSaveEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.save);
            });
            const isAttachmentEnable = ko.computed(() => {
                return ko.unwrap(toolbarButtons.fileAttachment);
            });
           
            const toggleMobileActionsMenue = function () {
                toggleInformationMenue(false);
                const currentVal = isActionsMenueOpen();
                isActionsMenueOpen(!currentVal);
                actionsMenueWidth(`${$(window).width()}px`);
                actionsMenueHeight(`${$(window).height() - $(toolbarSelector).height()}px`);
            };

            const submitForm = function () {
                submitAction.submitForm();
            };
            const fileAttachment = function () {
                filesManager.viewAttachment();
            };

            const saveAsPdf = function () {

                //if (userBrowser.isIOS())
                //    sendPdfToUserEmail();
                //else {
                pdfAction.saveAsPdf(actionsSettings.pdf);
                //}
            };

            const printForm = function () {
                printAction.printForm(actionsSettings.print);
            };

            const validateForm = function () {
                validateAction.validateForm(actionsSettings.validate);
            };

            const openFullView = function () {
                containersViewModel.isTabsMode(false);
            };

            const openTabsView = function () {
                containersViewModel.isTabsMode(true);
            };

            const startSaveProcess = function(){
                saveFormVM.openSaveModal(actionsSettings.save);
            };
            return {
                labels,
                submitForm,
                printForm,
                saveAsPdf,
                validateForm,
                fileAttachment,
                openFullView,
                openTabsView,
                isSubmitEnable,
                isDrawersEnable,
                isTabsEnable,
                isPrintEnable,
                isSaveAsPdfEnable,
                isValidateEnable,
                isSaveEnable,
                isAttachmentEnable,
                toggleInformationMenue,
                isActionsMenueOpen,
                toggleMobileActionsMenue,
                actionsMenueWidth,
                actionsMenueHeight,
                startSaveProcess,
                isActionsPartOpen,
                toggleActionsPart,
                isInformationPartOpen,
                toggleInformationPart,
                toggleViewActionsPart,
                isViewActionsPartOpen
            };
        };
        return {
            initToolbarVM
        };
    });
