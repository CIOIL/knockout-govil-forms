define(['common/core/generalAttributes',
    'common/resources/domains',
    'common/core/readyToRequestPromise',
    'common/viewModels/languageViewModel',
    'common/utilities/resourceFetcher',
    'common/infrastructureFacade/tfsMethods',
    'common/components/payments/texts',
    'common/core/biztalkHandler',
    'common/resources/texts/indicators',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/ko/bindingHandlers/initialization'
],
    function (generalAttributesManager, domains, readyToRequestPromise, languageViewModel, resourceFetcher, tfsMethods, paymentResources, biztalkHandler, indicators, exceptions, exceptionMessages, stringExtension) {//eslint-disable-line max-params 

        var createPaymentFormViewModel = function (settings) {
            settings = settings || {};
            var encString = ko.observable();
            var actionURL = ko.observable();
            var retrievalURL = ko.observable();

            readyToRequestPromise.then(function () {
                var serverName = generalAttributesManager.getTargetServerName();
                var domain = domains.ecomDomains[serverName];
                actionURL(domain + (paymentResources.services[settings.paymentServiceType] || paymentResources.services.voucher) + (settings.serviceParameters || ''));
                retrievalURL(domain + paymentResources.services.retrieval);
            });
            var sendFormToEcom = function (response) {
                encString(response.substr(4));
                $('[name="MyForm"]').submit();
            };
            var showErrorMessage = function (response) {
                var message;
                if (biztalkHandler.isNotUniqueReference(response)) {
                    message = resourceFetcher.get(indicators.errors).uniqSubmitMessage;
                }
                else {
                    message = resourceFetcher.get(indicators.errors).biztalkError;
                }
                tfsMethods.dialog.alert(message, resourceFetcher.get(indicators.information).sendTheForm);
            };
            var callBackPayment = function (response) {
                if (!response) {
                    exceptions.throwFormError(stringExtension.format(exceptionMessages.undefinedParam, 'response'));
                }
                response = response.strURL || response;//Backward support
                if (biztalkHandler.isSendingSucceeded(response)) {
                    sendFormToEcom(response);
                } else {
                    showErrorMessage(response);
                }
            };

            return {
                action: actionURL,
                retrieval: retrievalURL,
                vid: settings.vidNumber,
                encString: encString,
                language: settings.language || languageViewModel.getShortName(),
                callBackPayment: callBackPayment
            };
        };
        return {
            createPaymentFormViewModel: createPaymentFormViewModel
        };
    });