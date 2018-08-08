
define(['common/components/controls/FormControl',
       'common/utilities/reflection',
       'common/utilities/tryParse',
       'common/accessibility/rangeAccessibility'
],
function (FormControl, reflection, parser) {//eslint-disable-line max-params

    var defaultSettings = {
        args: {
            min: {
                value: 0,
                type: 'number',
                displayName: 'טווח מינימלי'
            },
            max: {
                value: 10,
                type: 'number',
                displayName: 'טווח מקסימלי'
            },
            step: {
                value: 1,
                type: 'number',
                displayName: 'מקדם'
            }
        },
        selectedValue: {
            defaultValue: '',
            initialValue: '',
            validator: function (value) {
                return parser('number', value).toString();
            }
        }
    };

    var RangeViewModel = function (settings) {

        var self = this;

        FormControl.call(self, defaultSettings, settings);

        settings = self.settings;

        var model = {
            selectedValue: ko.observable(self.settings.selectedValue.initialValue).defaultValue(settings.selectedValue.defaultValue).extend(settings.selectedValue.extenders)
        };

        self.setModel(model);

        var args = self.settings.args;

        var min = ko.computed(function () {
            return ko.unwrap(args.min.value);
        });

        var max = ko.computed(function () {
            return ko.unwrap(args.max.value);
        });

        var step = ko.computed(function () {
            return ko.unwrap(args.step.value);
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

        var fillArray = function () {
            var arr = [];
            for (var i = 0, j = min(); j <= max(); j += step(), i++) {
                arr[i] = j.toString();
            }
            return arr;
        };

        var valuesArray = ko.observableArray(fillArray());

        var stepWidth = function () {
            var precent = 100;
            return precent / (valuesArray().length) + '%';
        };

        var isFocusOnFirst = function (index) {
            return model.selectedValue() === settings.initialValue && index === 0;
        };

        var isFocus = function (index) {
            index = ko.unwrap(index);
            return isSelected(valuesArray()[index]) || isFocusOnFirst(index);
        };

        var getAriaCheckedVal = function (data) {
            return isSelected(data) ? 'true' : 'false';
        };

        var getTabindexVal = function (data, index) {
            return isSelected(data) || (model.selectedValue() === settings.defaultValue && ko.unwrap(index) === 0) ? '0' : '-1';
        };
        self.setSelectedValue = setSelectedValue;
        self.isSelected = isSelected;
        self.isRequired = isRequired;
        self.valuesArray = valuesArray;
        self.stepWidth = stepWidth;
        self.isFocus = isFocus;
        self.getAriaCheckedVal = getAriaCheckedVal;
        self.getTabindexVal = getTabindexVal;
    };

    RangeViewModel.prototype = Object.create(FormControl.prototype);
    RangeViewModel.prototype.constructor = RangeViewModel;
    RangeViewModel.defaultSettings = defaultSettings;

    return RangeViewModel;
});