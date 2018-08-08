/**
 * @module isExtender
 */
define(function () {
    var isInstanceNotExist = function (instance) {
        return (instance === null) || (instance === undefined) || (instance.__ko_proto__ === undefined);
    };
    /**
     * @function
     * @description check object is ko.extender
     * @param {any} instance - value for checking
     * @returns {boolean} boolean on instance is a ko.extender
    */
    ko.utils.isExtender = function isExtender(instance) {
        if (isInstanceNotExist(instance)) { return false; }
        if (instance.__ko_proto__ === ko.dependentObservable) { return true; }
    };
});