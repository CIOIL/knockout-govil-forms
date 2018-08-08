define(['common/components/recaptcha/recaptchaCollection', 'common/external/q'], function (recaptchaCollection, Q) {
    //eslint-disable-line

    var widgetId, defer, widget;
    describe('recaptchaCollection', function () {
        var addWidgetToRecaptchaCollection = function addWidgetToRecaptchaCollection() {
            widgetId = 'container_id';
            defer = Q.defer;
            recaptchaCollection.addWidgetToRecaptchaCollection(widgetId, defer);
            widget = recaptchaCollection.getRecaptchaByWidgetId(widgetId);
        };

        beforeEach(function () {
            addWidgetToRecaptchaCollection();
        });

        it('add widget to widget Collection', function () {
            var recaptcha = recaptchaCollection.getRecaptchaByWidgetId(widget.widgetId);
            expect(recaptcha.widgetId).toBe(widgetId);
        });

        it('add exist widget to widget collection', function () {
            addWidgetToRecaptchaCollection();
            var recaptcha = recaptchaCollection.getRecaptchaByWidgetId(widget.widgetId);
            expect(recaptcha.widgetId).toBe(widgetId);
        });
    });
});