define(function () {
    var ModularViewModel = require('common/viewModels/ModularViewModel')
    , resources = require('common/components/Grid/resources');
    require('common/ko/fn/defaultValue');
    require('common/ko/fn/config');

   
    var ColumnFilterControl = function (settings) {
        var self = this;

        var model = {
            filteredValue: ko.observable(settings.defaultValue).defaultValue(settings.defaultValue),
            dataField: ko.observable(settings.dataField).defaultValue(settings.dataField)
        };
        ModularViewModel.call(self, model);


        var controlTitle = settings.controlTitle;
        var controlType = settings.controlType;
        var options = settings.options;

        var isSelect = ko.computed(function () {
            return controlType === resources.controlType.select;
        });
        var isInput = ko.computed(function () {
            return controlType ===  resources.controlType.input;
        });
        var isDate = ko.computed(function () {
            return controlType === resources.controlType.date;
        });
        self.isSelect = isSelect;
        self.isInput = isInput;
        self.isDate = isDate;

        self.controlTitle = controlTitle;
        self.controlType = controlType;
        self.options = options;

    };
    ColumnFilterControl.prototype = Object.create(ModularViewModel.prototype);
    ColumnFilterControl.prototype.constructor = ColumnFilterControl;

    var ColumnFilter = function (settings) {
        var self = this;

        var model = {
            columnsFilterControls: ko.observableArray([]).config({ type: ColumnFilterControl, params: {} })
        };
        ModularViewModel.call(self, model);

        var mappingRules = {
            columnsFilterControls: {
                key: function (data) {
                    return ko.unwrap(data.dataField);
                }
            }
        };
        self.setMappingRules(mappingRules);

        var sourceData = settings.data;
        var columns = settings.columns;

        var filterColumns = ko.pureComputed(function () {
            return ko.utils.arrayFilter(columns, function (item) {
                return item.filter;
            });

        });

        function fillColumnsFilterControls() {
            var columnsFilterControls = [];
            ko.utils.arrayForEach(filterColumns(), function (item) {
                columnsFilterControls.push(new ColumnFilterControl(item));
            });
            model.columnsFilterControls(columnsFilterControls);
        }

        fillColumnsFilterControls();

        var data = ko.pureComputed(function () {
            var allOptions = -1;
            if (model.columnsFilterControls().length === 0) {
                return sourceData();
            }
            var filteredData = ko.utils.arrayFilter(sourceData(), function (row) {
                var isFilter = ko.utils.arrayFirst(model.columnsFilterControls(), function (filterItem) {
                    if (filterItem.filteredValue() !== allOptions) {
                        return ko.unwrap(row[filterItem.dataField()]) === filterItem.filteredValue();
                    }
                    else {
                        return filterItem.filteredValue();
                    }
                });
                return isFilter !== null;
            });
            return filteredData;
        });
        self.data = data;
    };

    ColumnFilter.prototype = Object.create(ModularViewModel.prototype);
    ColumnFilter.prototype.constructor = ColumnFilter;

    return ColumnFilter;
});
