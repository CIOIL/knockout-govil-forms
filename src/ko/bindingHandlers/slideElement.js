define([], function () {
    /**     
* @memberof ko         
* @function "ko.bindingHandlers.slideElement"
* @description custom binding that open and close element in slide,  
* @param {ko.observable} valueAccessor:  value should be true or false, open or close element by it.
* @example  Example of usage
* 
  <div data-bind="slideElement: shouldOpen></div>

*/
    ko.bindingHandlers.slideElement = {
        init: function (element, valueAccessor) {
            var value = valueAccessor()();
            if (value) {
                $(element).slideDown('fast');
                return;
            }
            $(element).slideUp('fast');
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor()();
            setTimeout(function () {
                if (value) {
                    $(element).slideDown('fast');
                    return;
                }
                $(element).slideUp('fast');
            }, 0);
        }
    };
});