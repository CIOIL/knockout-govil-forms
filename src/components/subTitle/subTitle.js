define(['common/utilities/reflection',
    'common/components/formInformation/formInformationViewModel',
    'common/components/subTitle/texts',
    'common/components/toggleLanguagesButton/toggleLanguagesButton',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/bindingHandlers/initialization'
], function (reflection, formInformation, texts, toggleLanguages) {//eslint-disable-line max-params 

    var labels = ko.multiLanguageObservable({ resource: texts });

    var subTitleViewModel = {};

    var defaultSettings = {
        formNameResources: { },
        avaliableLanguages: []
    };

    var setFormTitle = function (settings) {
        settings = reflection.extendSettingsWithDefaults(settings, defaultSettings);

        labels.resource(reflection.extendSettingsWithDefaults(settings.formNameResources, labels.resource()));

        formInformation.availableLanguages(settings.avaliableLanguages);

        subTitleViewModel.toggleLanguagesButton = toggleLanguages.createButton(settings.avaliableLanguages);
    };

    /**
    *@name formInformation :Object
    *@description public reference to formInformationViewModel
    */
    subTitleViewModel.formInformation = formInformation;

    /**
     * @name labels :Object
     * @description multiple language resources for subTitles
     */
    subTitleViewModel.labels = labels;
    /**
    * @function setFormTitle
    * @description override default formName resources
    * @param {Object} settings of multiple language object 
    * @example formNameResources: { hebrew : { formName: 'טופס דוגמא'}, english : { formName: 'ExampleForm'}},
    *          avaliableLanguages: ['hebrew', 'english'] };
    */
    subTitleViewModel.setFormTitle = setFormTitle;


    return subTitleViewModel;
});