define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/utilities/resourceFetcher',
    'common/viewModels/languageViewModel'
], function (exceptions, exceptionMessages, stringExtension, resourceFetcher, languageViewModel) {//eslint-disable-line max-params
    /**
   * wrapper to an observable that returns a language sub set form a given multi language resource
   * @param {object} settings - object containing the parameters for the function
   * @param {object} settings.resource - the multi language resource from which the language sub set should be extracted
   * @param {object|string} settings.language - an observable (for dynamic support) or string (for one time staticsupport) containing the language.
   *                                            if not specified the function will try to take the language from the languageViewModel module.
   * @returns {ko.multiLanguageObservable} observable containing the language sub set form a given multi language resource
   */

    ko.multiLanguageObservable = function (settings) {

        var isValidSettingsResource = function () {//eslint-disable-line
            if (typeof settings !== 'object' || typeof settings.resource !== 'object' || $.isEmptyObject(settings.resource)) {
                return false;
            }
            return true;
        };

        var isValidSettingsLanguage = function () {
            if (typeof settings !== 'object') {
                return false;
            }
            return !settings.language || languageViewModel.getLanguageByLongName(ko.unwrap(settings.language)) !== null;
        };

        if (!(isValidSettingsResource())) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'multiLanguageObservable'));
        }

        if (!(isValidSettingsLanguage())) {
            exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'multiLanguageObservable'));
        }

        var resource = ko.observable(settings.resource);

        var previousValidLanguage;

        var getLanguage = function () {
            var observedLanguge = (languageViewModel.getLanguageByLongName(languageViewModel.language())) ? languageViewModel.language : undefined;
            return settings.language || observedLanguge || previousValidLanguage;
        };

        var multi = ko.computed(function () {

            var language = getLanguage();

            //save valid language - so it can be usedinstead of invalid languages in the language view model            
            previousValidLanguage = ko.unwrap(language);

            return resourceFetcher.get(resource(), ko.unwrap(language));
        });
        multi.resource = resource;
        return multi;
    };

});