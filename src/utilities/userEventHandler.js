define(['common/utilities/reflection',
    'common/core/exceptions',
    'common/external/q'],
    function (reflection, exceptions, Q) {

        var errorMasseges = {
            errorEventMissing: 'Must be Event to publish',
            errorCallBackMissing: 'Must be callBack function'
        };

        /**
         * publish event with ko.posbox.publish
         * @param {string} eventsSettings - event name
         * @param {function} callback function
         * @param {bool} has event after callback function (optional)
         * @param {object} data send on event (optional)
         * on event create new Q.defer, on event can resolve this defer or reject,
         * if defer is resolve then append callback function.
         */
        var invoke = function (eventsSettings) {

            var defaultSettings = {
                afterEvent: true,
                publishedData: {}
            };

            eventsSettings = reflection.extendSettingsWithDefaults(eventsSettings, defaultSettings);

            if (!eventsSettings.event) {
                throw new exceptions.throwFormError(errorMasseges.errorEventMissing);
            }

            if (!eventsSettings.callback) {
                throw new exceptions.throwFormError(errorMasseges.errorCallBackMissing);
            }

            var configuration = {
                userBeforeEvent: 'userBefore' + eventsSettings.event,
                userAfterEvent: 'userAfter' + eventsSettings.event,
                afterEvent: function () {
                    if (eventsSettings.afterEvent) {
                        ko.postbox.publish(configuration.userAfterEvent, eventsSettings.publishedData);
                    }
                }
            };

            var isTopicSubscribedTo = function (topic) {
                return ko.postbox && ko.postbox.getSubscriptionsCount(topic) > 0;
            };

            var deferred = Q.defer();

            ko.postbox.publish(configuration.userBeforeEvent, { deferred: deferred, publishedData: eventsSettings.publishedData });

            deferred.promise
                .then(eventsSettings.callback)
                .then(configuration.afterEvent);


            if (!isTopicSubscribedTo(configuration.userBeforeEvent)) {
                deferred.resolve();
            }

        };

        return {
            invoke: invoke
        };
    });