define(['common/accessibility/dynamicTableAccessibility'],
    function (dynamicTableAccessibility) {
    
    /**     
   * @memberof ko         
   * @function "ko.bindingHandlers.input"
   * @description Accessibility support when input in a dynamic table - 
     adds  'aria-labelledby' attribute to the input  contains the id of label
   */
        ko.bindingHandlers.input = {
            init: function (element) {
                dynamicTableAccessibility.addAccessibilityAttr(element);
            }
        };
    });

