define([
], function () {
    ko.bindingHandlers.checkboxAccessibility = {
        init: function (element, valueAccessor) {
            var  currentCheckboxValue = $(element).val();
            var value = ko.computed(function () {
                var selectedCheckboxArray = ko.unwrap(valueAccessor()());
                return selectedCheckboxArray.some(function (selectedValue) {
                    return currentCheckboxValue === selectedValue;
                });
            });
            ko.applyBindingsToNode(element, { attr: { 'aria-checked': value } });
        }
    };
});