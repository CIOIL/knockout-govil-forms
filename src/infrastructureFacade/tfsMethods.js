define(['common/core/generalAttributes',
    'common/infrastructureFacade/agformMethods',
    'common/infrastructureFacade/govFormMethods'
], function(generalAttributes, agFormMethods, govFormMethods) {

    if (generalAttributes.isGovForm()) {
        return govFormMethods;
    }
    return agFormMethods;

});

