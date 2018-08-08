define(['common/core/exceptions',
        'common/infrastructureFacade/tfsMethods',
        'common/resources/texts/indicators',
        'common/utilities/resourceFetcher',
        'common/utilities/stringExtension',
        'common/components/support/supportViewModel'
],
function (exceptions, tfsMethods, texts, resourceFetcher, stringExtension, support) {//eslint-disable-line max-params 

    var setErrorMessage = function (exception) {
        if (exception instanceof exceptions.ApplicativeError) {
            return exception.message;
        }
        else {
            var errorsTexts = resourceFetcher.get(texts.errors);
            return stringExtension.format(errorsTexts.callServerError, [support.phone()]);
        }
    };

    var handleCallServerError = function (exception) {
        var errorMessage = setErrorMessage(exception);
        tfsMethods.dialog.alert(errorMessage);
    };

    return {
        /** display message for call server exceptions, if error is an applicativeError display original message else general call server error message
             * @method handleCallServerError.
             * @param {exception} - the catched error */
        handleCallServerError: handleCallServerError
    };

});