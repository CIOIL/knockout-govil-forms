define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension'],
function (formExceptions, exceptionMessages, stringExtension) {

    var createParamsFactories = function (resources) {
        if (!resources || typeof resources !== 'function') {
            formExceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'createParamsFactories'));
        }

        var validationMessageFactory = function (validationRule, params) {
            if (params && params.message) {
                return ko.unwrap(params.message);
            }
            if (!resources()[ko.unwrap(validationRule)]) {
                return undefined;
            }
            return function () {
                return resources()[ko.unwrap(validationRule)];
            };
        };

        var useObjectLiteral = function (optionalParams, message) {
            if (message) {
                return true;
            }
            for (var prop in optionalParams) {
                if (prop !== 'params' && optionalParams.hasOwnProperty(prop)) {
                    return true;
                }
            }
            return false;
        };

        var validationParamsFactory = function (optionalParams, params, validationRule) {
            optionalParams = optionalParams || {};
            var message = validationMessageFactory(validationRule, optionalParams);
            if (useObjectLiteral(optionalParams, message)) {
                return {
                    params: params,
                    onlyIf: optionalParams.onlyIf,
                    message: message,
                    ruleName: optionalParams.ruleName || validationRule
                };
            }
            else {
                return params;
            }
        };


        return {
            validationMessageFactory: validationMessageFactory,
            validationParamsFactory: validationParamsFactory
        };
    };
    return createParamsFactories;
});