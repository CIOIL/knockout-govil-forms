/** module that is responsible for throwing custom exceptions
@module exceptions 
*/
define(['common/configuration/globalGeneralAttributes']
    , function (generalAttributes) {

        var FormError = function (message) {
            this.message = message;
            this.stack = (new Error()).stack;
        };

        FormError.prototype = new Error();
        FormError.prototype.constructor = FormError;

        var ApplicativeError = function (message) {
            this.message = message;
            this.stack = (new Error()).stack;
        };

        ApplicativeError.prototype = new Error();
        ApplicativeError.prototype.constructor = ApplicativeError;

        var isDebugMode = function (mode) {
            return ((typeof mode === 'string' && mode.toLowerCase() === 'debug'));
        };

        var throwFormError = function (message, mode) {

            if (isDebugMode(mode) || generalAttributes.tfsAppMode === 'debug') {
                alert(message);  //eslint-disable-line no-alert
            }

            throw new FormError(message);
        };

        return {
            /** throw a custom Error object. if in debug mode, alert the error message before throwing  
             * @method throwFormError
             * @param {string} - the error message 
             * @param {string} - optional. The form's mode ("release" or "debug"). If not given, the tfsAppMode in the
             *                   form's general attributes is checked. 
             * @throws {FormError}  - the custom error to be thrown */
            throwFormError: throwFormError,
            /**  
              custom error          
              @type {Object} 
            */
            FormError: FormError,
            /**  
              custom error          
              @type {Object} 
            */
            ApplicativeError: ApplicativeError
        };

    });
