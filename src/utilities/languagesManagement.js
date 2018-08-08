define(function (require) {

    var hebrewMessages = require('common/resources/hebrewMessages'),
        englishMessages = require('common/resources/englishMessages'),
        commonMessages = require('common/resources/messages'),

        hebrewToolTips = require('common/resources/hebrewToolTips'),
        englishToolTips = require('common/resources/englishToolTips'),
        commonToolTips = require('common/resources/toolTips'),

        hebrewComponents = require('common/resources/hebrewComponents'),
        englishComponents = require('common/resources/englishComponents'),
        commonComponents = require('common/resources/components');


    var languages = {
        hebrew: 'hebrew',
        english: 'english'
    };

    var languagesConfiguration = {
        messages: {
            common: commonMessages,
            hebrew: hebrewMessages,
            english: englishMessages
        },
        toolTips: {
            common: commonToolTips,
            hebrew: hebrewToolTips,
            english: englishToolTips
        },
        components: {
            common: commonComponents,
            hebrew: hebrewComponents,
            english: englishComponents
        }
    };

    var changeLanguage = function (language) {
        for (var category in languagesConfiguration) {
            if (languagesConfiguration.hasOwnProperty(category)) {
                languagesConfiguration[category]['common'].set(languagesConfiguration[category][language]);
            }
        }
        //tlp.messages = 
        //commonMessages.messages.validates.englishHebrew = "aaa";
    };

    return {
        languages: languages,
        changeLanguage: changeLanguage
    };


});