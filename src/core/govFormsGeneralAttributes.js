define(['common/core/exceptions',
    'common/core/genericDictionary',
    'common/resources/domains',
    'common/resources/fileTypesWhiteList',
    'common/utilities/reflection',
    'common/resources/govFormAttributes',
    'common/configuration/globalGeneralAttributes'
],
    function (formExceptions, genericDictionary, commonDomains, fileTypesWhiteList, reflection, govFormAttributes, globalGeneralAttributes) {//eslint-disable-line max-params

        var generalAttributesSettings;
        const notFound = -1;

        const messages = {
            invalidGeneralAttributes: 'Invalid General Attributes were sent to the function, unable to create the GeneralAttributes dictionary',
            unrecognizedFormDestination: 'The form\'s state wasn\'t recognized. The state in the form configuration should be \'dev\', \'test\' or \'production\''
        };

        const formConfigurationManager = new genericDictionary.Dictionary();

        const isValidGeneralAttributes = () =>
            globalGeneralAttributes.hasOwnProperty(govFormAttributes.FORMVERSION) && globalGeneralAttributes.hasOwnProperty(govFormAttributes.FORMID);

        const validateAttribute = (attributeValue, attribute) => {
            if (attribute === 'attachmentsValidTypes') {
                if (attributeValue[attribute].every(elem => fileTypesWhiteList.indexOf(elem) > notFound)) {
                    formExceptions.throwFormError('this extension is not allowed according to the white list of extensions');
                }
            }
            return true;
        };

        const createInnerDictionary = function (attributeValue) {
            const innerDictionary = new genericDictionary.Dictionary();
            innerDictionary.lowercase = true;
            for (var attribute in attributeValue) {
                //returns only the attributes that pass the predicate  
                if (attributeValue.hasOwnProperty(attribute) && validateAttribute(attribute)) {
                    innerDictionary.store(attribute, attributeValue[attribute]);
                }
            }
            return innerDictionary;
        };

        const storeGeneralAttribute = function (attributeName, attributeValue) {

            if (typeof attributeValue !== 'undefined') {

                if (generalAttributesSettings.keyValuePairsAttributes.includes(attributeName.toLowerCase())) {

                    this.store(attributeName, createInnerDictionary(attributeValue));
                }
                else {
                    this.store(attributeName, attributeValue);
                }
            }
        };

        const populateGeneralAttributesDictionary = function (attributes) {

            for (var attribute in attributes) {
                //returns only the attributes that pass the predicate  
                if (attributes.hasOwnProperty(attribute)) {
                    storeGeneralAttribute.call(this, attribute, attributes[attribute]);
                }
            }
        };

        const initialize = function () {
            if (!isValidGeneralAttributes()) {
                formExceptions.throwFormError(messages.invalidGeneralAttributes);
            }

            this.values = {};

            this.lowercase = true;

            //use default settings when no corresponding setting was sent from the caller
            generalAttributesSettings = {
                keyValuePairsAttributes: [govFormAttributes.PRINTSETUP, govFormAttributes.SUBMITSETUP]
            };
            generalAttributesSettings = reflection.extendSettingsWithDefaults(globalGeneralAttributes.settings || {}, generalAttributesSettings);

            //TODO support the settings - add underscore for filtering the attributes object
            populateGeneralAttributesDictionary.call(this, globalGeneralAttributes);
        };

        // initialize.call(formConfigurationManager);

        //initialize is public so the general attributes can be reset
        formConfigurationManager.initialize = initialize;

        formConfigurationManager.getCleanedFormName = function () {

            return this.get('formName') || '';

        };
        formConfigurationManager.isDebugMode = function () {

            return (this.contains(govFormAttributes.APPMODE) && this.get(govFormAttributes.APPMODE).toLowerCase() === 'debug');

        };
        formConfigurationManager.getOfficeName = function () {

            var formId = this.get(govFormAttributes.FORMID) || '';

            var officeName = (formId.indexOf('@') >= 0) ? formId.split('@')[1].split('.')[0] : '';

            return officeName;

        };
        //todo: match to middleware name
        const isSecureDomain = () =>
            window.govForms.govFormConfiguration.identification !== undefined;
        //todo: match to middleware name
        const getSecureState = () =>
          'todo: wait to design';

        /** Return server name 
         * @method getTargetServerName
         * @returns {string} [dev,secureDev,test, production,sca, scaTest,publicSca, agFormManager].
         */
        formConfigurationManager.getTargetServerName = function () {
            let state = this.get(govFormAttributes.STATE);
            if (isSecureDomain()) {
                state = getSecureState();
            }
            if (!commonDomains.formServers.hasOwnProperty(state)) {
                throw formExceptions.throwFormError(messages.unrecognizedFormDestination);
            }
            return state;
           
        };
        /** Return server name ignoring secured state
         * @method getTargetEnvoirment
         * @returns {string} [dev,test,production].
         */
        formConfigurationManager.getTargetEnvoirment = function () {

            var targetFormInfo = this.getTargetServerName();
            var environment;
            for (environment in commonDomains.fromEnviorments) {
                if (commonDomains.fromEnviorments[environment].indexOf(targetFormInfo) > notFound) {
                    return environment;
                }
            }
            throw formExceptions.throwFormError(messages.unrecognizedFormDestination);
        };
        /** Return server address 
        * @method getTargetServer
        * @returns {string} ['http://gov.xxx.dev'/'http://gov.xxx.test' etc.].
        */
        formConfigurationManager.getTargetServer = function () {
            const state = this.getTargetServerName();
            const domain =  commonDomains.govFormsDomains[state];
            if (!domain) {
                throw formExceptions.throwFormError(messages.unrecognizedFormDestination);
            }
            return domain;
         
        };

        const createGeneralAttributes = () => {
            initialize.call(formConfigurationManager);
            return formConfigurationManager;
        };
        return { create: createGeneralAttributes };
    });