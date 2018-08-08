define(['common/actions/print', 'common/actions/validate'], function (print) {
    var beforePrintSubscriber, validateSubscriber;
    var delay = 1500;

    var eventHandlers = {
        beforePrintHandler: function beforePrintHandler() {
            return;
        }
    };

    describe('printForm', function () {
        beforeEach(function () {
            spyOn(window, 'print').and.callFake(function () {});
            spyOn(eventHandlers, 'beforePrintHandler');

            if (beforePrintSubscriber) {
                beforePrintSubscriber.dispose();
            }
            if (validateSubscriber) {
                validateSubscriber.dispose();
            }
        });
        it('verfy existence', function () {
            expect(print.printForm).toBeDefined();
        });

        it('should invoke validation event with context print', function (done) {
            validateSubscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                expect(data.publishedData.context).toEqual('printForm');
                done();
            });
            print.printForm();
        });

        it('reject validation should abort print', function (done) {
            validateSubscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                data.deferred.reject();
            });
            print.printForm();
            setTimeout(function () {
                expect(eventHandlers.beforePrintHandler).not.toHaveBeenCalled();
                done();
            }, delay);
        });

        it('resolve validation should allow print', function (done) {
            //spyOn(eventHandlers, 'beforePrintHandler').and.callThrough();
            beforePrintSubscriber = ko.postbox.subscribe('userBeforePrint', eventHandlers.beforePrintHandler);
            validateSubscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                data.deferred.resolve();
            });
            print.printForm();
            setTimeout(function () {
                expect(eventHandlers.beforePrintHandler).toHaveBeenCalled();
                done();
            }, delay);
        });

        it('reject in userBeforePrint should abort print', function (done) {
            beforePrintSubscriber = ko.postbox.subscribe('userBeforePrint', function (data) {
                data.deferred.reject();
            });
            print.printForm();
            setTimeout(function () {
                expect(window.print).not.toHaveBeenCalled();
                done();
            }, delay);
        });

        it('reject in userBeforeSubmit should allow print', function (done) {
            beforePrintSubscriber = ko.postbox.subscribe('userBeforePrint', function (data) {
                data.deferred.resolve();
            });
            print.printForm();
            setTimeout(function () {
                expect(window.print).toHaveBeenCalled();
                done();
            }, delay);
        });

        it('print subscriber get data', function (done) {
            beforePrintSubscriber = ko.postbox.subscribe('userBeforePrint', function (data) {
                setTimeout(function () {
                    expect(data.publishedData.a).toEqual(1);
                    expect(data.publishedData.b).toEqual(2);
                    done();
                }, delay);
            });
            print.printForm({ a: 1, b: 2 });
        });
        it('should invoke userAfterPrint event', function (done) {
            beforePrintSubscriber = ko.postbox.subscribe('userAfterPrint', function () {
                setTimeout(function () {
                    done();
                }, delay);
            });
            print.printForm({ a: 1, b: 2 });
        });
    });
});