define(['common/core/exceptions', 'common/accessibility/utilities/accessibilityMethods'],
    function (formExceptions, accessibilityMethods) {

        ko.bindingHandlers.ariaLabelForRangeGroup = {
            init: function (element, valueAccessor) {
                valueAccessor();
                var errorMessage = {
                    notFoundRangeContainer: 'wrong HTML - there no range-container.',
                    notFoundLabel: 'wrong HTML- there no label under range-container.'
                };
                var rangeContainer = $(element).closest('.control-container');
                if (!rangeContainer) {
                    formExceptions.throwFormError(errorMessage.notFoundRangeContainer);
                }
                var label = $(rangeContainer).find('label')[0];
                if (!label) {
                    formExceptions.throwFormError(errorMessage.notFoundLabel);
                }
                accessibilityMethods.addingAriaLabelledBy(label, element);
            }
        };
    });