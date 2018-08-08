/**
* @description collection of utility functions.
* @module argumentsChecker
*/


define(['common/core/exceptions',
    'common/utilities/stringExtension',
    'common/resources/exeptionMessages'
],
    function (formExceptions, stringExtension, exeptionMessages) {

        /**
      *  <b>checkRequiredArgForFunction</b>
      * @description validating the presence of required parameter
      * @param {object} args - params object
      * @param {string} parameterName - name of the required parameter
      * @param {string} functionName - the invoking function name
      * @throws {FormError} param not exist
      * @returns {boolean} true
      * @inner
      */
        var checkRequiredArgForFunction = function (args, parameterName, functionName) {
            if (!args || !args.hasOwnProperty(parameterName)) {
                var exeptionToThrow = stringExtension.format(exeptionMessages.funcInvalidParams, parameterName, functionName);
                throw new formExceptions.throwFormError(exeptionToThrow);
            }
            else { return true; }

        };

        /**
    * @function <b>checkAllRequiredArgs</b>
    * @description validating the presence of multiple required parameters
    * @param {object} args - params object
    * @param {array} requiredParams - an array containing the names of the required parameters
    * @param {string} functionName - the invoking function name
    * @throws {FormError} param not exist
    * @inner
    */

        var checkAllRequiredArgs = function (args, requiredParams, functionName) {
            var paramExist = true;
            $.each(requiredParams, function (i, paramName) {
                paramExist = checkRequiredArgForFunction(args, paramName, functionName);
            });
            return paramExist;
        };

        return {
            checkRequiredArgForFunction: checkRequiredArgForFunction,
            checkAllRequiredArgs: checkAllRequiredArgs
        };
    });