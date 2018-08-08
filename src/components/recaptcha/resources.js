define([], () => {

    return {
        selectors: {
            body: 'body'
        },
        errors: {
            recaptchaSettings: 'racaptcha settings must be an object',
            widgetId: 'parameter widgetId is null or empty'
        },
        sitekey: {
            dev: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            test: '6Lc90B8UAAAAAMpl-3XeCIOxuCy7rZhdGC1h2DNg',
            production: '6Lc90B8UAAAAAMpl-3XeCIOxuCy7rZhdGC1h2DNg'
        },
        widget: {
            id: 'widgetId',
            render: 'captchaRender',
            defer: 'defer'
        }
    };
});