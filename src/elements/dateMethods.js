define(['common/elements/govFormsDateMethods',
        'common/elements/agFormsDateMethods',
        'common/core/generalAttributes'
], function (govFormsDateMethods, agFormsDateMethods, generalAttributes) {

    const api = {
        govForm: govFormsDateMethods,
        agForm: agFormsDateMethods
    };

    return generalAttributes.isGovForm() ? api.govForm : api.agForm;

});
