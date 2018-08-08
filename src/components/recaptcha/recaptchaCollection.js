define(['common/components/recaptcha/recaptchaWrapper',
    'common/components/recaptcha/resources',
    'common/utilities/arrayExtensions'],
    function (recaptcha,resources) {
       
        let recaptchaWidgets = [];

        class Widget {
            constructor(widgetId,captchaRender,defer = null) {
                this.widgetId = widgetId;
                this.captchaRender = captchaRender;
                this.defer = defer;
            }
            }
     
        const addWidget = (widgetId,defer) => {
            recaptchaWidgets.push(new Widget(widgetId,null,defer)); 
        };

        const getRecaptchaByWidgetId = (widgetId) => {
            return recaptchaWidgets.findObjectByKey(resources.widget.id, widgetId);
        };

        const updateWidget = (widgetId,defer) => {
            const recaptchaWidget = getRecaptchaByWidgetId(widgetId);
            recaptchaWidget[resources.widget.defer] = defer;
        };
        
        const addWidgetToRecaptchaCollection = (widgetId,defer) => {
            const recaptchaWidget = getRecaptchaByWidgetId(widgetId);
            if (!recaptchaWidget) {
                addWidget(widgetId,defer);
            } else {
                updateWidget(widgetId,defer);
            }
        };

        return {
            getRecaptchaByWidgetId,
            addWidgetToRecaptchaCollection
        };
    });