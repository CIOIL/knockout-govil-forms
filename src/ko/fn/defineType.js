define(['common/core/exceptions'], function (exceptions) {
    /**     
 * @memberof ko         
 * @function ko.observable.fn.defineType
 * @description function that defines type to an observable when the wanted shcematype is different than the initial value type.
 * @param {string} value - value of default
 * @example 
 * observable: ko.observable().defineType('number')// sets the schemaType.
 * observable.schemaType// gets the value from schemaType
 * @returns {ko.observable.fn.defineType} this.
 */
    ko.subscribable.fn.defineType = function (value) {

        var notFound = -1;
        var notValidType = 'cannot set property schemaType, value is not a valid type';
        var notImplemented = 'property schemaType is not supported for ko.observableArray';

        var nativeTypes = ['boolean', 'number', 'string'];

        if (ko.isObservableArray(this)) {
            exceptions.throwFormError(notImplemented);
        }

        if (nativeTypes.indexOf(value) !== notFound) {
            this.schemaType = value;
        }
        else {
            exceptions.throwFormError(notValidType);
        }

        return this;
    };

});

