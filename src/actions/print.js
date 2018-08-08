define(['common/utilities/resourceFetcher'
    , 'common/events/userEventHandler'
    , 'common/external/q'
    , 'common/actions/validate'
    , 'common/core/formPrintFix'
],
    function (resourceFetcher, userEventHandler, Q, validateAction, formPrintFix) { //eslint-disable-line max-params

        const PRINTDELAY = 10;

        const printSuccessCallback = () => {
            formPrintFix.addPrintstyle();
            //alert(labels().printMessage);//TODO replace with dialog
            setTimeout(() => {
                window.print();
            }, PRINTDELAY);
        };


        const printForm = function (publishedData = {}) {
            const validationDefer = Q.defer();
            publishedData.context = 'printForm';
            validateAction.validateForm(validationDefer, publishedData);
            validationDefer.promise.then(function () {
                userEventHandler.invoke({
                    event: 'print',
                    callback: () => {
                        printSuccessCallback();
                    },
                    afterEvent: true,
                    publishedData: publishedData
                });
            });

        };

        return {
            /** print form process - run validateForm action and only if the form is valid continue to print,
                 by publish userBeforePrint event, and if it resolve do print
                * @method <b>printForm</b>
                * @param {object} publishedData - pass data to userBeforePrint event
                */
            printForm
        };
    });