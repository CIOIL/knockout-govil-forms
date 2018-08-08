define(['common/components/recaptcha/resources'], function (resources) {

    ko.bindingHandlers.addRecaptchaWidgetId = {
        init: function (element, valueAccessor) {
            const widgetId = valueAccessor;
            $(element).append(`<div id=${widgetId}></div>`);
        }
    };
    
    const addWidgetRecaptchaDiv = (widgetId) => {
        const element = $(resources.selectors.body);
        ko.bindingHandlers.addRecaptchaWidgetId.init(element, widgetId);
    };

    return {
        addWidgetRecaptchaDiv
    };
    
});