define(['common/viewModels/languageViewModel',
        'common/infrastructureFacade/tfsMethods',
        'common/components/toggleLanguagesButton/texts'
], function (languageViewModel, tfsMethods, texts) {//eslint-disable-line max-params

    /** Module that manages the toggle languages button
    * @module toggleLanguagesButton         
    */

    var createButton = function (settings) {
        var labels = ko.multiLanguageObservable({ resource: texts });

        var availableLanguagesList = ko.observableArray(languageViewModel.getAvailableLanguages(settings));

        var toggleLanguageDiv = function () {
            tfsMethods.toggleLanguageDiv();
        };

        //var triggerLanguageChangeAlert = function () {
        //    var languagesMenueElement = $('body');
        //    $(languagesMenueElement).parent().find('.languageChangedAlert').remove();
        //    accessibilityMethods.appendNotifyElement(languagesMenueElement, labels().languageChangedAlert, 'languageChangedAlert');
        //};

        var toggleLanguage = function (language) {
            //triggerLanguageChangeAlert();
            languageViewModel.language(language.longName);
            toggleLanguageDiv();
        };

        var isMultiLanguages = ko.computed(function () {
            return availableLanguagesList().length > 1;
        });

        return {
            /**
            *@name toggleLanguageDiv  
            *@description hide & show the toggle languages div
            */
            toggleLanguageDiv: toggleLanguageDiv,
            /**
            *@name toggleLanguage  
            *@description change form's language
            */
            toggleLanguage: toggleLanguage,
            
            /**
            *@name availableLanguagesList  
            *@description List of supported languages form
            *@type ko.observableArray()
            */
            availableLanguagesList: availableLanguagesList,
            /**
            *@name isMultiLanguages  
            *@description if the form support multy languages
            *@type boolean
            */
            isMultiLanguages: isMultiLanguages,
            /**
           *@name labels  
           *@description contain texts object
           */
            labels: labels
        };
    };

    return {
        createButton: createButton
    };

});