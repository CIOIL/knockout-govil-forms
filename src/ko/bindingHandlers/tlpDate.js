define(function () {
    ko.bindingHandlers.tlpEnableDate = {
        init: function (element, valueAccessor) {
            var underlyingObservable = ko.unwrap(valueAccessor());
            var datePicker = $(element).next('input.tfsCalendar');
            try {
                ko.applyBindingsToNode(element, { enable: underlyingObservable });
                ko.applyBindingsToNode(datePicker[0], { enable: underlyingObservable });
            }
            catch (e) {
                throw new Error('Invalid use of tlpEnableDate');
            }
        }
    };
});