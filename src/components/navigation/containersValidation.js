define(['common/external/q'], function (Q) {
    var getInvalidContainers = function (containersList, useShouldBeValidated, validateBySaveAction) {
        var allValidationPromises = [];
        allValidationPromises = ko.unwrap(containersList).map(function (container) {
            var containerValidationState = function () {
                var localContainer = container;
                return function () {//eslint-disable-line consistent-return
                    if (ko.unwrap(localContainer.isEnabled)) {
                        if (useShouldBeValidated) {
                            return { container: localContainer, isValidState: localContainer.shouldBeValidated() ? localContainer.setValidationState(validateBySaveAction) : true };
                        }
                        return { container: localContainer, isValidState: localContainer.setValidationState(validateBySaveAction) };
                    }
                };
            }();
            return Q.fcall(containerValidationState);
        });
        return Q.all(allValidationPromises);
    };
    return { getInvalidContainers: getInvalidContainers };
});