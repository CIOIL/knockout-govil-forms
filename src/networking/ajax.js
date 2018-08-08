/// <reference path="../core/formMode .js" />
/** Object for handling ajax request, implemented as a proxy to jquery ajax.
 * makes an ajax request and returns a promise   
  @module ajax 
 * @example Example of usage
 * ajax.request({url:"someURL",method:"GET"})
 *     .then(function (response) { //Do something with the response })
 *     .then(return tlp.ajax.request({url:"anotherURL",method:"POST"}))
 *     .then(function (response) { //Do something with the response })
 *     .catch(function (ex) { //Do something with the exception })
 *     .done (function () { //always called whether there was a failure or not })
 */

define(['common/external/q',
    'common/core/formMode'
],
    function (Q, formMode) {

        var messages = {
            missinggRequiredParams: 'URL and method (GET/POST) parameters are mandatory',
            callbacksNotAllowed: 'Callback functions are not allowed. used the returned promise instead',
            syncRequestNotAllowed: 'only async requests are supported'

        };

        var notFound = -1;

        var validMethod = function (method) {
            var validMethods = ['GET', 'POST'];

            return validMethods.indexOf(method) !== notFound;
        };

        var checkRequiredParams = function (settings) {
            return (typeof settings === 'object' && 'url' in settings && validMethod(settings['method']));
        };

        var checkForCallbacks = function (settings) {
            return (settings.hasOwnProperty('success') || settings.hasOwnProperty('error'));
        };

        var checkForAsyncRequest = function (settings) {
            if (settings.hasOwnProperty('async') ? settings.async === false : false) {
                throw new Error(messages.syncRequestNotAllowed);
            }
        };

        var updateSettingsToSupportOldjQuery = function (settings) {

            if (typeof jQuery !== 'function' || !jQuery().jquery) {
                return;
            }

            if (jQuery().jquery < '1.9.0') {
                settings.type = settings.method;
            }

        };

        /**   @method request
        * @param {object} settings containning at least a 'url' property and a 'method' ('GET'/'POST') property
        * and can contain any additional option that is supported by jQuery ajax (see http://api.jquery.com/jquery.ajax/).
        * success / error callbacks are not allowed.
        * @returns {object} promise.
        * */
        var request = function (settings) {

            if (!checkRequiredParams(settings)) {
                throw new Error(messages.missinggRequiredParams);
            }

            if (checkForCallbacks(settings)) {
                throw new Error(messages.callbacksNotAllowed);
            }
            checkForAsyncRequest(settings);

            updateSettingsToSupportOldjQuery(settings);

            if (formMode.isServer()) {
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            }
            else {
                return Q($.ajax(settings))
                    .fail(function (error) {
                        error.url = settings.url;
                        error.method = settings.method;
                        throw error;
                    });
            }
            // if (formMode.mode() === formMode.validModes.client) {
        };

        return { request: request };
    });

