define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension'
], function () {

    /** Add eventsHandler methods on the window
     * @param {object} eventsHandler eventsHandler methods
     * @returns {undefined}
     */
    var createEventHandler = function (eventsHandler) {
        for (var event in eventsHandler) {
            if (typeof window[event] !== 'function') {
                window[event] = new function () {
                    return eventsHandler[event];
                };
            }
        }
    };

    return {
        createEventHandler: createEventHandler
    };
});