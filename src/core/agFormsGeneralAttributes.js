define(['common/core/exceptions',
    'common/core/genericDictionary',
    'common/resources/domains',
    'common/utilities/reflection',
    'common/resources/tfsAttributes',
    'common/configuration/globalGeneralAttributes',
    'common/resources/exeptionMessages'
],
    function (formExceptions, genericDictionary, commonDomains, reflection, tfsAttributes, globalGeneralAttributes, exeptionMessages) {//eslint-disable-line max-params

        var generalAttributesSettings;

        var messages = {
            invalidGeneralAttributes: 'Invalid General Attributes were sent to the function, unable to create the GeneralAttributes dictionary',
            unrecognizedFormDestination: 'The form\'s destination URL wasn\'t recognized. Check the url in the general attributes',
            documentIsNotReady: 'The DOM is not fully loaded, unable to access the components on the DOM until the readyState is complete'
        };

        var generalAttributesManager = new genericDictionary.Dictionary();

        var createInnerDictionary = function (attributeValue) {
            var innerDictionary = new genericDictionary.Dictionary();
            innerDictionary.lowercase = true;
            innerDictionary.populateFromKeyValuePairs(attributeValue, ';');
            return innerDictionary;
        };

        var storeGeneralAttribute = function (attributeName, attributeValue) {

            if ($.type(attributeValue) !== 'undefined') {

                if ($.inArray(attributeName.toLowerCase(), generalAttributesSettings.keyValuePairsAttributes) >= 0) {

                    this.store(attributeName, createInnerDictionary(attributeValue));
                }
                else {
                    this.store(attributeName, attributeValue);
                }
            }
        };

        var populateGeneralAttributesDictionary = function (attributes) {

            for (var attribute in attributes) {
                //returns only the attributes that pass the predicate  
                if (attributes.hasOwnProperty(attribute) && generalAttributesSettings.filterAttributes(attribute, attributes[attribute])) {
                    storeGeneralAttribute.call(this, attribute, attributes[attribute]);
                }
            }
        };

        var isValidGeneralAttributes = () =>
            globalGeneralAttributes.hasOwnProperty('tfsversion') && globalGeneralAttributes.hasOwnProperty('tfsformid');

        function initialize() {
            if (!isValidGeneralAttributes()) {
                formExceptions.throwFormError(messages.invalidGeneralAttributes);
            }

            this.values = {};

            this.lowercase = true;

            //use default settings when no corresponding setting was sent from the caller
            generalAttributesSettings = {
                keyValuePairsAttributes: [tfsAttributes.TFSPRINTSETUP.toLowerCase(), tfsAttributes.TFSSUBMITACTIONPARAM.toLowerCase()],
                filterAttributes: function (attr) { return attr.indexOf('tfs') === 0; }
            };
            generalAttributesSettings = reflection.extendSettingsWithDefaults(globalGeneralAttributes.settings || {}, generalAttributesSettings);

            //TODO support the settings - add underscore for filtering the attributes object
            populateGeneralAttributesDictionary.call(this, globalGeneralAttributes);

        }

        //initialize is public so the general attributes can be reset
        generalAttributesManager.initialize = initialize;

        var getFormTargetInfo = function getFormTargetInfo(infoType) {//eslint-disable-line complexity

            if (document.readyState !== 'complete') {
                throw formExceptions.throwFormError(messages.documentIsNotReady);
            }
            if (commonDomains.formServers === undefined) {
                throw formExceptions.throwFormError(exeptionMessages.domainsIsNotRecognized);
            }
            var formURLAttr = $('#GeneralAttributes').attr('tfssubmitactionparam');
            var key = 'url:';
            var index = formURLAttr.indexOf(key);
            var lastIndex = formURLAttr.indexOf(';', index) > -1 ? formURLAttr.indexOf(';', index) : formURLAttr.length; //eslint-disable-line no-magic-numbers
            var formURL = formURLAttr.substring(index + key.length, lastIndex);

            var environment;
            for (environment in commonDomains.formServers) {
                if (formURL.toLowerCase().indexOf(commonDomains.formServers[environment]) === 0) {
                    return (infoType === 'name') ? environment : commonDomains.formServers[environment];
                }
            }

            throw formExceptions.throwFormError(messages.unrecognizedFormDestination);

        };

        generalAttributesManager.getTargetEnvoirment = function () {
            var targetFormInfo = getFormTargetInfo.call(this, 'name');
            var environment;
            var notFound = -1;
            for (environment in commonDomains.fromEnviorments) {
                if (commonDomains.fromEnviorments[environment].indexOf(targetFormInfo) > notFound) {
                    return environment;
                }
            }
            throw formExceptions.throwFormError(messages.unrecognizedFormDestination);
        };

        generalAttributesManager.getCleanedFormName = function () {
            var fullFormName = this.get(tfsAttributes.TFSFORMNAME) || '';

            fullFormName = $('<span />', { html: fullFormName }).text();

            if ($(fullFormName).length > 0) {
                fullFormName = $(fullFormName).eq(0).text();
            }
            return (fullFormName.replace(/(?:^\s+|\s+$)/g, ''));

        };
        generalAttributesManager.isDebugMode = function () {

            return (this.contains(tfsAttributes.TFSAPPLICATIONMODE) && this.get(tfsAttributes.TFSAPPLICATIONMODE).toLowerCase() === 'debug');

        };

        generalAttributesManager.getOfficeName = function () {

            var formId = this.get(tfsAttributes.TFSFORMID) || '';

            var officeName = (formId.indexOf('@') >= 0) ? formId.split('@')[1].split('.')[0] : '';

            return officeName;

        };
        generalAttributesManager.getTargetServer = function () {

            return getFormTargetInfo.call(this);

        };
        generalAttributesManager.getTargetServerName = function () {
            return getFormTargetInfo.call(this, 'name');
        };

        generalAttributesManager.getPluginVersion = function () {
            return this.get(tfsAttributes.TFSPLUGINVERSION) || '';
        };
        const createGeneralAttributes = () => {
            initialize.call(generalAttributesManager);
            return generalAttributesManager;
        };
        return { create: createGeneralAttributes };

    });