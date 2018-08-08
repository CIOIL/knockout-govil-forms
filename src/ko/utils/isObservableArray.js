define(function () {

    var isInstanceNotExist = function (instance) {
        return (instance === null) || (instance === undefined) || (instance.__ko_proto__ === undefined);
    };
    /**
     * @function ko.utils.isComputed
     * @memberof ko
     * @description check object is ko.observableArray
     * @param {any} instance - value for checking
     * @returns {boolean} boolean on instance is a ko.observableArray
    */
    ko.utils.isObservableArray = function (instance) {
        if (!isInstanceNotExist(instance)) {
            if (ko.isObservable(instance) && Array.isArray(instance())) {
                return true;
            }
        }
        return false;
    };
});