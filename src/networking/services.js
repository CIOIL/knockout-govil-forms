/** Object for handling requests to webServiceList and govServiceList
  @module services 
 */
define(['common/resources/domains',
    'common/networking/ajax',
    'common/core/generalAttributes',
    'common/core/exceptions',
    'common/utilities/reflection',
    'common/core/readyToRequestPromise'
],
    function (domains, ajax, generalAttributes, exceptions, reflection, readyToRequestPromise ) {//eslint-disable-line max-params
        var messages = {
            missinggRequiredParams: 'settings parameter is mandatory and should be contains route property',
            invalidDomain: 'serverName parameter should be one of govServiceList domains'
        };
        var govServiceListSettings = {
            method: 'GET',
            dataType: 'json',
            cache: true,
            crossDomain: true
        };
        var webServiceListSettings = {
            method: 'GET',
            dataType: 'xml',
            cache: true,
            crossDomain: true

        };

        //#region private functions
        var checkRequiredParams = function (settings) {
            return (typeof settings === 'object' && 'route' in settings);
        };
        function getDomain(serviceType, serverName) {
            var domain = domains[serviceType][serverName || generalAttributes.getTargetServerName()];
            if (!domain) {
                exceptions.throwFormError(messages.invalidDomain);
            }
            return domain;
        }
        function getRequest(settings, serviceType, defaultSettings) {
            var request = readyToRequestPromise.then(function () {
                if (!checkRequiredParams(settings)) {
                    exceptions.throwFormError(messages.missinggRequiredParams);
                }
                var domain = getDomain(serviceType, settings.serverName);
                settings = reflection.extendSettingsWithDefaults(settings, defaultSettings);
                settings.url = domain + settings.route;
                return ajax.request(settings);
            });
            return request;
        }


        //#endregion

        //#region public functions

        function govServiceListRequest(settings) {
            return getRequest(settings, 'govServiceListDomains', govServiceListSettings);
        }

        function webServiceListRequest(settings) {
            return getRequest(settings, 'listManagerDomains', webServiceListSettings);
        }


        //#endregion
        return {

            /**
          * get govServiceList Request   
          * @method govServiceListRequest
          * @param {json} settings settings for the request, can contain : serverName, route, method ,dataType, cache, crossDomain etc.
          * @example Example usage of govServiceListRequest:
          * var settings = {route:'TSA/GetTime', cache:false};
          * services.govServiceListRequest(settings)
          * @returns {object} promise.
          */
            govServiceListRequest: govServiceListRequest,
            /**
         * get webServiceList Request   
         * @method webServiceListRequest
         * @param {json} settings settings for the request, can contain : serverName, route, method ,dataType, cache, crossDomain etc.
         * @example Example usage of webServiceListRequest:
         * var settings = {route:'xx/xx/xx.aspx/?ID=1', cache:false};
         * services.webServiceListRequest(settings)
         * @returns {object} promise.
        */
            webServiceListRequest: webServiceListRequest

        };
    });

