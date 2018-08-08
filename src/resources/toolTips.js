define(['common/resources/hebrewTooltips'],
    function (_toolTips) {

        return {
            get: function () { return _toolTips; },
            set: function (toolTips) { _toolTips = toolTips; }
        };

    });