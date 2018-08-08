/** Object for getting the current time from the server. makes an ajax request and returns a promise.
@module currentTime */

define(['common/resources/domains',
        'common/networking/ajax',
        'common/core/generalAttributes',
        'common/core/exceptions',
        'common/external/q',
        'common/utilities/typeParser',
        'common/utilities/stringExtension',
        'common/networking/services',
        'common/core/domReadyPromise'
],
        function (domains, ajax, generalAttributes, formExceptions, Q, typeParser, stringExtension, services, domReadyPromise) {//eslint-disable-line max-params

            var resources = {
                exeptionMessage: 'serverName parameter should be one of govServiceList domains',
                serviceUrl: 'TSA/GetTime',
                format: '"M/d/yyyy H:mm:ss tt"',//this format must have the quotation marks to support the format like it comming from the service, example of the response: '"11/12/2015 10:46:06 PM"'
                generalDateFormat: 'dd/MM/yyyy',
                invalidFormatException: 'the response {0} is not valid according to the format {1}'
            };

            Object.freeze(resources);

            var request = function request(serverName) {
                var settings = {
                    route: resources.serviceUrl,
                    dataType: 'text',
                    cache: false,
                    serverName: serverName || generalAttributes.getTargetEnvoirment()
                };
                return services.govServiceListRequest(settings);
            };

            var getDateInGeneralFormatPromise = function (serverName, format) {

                var deffer = Q.defer();
                domReadyPromise.promise.then(function () {
                    request(serverName).then(function (response) {
                        var parsingDate = typeParser.date(response, resources.format);
                        if (parsingDate) {
                            deffer.resolve(parsingDate.toString(format || resources.generalDateFormat));
                        }
                        else {
                            throw formExceptions.throwFormError(stringExtension.format(resources.invalidFormatException, response, resources.format));
                        }
                    })
                    .fail(function (error) {
                        deffer.reject(error);
                    });
                });
                return deffer.promise;
            };
            return {
                /**       
               * @method request           
               * @param {string} serverName one of govServiceList domains -optional,the default is targetName from generalAttributes
               * @returns {object} a promise object with current dateTime from esb server.
               * @example Example of usage
               * 
               * currentTime.request();
               * .then(function (response) {
               *      currentDateTime = Date.parseExact(response, tlp.currentTime.resources.format);                 
               *  })    
               */
                request: request,

                /**       
                * @method getDateInGeneralFormatPromise           
                * @param {string} serverName one of govServiceList domains -optional,the default is targetName from generalAttributes
                * @returns {object} a promise object with current dateTime from esb server in dd/MM/yyyy format.
                * @example Example of usage
                * 
                * getParseDatePromise();
                * .then(function (response) {
                *      model.loadingDate(response);                 
                *  })    
                */
                getDateInGeneralFormatPromise: getDateInGeneralFormatPromise,

                /** 
                 * @name resources       
                 * @description resources for currentTime request from esb server.
                 * @type {Object}
                 * @readOnly
                 * @property {string} exeptionMessage .
                 * @property {string} serviceUrl - the url of the action action .
                 * @property {string} format - the format of the responce .
                 */
                resources: resources
            };

        });


