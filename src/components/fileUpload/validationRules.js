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

    const messages = ko.multiLanguageObservable({ resource: resources });

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

    const isExistAndRegex = (obj) => {
        return obj && Object.prototype.toString.call(obj) === '[object RegExp]';
    };

    const checkConfigRegex = (fileName) => {
        const nameInConfig = generalAttributes.get('attachments') ? generalAttributes.get('attachments').attachmentNamePattern : undefined;
        return isExistAndRegex(nameInConfig) ? fileName.match(nameInConfig) : true;
    };

    const getMaxAllowedSize = (maxSize) => {
        const B = 1048576;
        return $.isNumeric(maxSize) ? maxSize * B :
            ((generalAttributes.get('attachments') ? generalAttributes.get('attachments').attchmentsMaxSize : undefined) || filesManager.defaultSizeLimit) * B
            - filesManager.totalAttachmentsSize.peek();
    };

    return {
        name: {
            fileType: {
                validator: function (val, allowedExtensions=[]) {
                    validateAllowedExtensions(allowedExtensions);
                    var fileExtension = filesUtilities.getExtension(val);
                    if (!val) {
                        return true;
                    }
                    return isExtensionAlloed(fileExtension, allowedExtensions);
                },
                message: () => messages().fileType
            },
            fileName: {
                validator: (val, namePattern) => {
                    if (!val) {
                        return true;
                    }
                    const isMatchCommonRegex = val.match(regexSource.fileNamePattern);
                    const isMatchConfigRegex = checkConfigRegex(val);
                    const isMatchFileRegex = isExistAndRegex(namePattern) ? val.match(namePattern) : true;
                    return isMatchCommonRegex && isMatchConfigRegex && isMatchFileRegex;

                },
                message: () => {
                    return messages().wrongFileName;
                }
            }
        },
        size: {
            emptyFile: {
                validator: (val) => {
                    return !(!val || val === 0);
                },
                message: () => {
                    return messages().emptyFile;
                }
            },
            fileSize: {
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
            }
        }
    };
});