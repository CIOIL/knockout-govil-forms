define(['common/utilities/reflection',
        'common/utilities/resourceFetcher',
        'common/utilities/functionalPatterns',
        'common/viewModels/ModularViewModel',
        'common/components/payments/texts',
        'common/ko/bindingHandlers/tlpLockElement',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/validate/extensionRules/personalDetails',
        'common/ko/fn/defaultValue'
],
    function (commonReflection, resourceFetcher, functionalPatterns, ModularViewModel, resources) {//eslint-disable-line max-params 

        var defaulValues = {
            defaultYesNo: '2',
            isRadioDisabled: false,
            isEcomPayment: true
        };

        var createPaymentViewModel = functionalPatterns.once(function createViewModel(settings) {

            settings = commonReflection.extendSettingsWithDefaults(settings, defaulValues);
            var model = function () {
                var iDNumHPNum = ko.observable();
                var familyName = ko.observable();
                var firstName = ko.observable();
                var yesNo = ko.observable(settings.defaultYesNo).defaultValue(settings.defaultYesNo);
                var misparKabala = ko.observable();
                var paymentTypeCode = ko.observable();
                return {
                    iDNumHPNum: iDNumHPNum,
                    familyName: familyName,
                    firstName: firstName,
                    yesNo: yesNo,
                    misparKabala: misparKabala,
                    paymentTypeCode: paymentTypeCode
                };
            }();

            settings.idNum? settings.idNum.publishOn('idChanged'):null;
            settings.firstName? settings.firstName.publishOn('firstNameChanged'):null;
            settings.lastName? settings.lastName.publishOn('familyNameChanged'):null;

            var paymentTypeText = ko.computed(function () {
                var match = resources.paymentTypes.filter(function (item) {
                    return item.code === model.paymentTypeCode();
                })[0];
                return match ? resourceFetcher.get(match.text) : '';
            });

            model.yesNo.subscribe(function (newValue) {
                if (newValue === '1') {
                    model.iDNumHPNum.subscribeTo('idChanged', true);
                    model.firstName.subscribeTo('firstNameChanged', true);
                    model.familyName.subscribeTo('familyNameChanged', true);
                }
            });

            model.yesNo.subscribe(function (oldValue) {
                function cancelSubscribe(target, publisName) {
                    target.unsubscribeFrom(publisName);
                    target('');
                }
                if (oldValue === '1') {
                    cancelSubscribe(model.iDNumHPNum, 'idChanged');
                    cancelSubscribe(model.firstName, 'firstNameChanged');
                    cancelSubscribe(model.familyName, 'familyNameChanged');
                }

            }, model, 'beforeChange');

            var isNotBind = ko.computed(function () {
                return model.yesNo() === '2';
            }, model);

            var isBind = ko.computed(function () {
                return model.yesNo() !== '2';
            }, model);

            var isRadioDisabled = ko.computed(function () {
                return ko.unwrap(settings.isRadioDisabled);
            });
            var isRadioRequired = ko.computed(function () {
                return !isRadioDisabled() && ko.unwrap(settings.isEcomPayment);
            });
            var isRequired = ko.computed(function () {
                return ko.unwrap(settings.isEcomPayment) && isNotBind();
            });


            var isPaymentSucceeded = ko.computed(function () {
                return model.misparKabala() !== '' && model.misparKabala() !== undefined;
            }, model).publishOn('isPaymentSucceeded');

            model.iDNumHPNum.extend({ required: { onlyIf: isRequired }, idNum: true, minLength: 9, maxLength: 9 });
            model.familyName.extend({ required: { onlyIf: isRequired }, hebrewName: true });
            model.firstName.extend({ required: { onlyIf: isRequired }, hebrewName: true });
            model.yesNo.extend({ required: { onlyIf: isRadioRequired } });

            var paymentDetailsViewModel = new ModularViewModel(model);

            paymentDetailsViewModel.labels = ko.multiLanguageObservable({ resource: resources.labels });
            paymentDetailsViewModel.paymentTypeText = paymentTypeText;
            paymentDetailsViewModel.isNotBind = isNotBind;
            paymentDetailsViewModel.isBind = isBind;
            paymentDetailsViewModel.isRadioDisabled = isRadioDisabled;
            paymentDetailsViewModel.isPaymentSucceeded = isPaymentSucceeded;
            return paymentDetailsViewModel;

        });

        return {
            createPaymentViewModel: createPaymentViewModel
        };

    });

