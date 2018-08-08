define([], function () {

    //const recaptchaParams = {
    //    required : ['sitekey','callback'],
    //    optional :['className','invisible','locale','size','badge']
    //};
   
    class Recaptcha {
     
        constructor() {
            
        }

        static render(settings ={}) {
            const { widgetId, ...recaptchSettings } = settings;
            return grecaptcha.render(widgetId,recaptchSettings);  //eslint-disable-line no-undef
        }

        static execute(recaptchaRender) {
            grecaptcha.execute(recaptchaRender);//eslint-disable-line no-undef
        }

        static reset(recaptchaRender) {
            grecaptcha.reset(recaptchaRender);//eslint-disable-line no-undef
        }
                
    }

    return Recaptcha;
});