/** 
*
* @module formPrintFix 
* @description module that holds functions to set the form to print mode and return it to screen mode.
* <br /> subscribed to formInformation.printMode and on changes invokes the proper function according to the form mode. 
*/

define(['common/components/formInformation/formInformationViewModel',
        'common/elements/textAreaAdjuster',
        'common/elements/selectMethods',
        'common/infrastructureFacade/tfsMethods',
        'common/core/generalAttributes'
], function (formInformation, textAreaAdjuster, selectMethods, tfsMethods, generalAttributes) { //eslint-disable-line max-params
    const addPrintstyle = function () { //eslint-disable-line complexity
        const dynamicPrintStyleElement = $('head').find('#dynamicPrintStyle');
        if (dynamicPrintStyleElement.length > 0) {
            return;
        }
        if (formInformation.pdfMode()) {
            dynamicPrintStyleElement.remove();
            return;
        }
        const printSetup = generalAttributes.get('printSetup');
        if (!printSetup.get('marginSettings')) {
            return;
        }
        const marginSettings = Object.assign({}, printSetup.get('marginSettings'));
        const styleString = `${marginSettings.top || 'auto'} ${marginSettings.right || 'auto'} ${marginSettings.bottom || 'auto'} ${marginSettings.left || 'auto'}`;
        const styleTag = `<style type='text/css' id='dynamicPrintStyle'>@page { margin: ${styleString};} </style>`;
        $(styleTag).appendTo($('head'));
    };
    
    var printFixExtension = {
        /**
    * @function fixElements
    * @description applies changes on controls to adjust to print mode.
    */
        fixElements: function () {
            textAreaAdjuster.expandToFitContent();
           
        },
        /**
       * @function rollBackChanges
       * @description rolls back changes on controls to adjust to screen mode.
       */
        rollBackChanges: function () {
            textAreaAdjuster.returnToOriginalSize();

        }
    };


    /**
     * @function changeToPrintMode
     * @description sets the form to print mode.
     * @returns {changeToPrintMode} function
     * <br /> calls fixElements of the infrastracture and then the custom fixElements
     */
    //function changeToPrintMode(deferred) {//eslint-disable-line no-unused-vars
    function changeToPrintMode() {
        tfsMethods.fixElements(); //eslint-disable-line no-undef
        setTimeout(function () {
            printFixExtension.fixElements();
        }, 1);

        // deferred.resolve()
    }

    /**
    * @function returnToScreenMode
    * @description returns the form to screen mode.
    * <br /> calls the custom rollBackChanges of the infrastracture and then the infrastracture rollBackChanges
    */

    function returnToScreenMode() {
        printFixExtension.rollBackChanges();
        tfsMethods.rollBackChanges(); //eslint-disable-line no-undef
        return true;
    }

    //formInformation.printMode.subscribe(function (isPrintMode) {
    //    if (isPrintMode) {
    //        changeToPrintMode();
    //    }
    //    else {
    //        returnToScreenMode();
    //    }
    //});
    return {
        changeToPrintMode: changeToPrintMode,
        returnToScreenMode: returnToScreenMode,
        addPrintstyle: addPrintstyle
    };
});