define(function (require) {
    var regExpSource = require('common/resources/regularExpressions'),
        selectListMethods = require('common/utilities/loadWSList'),
        formVersion = require('common/core/formVersion');

    //#region enum
    var phoneType = {
        phone: 1,
        mobile: 2,
        international: 3,
        phoneOrMobile: 4
    };

    //#endregion

    //#region Lists
    var phoneAreaCodeList = ko.observableArray();
    var mobileAreaCodeList = ko.observableArray();
    var phoneOrMobileAreaCodeList = ko.observableArray();
    //#endregion

    //#region private methods
    var loadLists = function () {//eslint-disable-line no-unused-vars
        selectListMethods.loadWSList(phoneAreaCodeList, 'AreaCodes', 1);
        selectListMethods.loadWSList(mobileAreaCodeList, 'AreaCodes', 2);
        selectListMethods.loadWSList(phoneOrMobileAreaCodeList, 'AreaCodes', '');
    }();

    var getAreaCodeList = function (phoneType) { //eslint-disable-line complexity, consistent-return
        switch (phoneType) {
        case 1:
            if (phoneAreaCodeList().length === 0) {
                selectListMethods.loadWSList(phoneAreaCodeList, 'AreaCodes', 1);
            }
            return phoneAreaCodeList();
        case 2:
            if (mobileAreaCodeList().length === 0) {
                selectListMethods.loadWSList(mobileAreaCodeList, 'AreaCodes', 2);
            }
            return mobileAreaCodeList();
        case 4:
            if (phoneOrMobileAreaCodeList().length === 0) {
                selectListMethods.loadWSList(phoneAreaCodeList, 'AreaCodes', '');
            }
            break;
        default: return phoneOrMobileAreaCodeList();
        }
    };

    //#endregion

    //#region public methods

    /** method to get area code from dtring
       * @memberof validatorMethods 
       * @param {string} value - value to check
       * @param {enum} phoneType - type of phone(phoneNumber\fax\mobile)
       * @returns {string} - area code
       * @example Example usage of checkNumber:
       * var areaCode = getAreaCode(text, phoneType);
      * */
    var getAreaCode = function (value, phoneType) {
        if (typeof (value) === 'string') {
            var areaCode2Digit = value.substring(0, 2);
            var areaCode3Digit = value.substring(0, 3);
            var areaCode4Digit = value.substring(0, 4);
        }
        var areaCodeList = getAreaCodeList(phoneType);

        var match = ko.utils.arrayFirst(areaCodeList, function (item) {
            return item.dataText === areaCode2Digit || item.dataText === areaCode3Digit || item.dataText === areaCode4Digit;
        });

        if (match) {
            return match.dataText;
        }
        return '';
    };

    /** method to check phone number valid value
       * @memberof validatorMethods 
       * @param {string} value - value to check
       * @param {enum} phoneType - type of phone(phoneNumber\fax\mobile)
       * @returns {boolean} - is valid 
       * @example Example usage of checkNumber:
       * phoneMethods.checkNumber(text, phoneMethods.phoneType.fax);
      * */
    var checkNumber = function (value, phoneType) {//eslint-disable-line no-unused-vars
        var isInternationalPhone = function (phoneType) {
            return phoneType === phoneMethods.phoneType.international;//eslint-disable-line no-undef
        };

        var isAreaCode153 = function (areaCode) {
            return areaCode === '153';
        };

        var areaCodes = function (value, phoneType) {
            if (!isInternationalPhone(phoneType) && !formVersion.isPDF()) {
                return !!getAreaCode(value, phoneType);
            }
            return true;
        };

        var phoneNumber153 = function (value, phoneType) {
            if (!isInternationalPhone(phoneType) && !formVersion.isPDF()) {
                if (isAreaCode153(getAreaCode(value, phoneType))) {
                    return regExpSource.phoneNumber153.test(value);
                }
            }
            return true;
        };

        var phoneNumber = function (value, phoneType) {
            if (!isInternationalPhone(phoneType) && !formVersion.isPDF() && !isAreaCode153(getAreaCode(value, phoneType))) {
                return regExpSource.phoneNumber.test(value);
            }
            return true;
        };

        var internationalPhone = function (value, phoneType) {
            if (isInternationalPhone(phoneType)) {
                return regExpSource.internationalPhone.test(value);
            }
            return true;
        };


        return {
            areaCodes: areaCodes,
            phoneNumber153: phoneNumber153,
            phoneNumber: phoneNumber,
            internationalPhone: internationalPhone
        };
    };
    //#endregion

    return {
        phoneType: phoneType,
        getAreaCode: getAreaCode,
        checkNumber: checkNumber
    };

});