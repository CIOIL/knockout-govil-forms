
define(['common/core/applyBindingsCompletedPromise'],
    function (applyBindingsCompletedPromise) {

      /**
      * @memberof ko         
      * @function "ko.observable.fn.afterLoadSubscribe"
      * @description Subscribe that will be executed only after real change on the form, and not on view model initialize.
      * @param {function} callBack - The original callback parameter of KO subscribe function
      * @param {function} [callbackTarget] - The original callbackTarget parameter of KO subscribe function
      * @param {function} [event] - The original event parameter of KO subscribe function
      * @example 
      * observable: ko.observable();
      * observable.afterLoadSubscribe(function(){\\ Do Something....;})
      * observable.afterLoadSubscribe(function(){\\ Do Something....;},null,'beforeChange')
      * @returns {object} The return value of original KO subscribe - subscription object.
      */

        ko.subscribable.fn.afterLoadSubscribe = function (callBack, callbackTarget, event) {
            return this.subscribe(function (value) {
                if (applyBindingsCompletedPromise.promise.isFulfilled()) {
                    callBack(value);
                }
            }, callbackTarget, event);

        };
    });
