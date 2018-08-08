define(['common/elements/attachmentMethods',
    'common/elements/lookUpMethods',
    'common/elements/dateMethods',
    'common/elements/autocompleteMethods',
    'common/viewModels/languageViewModel'],
    function (attachmentMethods, lookUpMethods, dateMethods, autocompleteMethods, languageViewModel) { //eslint-disable-line max-params
        var isCheckBox = function (element) {
            return element.is(':checkbox');
        };

        var isRadio = function (element) {
            return element.is(':radio');
        };

        const isGovFile = (element) => {
            return element.is(':file') && element.hasClass('input-file');
        };

        const isDatepicker = function (element) {
            return $(element).hasClass('date-field');
        };
        const getDatepickerElement = function (element) {
            var datepickerButtonElement = $(element).parent().find('.datepicker-button');
            return languageViewModel.isRtl() || !datepickerButtonElement[0] ? $(element) : datepickerButtonElement;
        };
        const isMultipleAutocomplete = function (element) {
            return $(element).hasClass('multiple-autocomplete-field');
        };
        const getWrapperMultipleAutocomplete = function (element) {
            return $(element).parent('.multiple-autocomplete-container');
        };
       
        var elementTypes = {
            multipleAutocomplete: {
                is: isMultipleAutocomplete,
                getMessageLocation: getWrapperMultipleAutocomplete
            },
            autocomplete: {
                is: autocompleteMethods.isAutocomplete,
                getLabel: autocompleteMethods.getLabelElement,
                getMessageLocation: autocompleteMethods.getWrapperElement
            },
            lookup: {
                is: lookUpMethods.isLookUp,
                getLabel: lookUpMethods.getLabelElement,
                getMessageLocation: lookUpMethods.getWrapperElement
            },
            attachment: {
                is: attachmentMethods.isAttachment,
                getLabel: attachmentMethods.getLabelElement,
                getMessageLocation: attachmentMethods.getWrapperElement
            },
            tlpDatepicker: {
                is: isDatepicker,
                getMessageLocation: getDatepickerElement
            },
            date: {
                is: dateMethods.isDate,
                getMessageLocation: dateMethods.getButtonElement
            },
            checkbox: {
                is: isCheckBox,
                getMessageLocation: function (currentElement) {
                    return currentElement.parents('.required-wrapper');
                }
            },
            radio: {
                is: isRadio
            },
            govFile: {
                is: isGovFile,
                getMessageLocation: function (currentElement) {
                    return currentElement.parents('.file-wrapper');
                }
            }
        };

        return elementTypes;

    });