define([
    'common/infrastructureFacade/tfsMethods',
    'common/core/generalAttributes'

], function (tfsMethods, generalAttributes) {

    if (generalAttributes.isGovForm() && tfsMethods.isMobile()) {
        $('body').addClass('mobile-ui');
        $('body').removeClass('dsk-view');
    }

});