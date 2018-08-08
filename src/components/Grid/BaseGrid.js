define(function () {
    var ModularViewModel = require('common/viewModels/ModularViewModel'),
        commonReflection = require('common/utilities/reflection'),
        formExceptions = require('common/core/exceptions'),
        BaseItemType = require('common/components/Grid/BaseItemType'),
        stringExtension = require('common/utilities/stringExtension'),
        exceptionsMessages = require('common/resources/exeptionMessages'),
        resources = require('common/components/Grid/resources');
    require('common/ko/globals/multiLanguageObservable');
    require('common/ko/bindingHandlers/checkbox');

    var texts = {
        hebrew: {
            noDataFound: 'לא נמצאו תוצאות'
        },
        english: {
            noDataFound: 'no data found'
        }
    };


    var textsResource = ko.multiLanguageObservable({ resource: texts });


    var Grid = function (settings) {
        var defaultSettings = {
            isCheckBoxColumn: false,
            isRowIndex: true,
            isPrint: true,
            isPDF: true,
            data: ko.observableArray([])
        };

        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);

        var setDataType = function () {
            if (!settings.itemType) {
                throw formExceptions.throwFormError(stringExtension.format(exceptionsMessages.isRequired, 'itemType'));
            }
            if (!(settings.itemType.prototype instanceof BaseItemType)) {
                throw formExceptions.throwFormError(resources.errors.itemTypeIsNotBaseItemType);
            }
            settings.data.config({ type: settings.itemType });
        };
        setDataType();


        var columns = settings.columns;

        var visibleColumns = ko.pureComputed(function () {
            return ko.utils.arrayFilter(columns, function (item) {
                return item.visible;
            });
        });

        var columnsInGrid = ko.pureComputed(function () {
            return ko.utils.arrayFilter(columns, function (item) {
                return item.visible && !item.isAdditionalDetails;
            });

        });

        var hasAdditionalDetails = ko.pureComputed(function () {
            return ko.utils.arrayFilter(columns, function (item) {
                return item.isAdditionalDetails;
            }).length > 0;

        });

        var columnsInGridCount = ko.pureComputed(function () {
            var rowIndexColumn = settings.isRowIndex ? 1 : 0;
            var checkBoxColumn = settings.isCheckBoxColumn ? 1 : 0;
            var additionalDetailsColumn = hasAdditionalDetails() ? 1 : 0;
            return columnsInGrid().length + rowIndexColumn + checkBoxColumn + additionalDetailsColumn;
        });

        var model = {
            data: settings.data,
            selectedItems: ko.observableArray([]),
            selectAll: ko.observable(false)
        };

        ModularViewModel.call(self, model);

        model.selectAll.subscribe(function (value) {
            if (value) {
                var selectedItemsArray = [];
                model.data().forEach(function (item) {
                    selectedItemsArray.push(ko.unwrap(item[settings.keyFieldName]).toString());
                });
                model.selectedItems(selectedItemsArray);
            }
            else {
                model.selectedItems([]);
            }
        });


        self.visibleColumns = visibleColumns;
        self.columnsInGrid = columnsInGrid;
        self.hasAdditionalDetails = hasAdditionalDetails;
        self.columnsInGridCount = columnsInGridCount;
        self.keyFieldName = settings.keyFieldName;
        self.isCheckBoxColumn = settings.isCheckBoxColumn;
        self.isRowIndex = settings.isRowIndex;
        self.isPrint = settings.isPrint;
        self.isPDF = settings.isPDF;
        self.textsResource = textsResource;
    };

    Grid.prototype = Object.create(ModularViewModel.prototype);
    Grid.prototype.constructor = Grid;

    return Grid;
});
