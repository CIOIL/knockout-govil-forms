/* global AgatAttachment agatMobile AgatValidator agform2Html CurrentPlugInVersion */

define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/resources/infrastructureEnums',
    'common/resources/tfsAttributes',
    'common/core/formMode'
], function (formExceptions, exceptionsMessages, stringExtension, infrastructureEnums, tfsAttributes, formMode) {//eslint-disable-line max-params

    /*region privateFunctions*/

    function callGlobalFunction(callbackFunctionName, args) {//eslint-disable-line consistent-return

        var scope = window;

        var findScopeAndFunction = function () {
            var stack = callbackFunctionName.split('.');
            for (var i = 0; i < stack.length - 1; i++) {
                scope = scope[stack[i]];
            }
            callbackFunctionName = stack[stack.length - 1];
        };

        var functionDoesNotExist = function () {
            return typeof scope === 'undefined' || typeof (scope[callbackFunctionName]) !== 'function';
        };

        var ensureFunctionExisting = function () {
            if (functionDoesNotExist()) {
                formExceptions.throwFormError(stringExtension.format(exceptionsMessages.funcNotExist, callbackFunctionName));
            }
        };


        findScopeAndFunction();
        ensureFunctionExisting();

        try {
            return scope[callbackFunctionName].apply(scope, Array.prototype.slice.call(args));
        }
        catch (e) {
            formExceptions.throwFormError(stringExtension.format(exceptionsMessages.funcThrewException, callbackFunctionName, e.message));
        }
    }

    function hasAttribute(element, attribute) {
        if (element && element.length) {
            return element.attr(attribute) !== undefined;
        }
        return false;
    }

    function throwUndefinedElementException(paramName) {
        formExceptions.throwFormError(stringExtension.format(exceptionsMessages.undefinedParam, paramName));
    }

    function throwIsAGForms2HtmlFunctionException() {
        formExceptions.throwFormError(stringExtension.format(exceptionsMessages.isAGForms2HtmlFunction));
    }
    /*end region privateFunctions*/


    /*region publicFunctions*/
    /**
     * Make ajax request
     * @param {object} options (params like jQuery.Ajax())
     * @returns {undefined}
     * @deprecated since version 3.0.0, use 'Common' ajax function instead
     */
    function ajaxRequest() {
        return callGlobalFunction('tfsAjaxRequest', arguments);
    }

    /**
     * Init connecion to signature Adaptor
     * @returns {undefined}
     */
    function initSignatureAdaptor() {
        return callGlobalFunction('govForms.signature.agform2HtmlAdapter.initSignatureAdaptor', arguments);
    }

    /**
     * Raise alert popup
     * @param {string} message alert message to display
     * @param {string} title alert title
     * @param {function} callbackFunction callback function to be called while confirmation the popup
     * @returns {undefined}
     */
    function alert() {
        return callGlobalFunction('tfsAlert', arguments);
    }
    /**
     * Make ajax request, support only 'GET' method requests
     * @param {string} url ajax url
     * @param {object} data ajax data
     * @param {function} callbackFunction success callback function
     * @param {object} context ajax context
     * @param {string} method ajax sending method
     * @param {string} user ajax user property
     * @param {string} password ajax password property
     * @returns {undefined}
     * @deprecated since version 3.0.0, use 'Common' ajax function instead
     */
    function callServer() {
        return callGlobalFunction('tfsCallServer', arguments);
    }

    /**
     * Raise confirm popup
     * @param {string} message alert confirmation message to display
     * @param {string} title confirmation title
     * @param {function} callbackFunction callback function to be called while confirmation the popup
     * @returns {undefined}
     */
    function confirm() {
        return callGlobalFunction('tfsConfirm', arguments);
    }

    /**
         * Do bind to lookup element
         * @param {string} id element id
         * @returns {undefined}
         * @deprecated since version 3.0.0, use knockout data binding instead
         */
    function doBind() {
        return callGlobalFunction('tfsDoBind', arguments);
    }

    function setDateUI() {
        return callGlobalFunction('AgatCalendar.updateUI', arguments);
    }

    function handleCalendarElements() {
        if (!window.AgatEngine) {
            return;
        }
        return callGlobalFunction('AgatEngine.handleCalendarElements', arguments);//eslint-disable-line consistent-return
    }

    /**
     * Get element by id
     * @param {string} id element id
     * @returns {object} jQuery element
     * @deprecated since version 3.0.0, use knockout data binding instead or jQuery
     */
    function getElementById() {
        return callGlobalFunction('tfsGetElementById', arguments);
    }

    /**
     * Get elements by name
     * @param {string} name element name
     * @returns {object} jQuery element
     * @deprecated since version 3.0.0, use knockout data binding instead or jQuery
     */
    function getElementsByName() {
        return callGlobalFunction('tfsGetElementsByName', arguments);
    }

    /**
     * Get value of element
     * @param {string} id element id
     * @returns {string} value
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function getValue() {
        return callGlobalFunction('tfsGetValue', arguments);
    }

    /**
     * Hide AGForms2Html toolbar
     * @returns {undefined}
     */
    function hideToolbar() {
        return callGlobalFunction('tfsHideToolbar', arguments);
    }

    /**
     * Import form data from XML
     * @param {object} value XML value
     * @returns {undefined}    
     */
    function importData() {
        return callGlobalFunction('tfsImportData', arguments);
    }

    /**
     * Lock element in the DOM
     * @param {string} id element id
     * @returns {undefined}
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function lock() {
        return callGlobalFunction('tfsLock', arguments);
    }

    /**
     * Lock form
     * @returns {undefined}
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function lockForm() {
        return callGlobalFunction('tfsLockForm', true);
    }

    /**
     * Reset fields values
     * @param {object} fields the fields names separated with ';' char
     * @returns {undefined}
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function resetFields() {
        return callGlobalFunction('tfsResetFields', arguments);
    }

    /**
     * Reset form fields
     * @returns {undefined}
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function resetForm() {
        return callGlobalFunction('tfsResetForm', true);
    }

    /**
     * Set value in element
     * @param {string} id element id
     * @param {string} value value to set
     * @returns {string} inserted value
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function setValue() {
        return callGlobalFunction('tfsSetValue', arguments);
    }

    /**
     * Show AGForms2Html toolbar
     * @returns {undefined}
     */
    function showToolbar() {
        return callGlobalFunction('tfsShowToolbar', arguments);
    }

    /**
     * Unlock element in the DOM
     * @param {string} id element id
     * @returns {undefined}
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function unlock() {
        return callGlobalFunction('tfsUnLock', arguments);
    }

    /**
     * Init AGForms2Html toolbar
     * @returns {undefined}
     */
    function initToolbar() {
        if (formMode.mode() === formMode.validModes.client) {
            return callGlobalFunction('AgatToolbar.initToolbarButtons', arguments);
        }
        return undefined;
    }

    /**
     * Submit the data (XML) of form
     * @param {object} button button element
     * @returns {undefined}
     */
    function submitForm() {
        return callGlobalFunction('AgatToolbar.submitForm', arguments);
    }

    /**
  * Submit the form without wrapping like loading 
  * @param {object} ReviewMode, {string} xmlText, {string} sendingText e.g. submitFormSuccessCallbackHandler(null, '', '')
  * @returns {undefined}
  */
    function submitFormSuccessCallbackHandler() {
        return callGlobalFunction('AgatToolbar.submitFormSuccessCallbackHandler', arguments);
    }

    /**
     * Export the data (XML) of form
     * @returns {undefined}
     */
    function exportData() {
        return callGlobalFunction('AgatToolbar.exportData', arguments);
    }

    /**
     * Save form as PDF format
     * @returns {undefined}
     */
    function saveFormAsPDF() {
        return callGlobalFunction('AgatToolbar.saveFormAsPDF', arguments);
    }

    /** 
     * Print form
     * @returns {undefined}
     */
    function printForm() {
        return callGlobalFunction('AgatToolbar.printForm', arguments);
    }

    /** 
     * Get XML data
     * @returns {undefined}
     */
    function getXML() {
        return callGlobalFunction('AgatXML.getXML', arguments);
    }

    /** 
   * fixElements
   * @returns {undefined}
   */
    function fixElements() {
        return callGlobalFunction('printFix.fixElements', arguments);
    }
    /** 
  * rollBackChanges
  * @returns {undefined}
  */
    function rollBackChanges() {
        return callGlobalFunction('printFix.rollBackChanges', arguments);
    }

    /**
     * Perform an action from AGForms2Html toolbar actions by toolbar button name
     * @param {string} buttonName name of button ( - action) of AGForms2Html toolbar
     * @returns {undefined}
     */
    function clickToolbarButton() {
        return callGlobalFunction('AgatToolbar.handleToolbarButtonsClick', arguments);
    }

    /**
     * Remove all the attachments of a form
     * @returns {undefined}
     */
    function removeAllAttachments() {
        return callGlobalFunction('AgatToolbar.removeAllAttachments', arguments);
    }

    /**
     * Remove attachment from element
     * @returns {undefined}
     */
    function removeAttachmentByElem() {
        return callGlobalFunction('AgatAttachment.removeAttachmentByElem', arguments);
    }

    /**
     * disable and enable attachment element
     * @returns {undefined}
     */
    function setDisabledEnabled() {
        return callGlobalFunction('AgatAttachment.setDisabledEnabled', arguments);
    }

    /**
     * Open dialog message
     * @param {string} id dialog id
     * @param {string} message dialog message
     * @param {string} title dialog message
     * @param {number} width dialog width
     * @returns {undefined}
     */
    function openDialog() {
        return callGlobalFunction('AgatDialog.openDialog', arguments);
    }

    /**
     * Remove all dynamic table rows (staying the first row as empty row).
     * @param {object} table dynamic table
     * @returns {undefined}
     * @deprecated since version 3.0.0, use knockout data binding instead
     */
    function clearTable() {
        return callGlobalFunction('AgatTables.clearTable', arguments);
    }

    /** 
    * determines the form language
    * @param {string} language - the desired languge
    * @returns {undefined}
    */
    function setFormLanguage() {
        return callGlobalFunction('AgatEngine.setFormLanguage', arguments);
    }
    /** 
     * Validate element with his descendants
     * @param {string} elementId - id of the element to validate
     * @returns {boolean} - is valid element
     * @deprecated since version 3.0.0, use knockout data binding instead (knockout validations)
     */
    function validate() {
        return callGlobalFunction('tfsValidate', arguments);
    }

    /** 
     * Open submit popup
     * @param {string} text popup text
     * @returns {undefined}
     */
    function openSubmitPopup() {
        return callGlobalFunction('AgatSubmitPopup.open', arguments);
    }

    /**
     * Close submit popup
     * @returns {undefined}
     */
    function closeSubmitPopup() {
        return callGlobalFunction('AgatSubmitPopup.close', arguments);
    }

    /**
     * Get the total size of attachments in a form
     * @returns {number} total attachments size in the form
     */
    function getTotalAttachmentsSize() {
        return callGlobalFunction('AgatAttachment.formAllAttachmentsTotalSize', arguments);
    }

    function getAgform2HtmlAdapterObject(signIDElement) {
        if (window.govForms && window.govForms.signature && typeof (window.govForms.signature.agform2HtmlAdapter) !== 'undefined') {
            return new window.govForms.signature.agform2HtmlAdapter(signIDElement);
        }
        else {
            formExceptions.throwFormError('window.govForms.signature.agform2HtmlAdapter is not defined');
            return false;
        }
    }
    /**
     * Get the agat crossDomin reponse types object
     * @returns {object} - agat reponse type object
     */
    function getResponseTypeObject() {//eslint-disable-line consistent-return
        if (window.Agat && typeof (window.Agat.crossDomain) !== 'undefined') {
            return window.Agat.crossDomain.ResponseType;
        }
        else {
            formExceptions.throwFormError('Agat.crossDomain is not defined');
        }
    }
    /**
     * Call agat beginRequest function
     * @param {string} url - the requested url
     * @returns {undefined} -
     */
    function beginRequest() {
        return callGlobalFunction('agat.requestManager.beginRequest', arguments);
    }
    /**
     * Call agat endRequest function
     * @param {string} url - the requested url
     * @returns {undefined}
     */
    function endRequest() {
        return callGlobalFunction('agat.requestManager.endRequest', arguments);
    }
    /**
     * Call agat crossDomain.invoke function
     * @param {object} settings {succeed:function, error:function, callBackResponseType:JSON/String/XML, otherDomainUrl: url}
     * @returns {undefined}
     */
    function invokeCrossDomainRequest() {
        return callGlobalFunction('Agat.crossDomain.invoke', arguments);
    }
    /**
    * Call cross domain function by using agat requests
    * @param {object} deffer - promise for the reponse
    * @param {string} url - the requested url
    * @param {string} dataType - the needed data type
    * @returns {undefined}
    */
    var crossDomainRequest = function (deffer, url, dataType) {
        var responseTypeObject = getResponseTypeObject();
        var interval = 20000;
        beginRequest(url, interval);
        invokeCrossDomainRequest({
            succeed: function (data) {
                endRequest(url);
                if (data) {
                    deffer.resolve(data);
                }
            },
            error: function (data) {
                endRequest(url);
                deffer.reject(data);
            },
            callBackResponseType: responseTypeObject[dataType],
            otherDomainUrl: url
        });
    };

    var showLookUpWindow = function () {
        return callGlobalFunction('showLookUpWindow', arguments);
    };
    /**
     * Get the 'tfsDataType' attribute of element
     * @param {object} element jQuery element
     * @returns {String} 'tfsDataType' attribute of element
     */
    function getElementType(element) {//eslint-disable-line consistent-return

        var getTfsDataType = function () {//eslint-disable-line consistent-return
            if (hasAttribute(element, tfsAttributes.TFSDATATYPE)) {
                var tfsDataType = element.attr(tfsAttributes.TFSDATATYPE).toLowerCase();
                return infrastructureEnums.dataTypes[tfsDataType] || '';
            }
        };

        if (element && element.length) {
            return getTfsDataType();
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Checking if an element is of attachment type
     * @param {object} element jQuery element
     * @returns {boolean} is attachment input
     */
    function isAttachmentInput(element) {//eslint-disable-line consistent-return
        if (element && element.length) {
            return getElementType(element) === infrastructureEnums.dataTypes.attachment;
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Clear attachment from DOM
     * @param {object} element jQuery attachment element
     * @returns {undefined}
     */
    function clearAttachment(element) {
        if (isAttachmentInput(element)) {
            //fire change event for ko
            if (typeof (ko) === 'object') {
                ko.utils.triggerEvent(element[0], 'change');
            }

            AgatAttachment.clearInpufFileElement(element);
            element.tfsClear();
        }
        else {
            formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'attachment'));
        }
    }

    /** 
     * Get if the is form in the first load
     * @returns {boolean} - is form in first load
     */
    function isFormInitialLoad() {//eslint-disable-line consistent-return
        if (typeof agform2Html !== 'undefined') {
            return agform2Html.settings().initialLoad;
        } else {
            throwIsAGForms2HtmlFunctionException();
        }
    }

    /** 
     * Get the running browser name
     * @returns {String} browser name
     */
    function getBrowserName() {//eslint-disable-line consistent-return
        if (typeof agform2Html !== 'undefined') {
            return agform2Html.settings().browser.Browser;
        } else {
            throwIsAGForms2HtmlFunctionException();
        }
    }

    /**
     * Get the running browser version 
     * @returns {String} browser version
     */
    function getBrowserVersion() {//eslint-disable-line consistent-return
        if (typeof agform2Html !== 'undefined') {
            return agform2Html.settings().browser.Ver;
        } else {
            throwIsAGForms2HtmlFunctionException();
        }
    }

    /**
    * Get the running browser document mode 
    * @returns {String} browser document mode
    */
    function getBrowserDocumentMode() {//eslint-disable-line consistent-return
        if (typeof agform2Html !== 'undefined') {
            return agform2Html.settings().browser.DocumentMode;
        } else {
            throwIsAGForms2HtmlFunctionException();
        }
    }

    /**
     * Set the 'tfsAction' attribute of element
     * @param {object} element jQuery element
     * @param {string} action 'tfsAction' attribute from 'infrastructureEnums.actions' enum
     * @returns {undefined}
     */
    function setElementAction(element, action) {
        if (element && element.length) {
            if (action && infrastructureEnums.actions[action.toLowerCase()]) {
                element.attr(tfsAttributes.TFSACTION, action.toLowerCase());
            } else {
                formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidParam, 'action'));
            }
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Get the 'tfsAction' attribute of element
     * @param {object} element jQuery element
     * @returns {String} 'tfsAction' attribute of element
     */
    function getElementAction(element) {//eslint-disable-line consistent-return

        var getTfsAction = function () {//eslint-disable-line consistent-return
            if (hasAttribute(element, tfsAttributes.TFSACTION)) {
                var tfsAction = element.attr(tfsAttributes.TFSACTION).toLowerCase();
                return infrastructureEnums.actions[tfsAction] || '';
            }
        };

        if (element && element.length) {
            return getTfsAction();
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Get the 'tfsName' attribute of element
     * @param {object} element jQuery element
     * @returns {String} 'tfsName' attribute of element
     */
    function getName(element) {//eslint-disable-line consistent-return
        if (element && element.length) {
            return element.attr(tfsAttributes.TFSNAME);
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
   * Get the 'tfsBind' attribute of element
   * @param {object} element jQuery element
   * @returns {String} 'tfsBind' attribute of element
   */
    function getTfsbind(element) {//eslint-disable-line consistent-return
        if (element && element.length) {
            return element.attr(tfsAttributes.TFSBIND);
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
   * Get the 'tfsLastBind' attribute of element
   * @param {object} element jQuery element
   * @returns {String} 'tfsBind' attribute of element
   */
    function getTfsLastbind(element) {//eslint-disable-line consistent-return
        if (element && element.length) {
            return element.attr(tfsAttributes.TFSLASTBIND);
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Checking the 'tfsUploaded' attribute of element
     * @param {object} element jQuery element
     * @returns {boolean} - is uploaded element
     */
    function isUploadedElement(element) {//eslint-disable-line consistent-return
        if (element && element.length) {
            return element.attr(tfsAttributes.TFSUPLOADED) && element.attr(tfsAttributes.TFSUPLOADED).toLowerCase() === 'true';
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Set the 'tfsUploaded' attribute of element
     * @param {object} element jQuery element
     * @param {object} isUploaded is uploaded element
     * @returns {undefined}
     */
    function setElementUploaded(element, isUploaded) {
        if (element && element.length) {
            element.attr(tfsAttributes.TFSUPLOADED, !!isUploaded);
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * Get the unique name(s) of attachment(s) from the saved attribute on the table element/attachment input
     * @param {object} element jQuery element
     * @param {boolean} isTable the method refer to names of table attachments or single attachment input 
     * @returns {object} array of unique names or single string name (depending on isTable param)
     */
    function getAttachmentsUniqueNames(element, isTable) {//eslint-disable-line consistent-return

        isTable = isTable && isTable.toString().toLowerCase() === 'true';

        var isAttachmentsTable = function () {
            return element.find('input[' + tfsAttributes.TFSDATATYPE + '="' + infrastructureEnums.dataTypes.attachment + '"]').length > 0;
        };

        var getTableAttachmentsUniqueNames = function () {//eslint-disable-line consistent-return
            if (isAttachmentsTable()) {
                return element.data(AgatAttachment.dataAttributes.filename.dynamictable) || [];
            }
            else {
                formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'table of attachments element'));
            }
        };

        var getInputAttachmentUniqueName = function () {//eslint-disable-line consistent-return
            if (isAttachmentInput(element)) {
                return element.data(AgatAttachment.dataAttributes.filename.elementAttribute) || '';
            }
            else {
                formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'attachment'));
            }
        };

        if (element && element.length) {
            if (isTable) {
                return getTableAttachmentsUniqueNames();
            }
            return getInputAttachmentUniqueName();
        }
        else {
            throwUndefinedElementException('element');
        }
    }

    /**
     * View uploaded attachment
     * @param {object} element jQuery attachment element 
     * @returns {undefined}
     */
    function viewAttachment(element) {
        if (isAttachmentInput(element)) {
            if (isUploadedElement(element)) {
                AgatAttachment.displayAttachment(element);
            }
        } else {
            formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'attachment'));
        }
    }


    /**
     * Get attachment info
     * @param {object} element jQuery attachment element 
     * @returns {object} - attachment info
     */
    function getAttachmentInfo(element) {
        if (isAttachmentInput(element)) {
            return AgatAttachment.getAttachmentInfo(element);
        }
        throw formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'attachment'));
    }

    /**
     * Checking if the application is running from mobile
     * @returns {boolean} - is running from mobile
     */
    function isMobile() {
        return typeof (agatMobile) !== 'undefined';
    }
    /**
        * Checking if the application is running from mobile
        * @returns {boolean} - is running from mobile
        */
    function getFormEvents() {
        return window.govForms ? window.govForms.events : undefined;
    }

    /**
     * Checking if the application is running with AGForms2Html
     * @returns {boolean} - is running with AGForms2Html
     */
    function isAGForms2Html() {
        return typeof agform2Html !== 'undefined';
    }

    /**
    * Show/Hide the toggle languages div
    * and put transparent div on the form
    * @returns {undefined}
    */
    function toggleLanguageDiv() {
        var oLightBackGround = {
            key: 'background', val: 'rgba(223, 223, 223, 0.5)'
        };
        var languageMenu = $('.culture-menu');
        var modalId = $('#my_modal_id');

        if (languageMenu.length < 1 || modalId.length < 1) {
            formExceptions.throwFormError(exceptionsMessages.AGForms2HtmlVersion);
        }

        languageMenu.toggle();

        if (languageMenu.is(':visible')) {
            modalId.css(oLightBackGround.key, oLightBackGround.val);
            modalId.height($(document).height());
            modalId.show();
        }
        else {
            modalId.css(oLightBackGround.key, '');
            modalId.hide();
        }
    }
    /*end region publicFunctions*/

    /*region publicProperties*/
    var currentPluginVersion = typeof CurrentPlugInVersion !== 'undefined' ? CurrentPlugInVersion : '';
    var language = 'hebrew';
    /*end region publicProperties*/


    /**
     * Calling 'userBeforeValidateForm' before 'AgatValidator.validateForm'
     * @returns {undefined}
     */
    var tlp = tlp || {};//eslint-disable-line no-use-before-define
    (function () {

        var activateValidationWithBeforeCallback = function () {
            var originalAgatValidateForm = AgatValidator.validateForm;
            AgatValidator.validateForm = function (container) {
                if (tlp.userBeforeValidateForm(container)) {
                    return originalAgatValidateForm.call(AgatValidator, container);
                }
                else {
                    return false;
                }
            };
        };

        if (typeof (AgatValidator) !== 'undefined' && ko) {
            if (typeof tlp.userBeforeValidateForm === 'function') {
                activateValidationWithBeforeCallback();
            }
        }
    })();

    /**
        * geting cookie value 
        * @param {string} cookieName - the needed cookie name
        * @returns {string} - the value of needed cookie
        */
    var getCookie = function (cookieName) {
        if (typeof window.utils.cookie !== 'undefined') {
            return window.utils.cookie.get(cookieName);
        } else {
            formExceptions.throwFormError(stringExtension.format(exceptionsMessages.isUtilsCookies));
            return false;
        }
    };

    /**
       * seting cookie value 
       * @param {string} cookieName - the needed cookie name
       * @param {string} newVale - the value
       * @param {number} daysNumber - the needed days number for keep the value 
       * @returns {string} - the value of needed cookie
       */
    var setCookie = function (cookieName, newVale, daysNumber) {
        if (typeof window.utils.cookie !== 'undefined') {
            return window.utils.cookie.set(cookieName, newVale, daysNumber);
        } else {
            formExceptions.throwFormError(stringExtension.format(exceptionsMessages.isUtilsCookies));
            return false;
        }
    };

    return {

        dialog: {
            alert: alert,
            confirm: confirm,
            openDialog: openDialog,
            openSubmitPopup: openSubmitPopup,
            closeSubmitPopup: closeSubmitPopup
        },

        toolbar: {
            hideToolbar: hideToolbar,
            showToolbar: showToolbar,
            initToolbar: initToolbar,
            clickToolbarButton: clickToolbarButton
        },

        attachment: {
            clearAttachment: clearAttachment,
            getTotalAttachmentsSize: getTotalAttachmentsSize,
            removeAllAttachments: removeAllAttachments,
            removeAttachmentByElem: removeAttachmentByElem,
            getAttachmentsUniqueNames: getAttachmentsUniqueNames,
            setDisabledEnabled: setDisabledEnabled,
            viewAttachment: viewAttachment,
            getAttachmentInfo: getAttachmentInfo,
            isAttachmentInput: isAttachmentInput
        },
        lookup: {
            doBind: doBind
        },

        calendar: {
            setDateUI: setDateUI,
            handleCalendarElements: handleCalendarElements
        },
        browser: {
            getName: getBrowserName,
            getVersion: getBrowserVersion,
            getDocumentMode: getBrowserDocumentMode
        },

        attributes: {
            getElementAction: getElementAction,
            setElementAction: setElementAction,
            getElementType: getElementType,
            getName: getName,
            getTfsbind: getTfsbind,
            getTfsLastbind: getTfsLastbind,
            setElementUploaded: setElementUploaded,
            isUploadedElement: isUploadedElement
        },
        crossDomain: {
            beginRequest: beginRequest,
            endRequest: endRequest,
            invokeCrossDomainRequest: invokeCrossDomainRequest,
            getResponseTypeObject: getResponseTypeObject,
            crossDomainRequest: crossDomainRequest
        },
        cookies: {
            get: getCookie,
            set: setCookie
        },
        initSignatureAdaptor: initSignatureAdaptor,
        ajaxRequest: ajaxRequest,
        callServer: callServer,
        getElementById: getElementById,
        getElementsByName: getElementsByName,
        getValue: getValue,
        setValue: setValue,
        lock: lock,
        lockForm: lockForm,
        unlock: unlock,
        resetFields: resetFields,
        resetForm: resetForm,
        clearTable: clearTable,
        setFormLanguage: setFormLanguage,
        validate: validate,
        submitForm: submitForm,
        submitFormSuccessCallbackHandler: submitFormSuccessCallbackHandler,
        saveFormAsPDF: saveFormAsPDF,
        printForm: printForm,
        getXML: getXML,
        fixElements: fixElements,
        rollBackChanges: rollBackChanges,
        importData: importData,
        exportData: exportData,
        isMobile: isMobile,
        isAGForms2Html: isAGForms2Html,
        toggleLanguageDiv: toggleLanguageDiv,
        currentPluginVersion: currentPluginVersion,
        language: language,
        isFormInitialLoad: isFormInitialLoad,
        getFormEvents: getFormEvents,
        showLookUpWindow: showLookUpWindow,
        getAgform2HtmlAdapterObject: getAgform2HtmlAdapterObject
    };
});

