define([
    'common/components/header/texts',
    'common/utilities/reflection',
    'common/viewModels/languageViewModel',
    'common/ko/globals/multiLanguageObservable'
], function (headerResources, reflection, languageViewModel) {
    let labels = ko.multiLanguageObservable({ resource: headerResources });
    /**
   * @function customizeResources
   * @description extend resources with params
   * @param {Object} resources - object of multiple language object 
   * @example  
   * var resources = {
   *       hebrew: { officeName: 'משרד העליה והקליטה', division: '' },
   *       english: { officeName: 'The Ministry of Aliyah and Integration', division: '' }
   *  };
   */
    const customizeResources = function (resources) {
        const newResources = reflection.extendSettingsWithDefaults(resources, headerResources);
        Object.keys(newResources).forEach(languageName => {
            const defaultLanguage = languageViewModel.getDefaultLanguage(languageName);
            if (languageName === defaultLanguage) {
                return;
            }
            const currentResources = newResources[languageName];
            const defaultResources = headerResources[defaultLanguage];
            newResources[languageName] = reflection.extendSettingsWithDefaults(currentResources, defaultResources);
        });
        labels.resource(newResources);
    };
    return {
        customizeResources,
        labels
    };
});