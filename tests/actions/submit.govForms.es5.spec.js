define(['common/actions/submit'], function (submit) {
    var subscriber;
    var delay = 500;
    var eventHandlers = {
        beforeSubmitHandler: function beforeSubmitHandler() {
            return;
        }
    };

    describe('submit', function () {
        beforeEach(function () {
            if (subscriber) {
                subscriber.dispose();
            }
        });
        it('should invoke validation event', function (done) {
            subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                setTimeout(function () {
                    expect(data).toBeDefined();
                    done();
                }, delay);
            });
            submit.submitForm();
        });
        it('reject validation should abort submit', function (done) {
            spyOn(eventHandlers, 'beforeSubmitHandler');
            subscriber = ko.postbox.subscribe('userBeforeSubmitForm', eventHandlers.beforeSubmitHandler);

            ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                data.deferred.resolve();
            });
            setTimeout(function () {
                expect(eventHandlers.beforeSubmitHandler).toHaveBeenCalled();
                done();
            }, delay);
            submit.submitForm();
        });
        xit('resolve validation should  submit', function (done) {
            submit.submitForm();
            subscriber = ko.postbox.subscribe('userBeforeSubmitForm', eventHandlers.beforeSubmitHandler);
            subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                data.deferred.resolve();
            });
            setTimeout(function () {
                expect(eventHandlers.beforeSubmitHandler).toHaveBeenCalled();
                done();
            }, delay);
        });
        xit('should invoke beforeSubmit event', function () {
            submit.submitForm();
            subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                data.deferred.resolve();
            });
        });
        xit('reject in userBeforeSubmit should abort submit', function (done) {
            submit.submitForm();
            subscriber = ko.postbox.subscribe('userBeforeSubmitForm', function (data) {
                data.deferred.reject();
                setTimeout(function () {
                    expect(data).toBeDefined();
                    done();
                }, delay);
            });
        });
        xit('resolve validation should allow submit', function (done) {
            submit.submitForm();
            subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                setTimeout(function () {
                    expect(data).toBeDefined();
                    done();
                }, delay);
            });
        });
    });
});