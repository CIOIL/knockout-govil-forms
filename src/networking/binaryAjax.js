/** Object for handling ajax request which expect to receive binary data, implemented as a wrapper to networkink/ajax module.
 * binary settings are added / merged with recieved settings
 * makes an ajax request and returns a promise   
  @module binaryAjax 
 * @example Example of usage
 * binaryAjax.request({url:"someURL",method:"GET", responseType:"blob"})
 *     .then(function (response) { //Do something with the response })
 *     .catch(function (ex) { //Do something with the exception })
 *     .done (function () { //always called whether there was a failure or not })
 */
define([
    'common/networking/ajax',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/external/jquery.ajaxTransport'
],
    function (ajax, formExceptions, exceptionToThrow, stringExtension) {//eslint-disable-line max-params
        const defaultSettings = {
            dataType: 'binary',
            processData: false,
            responseType: 'arraybuffer'
        };
        const request = function (settings) {
            if (typeof settings !== 'object') {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.invalidElementTypeParam, 'settings', 'object'));
            }
            var expandedSettings = Object.assign({}, defaultSettings, settings);
            return ajax.request(expandedSettings);
        };
        return { request };
    });