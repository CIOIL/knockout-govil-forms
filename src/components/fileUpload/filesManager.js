define([
    'common/components/fileUpload/texts',
    'common/utilities/stringExtension',
    'common/external/q',
    'common/core/generalAttributes',
    'common/components/fileUpload/utilities',
    'common/utilities/resourceFetcher'
], function (texts, stringExtension, Q, generalAttributes, utilities, resourceFetcher) {//eslint-disable-line max-params

    const defaultSizeLimit = 60;

    const attachedFilesInForm = ko.observableArray();
    const allUplaodFiles = ko.observableArray();

    // const removeAllAttachments = () => {
    //     attachedFilesInForm.each((file) => file.remove())
    // }

    const totalAttachmentsSize = ko.computed(() => {
        let total = 0;
        ko.utils.arrayForEach(attachedFilesInForm(), (file) => {
            total += ko.unwrap(file.size) || 0;
        });
        return total;
    });

    const registerCompletedFile = (newFile) => {
        attachedFilesInForm.push(newFile);
    };

    const removeFile = (file) => {
        attachedFilesInForm.remove(file);
        allUplaodFiles.remove(file);
    };

    const addFile = (newFile) => {
        allUplaodFiles.push(newFile);
    };

    const allUploadsCompleted = function () {
        return Q.all(ko.unwrap(allUplaodFiles).map(a => a.uploadRequest));
    };
    const attachedFilesIds = function () {
        return ko.unwrap(attachedFilesInForm).map(a => a.id());
    };
    const getMaxAllowedSize = () => {
        const attachmentsSettings = generalAttributes.get('attachments') || {};
        return attachmentsSettings.attchmentsMaxSize || defaultSizeLimit;
    };

    const isMultiFiles = () => {
        const attachmentsSettings = generalAttributes.get('attachments');
        return attachmentsSettings && attachmentsSettings.hasOwnProperty('isMultiAttachments') ? attachmentsSettings.isMultiAttachments : false;
    };

    const attchmentsSizeStatus = ko.computed(() => {
        const K = 1024;
        const maxAllowedSize = getMaxAllowedSize();
        const usedSpace = totalAttachmentsSize();
        return stringExtension.format(resourceFetcher.get(texts).attachmentsStatusSize, [utilities.bytesToSize(usedSpace), utilities.bytesToSize(maxAllowedSize * K)]);
    });

    return {
        attachedFilesInForm,
        totalAttachmentsSize,
        registerCompletedFile,
        removeFile,
        allUploadsCompleted,
        defaultSizeLimit,
        attchmentsSizeStatus,
        getMaxAllowedSize,
        isMultiFiles,
        attachedFilesIds,
        addFile
    };

});