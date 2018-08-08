/** 
  * Holds the language information as mediator between the form and the common layer. 
  * In multi laguages forms the language in this view model should be bound to the form's changing language,
  * hence enabling the common layer to refer to a dynamically changing language.  
  * @module languageViewModel
  */
define(['common/resources/languages',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/viewModels/ModularViewModel',
    'common/infrastructureFacade/tfsMethods',
    'common/core/generalAttributes',
    'common/core/formMode',
    'common/core/domReadyPromise',
    'common/utilities/formUrl'
], function (resources, formExceptions, exceptionsMessages, stringExtension, ModularViewModel, infsMethods, generalAttributes, formMode, domReadyPromise, formUrl) {//eslint-disable-line max-params

    /** observable for getting and setting the form's language
         * @method language
         */
    var model = {
        language: ko.observable('')
    };
    /** <b>deprecated</b> - remaining for back support
        * @type {object} */
    var validLanguages = {};

    /** <b>deprecated</b> - remaining for back support
        * @type {object} */
    var defaultLanguages = {};

    /** <b>deprecated</b> - remaining for back support
        * @type {object} */
    var otherLanguages = resources.otherLanguages;

    var infrastructureLanguages = resources.infrastructureLanguages;
    var languagesListArray = resources.languagesList;

    /**
       *@name languagesList  
       *@description array of languages with all properties.
       *@type {ko.observableArray}
       */
    var languagesList = ko.observableArray();

    languagesList.subscribe(function () {
        languagesList().forEach(function (lang) {
            validLanguages[lang.longName] = lang.longName;
            defaultLanguages[lang.longName] = lang.defaultLanguage;
        });
    });

    ko.utils.arrayPushAll(languagesList, languagesListArray);

    /* @function <b>getLanguageByLongName</b>
    * @description return language object from languagesList by sent language
    * @param {string} lang - long name of language
    * @returns {object} language object from languagesList or null
    */
    var getLanguageByLongName = function (lang) {
        var language = ko.utils.arrayFirst(languagesList(), function (language) {
            return language.longName === lang;
        });
        return language;
    };

    const getEnglishLanguage = function () {
        return languagesList().find(item => item.longName === 'english');
    };
    var getLanguaugeObject = function (newValue) {
        var newLanguage = getLanguageByLongName(newValue);
        return newLanguage ? newLanguage : getEnglishLanguage();
    };
    /* @function <b>languageObject</b>
     * @description return current language resources
     * @returns {object} properties:longName,shortName,text,defaultLanguage,dir
     * @example 
             var languageObject = languageViewModel.languageObject()// return   { longName: 'hebrew', shortName: 'he', text: 'עברית', defaultLanguage: 'hebrew', dir: 'rtl' }

     */
    var languageObject = ko.computed(function () {
        return getLanguaugeObject(model.language());
    });


    /* @function <b>getDefaultLanguage</b>
    * @description return the default language for sent language
    * @param {string} lang - long name of language
    * @returns {string} default language or english
    */
    var getDefaultLanguage = function (lang) {
        var language = getLanguageByLongName(lang);
        var defaultLanguage = language ? language.defaultLanguage : infrastructureLanguages.english;
        return defaultLanguage || infrastructureLanguages.english;
    };
    /* @function <b>isRtl</b>
      * @description return true when current language dir is rtl
      * @returns {bool} true/false
      * @example 
              var isRtl = languageViewModel.isRtl()// return true
      */
    const isRtl = ko.computed(function () {
        return languageObject().dir === 'rtl';
    });

    /* @function <b>getDirection</b>
        * @description return the direction of current language
        * @returns {string} direction - rtl/ltr
        */
    const getDirection = ko.computed(function () {
        return languageObject().dir;
    });

    model.language.subscribe(function () {

        var newLanguageName = languageObject().longName;
        if (formMode.mode() !== formMode.validModes.server) {
            infsMethods.setFormLanguage(newLanguageName, isRtl());
        }

        generalAttributes.store('tfslanguage', newLanguageName);

        ko.postbox.publish('formLanguageChanged', { newLanguage: languageObject() });
    });

    model.language(generalAttributes.get('tfsLanguage'));

    /**
     * @function <b>isHebrew</b>
     * @returns {boolean} <i>true</i> if the form language is Hebrew
     *  <br /> <i>false</i> if not
     */
    var isHebrew = ko.computed(function () {
        return (model.language() === validLanguages.hebrew);
    });

    /**
    * @function <b>isArabic</b>
    * @returns {boolean} <i>true</i> if the form language is Arabic
    *  <br /> <i>false</i> if not
    */
    var isArabic = ko.computed(function () {
        return (model.language() === otherLanguages.arabic);
    });

    /**
    * @function <b>isEnglish</b>
    * @returns {boolean} <i>true</i> if the form language is English
    *  <br /> <i>false</i> if not
    */
    var isEnglish = ko.computed(function () {
        return (!isHebrew() && !isArabic());
    });

    /* @function <b>getAvailableLanguages</b>
     * @description get array of languages
     * @param {Object} settings array of languages
     * @returns {object} list of the languages - example { longName: 'english', text: "English" }
     * @throws {FormError} language not valid or settings not type of array
     */
    var getAvailableLanguages = function (settings) {
        if (settings && !(settings instanceof Array)) {
            formExceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidParam, settings));
        }
        return ko.utils.arrayMap(settings, function (language) {
            var lang = getLanguageByLongName(language);
            if (lang === null) {
                formExceptions.throwFormError(stringExtension.format(exceptionsMessages.languageNameIsNotValid, language));
            }
            return lang;
        });
    };

    var updateLanguage = function () {
        model.language(generalAttributes.get('tfsLanguage'));
    };
    /* @function <b>getShortName</b>
     * @description return the current language short name
     * @returns {string} short name
     * @example 
             var shortName = languageViewModel.getShortName()// return 'he'
     */
    var getShortName = function () {
        return languageObject().shortName;
    };

    /* @function <b>getLanguageByShortName</b>
    * @description return language object from languagesList by sent language
    * @param {string} short - short name of language
    * @returns {object} language object from languagesList or null
    */
    var getLanguageByShortName = function (lang) {
        var language = ko.utils.arrayFirst(languagesList(), function (language) {
            return language.shortName === lang;
        });
        return language;
    };

    const setLanguage = (language) => {
        model.language(language);
    };

    domReadyPromise.promise.then(function () {
        const url = window.location.href;
        const urlDisplayLang = formUrl.getQueryStringValue(url, 'displang');
        const language = getLanguageByShortName(urlDisplayLang);
        setLanguage(language.longName);

    });

    var languageViewModel = new ModularViewModel(model);
    languageViewModel.validLanguages = validLanguages;
    languageViewModel.otherLanguages = otherLanguages;
    languageViewModel.isRtl = isRtl;
    languageViewModel.getDirection = getDirection;
    languageViewModel.isHebrew = isHebrew;
    languageViewModel.isArabic = isArabic;
    languageViewModel.isEnglish = isEnglish;
    languageViewModel.updateLanguage = updateLanguage;
    languageViewModel.getAvailableLanguages = getAvailableLanguages;
    languageViewModel.defaultLanguages = defaultLanguages;
    languageViewModel.languagesList = languagesList;
    languageViewModel.getLanguageByLongName = getLanguageByLongName;
    languageViewModel.getDefaultLanguage = getDefaultLanguage;
    languageViewModel.languageObject = languageObject;
    languageViewModel.getShortName = getShortName;

    return languageViewModel;

});