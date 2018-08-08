/*
 * override ko.validation.insertValidationMessage to adjust to complex components
 * such as date-picker, attachment and look-up
 */
define(['common/ko/validate/utilities/elementGettersByType',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/core/exceptions',
    'common/viewModels/languageViewModel',
    'common/ko/bindingHandlers/accessibility'
], function (elementGettersByType, exceptionsMessages, stringExtension, exceptions) {//eslint-disable-line max-params 
    //, languageViewModel) {

    var messageLocation;

    //var isCheckBox = function (element) {
    //    return element.is(':checkbox');
    //};

    //const isDatepicker = function (element) {
    //    return $(element).hasClass('date-field');
    //};
    //const getDatepickerElement = function (element) {
    //    return languageViewModel.isRtl() ? $(element).parent().find('.date-field') : $(element).parent().find('.datepicker-button');
    //};
    // var elementTypes = {
    //     lookup: { is: lookUpMethods.isLookUp, getMessageLocation: lookUpMethods.getWrapperElement },
    //     attachment: { is: attachmentMethods.isAttachment, getMessageLocation: attachmentMethods.getWrapperElement },
    //     date: { is: dateMethods.isDate, getMessageLocation: dateMethods.getButtonElement },
    //     tlpDatepicker: { is: isDatepicker, getMessageLocation: getDatepickerElement },
    //     checkbox: {
    //         is: isCheckBox, getMessageLocation: function (currentElement) {
    //             return currentElement.parents('.required-wrapper');
    //         }
    //     }
    // };

    var getMessageLocationByType = function (currentElement) {

        for (var type in elementGettersByType) {
            if (elementGettersByType[type].is(currentElement)) {
                if (typeof elementGettersByType[type].getMessageLocation === 'function') {
                    return elementGettersByType[type].getMessageLocation(currentElement);
                }                
            }
        }
        return currentElement;
    };

  
    var insertValidationMessage = function (currentElement) {

        currentElement = $(currentElement);
        messageLocation = getMessageLocationByType(currentElement);

        var span = document.createElement('SPAN');

        span.setAttribute('aria-live', 'assertive');

        if (messageLocation && messageLocation.length > 0) {
            span.id = 'vmsg_' + currentElement[0].id;
            // span.setAttribute('errorSuffix', getErrorSuffix(currentElement));
            ko.bindingHandlers.addDescription.update(currentElement[0], function () { return span.id; });
            span.className = ko.validation.utils.getConfigOptions(currentElement[0]).errorMessageClass;
            ko.validation.utils.insertAfter(messageLocation[0], span);
        }
        else {
            var validationMessageFailed = 'could not resolve location of validation message span for: element {0}';
            exceptions.throwFormError(stringExtension.format(validationMessageFailed, currentElement.attr('id')), 'debug');

        }
        return span;
    };

    return {
        insertValidationMessage: insertValidationMessage
    };
});
