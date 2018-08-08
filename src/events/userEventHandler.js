/// <reference path="../utilities/stringExtension.js" />
/** module that is responsible for publishing before event with promises using ko.posbox.publish and possibly also executes the before event callback and publish an after event.
@module userEventHandler */
define(['common/utilities/reflection',
    'common/core/exceptions',
    'common/utilities/stringExtension',
    'common/external/q'
],
    function (reflection, exceptions, stringExtension, Q) {//eslint-disable-line max-params

        var errorMasseges = {
            errorEventMissing: 'the event to be published is missing',
            errorCallBackMissing: 'a callback function is missing'
        };


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
                userBeforeEvent: 'userBefore' + stringExtension.capitalizeFirstLetter(eventsSettings.event),
                userAfterEvent: 'userAfter' + stringExtension.capitalizeFirstLetter(eventsSettings.event),
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
                .then(function () { eventsSettings.callback(); })
                .then(function () { configuration.afterEvent(); })
                .catch(function (ex) {
                    if (typeof eventsSettings.fcallback === 'function')
                    { eventsSettings.fcallback({ exception: ex, publishedData: eventsSettings.publishedData }); }
                })
                .done();


            if (!isTopicSubscribedTo(configuration.userBeforeEvent)) {
                deferred.resolve();
            }

        };

        return {
            /**
         * publish before event with promises using ko.posbox.publish and possibly also executes the before event callback and publish an after event.
         * If there are no subscribers on the before event or if  promise published by the before event is resolved, the specified callback will be executed
         * and (by default) an after event will be invoked. if a subscriber to the before event rejects the published promise then the callback will not be
         * executed and the after event will not be published.
         * @method invoke
         * @param defaultSettings {object} 
         * @param defaultSettings.callback {function}  - the function to be executed if there are no subscribers to the
         * before event or if the published promise has been resolved.
         * @param {string} defaultSettings.event - the name of the event. will be used with "userBefore" and "userAfter" prefixes.
         * @param {bool} [afterEvent=true] - has event after callback function 
         * @param {function} [fcallback] - the function to be executed in the promise.catch 
         * i.e in case of failure or if the deferred has been rejected
         * @param {object} publishedData - specifies if an after event should be published
         * @throws Will throw an error if either the callback or the event name are not specified. */
            invoke: invoke
        };
    });