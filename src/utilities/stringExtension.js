/** module that adds utility functions for strings.
@module stringExtension */
define(['common/core/exceptions'],
    function (formExceptions) {

        var format = function (source, params) { //eslint-disable-line complexity

            if ($.type(source) !== 'string') {
                formExceptions.throwFormError('invalid source or source is missing');
            }

            if ($.type(params) === 'object') {
                formExceptions.throwFormError('invalid params');
            }

            if (arguments.length === 1) {
                return source;
            }
            if (arguments.length > 2 && params.constructor !== Array) {
                params = $.makeArray(arguments).slice(1);
            }
            if (params.constructor !== Array) {
                params = [params];
            }
            $.each(params, function (i, n) {
                source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), function () {
                    return n;
                });
            });
            return source;
        };

        var trim = function (str) {
            return str.trim();
        };

        var trimLeft = function (str) {
            return (str.trimLeft) ? str.trimLeft() : str.replace(/^\s+/, '');
        };

        var trimRight = function (str) {
            return (str.trimRight) ? str.trimRight() : str.replace(/\s+$/, '');
        };

        var padLeft = function (str, char, length) {
            var mergeDefaults = function () {
                str = str ? str.toString() : '';
                char = char || '0';
                length = length || 2;
            };
            mergeDefaults();
            while (str.length < length) {
                str = char + str;
            }
            return str;
        };

        var capitalizeFirstLetter = function (str) {
            str = str ? str.toString() : '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        //polyfill for includes String method which is not defined in IE
        if (!String.prototype.includes) {
            String.prototype.includes = function (search, start) {//eslint-disable-line no-extend-native

                if (typeof start !== 'number') {
                    start = 0;
                }

                if (start + search.length > this.length) {
                    return false;
                } else {
                    return this.indexOf(search, start) !== -1;//eslint-disable-line no-magic-numbers
                }
            };
        }

        return {
            /**  insert string parameters to another string.
           * @method format    
           * @param {string} source - the string to which the string parameters will be inserted
           * @param {(string|Array)} params - the strings that will be inserted correspondingly to the source
           * @returns {string}  - A copy of format in which the format items have been replaced by the string representations of the corresponding params.
           * @example: stringExtension.fprmat('function {0} received invalid parameter {1}',['calculateInterest','baseInterest']) will output 
           *           the string "function calculateInterest received invalid parameter baseInterest" */
            format: format,
            /**  removes whitespace from both the left and the right sides of a string. 
            * Uses browser native implementation.
           * @method trim    
           * @param {string} str - the string from which whitespace will be removed
           * @returns {string}  - the trimmed string */
            trim: trim,
            /**  removes whitespace from the left end of a string. 
            * Uses browser native implementation if it exists.
           * @method trimLeft    
           * @param {string} str - the string from which whitespace will be removed
           * @returns {string}  - the trimmed string */
            trimLeft: trimLeft,
            /**  removes whitespace from the right end of a string. 
            * Uses browser native implementation if it exists.
           * @method trimRight
           * @param {string} source - tthe string from which whitespace will be removed
           * @returns {string}  str - the trimmed string */
            trimRight: trimRight,
            /**  add chars to the left of string. 
            * @method padLeft
            * @param {string} str - the string from which chars will be added
            * @param {string} char - the char to be added to the left
            * @param {number} length - number of chars the string contains after the padding
            * @returns {string}  str - the padding string 
            * @example: stringExtension.padLeft('3','0',2) will output '03'
         * */
            padLeft: padLeft,

             /** capitalize the first letter of a string.
            * @method capitalizeFirstLetter
            * @param {string} str - tthe string from which whitespace will be removed
            * @returns {string}  str - the modified string */
            capitalizeFirstLetter: capitalizeFirstLetter
        };
    });