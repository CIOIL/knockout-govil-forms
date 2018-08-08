/**function that define default value to empty ko.observable
* @function  ko.observable.fn.defaultValue
* @param value - value of default
* @example  Example of usage
* observable: ko.observable().defaultValue('aaa');\\ observable() get the defaultValue.
* observable.defaultVal\\ get the value from defaultValue
*/
define(function () {
    ko.observable.fn.enabled = function (value) {

        this.defaultVal = value;

        if (this() === '' || this() === undefined) {
            this(value);
        }

        return this;
    };
});