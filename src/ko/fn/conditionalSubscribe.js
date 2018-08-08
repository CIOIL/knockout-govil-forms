define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
], function (exceptions, exeptionMessages, stringExtension) {

    /**
     * @memberof ko         
     * @function ko.observable.fn.conditionalSubscribe
     * @description Alternative subscribe that get a condition when to be executed.
     * @param {function} condition - function that return boolean, when function result is true - the subscribe code will be executed
     * @param {function} callBack - The original callback parameter of KO subscribe function
     * @param {function} [callbackTarget=/] - The original callbackTarget parameter of KO subscribe function
     * @param {function} [event=/] - The original event parameter of KO subscribe function
     * @example 
     * observable: ko.observable();
     * observable.conditionalSubscribe(function(){return true;},function(){\\ Do Something....;})
     * observable.conditionalSubscribe(function(){return true;},function(){\\ Do Something....;},null,'beforeChange')
     * @returns {object} The return value of original KO subscribe - subscription object.
     */
    ko.subscribable.fn.conditionalSubscribe = function (condition, callBack, callbackTarget, event) {//eslint-disable-line max-params

        if (typeof condition !== 'function') {
            exceptions.throwFormError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'condition', 'function'));
        }

        return this.subscribe(function (value) {
            if (condition()) {
                callBack(value);
            }
        }, callbackTarget, event);

    };
});
