/** module that is responsible for converting from one structure to another
@module conversion */
define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/utilities/reflection'
],
 function (exceptions, exeptionMessages, stringExtension, reflection) {//eslint-disable-line max-params
     function jsonToQueryString(jsonData) {
         if (!(typeof jsonData === 'object')) {
             exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'jsonToQueryString'));
         }
         return decodeURIComponent($.param(jsonData));
     }

     function jsonToKeyValuePair(jsonData, keySeparator, pairSeparator) {

         if (!(typeof jsonData === 'object')) {
             exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'jsonToKeyValuePair'));
         }

         keySeparator = keySeparator || ':';
         pairSeparator = pairSeparator || ';';

         function concatKeysToValues() {
             var outPutArray = [];
             for (var key in jsonData) {
                 if (jsonData.hasOwnProperty(key)) {
                     outPutArray.push(key + keySeparator + jsonData[key]);
                 }
             }
             return outPutArray;
         }

         return concatKeysToValues().join(pairSeparator);

     }

     function jsonToBinding(jsonData) {
         return this.jsonToKeyValuePair(jsonData, ':', ';');
     }


     function keyValuePairsToObject(keyValuePairs, pairSeparator, keySeparator) {

         if (!(typeof keyValuePairs === 'string')) {
             exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'keyValuePairsToObject'));
         }

         pairSeparator = (typeof pairSeparator === 'string') ? pairSeparator : ';';
         keySeparator = (typeof keySeparator === 'string') ? keySeparator : ':';


         var convert = function () {
             var pairsArray = keyValuePairs.split(pairSeparator),
                 pair, separatorIndex, key, value, i,
                 notFound = -1,
                 target = {};

             for (i = 0; i < pairsArray.length; i++) {

                 pair = pairsArray[i];

                 // using index and not another split to allow values that contain the delimiter
                 separatorIndex = pair.indexOf(keySeparator);

                 if (separatorIndex === notFound) {
                     continue;
                 }

                 key = pair.substr(0, separatorIndex);
                 value = pair.substr(separatorIndex + 1);

                 target[key] = value;
             }

             return target;
         };

         return convert();
     }

     function comboSettingsToTfsBind(binding, queryString) {
         var urlBind = '', settings;

         if (!(typeof binding === 'object')) {
             exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'comboSettingsToTfsBind'));
         }

         if (binding.queryString !== undefined) {
             queryString = reflection.extendSettingsWithDefaults(queryString, binding.queryString);
         }

         if (binding.url !== undefined) {
             urlBind = binding.url + '?' + this.jsonToQueryString(queryString);
         }

         settings = reflection.extendSettingsWithDefaults({ url: urlBind }, binding);

         delete settings.queryString;

         return this.jsonToBinding(settings);
     }

     function base64ToArrayBuffer(base64) {
         let binaryString;
         try {
             binaryString = window.atob(base64);
         } catch (e) {
             exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'base64ToArrayBuffer'));
         }
         const len = binaryString.length;
         const bytes = new Uint8Array(len);//eslint-disable-line no-undef
         for (let i = 0; i < len; i++) {
             bytes[i] = binaryString.charCodeAt(i);
         }
         return bytes.buffer;
     }
     return {
         /** converts object to standard decoded QueryString  
          * @method jsonToQueryString    
          * @param {object} jsonData - the object to be converted
          * @returns {string}  - the standard query string
          * @example: conversion.jsonToQueryString({name:avi, age:30}) will output 
          *           the string "name=avi&age=30" */
         jsonToQueryString,
         /** serializes object to a string of key-value pairs delimited by ":" and ",".      
         * @method jsonToBinding    
         * @param {object} jsonData - the object to be serialized
         * @returns {string}  - the desrialized object
         * @example: conversion.jsonToKeyValuePair({name:avi, age:30}) will output 
         *           the string "name:avi,age:30" */
         jsonToBinding,
         /** serializes object to a string of key-value pairs.      
         * @method jsonToKeyValuePair    
         * @param {object} jsonData - the object to be serialized
         * @param {string} [keySeparator= ":"] - the desired separator between the key and its value in the output string
         * @param {string} [pairSeparator= ";"] - the desired separator between the pairs in the output string       
         * @returns {string}  - the desrialized object
         * @example: conversion.jsonToKeyValuePair({name:avi, age:30},"|","-") will output 
         *           the string "name-avi|age-30" */
         jsonToKeyValuePair,
         /** deserializes a string of key-value pairs.      
         * @method keyValuePairsToObject    
         * @param {string} keyValuePairs - the pairs to be deserialized
         * @param {string} [pairSeparator= ";"] - the separator between the pairs
         * @param {string} [keySeparator= ":"] - the separator between the key and its value
         * @returns {object}  - the desrialized object
         * @example: conversion.keyValuePairsToObject("name-avi|age-30","|","-") will output 
         *           the object {name:avi, age:30} */
         keyValuePairsToObject,
         /** * this method convert the given definitions to a tfsBind format 
          * (concat the url with the queryString)
          * @param {object} binding - object with the basic information required by
          * the tfsBindFormat (url, text, value, etc.)
          * @param {object} queryString - expresses the condition by which data is retrieved by the tfsBind
          * @returns {string}  - tfsBind string */
         comboSettingsToTfsBind,
         /** * this method convert the given base64 string to bytes array
          * @param {string} base64 - string by base64 format
          * @returns {ArrayBuffer}  - bytes array */
         base64ToArrayBuffer
     };

 });