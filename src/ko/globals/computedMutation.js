/** */
define([],
    function () {
        /**
         * @function computedMutation
         * @description wrapps a ko.computed for calling callback on mutation
         * @param {function} callback function contains condition logic
         * @returns {ko.computedMutation} new mutation computed
         */
        ko.computedMutation = function (callback) {
            ko.computed(callback);
            //always return undefined
            return void (0);
        };
    });