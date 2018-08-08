define([
    'common/core/feedback',
    'common/core/readyToRequestPromise',
    'common/components/feedback/texts',
    'common/core/generalAttributes',
    'common/ko/globals/multiLanguageObservable'],
    function ( feedbackMethods, readyToRequestPromise, texts, generalAttributes) {//eslint-disable-line max-params

        /** Module that manages the feedBack depend on the details of the form.
         * @module feedback
         * @param {object} serverMode -
         * @return {object} createViewModel
         */
        var createViewModel = function createViewModel(serverMode) {
            const url = ko.observable('');
            serverMode() ? url('#') :
                readyToRequestPromise.then(() => {
                    url(feedbackMethods.getFeedbackUrl(generalAttributes));
                });
            return {
                /**  
                  url of agform's feedback          
                  @type {string} 
                  @return {string} url
                */
                url: url,

                /**  
                 texts          
                 @type {object} 
                 @return {object} texts
               */
                texts: ko.multiLanguageObservable({ resource: texts })
            };
        };
        return { createViewModel: createViewModel };

    });