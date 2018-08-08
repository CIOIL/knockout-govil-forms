
define(function () {
    var commonReflection = require('common/utilities/reflection'),
        resources= require('common/components/Grid/resources');
    var GridColumn = function (settings) {
        var defaultSettings = {
            visible: true,
            dataType:resources.dataType.string
        };
        var self = this;
        settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);
        self.visible = settings.visible;
        self.dataType = settings.dataType;
        self.format = settings.format;
        self.className = settings.className;
        self.headerText = settings.headerText || settings.dataField;
        self.dataField = settings.dataField;
        self.isAdditionalDetails = settings.isAdditionalDetails || false;
    };
    return GridColumn;
});