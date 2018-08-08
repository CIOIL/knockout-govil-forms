/**
* @module protectedObservable
* @description wrapper to an observable that requires accept/cancel to commit or reset value
*/
define(function () {
    /**
   * @function
   * @description  wrapper to an observable that requires accept/cancel to commit or reset value
   * taken from http://www.knockmeout.net/2011/03/guard-your-model-accept-or-cancel-edits.html
   * @param {any} initialValue - value for init observable
   * @returns {ko.protectedObservable} observable
   */
    ko.protectedObservable = function (initialValue) {
        var _temp = initialValue;
        var _actual = ko.observable(initialValue);

        var result = ko.dependentObservable({
            read: _actual,
            write: function (newValue) {
                _temp = newValue;
            }
        }).extend({ notify: 'always' }); //needed in KO 3.0+ for reset, as computeds no longer notify when value is the same

        result.commit = function () {
            if (_temp !== _actual()) {
                _actual(_temp);
            }
        };

        result.reset = function () {
            _actual.valueHasMutated();
            _temp = _actual();
        };

        return result;
    };
});