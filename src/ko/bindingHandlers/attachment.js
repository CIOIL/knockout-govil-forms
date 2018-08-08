
define(['common/utilities/stringExtension',
        'common/components/formInformation/formInformationViewModel',
        'common/resources/tfsAttributes',
        'common/elements/attachmentMethods',
        'common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/infrastructureFacade/tfsMethods',
        'common/viewModels/languageViewModel',
        'common/ko/globals/multiLanguageObservable'
],
    function (stringExtension, formInformation, tfsAttributes, attachmentMethods, exceptions,//eslint-disable-line max-params
        exceptionsMessages, tfsMethods, languageViewModel) {

        var attachmentElement, attachmentValue, table, attachmentIndex,
            attachmentUniqueName = '', attachmentSize = '',
            notFound = -1;

        var addFileName = function addFileName(element, isTable, value) {
            var agatDataAttributes = attachmentMethods.getAgatDataAttributes();

            if (isTable) {
                $(element).data(agatDataAttributes.filename.dynamictable, value);
            }
            $(element).data(agatDataAttributes.filename.elementAttribute, value);
        };

        var addFileSizeAttr = function addFileSizeAttr(element, isTable, value) {
            var agatDataAttributes = attachmentMethods.getAgatDataAttributes();
            if (isTable) {
                $(element).data(agatDataAttributes.fileSizeAttr.dynamictable, value);
            }
            $(element).data(agatDataAttributes.fileSizeAttr.elementAttribute, value);
        };

        var addDataFsize = function addDataFsize() {
            $(attachmentElement).attr('data-fsize', attachmentSize);
        };

        var addBackupFileName = function addBackupFileName(element, uniqueAttachmentsName) {
            if (!element.data(attachmentMethods.resources.dataAttributes.backUpFilename)) {
                element.data(attachmentMethods.resources.dataAttributes.backUpFilename, uniqueAttachmentsName);
            }
        };

        var addBackUpFsize = function addBackUpFsize(element, uniqueAttachmentsSizes) {
            if (!element.data(attachmentMethods.resources.dataAttributes.backUpFsize)) {
                element.data(attachmentMethods.resources.dataAttributes.backUpFsize, uniqueAttachmentsSizes);
            }
        };

        var handelUniqueAttachmentsNames = function handelUniqueAttachmentsNames(uniqueAttachmentsNames) {
            if (uniqueAttachmentsNames) {
                var arryUniqueAttachmentsNames = uniqueAttachmentsNames.slice();
                addBackupFileName(table, arryUniqueAttachmentsNames);
                attachmentUniqueName = uniqueAttachmentsNames[attachmentIndex];
                uniqueAttachmentsNames[attachmentIndex] = ''; // remove uniqueAttachmentsNames - if user delete the row and add again                 
            }
        };

        var handleAttachmentsSizes = function handleAttachmentsSizes(attachmentsSizes) {
            if (attachmentsSizes) {
                var arryUniqueAttachmentsSizes = attachmentsSizes.slice();
                addBackUpFsize(table, arryUniqueAttachmentsSizes);
                attachmentSize = attachmentsSizes[attachmentIndex];
                attachmentsSizes[attachmentIndex] = '';
            }
        };

        var handleAttachmentUniqueName = function handleAttachmentUniqueName() {
            attachmentUniqueName = attachmentMethods.getAttachmentsUniqueNames($(attachmentElement), false);
            addBackupFileName($(attachmentElement), attachmentUniqueName);
            addFileName($(attachmentElement), false, '');
        };

        var handleAttachmentSize = function handleAttachmentSize() {
            attachmentSize = attachmentMethods.getFileSizeAttr($(attachmentElement), false);
            addBackUpFsize($(attachmentElement), attachmentSize);
            addFileSizeAttr($(attachmentElement), false, '');
        };

        var isExistAttachmentUniqueName = function isExistAttachmentUniqueName() {
            return attachmentUniqueName && attachmentUniqueName !== '';
        };

        var getExtensionsAsArray = function getExtensionsAsArray() {
            return attachmentMethods.getExtensions(attachmentElement).split(';') || [''];
        };

        var handleMobile = function handleMobile() {
            if (tfsMethods.isMobile()) {
                ko.applyBindingsToNode(attachmentElement, { attr: { tfsmaxfilesize: attachmentMethods.resources.mobileDefaults.maxfilesize } });

                //set extensions
                if ($(attachmentElement).attr(tfsAttributes.TFSEXTENSIONS)) {
                    var mobileExtensions = attachmentMethods.resources.mobileDefaults.extensions;
                    var filteredExtensions = $.grep(getExtensionsAsArray(), function (extension)
                    { return $.inArray(extension, mobileExtensions) !== notFound; }).join(';');
                    ko.applyBindingsToNode(attachmentElement, { attr: { tfsextensions: filteredExtensions } });
                }
            }
        };

        var getValueAccessor = function getValueAccessor(valueAccessor) {//eslint-disable-line consistent-return
            if (ko.isObservable(valueAccessor())) {
                return valueAccessor();
            }
            else {
                exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'valueAccessor', 'ko.observable'));
            }
        };

        /**     
             * @memberof ko         
             * @function "ko.bindingHandlers.tlpAttachment"
             * @description custom binding for handling all attachment related issues
            * responsible for:
            <ul>
            <li> adjusts extensions and file size to mobile standards if needed </li>
            <li> applies changes made by infrastructure to support duplicate attachment names </li>   
            <li> backups the attachment names array provided by the infrastructure (as part of handling duplicate attachment) </li>
            <li> applies changes made by infrastructure to support attachments sizes </li>
            <li> backups the attachment sizes array provided by the infrastructure (as part of handling attachments sizes) </li>
            <li> updates the relevant attributes in each newly added row</li>
            </ul>
        * @example 
        * tlpAttachment: viewModel.fileName
        */

        ko.bindingHandlers.tlpAttachment = {
            init: function init(element, valueAccessor) {
                if (!formInformation.serverMode()) {
                    attachmentElement = element;
                    attachmentValue = getValueAccessor(valueAccessor);

                    handleMobile();

                    var bindToAccessibleLabel = function () {
                        var linkElement = attachmentMethods.getLinkElement(element);
                        var labeledBy = element.getAttribute('aria-labelledby');//if label had been linked using aria-labelledby pass it to wrapper a as is
                        var describedBy = element.getAttribute('aria-describedby');//if description had been linked using aria-describedby pass it to wrapper a as is
                        var label = attachmentMethods.getLabelElement(element);
                        if (!labeledBy) {
                            if (label) {
                                label.id = label.id ? label.id : element.id + '_lbl';
                                labeledBy = label.id;
                            }
                        }
                        linkElement.get(0).setAttribute('aria-labelledby', labeledBy);
                        linkElement.get(0).setAttribute('aria-describedby', describedBy);

                        //temporary, to be removed after close infrastructure bug no. 83462 
                        linkElement.get(0).setAttribute('role', 'button');
                        //TODO: support languages
                        linkElement.get(0).setAttribute('alt', 'לחץ להוספת קובץ');
                        linkElement.get(0).setAttribute('data-tofocus', true);
                    };
                    bindToAccessibleLabel();
                    var handleAttachmentInTable = function handleAttachmentInTable() {
                        attachmentIndex = attachmentMethods.getAttachmentIndexInTable(attachmentElement);

                        table = attachmentMethods.getClosestTable(attachmentElement);

                        var uniqueAttachmentsNames = attachmentMethods.getAttachmentsUniqueNames($(table), true);

                        handelUniqueAttachmentsNames(uniqueAttachmentsNames);

                        var attachmentsSizes = attachmentMethods.getFileSizeAttr(table, true);

                        handleAttachmentsSizes(attachmentsSizes);
                    };

                    if (attachmentMethods.isAttachmentInTable(element)) {

                        handleAttachmentInTable();

                    }
                    else {
                        handleAttachmentUniqueName();
                        handleAttachmentSize();
                    }

                    if (isExistAttachmentUniqueName(attachmentUniqueName)) {
                        attachmentValue(attachmentUniqueName);
                    }

                    addDataFsize();
                }
            },
            update: function (element, valueAccessor) {
                if (!formInformation.serverMode()) {

                    var coverInput = attachmentMethods.getCoverElement(element);
                    var resources = attachmentMethods.texts;
                    var language = ko.unwrap(languageViewModel.language);
                    var titles = ko.multiLanguageObservable({
                        resource: resources, language: language
                    });
                    var value = getValueAccessor(valueAccessor);
                    var attachmentName = value();

                    var removeAttachment = function () {
                        try {
                            if (!attachmentName) {
                                tfsMethods.attachment.removeAttachmentByElem(element);
                            }
                        } catch (e) {
                            return;
                        }
                    };

                    removeAttachment(attachmentName);

                    var isPopulated = function isPopulated(attachmentName) {
                        return typeof attachmentName === 'string' &&
                            attachmentName.length > 0 &&
                            attachmentName !== titles().addAttachment;
                    };


                    var isPopulatesAttachment = isPopulated(attachmentName);

                    var getTitleMessage = function () {
                        return isPopulatesAttachment ?
                            stringExtension.format(titles().displayAttachment, attachmentName) :
                            titles().addAttachment;
                    };

                    var titleMessage = getTitleMessage();

                    var addAttributes = function addAttributes() {
                        var coverInputAttr = {
                            readonly: isPopulatesAttachment,
                            title: titleMessage
                        };
                        $(element).attr({
                            title: titleMessage,
                            tfsuploaded: isPopulatesAttachment,
                            placeholder: titleMessage
                        });
                        if (!$(coverInput).get(0).hasAttribute('_title')) {
                            coverInputAttr._title = titles().addAttachment;
                        }
                        $(coverInput).attr(coverInputAttr);
                    };

                    var getAction = function getAction() {
                        return isPopulatesAttachment ? attachmentMethods.resources.actions.displayAttachment : attachmentMethods.resources.actions.addAttachment;
                    };

                    addAttributes();

                    if (attachmentMethods.hasImgTFSAction(element)) {
                        attachmentMethods.getImg(element).attr('title', titleMessage);
                        $(element).
                            attr({
                                title: titleMessage,
                                tfsaction: getAction()
                            });
                    }
                }
            }
        };


        /**     
         * @memberof ko         
         * @function "ko.bindingHandlers.tlpEnableAttachment"
         * @description custom binding for enabled or disabled attachment.
         * @example 
         * tlpEnableAttachment: viewModel.isEnableAttachment
       */

        ko.bindingHandlers.tlpEnableAttachment = {
            update: function (element, valueAccessor) {

                var wrapperInput = attachmentMethods.getWrapperElement(element);

                valueAccessor = valueAccessor();
                var isEnabled = ko.unwrap(typeof valueAccessor === 'function' ? valueAccessor() : valueAccessor);
                isEnabled = isEnabled ? isEnabled.toString().toLowerCase() === 'true' : false;

                $(element).attr('disabled', !isEnabled);
                $(wrapperInput).attr('disabled', !isEnabled);
            }
        };
    });
