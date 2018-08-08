define(['common/components/recaptcha/recaptchaGenerator', 'common/core/generalAttributes', 'common/external/q'], function (recaptchaGenerator, generalAttributes, Q) {
    //eslint-disable-line

    describe('recaptcha', function () {
        beforeEach(function () {
            var productionServerName = 'production';
            spyOn(generalAttributes, 'getTargetEnvoirment').and.returnValue(productionServerName);
        });
        describe('settings', function () {
            it('recaptcha type should be a function', function () {
                expect(typeof recaptchaGenerator === 'function').toBeTruthy();
            });
            it('is not an object', function () {
                expect(function () {
                    new recaptchaGenerator(true);
                }).toThrowError('racaptcha settings must be an object');
            });
            it('send with no widgetId', function () {
                expect(function () {
                    new recaptchaGenerator({});
                }).toThrowError('parameter widgetId is null or empty');
            });
            it('widgetId is empty string', function () {
                expect(function () {
                    new recaptchaGenerator({ widgetId: '' });
                }).toThrowError('parameter widgetId is null or empty');
            });
            it('widgetId is empty string', function () {
                expect(function () {
                    new recaptchaGenerator({ callback: function callback() {} });
                }).toThrowError('parameter widgetId is null or empty');
            });
            it('widgetId is string and not empty', function () {
                expect(function () {
                    new recaptchaGenerator({ widgetId: 'widget_id' });
                }).not.toThrow();
            });
        });
        var recaptchaKeyDefer, recaptchaKeyPromise;
        var generateRecaptcha = function generateRecaptcha(widgetId) {
            recaptchaKeyDefer = Q.defer();
            var reacaptcha = new recaptchaGenerator({ widgetId: widgetId });
            window.grecaptcha.render = jasmine.createSpy().and.callFake(function () {
                recaptchaKeyDefer.resolve({ responseKey: 'render' });
            });
            window.grecaptcha.reset = jasmine.createSpy().and.callFake(function () {
                recaptchaKeyDefer.resolve({ responseKey: 'reset' });
            });
            reacaptcha.generate();
            recaptchaKeyPromise = recaptchaKeyDefer.promise;
        };
        describe('generate', function () {
            beforeEach(function () {
                window.grecaptcha = undefined;
                window.grecaptcha = jasmine.createSpyObj('grecaptcha', ['render', 'execute', 'reset']);
            });

            it('with new widget id should call recaptcha render', function (done) {
                generateRecaptcha('widget_id1');
                recaptchaKeyPromise.then(function (response) {
                    expect(response).toEqual({ responseKey: 'render' });
                    done();
                });
            });
            it('with exist widget id should call recaptcha reset', function (done) {
                generateRecaptcha('widget_id1');
                recaptchaKeyPromise.then(function (response) {
                    expect(response).toEqual({ responseKey: 'reset' });
                    done();
                });
            });
            it('with another new widget id should call recaptcha render', function (done) {
                generateRecaptcha('widget_id2');
                recaptchaKeyPromise.then(function (response) {
                    expect(response).toEqual({ responseKey: 'render' });
                    done();
                });
            });
        });

        describe('recaptchaView', function () {
            beforeEach(function () {
                window.grecaptcha = undefined;
                window.grecaptcha = jasmine.createSpyObj('grecaptcha', ['render', 'execute', 'reset']);
                ko.cleanNode(document.body);
                jasmine.getFixtures().fixturesPath = '/base/Tests/components/recaptcha/templates';
                loadFixtures('recaptchaGenerator.html');
            });
            it('widget should add to the DOM', function (done) {
                generateRecaptcha('widget_id1');
                recaptchaKeyPromise.then(function () {
                    var captchaId = $('#widget_id1');
                    expect(captchaId[0]).toBeDefined();
                    done();
                });
            });
        });
    });
});