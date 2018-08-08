define(['common/events/userEventHandler'
    , 'common/external/q'
    , 'common/infrastructureFacade/tfsMethods'
    , 'common/components/dialog/dialog'
    , 'common/ko/globals/multiLanguageObservable'],
    function ( userEventHandler, Q, tfsMethods, dialog) { //eslint-disable-line max-params
        const resources = {
            hebrew: {
                validationText: 'בודק תקינות הטופס',
                validateSuccessMessage: 'נתוני הטופס תקינים'
            },
            english: {
                validateSuccessMessage: 'This form\'s data is valid.',
                validationText: 'Validating the form...'
            },
            arabic: {
                validateSuccessMessage: 'تفاصيل النموذج صحيحة',
                validationText: 'يفحص صلاحية النموذج'

            }
        };

        const labels = ko.multiLanguageObservable({ resource: resources });

        const validateForm = function (validationDefer = Q.defer(), settings = {}) {
            if (!settings.context) {
                settings.context = 'validateForm';
            }
            Object.assign(settings, { validateSuccessMessage: labels().validateSuccessMessage });

            userEventHandler.invoke({
                event: 'validateForm',
                callback: function () {
                    if (!settings.context || settings.context === 'validateForm') {
                        dialog.alert({ message: settings.validateSuccessMessage });
                    }
                    validationDefer.resolve();
                }, fcallback: function (err) {
                    validationDefer.reject(err);
                },
                afterEvent: true,
                publishedData: settings
            });
        };

        return {
            /** run validateForm action by publish userBeforePrint event.
            define callback that open dialog with success message,and resolve validationDefer parameter.
            define fcallback that reject validationDefer parameter
            (the callback and fcallback run by userEventHandler.invoke mechanism)
            * @method <b>validateForm</b>
            * @param {function} validationDefer
            * @param {object} settings - optional. this object pass to userBeforeValidateForm subscriber in form
              settings structure : {validateSuccessMessage: custom success message as string , context: custom context as string, more....},
            */
            validateForm
        };
    });