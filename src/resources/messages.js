define(function (require) {
    var _messages = require('common/resources/hebrewMessages');

    return {
        //messages: _messages
        get: function () { return _messages; },
        set: function (messages) { _messages = messages; }

        //todo:
        //get: function (resources) {
        //var lan= globalGeneralAttributes.....;
        //return resources[lan];

    //},
    //set: function (messages) { _messages = messages }
    };
    
});