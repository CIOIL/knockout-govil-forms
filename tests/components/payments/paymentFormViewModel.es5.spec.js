define(['common/components/payments/paymentFormViewModel'], function (paymentForm) {

    var readyToRequestPromise = require('common/core/readyToRequestPromise');
    var generalAttributes = require('common/core/generalAttributes');
    var tfsMethods = require('common/infrastructureFacade/tfsMethods');
    var resourceFetcher = require('common/utilities/resourceFetcher');
    var indicators = require('common/resources/texts/indicators');
    var biztalkHandler = require('common/core/biztalkHandler');
    var languageViewModel = require('common/viewModels/languageViewModel');
    describe('createPaymentFormViewModel', function () {

        var paymentFormVM;
        beforeEach(function () {

            ko.postbox.publish('documentReady');
            spyOn(generalAttributes, 'getTargetServerName').and.returnValue('production');
        });
        it('createPaymentFormViewModel function be defined', function () {
            expect(paymentForm.createPaymentFormViewModel).toBeDefined();
        });
        describe('settings', function () {
            it('settings is optional', function () {
                expect(function () {
                    paymentForm.createPaymentFormViewModel();
                }).not.toThrow();
            });
            it('settings can contains vidNumber', function () {
                paymentFormVM = paymentForm.createPaymentFormViewModel({ vidNumber: '293' });
                expect(paymentFormVM.vid).toEqual('293');
            });
            it('settings can contains language', function () {
                paymentFormVM = paymentForm.createPaymentFormViewModel({ language: 'ar' });
                expect(paymentFormVM.language).toEqual('ar');
            });
            it('language taken from languageViewModel if not recieved by settings', function () {
                spyOn(languageViewModel, 'getShortName').and.returnValue('en');

                paymentFormVM = paymentForm.createPaymentFormViewModel();
                expect(paymentFormVM.language).toEqual('en');
            });
            it('settings can contains paymentServiceType', function (done) {
                paymentFormVM = paymentForm.createPaymentFormViewModel({ paymentServiceType: 'counter' });
                readyToRequestPromise.then() //eslint-disable-line
                .done(function () {
                    expect(paymentFormVM.action()).toEqual('ecomdomains_prod_mock/counter/general/direction.aspx');
                    done();
                });
            });
            it('settings can contains paymentServiceType and serviceParameters', function (done) {
                paymentFormVM = paymentForm.createPaymentFormViewModel({ paymentServiceType: 'counter', serviceParameters: '?counter=59&catalog=2&category=justiceformspayments_2_justiceformspaymentsnew&language=he' });
                readyToRequestPromise.then() //eslint-disable-line
                .done(function () {
                    expect(paymentFormVM.action()).toEqual('ecomdomains_prod_mock/counter/general/direction.aspx?counter=59&catalog=2&category=justiceformspayments_2_justiceformspaymentsnew&language=he');
                    done();
                });
            });
            it('paymentServiceType is voucher by default', function (done) {
                paymentFormVM = paymentForm.createPaymentFormViewModel();
                readyToRequestPromise.then() //eslint-disable-line
                .done(function () {
                    expect(paymentFormVM.action()).toEqual('ecomdomains_prod_mock/voucherspa/directed');
                    done();
                });
            });
            it('retrieval URL is depend by domain', function (done) {
                paymentFormVM = paymentForm.createPaymentFormViewModel();
                readyToRequestPromise.then() //eslint-disable-line
                .done(function () {
                    expect(paymentFormVM.retrieval()).toEqual('ecomdomains_prod_mock/FormsPaymentReceiptReproduction/ReceiptReproduction.aspx');
                    done();
                });
            });
        });
    });
    var responses = {
        sucsses: 'res:FSFEdwd',
        biztalkFailure: 'err:fdsfs',
        unUnique: 'ERR: מספר סימוכין זה כבר קיים במערכת. (0007)',
        pmFailure: 'ERROR 1364'
    };
    describe('callBackPayment function', function () {
        var paymentFormVM;
        beforeEach(function () {
            paymentFormVM = paymentForm.createPaymentFormViewModel();
            spyOn($.fn, 'submit');
            spyOn(tfsMethods.dialog, 'alert');
            spyOn(biztalkHandler, 'isSendingSucceeded').and.callThrough();
        });
        it('response is undefined - throw', function () {
            expect(function () {
                paymentFormVM.callBackPayment();
            }).toThrow();
        });
        it('response of success - submit to ecom', function () {
            paymentFormVM.callBackPayment(responses.sucsses);
            expect($.fn.submit).toHaveBeenCalled();
        });
        it('response of biztalk failure - show error message', function () {
            paymentFormVM.callBackPayment(responses.biztalkFailure);
            expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(resourceFetcher.get(indicators.errors).biztalkError, jasmine.anything());
        });
        it('response of un-unique reference number - show uniqSubmitMessage message', function () {
            paymentFormVM.callBackPayment(responses.unUnique);
            expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(resourceFetcher.get(indicators.errors).uniqSubmitMessage, jasmine.anything());
        });
        it('response of PM failure - show error message', function () {
            paymentFormVM.callBackPayment(responses.pmFailure);
            expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(resourceFetcher.get(indicators.errors).biztalkError, jasmine.anything());
        });
        it('response can be object with strURL parameter', function () {
            paymentFormVM.callBackPayment({ strURL: responses.sucsses });
            expect(biztalkHandler.isSendingSucceeded).toHaveBeenCalledWith(responses.sucsses);
        });
        it('response can be directly string', function () {
            paymentFormVM.callBackPayment(responses.sucsses);
            expect(biztalkHandler.isSendingSucceeded).toHaveBeenCalledWith(responses.sucsses);
        });
        it('response of success - encString is filled up', function () {
            paymentFormVM.callBackPayment(responses.sucsses);
            expect(paymentFormVM.encString()).toEqual('FSFEdwd');
        });
    });
});define('spec/paymentFormViewModel.js', function () {});