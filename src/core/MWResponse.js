define(['common/viewModels/languageViewModel',
        'common/core/exceptions',
        'common/components/dialog/dialog',
        'common/resources/texts/indicators',
        'common/utilities/resourceFetcher'
],
        function (languageViewModel, formExceptions, dialog, indicatorsTexts, resourceFetcher) {//eslint-disable-line max-params
            let statusCodeRes = '0';
            const isSuccededResponse = function (response) {
                return response.hasOwnProperty('statusCode') && response.statusCode.toString() === statusCodeRes.toString();
            };
            const getMessageByLanguage = function (response) {
                if (!response || !response.responseMessages || typeof response.responseMessages !== 'object') {
                    dialog.alert({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });
                    formExceptions.throwFormError('call MWErrorMessages.getMessageByLanguage fail because response.responseMessages is undefined');
                }
                return response.responseMessages[languageViewModel.getShortName()];
            };
            const showMessage = function (response) {
                const message = getMessageByLanguage(response);
                dialog.alert({ message: message });
            };
            const defaultBehavior = function (response, callback, fcallback, callbackData) {//eslint-disable-line max-params
                if (isSuccededResponse(response)) {
                    callback(response, callbackData);
                    return;
                }
                showMessage(response);
                if (fcallback) {
                    fcallback(response);
                }
                return;
            };
            return {
                /** return MW response message by current form language. 
                 * @method <b>getMessageByLanguage</b>
                 * @param {object} response - 
                 * @returns {sting}  MW response message
                 */
                getMessageByLanguage,
                /** open dialog popup with MW response message
                 * @method <b>showMessage</b>
                 * @param {object} response - 
                 */
                showMessage,
                /** return handle MW response message and run callback by response.statusCode
                 * @method <b>defaultBehavior</b>
                 * @param {object} response -  MW response object. should include statusCode and responseMessages object
                 * @returns {function}  callback - function that should run when the response.statusCode is 0
                 * @returns {function}  fcallback - function that should run when the response.statusCode is different then 0
                 */
                defaultBehavior
            };
        });
