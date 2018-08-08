/**
 * @module printInstructions
 * @description module that holds instructions for printing using the toolBar print button.
 * <br /> supports dynamic change of language
 */

define(['common/viewModels/languageViewModel',
        'common/ko/globals/multiLanguageObservable'],
    function (languageViewModel) {

        var texts = {
            hebrew: {
                header: 'הנחיות להדפסת טופס מקוון',
                insructions: 'על מנת להדפיס את הטופס יש להשתמש בכפתור הדפס הנמצא בסרגל הכלים של הטופס.',
                tryAgain: 'אנא נסו שנית.'
            },
            arabic: {
                header: 'إرشادات لطباعة نموذج عبر الإنترنت',
                insructions: 'لطباعة النموذج، استخدم الزر طباعة على شريط أدوات النموذج.',
                tryAgain: 'الرجاء إعادة المحاولة.'
            },
            english: {
                header: 'instructions for printing an online form',
                insructions: 'To print the form, use the Print button in the toolbar of the form.',
                tryAgain: 'Please try again.'
            }
        };

        /**
        * @function <b>isEnglishInstructions</b>
        * @returns {boolean} <i>true</i> if the dafault language of languageViewModel.language is english
        *  <br /> <i>false</i> if not
        */
        var isEnglishInstructions = ko.computed(function () {
            return languageViewModel.getDefaultLanguage(languageViewModel.language()) === 'english';
        });

        /**
        * @function <b>isHebrewInstructions</b>
        * @returns {boolean} <i>true</i> if the dafault language of languageViewModel.language is hebrew
        *  <br /> <i>false</i> if not
        */
        var isHebrewInstructions = ko.computed(function () {
            return languageViewModel.getDefaultLanguage(languageViewModel.language()) === 'hebrew';
        });

        return {
            texts: ko.multiLanguageObservable({ resource: texts }),
            isEnglishInstructions: isEnglishInstructions,
            isHebrewInstructions: isHebrewInstructions
        };
    });