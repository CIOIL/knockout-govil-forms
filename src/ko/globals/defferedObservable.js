define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/core/formMode'
],
    function (exceptions, exceptionMessages, stringExtension, formMode) {//eslint-disable-line max-params
        var verifyDeferredValidity = function (deferred) {
            if (typeof deferred !== 'object' || typeof deferred.then !== 'function') {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.invalidParam, 'settings.deferred'));

            }
        };
        /**
       * wrapper to an observable that updated when promise is fulfilled
       * @param {settings} settings - initialValue: value for init observable, deferred: Promise that observable listen to it
       * @returns {ko.defferedObservable} observable
       */
        ko.defferedObservable = function (settings) {

            if (!settings) {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.undefinedParam, 'settings'));

            }
            var initialValue = settings.hasOwnProperty('initialValue') ? settings.initialValue : '';
            var deferred = settings.deferred;
            var deferredInitialValue = settings.deferredInitialValue;

            verifyDeferredValidity(deferred);
            var _actual = ko.observable();

            //the returned computed observable
            var result = ko.computed({
                //always return the actual value
                read: function () {
                    return _actual();
                },
                //write the new value when the promise is fulfilled
                write: function (newValue) {
                    if (formMode.mode() === formMode.validModes.pdf || deferred.isFulfilled()) {
                        var unwrapValue = ko.unwrap(newValue);
                        _actual(unwrapValue);
                    } else {
                        deferred.then(function () {
                            var unwrapValue = ko.unwrap(newValue);
                            _actual(unwrapValue);
                        });
                    }
                    _actual.valueHasMutated();
                }

            });
            //set the initial value of the underlying observable
            _actual(initialValue);

            if (deferredInitialValue) {
                result(deferredInitialValue);
            }

            return result;
        };
    });