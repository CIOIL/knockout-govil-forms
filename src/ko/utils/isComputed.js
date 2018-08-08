/**
 * @namespace ko
 */
define(function () {

    var isInstanceNotExist = function (instance) {
        return (instance === null) || (instance === undefined) || (instance.__ko_proto__ === undefined);
    };
    /**     
     * @memberof ko         
     * @function ko.utils.isComputed
     * @description check object is ko.Computed
     * @param {any} instance - value for checking
     * @returns {boolean} boolean on instance is a ko.Computed
    */
    ko.utils.isComputed = function isComputed(instance) {
        if (isInstanceNotExist(instance)) { return false; }
        return ko.isComputed(instance);
    };

    /**     
     * @memberof ko         
     * @function ko.utils.isWritableComputed
     * @description check object is ko.Computed and is ko.writableObservable
     * @param {any} instance - value for checking
     * @returns {boolean} boolean on instance is a ko.Computed and is ko.writableObservable
    */
    ko.utils.isWritableComputed = function isComputed(instance) {
        if (isInstanceNotExist(instance)) { return false; }
        return ko.isWritableObservable(instance) && ko.isComputed(instance);
    };

});