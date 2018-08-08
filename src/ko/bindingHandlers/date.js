define(['common/core/exceptions',
    'common/elements/dateMethods'
],
    function (exceptions, dateMethods) {
        //exceptionsMessages = require('common/resources/exeptionMessages');

        /**     
         * @memberof ko         
         * @function "ko.bindingHandlers.tlpEnableDate"
         * @description custom binding for enabling & disabling date.
         * @example 
         * tlpEnableDate: viewModel.isEnableDate
         */
        ko.bindingHandlers.tlpEnableDate = {
            init: function (element, valueAccessor) {
                var underlyingObservable = ko.unwrap(valueAccessor());
                var datePicker = dateMethods.getButtonElement(element);
                try {
                    ko.applyBindingsToNode(element, { enable: underlyingObservable });
                    ko.applyBindingsToNode(datePicker[0], { enable: underlyingObservable });
                }
                catch (e) {
                    exceptions.throwFormError('Invalid use of tlpEnableDate');
                }
            }
        };
    });
