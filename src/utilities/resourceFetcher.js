/** module that is responsible for fetching resources per language
@module resourceFetcher */
define(['common/core/generalAttributes',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/core/exceptions',
    'common/viewModels/languageViewModel'
], function (generalAttributes, exeptionMessages, stringExtension, exceptions, languageViewModel) {//eslint-disable-line max-params


    var get = function get(resources, language) {
        var defaultLanguage = languageViewModel.getDefaultLanguage(language || languageViewModel.language());

        var getLanguage = function getLanguage(language) {
            return language || (generalAttributes.get('tfslanguage')) || 'hebrew';
        };

        var isExistResources = function (language) {
            return resources[language] !== undefined || resources[defaultLanguage] !== undefined;
        };

        var getExistOrDefaultResourcesLanguage = function (language) {
            return resources[language] !== undefined ? language : defaultLanguage;
        };

        if (!(typeof resources === 'object')) {
            exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'resourceFetcher.get'));
        }

        language = getLanguage(language);

        if (!isExistResources(language)) {
            exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'resourceFetcher.get'));
        }

        var resource = resources[getExistOrDefaultResourcesLanguage(language)];
        return resource;
    };

    return {
        /**
        * get the sub part of a given resource that corresponds to a specific language. 
        * The language is determined as follows:
        * 1. taken from the parameter, if not specified then
        * 2. taken from the general attributes, if not defined
        * 3. defaults to hebrew.     * 
        * @method get    
        * @param {object} resource - the resource from which a sub part is returned according to the language
        * @param {string} language - the language according to which a sub part is returned     
        * @returns {object} resourse - the sub part of a given resource that corresponds to a specific language
        * @throws Will throw an error if the first parameter isnt an object or the resourse is not found for the chosen language. 
        */
        get: get
    };

});
