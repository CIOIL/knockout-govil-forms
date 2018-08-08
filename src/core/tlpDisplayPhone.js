//var phone = ko.observable().extend({ tlpDisplayPhone: {type: phoneMethods.phoneType.phoneOrMobile, withDash: false} });
define(function (require) {

    var stringExtension = require('common/utilities/stringExtension'),
        phoneMethods = require('common/core/phoneMethods');

    ko.extenders.tlpDisplayPhone = function (value, phoneType) {
        var result = ko.computed({
            read: value,
            write: function (newValue) { //eslint-disable-line complexity
                var phoneTypeVal = typeof phoneType.type === 'function' ? phoneType.type() : phoneType.type;
                var notFound = -1;
                if (newValue && newValue.indexOf('-') === notFound &&
                    phoneTypeVal !== phoneMethods.phoneType.international) {
                    var areaCode = phoneMethods.getAreaCode(newValue, phoneTypeVal);
                    if (areaCode) {
                        var number = newValue.substring(areaCode.length, newValue.length);
                        if (phoneType.withDash !== false) {
                            newValue = stringExtension.format('{0}-{1}', areaCode, number);
                        }
                    }
                }
                value(newValue);
                value.notifySubscribers(newValue);

            }
        });
        //return the new computed observable
        return result;
    };
});
