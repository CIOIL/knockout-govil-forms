
define(['common/viewModels/ModularViewModel',
    'common/utilities/reflection',
    'common/utilities/typeVerifier',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
],
function (ModularViewModel, reflection, typeVerifier, exceptions, exeptionMessages, stringExtension) {//eslint-disable-line max-params

    var RangeViewModel = function (args) {

        var defaultArgs = {
            isRequired: false,
            step: 1,
            initialValue: 0,
            extend: { required: false }
        };

        args = reflection.extendSettingsWithDefaults(args, defaultArgs);
        var self = this;


        var model = {
            selectedValue: ko.observable(args.initialValue).defaultValue(args.selectedValue).extend(args.extend)
        };

        var min = ko.computed(function () {
            return ko.unwrap(args.min);
        });

        var max = ko.computed(function () {
            return ko.unwrap(args.max);
        });

        var step = ko.computed(function () {
            return ko.unwrap(args.step);
        });

        var isRequired = ko.computed(function () {
            return ko.unwrap(args.isRequired);
        });

        var isSelected = function (data) {
            return data === model.selectedValue();
        };
        var setSelectedValue = function (data) {
            model.selectedValue(data);
        };

        var validateNumericParam = function (param) {
            if (!typeVerifier.number(param.val)) {
                exceptions.throwFormError(stringExtension.format(exeptionMessages.invalidParam, param.name));
            }
        };

        var fillArray = function () {
            var arr = [];
            for (var i = 0, j = min(); j <= max(); j += step(), i++) {
                arr[i] = j;
            }
            return arr;
        };

        validateNumericParam({ name: 'min', val: min() });
        validateNumericParam({ name: 'max', val: max() });

        var valuesArray = ko.observableArray(fillArray());

        var precent = 100;
        var stepWidth = function () {
            return precent / (valuesArray().length) + '%';
        };

        var isFocusOnFirst = function (index) {
            return model.selectedValue() === args.initialValue && index === 0;
        };

        var isFocus = function (index) {
            index = ko.unwrap(index);
            return isSelected(valuesArray()[index]) || isFocusOnFirst(index);
        };

        ModularViewModel.call(self, model);

        self.setSelectedValue = setSelectedValue;
        self.isSelected = isSelected;
        self.isRequired = isRequired;
        self.valuesArray = valuesArray;
        self.stepWidth = stepWidth;
        self.isFocus = isFocus;
    };

    RangeViewModel.prototype = Object.create(ModularViewModel.prototype);
    RangeViewModel.prototype.constructor = RangeViewModel;

    return {
        RangeViewModel: RangeViewModel
    };
});