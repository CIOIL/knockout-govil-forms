
define(['common/accessibility/radioGroupAccessibilityMethod'], function (radioGroupAccessibilityMethod) {

    var isNeedTabindex = function (element, valueAccessor) {
        var currentRadioValue = ko.unwrap(valueAccessor()());
        var radioName = $(element).attr('name');
        var isCheckedRadio = $('input[name=' + radioName + ']:checked').length > 0;
        var isFirstRadioInGroup = $('input[name=' + radioName + ']:first').val() === $(element).val();
        var isElementEqualToRadioValue = radioGroupAccessibilityMethod.isStringEqual($(element).val(), currentRadioValue);
        return (isElementEqualToRadioValue || (!isCheckedRadio && isFirstRadioInGroup));
    };

    ko.bindingHandlers.radioGroupAccessibility = {
        init: function (element, valueAccessor) {
            var value = ko.computed(function () {
                return $(element).val() === ko.unwrap(valueAccessor()()) ? 'true' : 'false';
            });
            var tabindexValue = ko.computed(function () {
                return isNeedTabindex(element, valueAccessor) ? '0' : '-1';
            });
            ko.applyBindingsToNode(element, { attr: { 'aria-checked': value } });
            ko.applyBindingsToNode(element, { attr: { 'tabindex': tabindexValue } });
        }
    };
});