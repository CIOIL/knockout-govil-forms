define(['common/components/recaptcha/recaptchaCollection',
    'common/components/recaptcha/recaptchaWrapper',
    'common/components/recaptcha/recaptchaView',
    'common/external/q',
    'common/core/generalAttributes',
    'common/core/exceptions',
    'common/components/recaptcha/resources'],
    function (recaptchaCollection,recaptchaWrapper,recaptchaView, Q,generalAttributes,exceptions,resources) {//eslint-disable-line max-params

        const callback = function (response,widgetId) {
            let currentRecaptcha = recaptchaCollection.getRecaptchaByWidgetId(widgetId);
            currentRecaptcha['defer'].resolve({ recaptchaKey: response });
        };

        const getSiteKeyByEnvirement = ()=>{
            return resources.sitekey[generalAttributes.getTargetEnvoirment()];
        };

        const defaultSettings = {
            theme: 'light',
            tabindex: 0,
            size: 'invisible',
            badge: 'bottomleft'
        };

        const recaptchaSettingsFactory = (settings)=>{
            const{ widgetId } = settings;
            return Object.assign(settings,{
                callback: (response) => {
                    callback(response,widgetId);
                },
                sitekey:getSiteKeyByEnvirement()
            });
            
        };

        const validateSettings = (settings) =>{
            if(typeof settings !== 'object'){
                exceptions.throwFormError(resources.errors.recaptchaSettings);
            } 
            const { widgetId } = settings;
            if( typeof widgetId !== 'string' || widgetId.length === 0){
                exceptions.throwFormError(resources.errors.widgetId);
            }
        };

        const isReaptchaRendered = (widgetId) => {
            const recaptchaWidget = recaptchaCollection.getRecaptchaByWidgetId(widgetId);
            const captchaRender = recaptchaWidget[resources.widget.render];
            
            return captchaRender !== null;
        };

        const renderRecaptcha = (settings) => {
            const captchaRender = recaptchaWrapper.render(settings);
            const recaptchaWidget = recaptchaCollection.getRecaptchaByWidgetId(settings.widgetId);
            recaptchaWidget[resources.widget.render] = captchaRender;
        };

        const resetRecaptcha = (widgetId) => {
            const recaptchaWidget = recaptchaCollection.getRecaptchaByWidgetId(widgetId);
            const captchaRender = recaptchaWidget[resources.widget.render];
            recaptchaWrapper.reset(captchaRender);
        };

        const executeRecaptcha = (widgetId) => {
            const recaptchaWidget = recaptchaCollection.getRecaptchaByWidgetId(widgetId);
            recaptchaWrapper.execute(recaptchaWidget[resources.widget.render]);
        };

        const createRecaptcha = (settings) => {
            const { widgetId } = settings;
            if (!isReaptchaRendered(widgetId)) {
                recaptchaView.addWidgetRecaptchaDiv(widgetId);
                renderRecaptcha(settings);
            } else {
                resetRecaptcha(widgetId);
            }
        };
      
        class RecaptchaGenerator {
            constructor(settings ={}) {
                validateSettings(settings);
                settings = Object.assign({},defaultSettings,settings);
                this.settings =  recaptchaSettingsFactory(settings);
            }

            generate() {
                const defer = Q.defer();
                const { widgetId } = this.settings;
                
                recaptchaCollection.addWidgetToRecaptchaCollection(widgetId,defer);
                createRecaptcha(this.settings);
                executeRecaptcha(widgetId);
                return defer.promise;
            }
        }
       
        return RecaptchaGenerator;
    });