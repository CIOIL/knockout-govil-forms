/** 
* @module certificateDetails
* @description module that return the certificate details 
*/

define(['common/networking/services',
    'common/networking/ajax',
    'common/core/generalAttributes',
    'common/resources/domains',
    'common/core/readyToRequestPromise'
],
    function (services, ajax, generalAttributesManager, domains, readyToRequestPromise) {//eslint-disable-line max-params

        const route = 'Certificate/GetCertificateProperties';

        const getCertificateDetailsRequest = function (keys) {
            const settings = {
                route: route,
                cache: false,
                method: 'POST',
                data: { keys: keys }
            };
            return services.govServiceListRequest(settings);
        };


        var getDataTokenRequest = function getDataTokenRequest(settings) {

            settings = settings || {};
            var route = 'ssl/tokenRequest.ashx?formType=';
            var enviorment = settings.environmentName || generalAttributesManager.getTargetServerName();
            var formId = settings.formId || generalAttributesManager.get('tfsFormId');
            var url = domains.processManagerSites[enviorment] + route + formId;
            var method = 'GET';
            return ajax.request({ cache: false, url: url, method: method });
        };

        var getAuthenticationRequest = function (settings) {

            return readyToRequestPromise.then(function () {
                return getDataTokenRequest(settings);
            });

        };


        return {
            /**
             * Get certificate details promise
             * @method getCertificateDetailsRequest
             * @param {Array}keys - contain the required certificate properties
             * @returns {object} a promise object with certificate details
             * @example Example of usage
             *  getCertificateDetailsRequest(['LastNameHeb', 'FirstNameHeb'])
             */
            getCertificateDetailsRequest: getCertificateDetailsRequest,
            getAuthenticationRequest: getAuthenticationRequest
        };
    });


