define(['common/components/dialog/dialog',
    'common/components/fileUpload/validationRules',
    'common/components/fileUpload/utilities',
    'common/utilities/resourceFetcher',
    'common/components/fileUpload/texts'
], function (dialog, validationRules, utilities, resourceFetcher, texts) {//eslint-disable-line max-params

    const getElementFile = (element) => {
        var files = $(element).get(0).files;
        if (files && files.length > 0) {
            return files[0];
        }
        return;//eslint-disable-line  consistent-return
    };


    const validateInputFile = (file, fileAccessor) => {

        const validateFileProperty = (prop) => {
            let validationResult;
            const allValidators = Object.assign({}, validationRules[prop], fileAccessor.customRules[prop]);
            const getMesaage = (rule) => {
                if (fileAccessor.config[rule].message) {
                    return ko.unwrap(fileAccessor.config[rule].message);
                }
                return allValidators[rule].message(fileAccessor.config[rule].param);
            };

            for (var rule in allValidators) {
                if (!allValidators[rule].validator(file[prop], fileAccessor.config[rule].param)) {
                    validationResult = getMesaage(rule);
                    break;
                }
            }
            return validationResult;
        };

        const msg = validateFileProperty('name') || validateFileProperty('size');

        if (msg) {
            dialog.alert({ message: msg });
            return false;
        }
        return true;
    };

    const populateFileInfo = (file, fileAccessor) => {
        fileAccessor.name(file.name);
        fileAccessor.size(file.size);
        fileAccessor.type(file.type);
        fileAccessor.fileContent = file;
    };
    const isFileInfoEmpty = (fileAccessor) => {
        const name = ko.unwrap(fileAccessor.name());
        const size = ko.unwrap(fileAccessor.size());
        return !name && !size;
    };

    ko.bindingHandlers.fileValue = {

        init: function (element, valueAccessor) {
            var fileAccessor = valueAccessor();
            ko.applyBindingsToNode(element, { validationCore: fileAccessor.name });
            $(element).on('click', function (event) {//if the input is full, use click to preview
                if (fileAccessor.isCompleted()) {
                    event.preventDefault();
                    fileAccessor.displayFile();
                }
                return;
            });
            $(element).on('change', function () {

                const file = getElementFile(element);
                if (file) {
                    if (!validateInputFile(file, fileAccessor)) {
                        $(element).val('');
                        return;
                    }
                    populateFileInfo(file, fileAccessor);
                    fileAccessor.uploadFile();
                }
            });
        },
        update: function (element, valueAccessor) {
            var fileAccessor = valueAccessor();
            if (isFileInfoEmpty(fileAccessor)) {
                $(element).val('');//clear element if value accessor had been cleared
            }
        }
    };

    ko.bindingHandlers.displayAttachmentStatus = {
        update: function (element, valueAccessor) {
            const filesManager = valueAccessor();
            const B = 1048576;
            const maxAllowedSize = filesManager.getMaxAllowedSize();
            const usedSpace = filesManager.totalAttachmentsSize();
            element.innerHTML = `<b>${utilities.bytesToSize(usedSpace)}</b> ${resourceFetcher.get(texts).outOf} <b>${utilities.bytesToSize(maxAllowedSize * B)}</b>`;
        }
    };

});
