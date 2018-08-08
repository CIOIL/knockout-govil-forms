define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
],
    function (exceptions, exceptionMessages, stringExtension) {
        /**   
        * @memberof ko
        * @function allowEmptyTable
        * @description function that define if ko.observableArray allow 0 rows
        * @param {boolean} value - boolean value, allow empty table or not
        * @returns {object} this
        * @example  Example of usage
        * observableArray: ko.observableArray().allowEmptyTable(true);
        */
        ko.observableArray.fn.allowEmptyTable = function (value) {
            if (typeof (value) !== 'boolean') {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'allowEmptyTable'));
            }
            this.allowEmptyTableVal = value;

            return this;
        };
    });