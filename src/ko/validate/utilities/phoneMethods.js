/**
 * @module phoneMethods
 * @description utility functions used to 
 */
define(['common/utilities/loadWSList',
    'common/external/q',
    'common/utilities/stringExtension',
    'common/utilities/resourceFetcher',
    'common/resources/texts/indicators',
    'common/infrastructureFacade/tfsMethods'
],
    function (selectListMethods, Q, stringExtension, resourceFetcher, indicators, tfsMethods) {//eslint-disable-line max-params
        //#region enum
        var phoneTypeEnum = {
            phoneNumber: 1,
            mobile: 2,
            international: 3,
            phoneOrMobile: 4,
            fax: 1
        };

        var getPhoneType = function (i) {
            for (var name in phoneTypeEnum) {
                if (phoneTypeEnum[name] === i) {
                    return name;
                }
            }
            return '';
        };

        //#endregion

        //#region Lists
        var AreaCode = function (areaCode, type) {
            this.areaCode = areaCode;
            this.type = type;
        };
        var mapping = {
            create: function (objRole) {
                return new AreaCode(objRole.data.AreaCode, objRole.data.Type);
            }
        };
        var allAreaCodes = ko.observableArray();
        var phoneAreaCodeList = ko.observableArray();
        var mobileAreaCodeList = ko.observableArray();
        //#endregion

        /*
         * @function loadLists
         * @description performs an ajax request to retrieve area-codes list from listManager 
         * loads the returning data into 'allAreaCodes' using ko.mapping.fromJS
         */
        var loadLists = function () {
            var request = selectListMethods.getList({ tableName: 'AreaCodes', format: 'json' });
            //var deferred = Q.defer();
            request.then(function (response) {
               
                ko.mapping.fromJS(response, mapping, allAreaCodes);
                phoneAreaCodeList = ko.utils.arrayFilter(allAreaCodes(), function (item) {
                    return item.type === '1';
                });
                mobileAreaCodeList = ko.utils.arrayFilter(allAreaCodes(), function (item) {
                    return item.type === '2';
                });

            }).catch(function () {
                tfsMethods.dialog.alert(resourceFetcher.get(indicators.errors).callServiceError);
            });
            return request;
        };

        /*
      * @function loadLists
      * @description load area-codes list if not loaded yet and filters the list by phoneType
      * @param {number} phoneType
      * @returns {array} area-codes array filtered by phoneType
      */

        /*eslint-disable indent*/
        var getAreaCodeList = function (phoneType) {

            switch (phoneType) {
                case 1: {
                    return phoneAreaCodeList;
                }
                case 2: {
                    return mobileAreaCodeList;
                }
                default: {
                    return allAreaCodes();
                }
            }

        };
        /*eslint-enable indent*/
        /*
    * @function getAreaCode
    * @description load area-codes list if not loaded yet and filters the list by phoneType
    * @param {number} phoneType
    * @returns {array} area-codes array filtered by phoneType
    */
        var getAreaCode = function (value, phoneType) {
            if (typeof value === 'string') {
                var areaCode2Digit = value.substring(0, 2);
                var areaCode3Digit = value.substring(0, 3);
                var areaCode4Digit = value.substring(0, 4);
            }
            var areaCodeList = getAreaCodeList(phoneType);
            var match = ko.utils.arrayFirst(areaCodeList, function (item) {
                return item.areaCode === areaCode2Digit || item.areaCode === areaCode3Digit || item.areaCode === areaCode4Digit;
            });

            if (match) {
                return match.areaCode;
            }
            return '';
        };

        var isAreaCodeValid = function (value, phoneType) {
            return !!getAreaCode(value, phoneType);
        };

        var displayPhoneNumber = function (newValue, phoneType) {
            var notFound = -1;
            if (newValue && newValue.indexOf('-') === notFound &&
                phoneType !== phoneTypeEnum.international) {
                var areaCode = getAreaCode(newValue, phoneType);
                if (areaCode) {
                    var number = newValue.substring(areaCode.length, newValue.length);
                    newValue = stringExtension.format('{0}-{1}', areaCode, number);
                }
            }
            return newValue;
        };

        return {
            displayPhoneNumber: displayPhoneNumber,
            getAreaCode: getAreaCode,
            isAreaCodeValid: isAreaCodeValid,
            phoneTypeEnum: phoneTypeEnum,
            getPhoneType: getPhoneType,
            loadLists: loadLists
        };

    });

