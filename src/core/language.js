define(['common/core/exceptions'

], function (formExceptions) {

    const updateFormDirection = function (isRtl) {
        const ltrClassName = 'ltr';
        if (isRtl) {
            $('body').removeClass(ltrClassName);
        } else {
            $('body').addClass(ltrClassName);
        }
    };
    const setFormLanguage = function (isRtl) {
        updateFormDirection(isRtl);
    };

    const toggleLanguageDiv = () => {
        var oLightBackGround = {
            key: 'background', val: 'rgba(223, 223, 223, 0.5)'
        };
        var languageMenu = $('.culture-menu');
        var modalId = $('#my_modal_id');

        if (languageMenu.length < 1 || modalId.length < 1) {
            formExceptions.throwFormError('missimg multi languages CSS');
        }

        languageMenu.toggle();

        if (languageMenu.is(':visible')) {
            modalId.css(oLightBackGround.key, oLightBackGround.val);
            modalId.height($(document).height());
            modalId.removeClass('hide');
        }
        else {
            modalId.css(oLightBackGround.key, '');
            modalId.addClass('hide');
        }
    };

    return {
        setFormLanguage,
        toggleLanguageDiv
    };
});