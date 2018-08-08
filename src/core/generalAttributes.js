/** Object for storing,retreiving, inspecting and checking the existance of the form's general attributes 
@module generalAttributes 
* @example Example of usage
* generalAttributes.get('tfslanguage').get('url'); // returns the value of the tfslanguage attribute
* generalAttributes.get('tfssubmitactionparam').get('url'); //returns the value of the url within the tfssubmitactionparam attribute
* generalAttributes.isDebugMode() // returns true if the form is in debug mode
*/

define(['common/core/exceptions',
    'common/configuration/globalGeneralAttributes',
    'common/core/govFormsGeneralAttributes',
    'common/core/agFormsGeneralAttributes',
    'common/resources/tfsAttributes',
    'common/resources/govFormAttributes',
    'common/utilities/arrayExtensions'
],
    function(exceptions, globalGeneralAttributes, govFormsGeneralAttributes, agFormsGeneralAttributes, tfsAttributes, govFormAttributes) {//eslint-disable-line max-params

        const managers = {
            'govForm': govFormsGeneralAttributes,
            'agForm': agFormsGeneralAttributes
        };

        const getAttributesArray = (attrCollection) => {
            const attributesArray = [];
            for (let attr in attrCollection) {
                if (attrCollection.hasOwnProperty(attr)) {
                    attributesArray.push(attrCollection[attr].toLowerCase());
                }
            }
            return attributesArray;
        };

        const attributes = {
            'govForm': getAttributesArray(govFormAttributes),
            'agForm': getAttributesArray(tfsAttributes)
        };

        const attributesTranslator = {
            formversion: 'tfsversion',
            formid: 'tfsformid',
            formname: 'tfsformname',
            printsetup: 'tfsprintsetup',
            submitsetup: 'tfssubmitaction',
            targeturl: 'tfssubmitaction',
            appMode: 'tfsappmode',
            language: 'tfslanguage',
            tfsversion: 'formversion',
            tfsformid: 'formid',
            tfsformname: 'formname',
            tfsprintsetup: 'printsetup',
            tfssubmitaction: 'submitsetup',
            tfsappmode: 'appMode',
            tfslanguage: 'language'
        };

        const isGovForm = () => {
            return window.govForms && typeof window.govForms.govFormConfiguration !== 'undefined';
        };

        const getType = () => isGovForm() ? 'govForm' : 'agForm';

        const generalAttributesManager = managers[getType()].create();

        generalAttributesManager.isGovForm = isGovForm;

        const originalGetter = generalAttributesManager.get;
        const originalSetter = generalAttributesManager.store;

        const isSupported = (attrName) => attributes[getType()].includes(attrName.toLowerCase());

        generalAttributesManager.get = function(attrName) {//eslint-disable-line consistent-return
            const name = isSupported(attrName) ? attrName : attributesTranslator[attrName.toLowerCase()];
            if (name) {
                return originalGetter.call(this, name);
            }
            if (!isGovForm()) {
                return originalGetter.call(this, attrName);
            }
            exceptions.throwFormError(`attribute ${attrName} not supported`);
        };
        generalAttributesManager.store = function(attrName, value) {//eslint-disable-line consistent-return

            const name = isSupported(attrName) ? attrName : attributesTranslator[attrName.toLowerCase()];

            if (name) {
                return originalSetter.call(this, name, value);
            }
            if (!isGovForm()) {
                return originalSetter.call(this, attrName, value);
            }
            exceptions.throwFormError(`attribute ${attrName} not supported`);
        };


        return generalAttributesManager;
    });
