/** 

* @module biztalkHandler
* @description Module that holds functions for display a message after submit callback, 
* according to the response that return from biztalk.
*/
define(['common/utilities/resourceFetcher',
        'common/infrastructureFacade/tfsMethods',
        'common/resources/texts/indicators',
        'common/utilities/stringExtension',
        'common/utilities/typeVerifier',
        'common/core/exceptions'

],
function (resourceFetcher, tfsMethods, indicators, stringExtension, typeVerifier, exceptions) {//eslint-disable-line max-params 
               
    var notFound = -1;
    var uniqueErrorCode = '0007';
    var signatureErrorCode = '0013';
    var validateSignatureErrorCode = '40016';
    var statuses = {
        error: 'err:',
        success: 'res:'
    };

    function getResponsePrefix(response) {
        return stringExtension.trimLeft(response).substr(0, 4).toLowerCase();
    }
    var isSendingSucceeded = function (response) {
        return response ? getResponsePrefix(response) === statuses.success : false;
    };
    var isNotUniqueReference = function (response) {
        return response ? response.indexOf(uniqueErrorCode) !== notFound : false;
    };
    var isSendingWithSignFailed = function (response) {
        return response ? response.indexOf(signatureErrorCode) !== notFound : false;
    };
    var isValidateSignatureFailed = function (response) {
        return response ? response.indexOf(validateSignatureErrorCode) !== notFound : false;
    };
    function getSuccessMessage(settings) {
        if (typeVerifier.string(settings.customMessages.success)){
            return settings.customMessages.success;
        }
        if (!typeVerifier.string(settings.referenceNumber)) {
            exceptions.throwFormError('Invalid settings: Default success message require referenceNumber. You must send settings.referenceNumber or settings.customMessages.success');
        }
        var informationTexts = resourceFetcher.get(indicators.information);
        return stringExtension.format(informationTexts.SendingSuccsess, settings.referenceNumber);
    }
    function getErrorMessage(settings) {
        if (typeVerifier.string(settings.customMessages.error)) {
            return settings.customMessages.error;
        }
        var errorsTexts = resourceFetcher.get(indicators.errors);
        return errorsTexts.biztalkError;
    }
    function getUniqueErrorMessage(settings) {
        if (typeVerifier.string(settings.customMessages.unique)) {
            return settings.customMessages.unique;
        }
        var errorsTexts = resourceFetcher.get(indicators.errors);
        return errorsTexts.uniqSubmitMessage;
    }
    function getSignErrorMessage(settings) {
        if (typeVerifier.string(settings.customMessages.submitWithSign)) {
            return settings.customMessages.submitWithSign;
        }
        var errorsTexts = resourceFetcher.get(indicators.errors);
        return errorsTexts.submitWithSignErrorMessage;
    }
    function getRelevantMessage(response, settings) {//eslint-disable-line complexity
        if (isSendingSucceeded(response)) {
            return getSuccessMessage(settings);
        }
        else {
            if (isNotUniqueReference(response)) {
                return getUniqueErrorMessage(settings);
            }
            else if (isValidateSignatureFailed(response)) {
                return response;
            }
            else if (isSendingWithSignFailed(response)) {
                return getSignErrorMessage(settings);
            }
            else {
                return getErrorMessage(settings);
            }
        }
    }
    var showMessage = function (response, settings) {
        var informationTexts = resourceFetcher.get(indicators.information);
        settings = settings || {};
        settings.customMessages = settings.customMessages || {};

        var message = getRelevantMessage(response, settings);

        tfsMethods.dialog.alert(message, informationTexts.sendTheForm);
    };
    return {
        /** Check if biztalk returns error of reference number is not unique. 
         * @method <b>isNotUniqueReference</b>
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the response is error of duplicate reference number.
         */
        isNotUniqueReference: isNotUniqueReference,
        /** Check if biztalk returns success message. 
         * @method <b>isSendingSucceeded</b>
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the response is success message.
         */
        isSendingSucceeded: isSendingSucceeded,
        /** Show an appropriate message (Display alert). 
         * By default, display messages from the resources.
         * @method <b>showMessage</b>
         * @param {string} response - the biztalk response
         * @param {object} settings - settings for the messages texts
         * @param {string} settings.referenceNumber - the form's reference number, is used for the default success message. (must be sent if custom success message wasn't send)
         * @param {object} settings.customMessages - text to display instead of the defaults.
         * @param {string} settings.customMessages.success - success message.
         * @param {string} settings.customMessages.error - error message.
         * @param {string} settings.customMessages.unique - duplicate reference message.
         */
        showMessage: showMessage
    };
});