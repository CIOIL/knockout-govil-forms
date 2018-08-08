define(function (require) {

    var infrastructureGlobals = require('infrastructureGlobals');

    var selectors = {
        printToolbar: '#PrintToolbar',
        toolbarInstructions: '.toolbar',
        agforms2HtmlInstructions: '.agform2html'
    };

    function setPrintInstructions(printToolbar) {
        printToolbar = printToolbar || selectors.printToolbar;
        var printIns = $(printToolbar);
        if (printIns.length > 0) {
            if (infrastructureGlobals.isToolbarOn()) {
                printIns.find(selectors.toolbarInstructions).removeClass('hide');
            }
            else {
                printIns.find(selectors.agforms2HtmlInstructions).removeClass('hide');
            }
        }
    }

    return {
        setPrintInstructions: setPrintInstructions
    };
});