
define(function () {
    /**     
 * @memberof ko         
 * @function ko.observable.fn.defaultValue
 * @description function that defines default value to empty ko.observable
 * @param {string} value - value of default
 * @example 
 * observable: ko.observable(defaultValue();\\ observable() get the defaultValue.
 * observable.defaultVal\\ get the value from defaultValue
 * @returns {ko.observable.fn.defaultValue} this.
 */

    var isEmpty = function (observable) {
        return observable === '' || observable === undefined || observable === null || observable.length === 0;
    };

    ko.subscribable.fn.defaultValue = function (value) {

        this.defaultVal = value;
        var observable = this();

        if (isEmpty(observable)) {
            this(value);
        }

        return this;
    };
});