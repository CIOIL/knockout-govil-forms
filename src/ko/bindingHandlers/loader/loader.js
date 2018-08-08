define(['common/components/formInformation/formInformationViewModel'],
    function (formInformation) {
        var getValueAccessor = function (valueAccessor) {
            var unwrapValue = ko.unwrap(valueAccessor);
            if (typeof (unwrapValue) === 'function') {
                unwrapValue = ko.unwrap(unwrapValue());
            }
            return !formInformation.serverMode() && unwrapValue;
        };
        ko.bindingHandlers.visibleLoader = {
            update: function (element, valueAccessor, allBindings) {//eslint-disable-line

                var cssSettingsAccessor = function () {
                    var css = {};
                    css['loader-icon'] = getValueAccessor(valueAccessor);
                    return css;
                };
                ko.bindingHandlers.css.update(element, cssSettingsAccessor, allBindings);
            }
        };
    });