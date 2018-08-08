define(['common/external/q'
],
function (Q) {

    var handelDialog = function (settings) {
        //var Q = require('common/external/q');
        var defer = Q.defer();
        var buttons = {};
        buttons[settings.buttons.ok] = function ok() {
            defer.resolve(); //on Yes click, end deferred state successfully with yes value
            $(this).dialog('close');
        };
        buttons[settings.buttons.cancel] = function cancel() {
            defer.reject(); //on No click end deferred successfully with no value
            $(this).dialog('close');
        };

        $('<div></div>').appendTo('body')
           .html('<div><h4>' + settings.question + '</h4></div>')
           .dialog({
               modal: true,
               title: '',
               autoOpen: true,
               width: 300,
               resizable: false,
               buttons: buttons,
               close: function () {
                   $(this).remove();
               }
           });
        return defer.promise; //important to return the deferred promise
    };

    return {
        handelDialog: handelDialog
    };
});