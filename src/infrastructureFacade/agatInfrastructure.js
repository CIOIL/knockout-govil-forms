//Shutdown infrastructure validation (replaced by ko validation)
define([], function () {

    return (function (agatInfrastructure) {
        if (agatInfrastructure && typeof agatInfrastructure.settings === 'function') {
            agatInfrastructure.settings().byPassValidation = true;
        }
    });

});