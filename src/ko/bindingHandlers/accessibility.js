define(['common/accessibility/dynamicTableAccessibility'],
    function (dynamicTableAccessibility) {

        /**     
       * @memberof ko         
       * @function "ko.bindingHandlers.accessibility"
       * @description Accessibility support when element in a dynamic table - 
         adds  'aria-labelledby' attribute to the input  contains the id of label
       */
        ko.bindingHandlers.accessibility = {
            init: function (element) {
                if ($(element).parents('table[tfsstaticrows]').length > 0) {
                    dynamicTableAccessibility.addAccessibilityAttr(element);
                }
            }
        };

        ko.bindingHandlers.addDescription = {
            update: function (element, valueAccessor) {
                var newDescription = valueAccessor();
                var descriptions;
                if (!element.getAttribute('aria-describedby')) {
                    element.setAttribute('aria-describedby', newDescription);
                }
                else {
                    descriptions = element.getAttribute('aria-describedby');
                    descriptions += ' ' + ko.unwrap(newDescription);
                    element.setAttribute('aria-describedby', descriptions);
                }
            }
        };
    });

