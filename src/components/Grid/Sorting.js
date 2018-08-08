define(function () {
    var ModularViewModel = require('common/viewModels/ModularViewModel');
    var tryParse = require('common/utilities/tryParse');

    var SortedGrid = function (settings) {
        var self = this;

        var state = {
            asc: { key: 'asc', right: 1, left: -1  },
            desc: { key: 'desc', right: -1, left: 1 },
            not: { key: 'not' }
        };

        var model = {
            sortKey: ko.observable(),
            sortOrder: ko.observable(state.asc.key)
        };

        ModularViewModel.call(self, model);
        var sourceData = settings.data;
        var columns = settings.columns;

        var sortColumn = ko.pureComputed(function () {
            var column = ko.utils.arrayFirst(columns, function (column) {
                return column.dataField === ko.unwrap(model.sortKey);
            });
            return column;
        });

        function columnClass(column) {
            if (sortColumn() !== column) {
                return state.not.key;
            }
            return model.sortOrder();
        }

        function toggleSortOrder() {
            if (model.sortOrder() === state.asc.key) {
                model.sortOrder(state.desc.key);
            }
            else {
                model.sortOrder(state.asc.key);
            }
        }

        function setSortKey(data) {
            if (data.dataField !== model.sortKey()) {
                model.sortKey(data.dataField);
                model.sortOrder(state.asc.key);
            }
            else {
                toggleSortOrder();
            }
        }

        function getDataField(item, dataField, params) {
            var value = ko.unwrap(item[dataField]);
            if (value) {
                value = tryParse(params.dataType, value, params.format);
            }
            return value;
        }

        var data = ko.pureComputed(function () {
            var sortColumnValue = sortColumn();
            var data = ko.unwrap(sourceData);
            if (sortColumnValue) {
                var dataField = sortColumnValue.dataField;
                return data.sort(function (left, right) {
                    var params = { 'dataType': sortColumnValue.dataType, 'format': sortColumnValue.format };
                    var leftValue = getDataField(left, dataField, params);
                    var rightValue = getDataField(right, dataField, params);
                    return leftValue > rightValue ? state[model.sortOrder()].right : leftValue < rightValue ? state[model.sortOrder()].left : 0;
                });
            }
            return data;
        });

        self.setSortKey = setSortKey;
        self.data = data;
        self.columnClass = columnClass;
    };

    SortedGrid.prototype = Object.create(ModularViewModel.prototype);
    SortedGrid.prototype.constructor = SortedGrid;

    return SortedGrid;
});
