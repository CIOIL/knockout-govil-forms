
define(function () {

    /**     
    * @memberof ko         
    * @function "ko.bindingHandlers.checkbox"
    * @description checkbox to enhance knockout checkbox binding.
    (bind the value  by knockout 'checked' binding).
    
     triggers click event when ENTER key or SPACE key are pressed.
    * @example 
    * checkbox: viewModel.signPrime
  */
    ko.bindingHandlers.checkbox = {
        init: function (element, valueAccessor, allBindings) {

            ko.bindingHandlers.checked.init(element, valueAccessor, allBindings);

            var currentDiv = $(element).closest('div');
            var label = currentDiv.find('label[data-for=' + element.id + ']');
            if (!label[0]) {
                return;
            }

            $(label).on('click', function () {
                if ($(element).attr('disabled')) {
                    return false;
                }
                else {
                    $(element)[0].click();
                    return true;
                }
            });
        }
    };
});
