define(function () {
    var observableIsValid = function () {
        return {
            compare: function (actual) {
                var observable = actual;
                return {
                    pass: observable.isValid() === true && observable.error() === null
                };
            }
        };
    };
    var observableIsNotValid = function () {
        return {
            compare: function (actual, ruleMessage) {
                var observable = actual;


                return {
                    pass: observable.isValid() === false && observable.error() === ruleMessage
                };
            }
        };
    };
    return {
        observableIsValid: observableIsValid,
        observableIsNotValid: observableIsNotValid
    };
});

