define([
    'common/components/inlinePopup/resources',
    'common/ko/bindingHandlers/slideElement'
], function (resources) {
    /**     
* @memberof ko         
* @function "ko.bindingHandlers.togglePopupModal"
* @description custom binding that open and close popup modal,  
* @param {ko.observable} valueAccessor:  value should be true or false.
* @example  Example of usage
* 
  <div data-bind="togglePopupModal: shouldOpen></div>

*/
    ko.bindingHandlers.togglePopupModal = {
        update: function (element, valueAccessor) {
            var value = valueAccessor()();
            if (value) {
                if (!$(resources.modalId)[0]) {
                    $('body').append(resources.modalTemplate);
                }
                $(resources.modalId).height($(document).height());
            }
            else {
                $(resources.modalId).remove();
            }

        }
    };

});