
define(['common/utilities/stringExtension'],
function (stringExtension) {

    //formExceptions = require('common/core/exceptions'),
    //exceptionsMessages = require('common/resources/exeptionMessages');

    /**     
   * @memberof ko         
   * @function ko.extenders.tlpTrim
   * @description extender for remove spaces from text in observable.
   * @param {string} target - current value
   * @param {string} direction - trim direction 
   * @returns {ko.extenders.tlpTrim} result.
   */
    ko.extenders.tlpTrim = function (target, direction) {

        //returns true if the trimmed value is equal to the value before the change 
        var isTrimmedAndUnchanged = function (currentValue, newValue, newValueTrimmed) {
            return (currentValue !== newValue && newValueTrimmed === currentValue);
        };

        var getMethod = function () {
            //trim both sides if direction not specified
            return (typeof stringExtension[direction] === 'function') ? direction : 'trim';
            //formExceptions.throwFormError(stringExtension.format(exceptionsMessages.funcNotExist, direction));
        };

        var result = ko.computed({
            read: function () {
                return target();
            },  //always return the original observables value

            write: function write(newValue) {

                var newValueTrimmed, currentValue = target();

                if (typeof newValue !== 'string') {
                    target(newValue);
                    return;
                }

                newValueTrimmed = stringExtension[getMethod()](newValue);

                //set the observable
                target(newValueTrimmed);

                if (isTrimmedAndUnchanged(currentValue, newValue, newValueTrimmed)) {
                    //send notification to the view about the change
                    target.valueHasMutated();
                }
            }
        });

        //initialize with current value to make sure it is trimmed appropriately
        result(target());

        //return the new computed observable
        return result;
    };
});
