define(['common/actions/validate', 'common/external/q', 'common/components/dialog/dialog'],
    function (validate, Q, dialog) {
        var subscriber;
        var deffer;
        var delay = 500;

        describe('validateForm', function () {
            beforeEach(function () {
                if (subscriber) {
                    subscriber.dispose();
                }
            });
            describe('validate context', function () {
                it('pass context - subscribe get it in publishedData object', function (done) {
                    deffer = Q.defer();
                    subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                        setTimeout(function () {
                            expect(data.publishedData.context).toEqual('print');
                            done();
                        }, delay);
                    });
                    validate.validateForm(deffer, { context:'print' });
                });
                it('default context is validateForm', function (done) {
                    deffer = Q.defer();
                    subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                        setTimeout(function () {
                            expect(data.publishedData.context).toEqual('validateForm');
                            done();
                        }, delay);
                    });
                    validate.validateForm(deffer, { });
                });
            });

            it('validation subscriber get settings', function (done) {
                deffer = Q.defer();
                subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                    setTimeout(function () {
                        expect(data.publishedData.a).toEqual(1);
                        expect(data.publishedData.b).toEqual(2);
                        done();
                    }, delay);
                });
                validate.validateForm(deffer, { a: 1, b: 2 });
            });

            it('setting include validateSuccessMessage', function (done) {
                deffer = Q.defer();
                subscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                    setTimeout(function () {
                        expect(data.publishedData.validateSuccessMessage).toEqual('נתוני הטופס תקינים');
                        done();
                    }, delay);
                });
                validate.validateForm(deffer, { a: 1, b: 2 });
            });

            it('validation event succeeded and context is validateForm diaolg alert should be called', function (done) {
                deffer = Q.defer();
                spyOn(dialog, 'alert');
                subscriber = ko.postbox.subscribe('userAfterValidateForm', function () {
                    setTimeout(function () {
                        expect(dialog.alert).toHaveBeenCalled();
                        done();
                    }, delay);
                });
                validate.validateForm(deffer, { a: 1, b: 2 });                
            });

            it('validation event succeeded and context is not validateForm diaolg alert should not be called', function (done) {
                deffer = Q.defer();
                spyOn(dialog, 'alert');
                subscriber = ko.postbox.subscribe('userAfterValidateForm', function () {
                    setTimeout(function () {
                        expect(dialog.alert).not.toHaveBeenCalled();
                        done();
                    }, delay);
                });
                validate.validateForm(deffer, { context: 'print' });
            });

            it('validation event succeeded - invoke afterValidateForm event', function (done) {
                deffer = Q.defer();
                subscriber = ko.postbox.subscribe('userAfterValidateForm', function () {
                    setTimeout(function () {
                        expect(true).toEqual(true);
                        done();
                    }, delay);
                });
                validate.validateForm(deffer, { context: 'print' });
            });
        });
    });