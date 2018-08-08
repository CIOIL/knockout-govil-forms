/** 
* @module referenceNumber
* @description module that return new reference number 
*/
define(['common/resources/domains',
    'common/core/generalAttributes',
    'common/core/exceptions',
    'common/networking/ajax',
    'common/core/readyToRequestPromise'    
],
    function (domains, generalAttributes, exceptions, ajax, readyToRequestPromise) {//eslint-disable-line max-params       

        const messages = {
            missinggRequiredParams: 'form id is required for the route',
            invalidDomain: 'server name should be one of wslist domains'
        };
        //TODO opensource
        const route = 'ExternalWS/Sequence/getSequenceWS.aspx?formid=';

        const checkRequiredParams = function (formId) {
            return formId !== '' && formId !== undefined;
        };

        const getDomain = function getDomain() {
           
            var domain = domains['wsListDomains'][generalAttributes.getTargetServerName()];
            if (!domain) {
                exceptions.throwFormError(messages.invalidDomain);
            }
            return domain;
        };

        const getReferenceNumberRequest = function (formId) {
            return readyToRequestPromise.then(function () {
                if (!checkRequiredParams(formId)) {
                    exceptions.throwFormError(messages.missinggRequiredParams);
                }
                const domain = getDomain();
                const url = `${domain}${route}${formId}`;
                const settings = {
                    url: url,
                    method: 'GET',
                    dataType: 'text',
                    cache: false,
                    crossDomain: true
                };
                return ajax.request(settings);
            });
        };

        return {
            /**
             * Get new reference number promise
             * @method getReferenceNumberRequest
             * @param {string} formId - the form ID to download a new reference number 
             * @returns {object} a promise object with new reference number 
             * @example Example of usage 
             * getReferenceNumerRequest('Test@test.gov.il');
             */
            getReferenceNumberRequest: getReferenceNumberRequest
        };

    });


