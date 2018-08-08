define(function () {
    /**     
    * @memberof ko         
    * @function ko.extenders.defaultValue
    * @description extender if empty value set a default value in observable .
    * @param {string} target - current value
    * @param {string} dVal - default value
    * @returns {void}
    */
    ko.extenders.defaultValue = function (target, dVal) {
        var changeEmptyToDefault = (newValue) => {
            if (!newValue) {
                target(dVal);
            }
        };
        changeEmptyToDefault(target());
        target.subscribe(changeEmptyToDefault);
    };
});