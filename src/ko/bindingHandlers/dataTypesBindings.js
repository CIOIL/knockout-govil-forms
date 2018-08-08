/// <reference path='../../tlpLookUp.js' />
/// <reference path='../../commonMethods.js' />
/// <reference path='../../FormsMethods.js' />
/*global ko, FormsMethods, AgatAttachment*/
define(function (require) {
    var stringExtension = require('common/utilities/stringExtension'),
        toolTips = require('common/resources/toolTips');

    ko.bindingHandlers.tlpAttachment = {

        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {//eslint-disable-line max-params, complexity
            var attachmentUniqueName = '';

            if (ko.bindingHandlers.tlpAttachment.helper.isUpdatedAGforms2Html()) {
                if (ko.bindingHandlers.tlpAttachment.helper.isAttachmentInTable(element)) {
                    var table = $(element).closest('table');
                    var attachmentIndex;
                    if (table.length) {
                        if (table.data(AgatAttachment.dataAttributes.filename.dynamictable)) {//eslint-disable-line max-depth
                            var uniqueAttachmentsNames = table.data(AgatAttachment.dataAttributes.filename.dynamictable);
                            attachmentIndex = bindingContext.$index();
                            attachmentUniqueName = uniqueAttachmentsNames[attachmentIndex];
                        }
                        if (table.data(AgatAttachment.dataAttributes.fileSizeAttr.dynamictable)) {//eslint-disable-line max-depth
                            var attachmentSizes = table.data(AgatAttachment.dataAttributes.fileSizeAttr.dynamictable);
                            attachmentIndex = bindingContext.$index();
                            $(element).attr('data-fsize', attachmentSizes[attachmentIndex]);
                        }
                    }
                } else {
                    attachmentUniqueName = $(element).data(AgatAttachment.dataAttributes.filename.elementAttribute);
                    var size = $(element).data(AgatAttachment.dataAttributes.fileSizeAttr.dynamictable);
                    $(element).attr('data-fsize', size);
                }

                if (attachmentUniqueName && attachmentUniqueName !== '') {
                    var value = valueAccessor();
                    if (ko.isObservable(value)) {
                        value(attachmentUniqueName);
                    }
                }
            }
        },
        update: function (element, valueAccessor) {//eslint-disable-line complexity

            var wrapperInput = $(element).closest('.attachment-wrapper').find('.attachment');
            var titles = toolTips.get().AGForms2HTML;
            var isPopulated = function (attachmentName) {
                return typeof attachmentName === 'string' &&
                    attachmentName.length > 0 &&
                    attachmentName !== titles.addAttachment;
            };
            var value = valueAccessor();
            var attachmentName = ko.unwrap(value);
            var isPopulatesAttachment = isPopulated(attachmentName);

            var actions = {
                displayAttachment: 'displayAttachment',
                addAttachment: 'addAttachment'
            };

            //var titles = (IsToolBarOn) ? CommonStrings.eToolTips['Toolbar'] :
            //            CommonStrings.eToolTips['AGForms2HTML'];

            var getTitleMessage = function () {

                return isPopulatesAttachment ?
                    stringExtension.format(titles.displayAttachment, attachmentName) :
                    titles.addAttachment;
            };

            if (wrapperInput.length > 0 && wrapperInput.attr('type') === 'file') {
                $(element).attr('tfsuploaded', isPopulatesAttachment);
                $(wrapperInput).attr('readonly', isPopulatesAttachment);
                if (!$(wrapperInput).hasAttribute('_title')) {
                    $(wrapperInput).attr('_title', titles.addAttachment);
                }
                $(wrapperInput).attr('title', getTitleMessage());
                $(element).attr('title', getTitleMessage());
                $(element).attr('placeholder', getTitleMessage());
            }
            if ($(element).next().attr('tfsaction') !== undefined) {
                $(element).next().attr('title', getTitleMessage());
                $(element).attr('title', getTitleMessage());
            }
            $(element).attr('tfsaction', isPopulatesAttachment ? actions.displayAttachment : actions.addAttachment);

        },
        helper: {
            isAttachmentInTable: function (element) {
                return $(element).attr('tfsrowdata') !== undefined;
            },
            isUpdatedAGforms2Html: function () {
                return typeof AgatAttachment !== 'undefined' && typeof AgatAttachment.dataAttributes !== 'undefined';
            }
        }
    };

    //function getWrapperAttachmentInput(attachmentElement) {
    //    return $(attachmentElement).closest('.attachment-wrapper').find('.attachment');
    //}

    ko.bindingHandlers.tlpEnableAttachment = {
        update: function (element, valueAccessor) {

            //var wrapperInput = FormsMethods.getWrapperAttachmentInput(element);
            var wrapperInput = $(element).closest('.attachment-wrapper').find('.attachment');
            valueAccessor = valueAccessor();
            var isEnabled = ko.unwrap(typeof valueAccessor === 'function' ? valueAccessor() : valueAccessor);
            isEnabled = isEnabled ? isEnabled.toString().toLowerCase() === 'true' : false;

            $(element).attr('disabled', !isEnabled);
            $(wrapperInput).attr('disabled', !isEnabled);
        }
    };

    ko.bindingHandlers.tlpEnableDate = {
        init: function (element, valueAccessor) {
            var underlyingObservable = ko.unwrap(valueAccessor());
            var datePicker = $(element).next('input.tfsCalendar');
            try {
                ko.applyBindingsToNode(element, { enable: underlyingObservable });
                ko.applyBindingsToNode(datePicker[0], { enable: underlyingObservable });
            }
            catch (e) {
                throw new Error('Invalid use of tlpEnableDate');
            }
        }
    };
});