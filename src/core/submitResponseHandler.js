/** 
* @module submitResponseHandler
* @description Module that holds functions for display a message after submit callback, 
*/
define(['common/core/biztalkJsonHandler',
        'common/utilities/resourceFetcher',
        'common/components/dialog/dialog',
        'common/resources/texts/indicators',
        'common/utilities/reflection',
        'common/viewModels/languageViewModel',
        'common/utilities/successDialog'
],

function (biztalkHandler, resourceFetcher, dialog, indicators, reflection, languageViewModel, successDialog) {//eslint-disable-line max-params    
   
    const getErrorMessage = function (response, settings) {
        if (response.statusCode.toString() === '0') {
            return '';
        }
        const responseMessages = response.responseMessages[languageViewModel.getShortName()];//todo: resourceFetcher.get
        return settings.customMessages.error || responseMessages || resourceFetcher.get(indicators.errors).defaultError;
    };

    const getBiztalkMessage = (response, settings) => {
        const message = biztalkHandler.getMessageByResponse(response, settings);
        if (biztalkHandler.isSendingSucceeded(response)) {
            successDialog.open(message); return;
        }
        dialog.alert({ message: message, title: resourceFetcher.get(indicators.information).sendTheForm });
    };

    const showMessage = function (response, settings) {
        const defaultSettings = { isBiztalk: true, customMessages: {} };
        const defaultResponse = { statusCode: '', response: '', responseMessages: '' };
        settings = reflection.extendSettingsWithDefaults(settings, defaultSettings);
        response = reflection.extendSettingsWithDefaults(response, defaultResponse);
        const errorMessage = getErrorMessage(response, settings);
        if (errorMessage) {
            dialog.alert({ message: errorMessage, title: resourceFetcher.get(indicators.information).sendTheForm }); return;
        }
        else {
            if (settings.isBiztalk) {
                getBiztalkMessage(response.response, settings);
            }
            ko.postbox.publish('successSubmitForm', response);
        }                
    };
    return {
        /** Show a message (Display alert) when failed submit. 
         * publish evevnt if success.
         * if the form is sent to biztalk call to biztalkJsonHandler
         * @method <b>showMessage</b>
         * @param {object} response - the submit response
         * @param {object} settings - settings for the messages texts
         * @param {string} settings.referenceNumber - the form's reference number, is used for the default success message. (must be sent if custom success message wasn't send)
         * @param {object} settings.customMessages - text to display instead of the defaults.
         * @param {string} settings.customMessages.success - success message.
         * @param {string} settings.customMessages.error - error message.
         * @param {string} settings.customMessages.unique - duplicate reference message.
         * @param {boolean} settings.isBiztalk - default is true. send false if the form does not sent to biztalk.
         */
        showMessage
    };    
});