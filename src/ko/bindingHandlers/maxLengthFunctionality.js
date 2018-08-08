
define(function () {
    var maxLengthFunctionalityUtils = function () {

        var excludeFromLength = function (key) {
            // backspace = 8, delete = 46, arrows = 37,38,39,40  
            var specialCharacters = [8, 46, 37, 38, 39, 40];//eslint-disable-line no-magic-numbers

            return (specialCharacters.indexOf(key) !== -1);//eslint-disable-line no-magic-numbers
        };

        var handleKeydownEvent = function (e, maxLength, element) {
            var key = e.which;

            if (excludeFromLength(key)) {
                return true;
            }
            return Number($(element).val().length) < maxLength;
        };
        return {
            handleKeydownEvent: handleKeydownEvent
        };
    }();

    /**     
  * @memberof ko         
  * @function "ko.bindingHandlers.maxLengthFunctionality"
  * @description custom binding that handles maxlength functoinality for mobile using binding event. 
  * @param valueAccessor - observable or value of maxlength number
  * @param element
  * @example Example usage of maxLengthFunctionality
   on the observable: age: ko.observable('').extend({ maxLength: 3 })
  *  } 
  */
    ko.bindingHandlers.maxLengthFunctionality = {
        init: function (element, valueAccessor) {

            var maxLength = ko.unwrap(valueAccessor);

            $(element).on('keydown', function (e) {
                return maxLengthFunctionalityUtils.handleKeydownEvent(e, maxLength, element);
            });
        }

    };
    return maxLengthFunctionalityUtils;
});