define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
],
    function (exceptions, exceptionMessages, stringExtension) {
        /**   
        * @memberof ko
        * @function minLength
        * @description function that define min length on ko.observableArray
        * @param {integer} value - value of minLength
        * @returns {object} this
        * @example  Example of usage
        * observableArray: ko.observableArray().minLength(3);\\ observable() get the defaultValue.
        * observable.minLenghVal\\ get the value from minLengh
        */
        ko.observableArray.fn.minLength = function (value) {
            if (!(value === parseInt(value, 10) && value >= 0)) {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minLength'));
            }
            this.minLengthVal = value;

            return this;
        };
    });