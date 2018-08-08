define([
    'common/components/formInformation/formInformationViewModel',
    'common/core/generalAttributes',
    'common/resources/eventNames',
    'common/external/q'

], function (formInformation, generalAttributes, eventNames, Q) {//eslint-disable-line max-params
    const invoke = () => {
        const fireUserBeforePrint = () => {
            var deferred = Q.defer();
            ko.postbox.publish('userBeforePrint', { deferred: deferred, context: eventNames.saveAsPdf });
        };
        const replaceStyles = () => {
            var printStyles = $('link[media="print"]');
            printStyles.removeAttr('media');
        };

        if (generalAttributes.isGovForm() && formInformation.pdfMode()) {
            fireUserBeforePrint();
            replaceStyles();
            
        }
    };
    return {invoke};
});