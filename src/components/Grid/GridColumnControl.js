define(function () {
    var commonReflection = require('common/utilities/reflection'),
        resources = require('common/components/Grid/resources'),
        GridColumn = require('common/components/Grid/GridColumn');
    var GridColumnControl = function (settings) {
        var defaultSettings = {
            controlType: resources.controlType,
            options: '',
            controlTitle: '',
            defaultValue: '',
            filter:false
        };
        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);
        var gridColumnArgs = {
            visible: settings.visible,
            dataType: settings.dataType,
            format: settings.format,
            className: settings.className,
            headerText:settings.headerText,
            dataField:settings.dataField
        };
        GridColumn.call(self, gridColumnArgs);
        self.controlType = settings.controlType;
        self.options = settings.options;
        self.defaultValue = settings.defaultValue;
        self.controlTitle = settings.controlTitle;
        self.filter = settings.filter;
    };
    return GridColumnControl;

});
