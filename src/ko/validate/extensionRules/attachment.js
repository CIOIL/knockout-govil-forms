define(['common/core/generalAttributes',
    'common/utilities/stringExtension',
    'common/resources/texts/attachment',
    'common/resources/fileTypesWhiteList',
    'common/components/fileUpload/filesManager',
    'common/components/fileUpload/utilities',
    'common/ko/validate/utilities/paramsFactories',
    'common/resources/regularExpressions',
    'common/core/exceptions',
    'common/ko/globals/multiLanguageObservable'
], function (generalAttributes, stringExtension, resources, typesWhiteList, filesManager, filesUtilities, createFactories, regexSource, formExceptions) {//eslint-disable-line max-params

    var messages = ko.multiLanguageObservable({ resource: resources });
    var factories = createFactories(messages);
    // var validationMessageFactory = factories.validationMessageFactory;
    var validationParamsFactory = factories.validationParamsFactory;

    const isExistAndRegex = (obj) => {
        return obj && Object.prototype.toString.call(obj) === '[object RegExp]';
    };

    ko.validation.rules.fileNameRule = {
        validator: (val, namePattern) => {//eslint-disable-line complexity
            if (!val) {
                return true;
            }
            const nameInConfig = generalAttributes.get('attachments') ? generalAttributes.get('attachments').attachmentNamePattern : undefined;
            return isExistAndRegex(namePattern) ? val.match(namePattern) && val.match(nameInConfig) : isExistAndRegex(nameInConfig) ? val.match(nameInConfig) : true;

        },
        message: () => {
            return messages().fileName;
        }
    };

    /**     
 * @memberof ko         
 * extender to validate file name
 * checks validation on the observable and in case of failure applies a proper error message.
 * @param {function} target - the observable to set the rules on
 * @param {object} params - params
 * @returns {undefined} undefined
 * @example  
 * var sampleValue = ko.observable().extend({ fileName: true });
 * sampleDate('myPic.jpg');
 */

    ko.extenders.fileName = function (target, params) {
        params = params || {};
        const fileNameMaxLength = 256;
        target.extend({
            maxLength: validationParamsFactory(params, fileNameMaxLength, ''),
            fileNameRule: validationParamsFactory(params, params.params || params, 'fileName'),
            pattern: validationParamsFactory(params, regexSource.fileName, 'fileName')
        });
        return target;
    };

    /**     
  * @memberof ko         
  * extender to validate file name
  * checks validation on the observable and in case of failure applies a proper error message.
  * @param {function} target - the observable to set the rules on
  * @param {object} params - params
  * @returns {undefined} undefined
  * @example  
  * var sampleValue = ko.observable().extend({ fileName: true });
  * sampleDate('myPic.jpg');
  */
    // ko.extenders.fileSize = function (target, params) {
    //     params = params || {};
    //     const defaultSizeLimit = 60;
    //     var maxAllowedSize = params || generalAttributes.get('attchmentsMaxSize') - filesManager.totalAttachmentsSize() || filesManager.defaultAttachmentsSizeLimit - filesManager.totalAttachmentsSize();
    //     //TODO: convert to readable size
    //     target.extend({
    //         max: validationParamsFactory(params, maxAllowedSize, 'fileSize')
    //     });
    //     return target;
    // };

    const getMaxAllowedSize = (maxSize) => {
        const K = 1024, B = 1048576;
        return $.isNumeric(maxSize) ? maxSize * K :
            (generalAttributes.get('attachments') ? generalAttributes.get('attachments').attchmentsMaxSize : undefined || filesManager.defaultSizeLimit) * B
            - filesManager.totalAttachmentsSize.peek();
    };


    ko.validation.rules.fileMaxSize = {
        validator: (val, maxSize) => {
            if (!val) {
                return true;
            }
            var maxAllowedSize = getMaxAllowedSize(maxSize);
            return val <= maxAllowedSize;
        },
        message: (maxSize) => {
            var maxAllowedSize = getMaxAllowedSize(maxSize);
            return stringExtension.format(messages().fileMaxAize, filesUtilities.bytesToSize(maxAllowedSize));
        }
    };


    /**     
  * @memberof ko         
  * @function "ko.extenders.fileType"
  * @description extender to validate file name
  * checks validation on the observable and in case of failure applies a proper error message.
  * @example  
  * var sampleValue = ko.observable().extend({ fileName: true });
  * sampleDate('myPic.jpg');
  */

    const validateAllowedExtensions = (allowedExtesions) => {
        var notFound = -1;
        if (allowedExtesions.length > 0) {
            if (allowedExtesions.find(elem => typesWhiteList.indexOf(elem) === notFound)) {
                formExceptions.throwFormError('this extension is not allowed according to the white list of extensions');
            }
        }
    };

    const isExtensionAlloed = (fileExtension, allowedExtesions) => {
        if (allowedExtesions.length > 0) {
            return allowedExtesions.includes(fileExtension);
        }
        if (generalAttributes.get('attachments') && generalAttributes.get('attachments').attachmentsValidTypes && generalAttributes.get('attachments').attachmentsValidTypes.length > 0) {
            return generalAttributes.get('attachments').attachmentsValidTypes.includes(fileExtension);
        }
        return typesWhiteList.includes(fileExtension);
    };

    ko.validation.rules.fileType = {
        validator: function (val, params) {
            params = params.params || params;
            var allowedExtesions = params.extensions || [];
            validateAllowedExtensions(allowedExtesions);
            var fileExtension = filesUtilities.getExtension(val);
            if (!val) {
                return true;
            }
            return isExtensionAlloed(fileExtension, allowedExtesions);
        },
        message: () => messages().fileType
    };


    ko.validation.registerExtenders();

});