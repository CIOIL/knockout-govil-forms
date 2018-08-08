/** 
* @module biztalkJsonHandler
* @description Module that holds functions for display a message after submit callback, 
* according to the response that return from biztalk.
*/
define(['common/utilities/resourceFetcher',
        'common/infrastructureFacade/tfsMethods',
        'common/resources/texts/indicators',
        'common/utilities/stringExtension',
        'common/utilities/typeVerifier',
        'common/core/exceptions',
        'common/utilities/reflection'
],
function (resourceFetcher, tfsMethods, indicators, stringExtension, typeVerifier, exceptions, reflection) {//eslint-disable-line max-params 

    const responsesCode = {
        uinque: 7,
        success: 0,
        applicativeError: -700,
        syncSuccess: -1,
        error: 1,
        successTask: 1,
        applicativeErrorTask: 6
    };

    const successResponseCode = [responsesCode.success, responsesCode.applicativeError, responsesCode.syncSuccess];

    function parseResponseToJson(response) {
        if (typeof response === 'object') {
            return response;
        }
        try {
            return JSON.parse(response);
        } catch (e) {
            return { ResponseCode: '' };
        }
    }

    function getSuccessMessage(settings) {
        if (typeVerifier.string(settings.customMessages.success)) {
            return settings.customMessages.success;
        }
        if (!settings.referenceNumber) {
            exceptions.throwFormError('Invalid settings: Default success message require referenceNumber. You must send settings.referenceNumber or settings.customMessages.success');
        }
        return stringExtension.format(resourceFetcher.get(indicators.information).SendingSuccsess, settings.referenceNumber);
    }

    function getErrorMessage(settings) {
        return settings.customMessages.error || resourceFetcher.get(indicators.errors).biztalkError;
    }

    function getUniqueErrorMessage(settings) {
        return settings.customMessages.unique || resourceFetcher.get(indicators.errors).uniqSubmitMessage;
    }

    const functionEnum = {
        '1': getErrorMessage,
        '0': getSuccessMessage,
        '-1': getSuccessMessage,
        '-700': getSuccessMessage,
        '7': getUniqueErrorMessage
    };

    const getMessageByResponse = (response, settings) => {
        response = parseResponseToJson(response);
        settings = reflection.extendSettingsWithDefaults(settings, { customMessages: {} });
        const functionMessage = functionEnum[response.ResponseCode];
        return typeof functionMessage === 'function' ? functionMessage(settings) : getErrorMessage(settings);
    };

    const isSuccessTask = (task, response) => {
        response = parseResponseToJson(response);
        return response && response[task] && response[task].TaskStatus === responsesCode.successTask;
    };

    const isApplicativeErrorTask = (task, response) => {
        response = parseResponseToJson(response);
        return response && response[task] && response[task].TaskStatus === responsesCode.applicativeErrorTask;
    };

    const isFailedTask = (task, response) => {
        return !isSuccessTask(task, response) && !isApplicativeErrorTask(task, response);
    };

    const isSendingSucceeded = response => {
        response = parseResponseToJson(response);
        return successResponseCode.includes(response.ResponseCode);
    };

    const isNotUniqueReference = response => {
        response = parseResponseToJson(response);
        return response.ResponseCode === responsesCode.uinque;
    };

    const showMessage = (response, settings) => {       
        const message = getMessageByResponse(response, settings);
        tfsMethods.dialog.alert(message, resourceFetcher.get(indicators.information).sendTheForm);
    };

    return {
        /** Check if biztalk returns error of reference number is not unique. 
         * @method <b>isNotUniqueReference</b>
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the response is error of duplicate reference number.
         */
        isNotUniqueReference,
        /** Check if biztalk returns success message. 
         * @method <b>isSendingSucceeded</b>
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the response is success message.
         */
        isSendingSucceeded,
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
        showMessage,
        /** return message according to biztalk response
        * @method <b>getMessageByResponse</b>
        * @param {string} response - the biztalk response
        * @param {object} settings - settings for the messages texts
        * @param {string} settings.referenceNumber - the form's reference number, is used for the default success message. (must be sent if custom success message wasn't send)
        * @param {object} settings.customMessages - text to display instead of the defaults.
        * @param {string} settings.customMessages.success - success message.
        * @param {string} settings.customMessages.error - error message.
        * @param {string} settings.customMessages.unique - duplicate reference message.
        */
        getMessageByResponse,
        /** Check if specific task failed.
         * @method <b>isFailedTask</b>
         * @param {string} task - the specific task 
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the task is error.
         */
        isFailedTask,
        /** Check if specific task failed with applicative error.
         * @method <b>isApplicativeErrorTask</b>
         * @param {string} task - the specific task
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the task failed with applicative error.
         */
        isApplicativeErrorTask,
        /** Check if specific task success.
         * @method <b>isSuccessTask</b>
         * @param {string} task - the specific task
         * @param {string} response - the biztalk response
         * @returns {boolean} <b>true</b> if the task is success.
         */
        isSuccessTask
    };
});