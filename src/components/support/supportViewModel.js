define(['common/viewModels/ModularViewModel',
        'common/components/support/texts',
        'common/networking/ajax',
        'common/ko/bindingHandlers/initialization',
        'common/ko/globals/multiLanguageObservable'
], function (ModularViewModel, texts, ajax) {

    var model = {
        phone: ko.observable(),
        activityTime: ko.observable(),
        mail: ko.observable()
    };
    var supportViewModel = new ModularViewModel(model);

    var setSupportInformation = function (supportInformationResponse) {
        supportInformationResponse.forEach(function (item) {
            model[item.key](item.data);
        });
    };


    const getPrefix = () =>  'https://xxx.gov.il';

    const requestSettings = {
        url: getPrefix() + '/govservicelist/xxx',
        method: 'POST',
        data: { listName: 'SupportInformation' }
    };
    var getSupportInformationPromise;

    (function initSupportInformation() {
        getSupportInformationPromise = ajax.request(requestSettings).then(function (response) {
            if (response && response.Data) {
                setSupportInformation(response.Data.List);
            }
        });
    })();

    supportViewModel.labels = ko.multiLanguageObservable({ resource: texts });
    supportViewModel.getSupportInformationPromise = getSupportInformationPromise;
    return supportViewModel;

});