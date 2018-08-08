define(['common/components/payments/paymentDetailsViewModel', 'common/viewModels/languageViewModel', 'common/infrastructureFacade/tfsMethods'],
function (paymentDetails, languageViewModel, tfsMethods) {

    describe('createPaymentViewModel', function () {

        var idNum = ko.observable('111111118');
        var firstName = ko.observable('Moshe');
        var lastName = ko.observable('Levi');
        var settings = {
            isRadioDisabled: true,
            idNum: idNum,
            firstName: firstName,
            lastName: lastName
        };

        beforeAll(function () {
            spyOn(tfsMethods, 'setFormLanguage').and.callFake(function () {
                return;
            });
        });


        var paymentDetailsVM = paymentDetails.createPaymentViewModel(settings);
        it('createPaymentViewModel function be defined', function () {
            expect(paymentDetails.createPaymentViewModel).toBeDefined();
        });
        it('model.iDNumHPNum get settings.idNum value when yesNo is 1', function () {
            paymentDetailsVM.yesNo('1');
            expect(paymentDetailsVM.iDNumHPNum()).toEqual('111111118');
        });
        it('model.firstName get settings.firstName value when yesNo is 1', function () {
            paymentDetailsVM.yesNo('1');
            expect(paymentDetailsVM.firstName()).toEqual('Moshe');
        });
        it('model.familyName get settings.lastName value when yesNo is 1', function () {
            paymentDetailsVM.yesNo('1');
            expect(paymentDetailsVM.familyName()).toEqual('Levi');
        });
        it('model.iDNumHPNum is empty when yesNo is 2', function () {
            paymentDetailsVM.yesNo('2');
            expect(paymentDetailsVM.iDNumHPNum()).toEqual('');
        });
        it('model.firstName is empty when yesNo is 2', function () {
            paymentDetailsVM.yesNo('2');
            expect(paymentDetailsVM.firstName()).toEqual('');
        });
        it('model.familyName is empty when yesNo is 2', function () {
            paymentDetailsVM.yesNo('2');
            expect(paymentDetailsVM.familyName()).toEqual('');
        });
        it('isRadioDisabled property is affected by settings.isRadioDisabled', function () {
            expect(paymentDetailsVM.isRadioDisabled()).toEqual(true);
        });

        it('Payment Succeeded if misparKabala is full', function () {
            expect(paymentDetailsVM.isPaymentSucceeded()).toEqual(false);
            paymentDetailsVM.misparKabala('22222222');
            expect(paymentDetailsVM.isPaymentSucceeded()).toEqual(true);
        });
        it('paymentType Text match the payment Type code - hebrew', function () {
            languageViewModel.language('hebrew');
            paymentDetailsVM.paymentTypeCode('1');
            expect(paymentDetailsVM.paymentTypeText()).toEqual('רגיל');
            paymentDetailsVM.paymentTypeCode('8');
            expect(paymentDetailsVM.paymentTypeText()).toEqual('תשלומים');
        });
        it('paymentType Text match the payment Type code - english', function () {
            languageViewModel.language('english');
            paymentDetailsVM.paymentTypeCode('1');
            expect(paymentDetailsVM.paymentTypeText()).toEqual('REGULAR');
            paymentDetailsVM.paymentTypeCode('8');
            expect(paymentDetailsVM.paymentTypeText()).toEqual('PAYMENTS');
        });
        describe('validation', function () {
            it('iDNumHPNum should validated by idNum validation', function () {
                paymentDetailsVM.iDNumHPNum('111111117');
                expect(paymentDetailsVM.iDNumHPNum.isValid()).toBeFalsy();
            });
            it('familyName should validated by hebrewName validation', function () {
                paymentDetailsVM.familyName('ffffff');
                expect(paymentDetailsVM.familyName.isValid()).toBeFalsy();
            });
            it('firstName should validated by hebrewName validation', function () {
                paymentDetailsVM.firstName('ssssss');
                expect(paymentDetailsVM.firstName.isValid()).toBeFalsy();
            });
        });
    });
}); define('spec/paymentDetailsViewModel.js', function () { });
