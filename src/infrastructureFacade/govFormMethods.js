/* global AgatAttachment agatMobile AgatValidator agform2Html CurrentPlugInVersion */


define(['common/core/exceptions',
    'common/utilities/stringExtension',
    'common/core/language',
    'common/elements/selectMethods',
    'common/utilities/userBrowser'],
    function (formExceptions, stringExtensions, _language, _selectMethods, _userBrowser) {//eslint-disable-line max-params

        let _dialog;

        const useBeforeInitializeException = 'govForm methods is not initialized, function "{0}" is therfore missing';

        /**
         * Raise alert popup
         * @param {string} message alert message to display
         * @param {string} title alert title
         * @param {function} callbackFunction callback function to be called while confirmation the popup
         * @returns {undefined}
         */
        function alert() {
            _dialog = _dialog || require('common/components/dialog/dialog');

            if (_dialog && typeof _dialog.alert === 'function') {
                const dialog = _dialog.alert({ message: arguments[0], title: arguments[1] });
                const callback = arguments[2];
                if (callback && typeof callback === 'function') {
                    dialog.then(callback);
                }
                return dialog;
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'dialog.alert'));
        }

        /**
        * Raise confirm popup
        * @param {string} message confirm message to display
        * @param {string} title confirm title
        * @param {function} callbackFunction callback function to be called while confirmation the popup
        * @returns {undefined}
        */
        function confirm() {
            _dialog = _dialog || require('common/components/dialog/dialog');
            if (_dialog && typeof _dialog.confirm === 'function') {
                const dialog = _dialog.confirm({ message: arguments[0], title: arguments[1] });
                const callback = arguments[2];
                if (callback && typeof callback === 'function') {
                    dialog.then(callback);
                }
                return dialog;
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'dialog.confirm'));
        }
        /** 
       * fixElements
       * @returns {undefined}
       */
        function fixElements() {
            if (_selectMethods && typeof _selectMethods.replaceSelectsWithInputs === 'function') {
                return _selectMethods.replaceSelectsWithInputs(...arguments);
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'selectMethods.replaceSelectsWithInputs'));
        }
        /** 
      * rollBackChanges
      * @returns {undefined}
      */

        function rollBackChanges() {
            if (_selectMethods && typeof _selectMethods.rollbackSelect === 'function') {
                return _selectMethods.rollbackSelect(...arguments);
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'selectMethods.rollbackSelect'));
        }

        /** 
    * determines the form language
    * @param {string} _language - the desired languge
    * @returns {undefined}
    */
        function setFormLanguage() {
            if (_language && typeof _language.setFormLanguage === 'function') {
                return _language.setFormLanguage(arguments[1]);
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'language.setFormLanguage'));
        }

        var showLookUpWindow = function () {
            return;
        };

        /**
         * Checking if the application is running from mobile
         * @returns {boolean} - is running from mobile
         */
        function isMobile() {
            if (_userBrowser && typeof _userBrowser.isMobile === 'function') {
                return _userBrowser.isMobile();
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'userBrowser.isMobile'));

        }

        /**
        * Show/Hide the toggle languages div
        * and put transparent div on the form
        * @returns {undefined}
        */
        function toggleLanguageDiv() {
            if (_language && typeof _language.toggleLanguageDiv === 'function') {
                return _language.toggleLanguageDiv(...arguments);
            }
            throw formExceptions.throwFormError(stringExtensions.format(useBeforeInitializeException, 'language.toggleLanguageDiv'));
        }
        /*end region publicFunctions*/


        return {

            dialog: {
                alert: alert,
                confirm: confirm
            },
            setFormLanguage: setFormLanguage,
            fixElements: fixElements,
            rollBackChanges: rollBackChanges,
            isMobile: isMobile,
            toggleLanguageDiv: toggleLanguageDiv,
            showLookUpWindow: showLookUpWindow
            //setDisabledEnabled- in use in tlpLockElement, ait for replacement
        };
    });

