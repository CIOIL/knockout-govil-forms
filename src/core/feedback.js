/** module that is responsible for form's feedback related functionality
@module feedback 
*/
define(['common/resources/tfsAttributes',
        'common/core/exceptions',
        'common/resources/domains',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/core/genericDictionary'
],
    function (tfsAttributes, exceptions, domains, exeptionMessages, stringExtension, genericDictionary) {//eslint-disable-line max-params

        function getFeedbackUrl(generalAttributesManager) {
            if (!(generalAttributesManager instanceof genericDictionary.Dictionary)) {
                exceptions.throwFormError(stringExtension.format(exeptionMessages.funcInvalidParams, 'getFeedbackUrl'));
            }
            var formId = generalAttributesManager.get(tfsAttributes.TFSFORMID);
            var officeName = generalAttributesManager.getOfficeName();
            var serverName = generalAttributesManager.getTargetServerName();
            var surveyUrl = domains.govFeedbackSurveys[serverName] || domains.govFeedbackSurveys['default'];
            return stringExtension.format('{0}?param1={1}&param2={2}&param3=2', surveyUrl, officeName, formId);
        }

        return {
            /** opens a window with the feedback survey
             * @method openFeedback      */
            getFeedbackUrl: getFeedbackUrl
        };
    });