define(['common/core/generalAttributes',
         'common/viewModels/ModularViewModel',
        'common/ko/bindingHandlers/initialization'
], function (generalAttributesManager, ModularViewModel) {

    var model = {
        bTSFormID: generalAttributesManager.get('tfsFormId'),
        bTSFormDesc: generalAttributesManager.getCleanedFormName(),
        bTSProcessID: ko.observable('')
    };
    var biztalkFieldsViewModel = new ModularViewModel(model);

    return biztalkFieldsViewModel;
});


