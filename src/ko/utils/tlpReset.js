
define(function (require) {
    require('common/utilities/arrayExtensions');
    require('common/ko/fn/defaultValue');
    require('common/ko/fn/minLength');
    require('common/ko/fn/allowEmptyTable');
    require('common/ko/utils/isComputed');
    var formExceptions = require('common/core/exceptions'),
        commonExptionMessages = require('common/resources/exeptionMessages'),
        stringExtension = require('common/utilities/stringExtension');


    ko.utils.tlpReset = function () {

        var ignore = [];

        var silentReset;

        var isIgnore = function isIgnore(obj, ignoreArray) {
            var isExist = ko.utils.arrayFirst(ignoreArray, function (item) {
                return item === obj;
            });
            return isExist === null ? false : true;
        };

        var isArray = function isArray(obj) {
            return ($.type(obj()) === 'array');
        };

        var extendIgnore = function extendIgnore(optinalIgnore) {
            if (optinalIgnore && !(optinalIgnore instanceof Array)) {
                formExceptions.throwFormError(stringExtension.format(commonExptionMessages.invalidElementTypeParam, 'optinalIgnore', 'array'));
            }
            var ignoreArray = optinalIgnore ? Array.from(optinalIgnore) : [];
            ko.utils.tlpReset.ignore.forEach(function (item) {
                ignoreArray.push(item);
            });
            return ignoreArray;
        };

        var isSubscribableToReset = function (obj, ignoreArray) {
            return (ko.utils.isWritableComputed(obj) && (!isIgnore(obj, ignoreArray))) || (!ko.utils.isComputed(obj) && (!isIgnore(obj, ignoreArray)));
        };

        var isExistInTypeObject = function (obj) {
            return (typeof (obj) === 'object' && obj !== null);
        };

        var checkCustomReset = function checkCustomReset(obj) {
            if (typeof (obj.reset) === 'function')//for special types like AGFormField
            {
                obj.reset();
                return true;
            }
            return false;
        };

        var resetObject = function resetObject(obj, ignoreArray) {
            if (isExistInTypeObject(obj)) {
                if (isIgnore(obj, ignoreArray)) {
                    return true;
                }
                else {
                    return checkCustomReset(obj);
                }
            }
            else {
                if (ko.isObservable(obj)) {
                    return resetObservable(obj, ignoreArray);//eslint-disable-line no-use-before-define
                }
                return true;
            }
        };

        /*eslint complexity: [2, 5]*/
        var resetAll = function resetAll(obj, ignoreArray) {
            if (!resetObject(obj, ignoreArray)) {
                if (obj.getModel !== undefined) {
                    resetAll(obj.getModel(), ignoreArray);
                }
                else {
                    $.each(obj, function (i) {
                        resetAll(obj[i], ignoreArray);
                    });
                }
            }
        };
        /*eslint complexity: [2, 4]*/

        var resetModel = function resetModel(obj, optinalIgnore, silentReset1) {
            var ignoreArray = extendIgnore(optinalIgnore);
            silentReset = typeof (silentReset1) !== 'undefined' ? silentReset1 : true;
            resetAll(obj, ignoreArray);
            ignoreArray = [];

        };

        var isArrayOfPrimitiveType = function isArrayOfPrimitiveType(obj) {
            return (typeof (obj()[0]) !== 'object' && !ko.isObservable(obj()[0]));
        };

        var isArrayToReset = function isArrayToReset(obj, ignoreArray) {
            return (!isIgnore(obj, ignoreArray) && obj().length > 0);
        };

        var isAllowEmptyTable = function isAllowEmptyTable(obj) {
            return typeof (obj.allowEmptyTableVal) !== 'undefined'
                && obj.allowEmptyTableVal
                && (typeof (obj.minLengthVal) === 'undefined' || obj.minLengthVal === 0);
        };

        var clearAllButMinRows = function getMinLines(obj) {
            if (isAllowEmptyTable(obj)) {
                obj([]);
            }
            else {
                obj(obj.slice(0, parseInt(obj.minLengthVal, 10) || 1));
            }
        };

        var resetRow = function resetRow(obj, ignoreArray) {
            if (isArrayOfPrimitiveType(obj)) {
                obj([]);
            }
            else {
                $.each(obj(), function (i) {
                    resetAll(obj()[i], ignoreArray);
                });
            }
        };

        var resetObservableArrayAll = function resetObservableArrayAll(obj, ignoreArray) {
            if (isArrayToReset(obj, ignoreArray)) {
                clearAllButMinRows(obj);
                resetRow(obj, ignoreArray);
                if (typeof obj.isModified === 'function') {
                    obj.isModified(!silentReset);
                }
            }
        };

        var resetObservableArray = function resetObservableArray(obj) {
            var ignoreArray = Array.from(ko.utils.tlpReset.ignore);
            resetObservableArrayAll(obj, ignoreArray);
        };

        var resetObservable = function resetObservable(obj, ignoreArray) {//eslint-disable-line complexity
            if (isArray(obj)) {
                resetObservableArrayAll(obj, ignoreArray);
                return true;
            }
            if (isSubscribableToReset(obj, ignoreArray)) {
                obj(obj() === '' && !obj.defaultVal ? '' : obj.defaultVal);
                if (typeof obj.isModified === 'function') {
                    obj.isModified(!silentReset);
                }
            }
            return true;
        };

        var checkResetByRemoveRow = function (obj) {
            if (obj && typeof (obj.resetByRemoveRow) === 'function')
            {
                obj.resetByRemoveRow();
                return true;
            }
            return false;
        };

        var resetByRemoveRow = function (obj) {
            if (checkResetByRemoveRow(obj)) {
                return;
            }
            if (obj && obj.getModel !== undefined) {
                resetByRemoveRow(obj.getModel());
            }
            else {
                if (isExistInTypeObject(obj)) {
                    $.each(obj, function (i) {
                        resetByRemoveRow(obj[i]);
                    });
                }

            }


        };

        return {
            /**     
           * @memberof ko         
           * @function "ko.utils.tlpReset.resetByRemoveRow"
           * @description Function for reset model by remove row of dynamic table
           * @param {object} model - the object to reset.
           * @example  Example of usage
           * ko.utils.tlpReset.resetByRemoveRow(viewModel);
          */
            resetByRemoveRow,
            /**     
           * @memberof ko         
           * @function "ko.utils.tlpReset.resetObservableArray"
           * @description Function for reset observable array
           * @param {observableArray} observableArray - observableArray to reset.
           * @example  Example of usage
           * ko.utils.tlpReset.resetObservableArray(observableArray);
          */
            resetObservableArray: resetObservableArray,

            /**     
           * @memberof ko         
           * @function "ko.utils.tlpReset.resetModel"
           * @description Function for reset model
           * @param {object} model - the object to reset.
           * @param {array} [optinalIgnore = "undefined"] - array of  observable or observableArray to be ignored by the reset.
           * @throws{error} Will throw an error if the optinalIgnore parameter isnt an array. 
           * @example  Example of usage
           * ko.utils.tlpReset.resetModel(viewModel,[viewModel.a,viewModel.b]);
          */
            resetModel: resetModel,
            /** array of properties to be ignored by the reset.*/

            /**     
          * @memberof ko         
          * @name "ko.utils.tlpReset.ignore"
          * @property "ko.utils.tlpReset.ignore"
          * @description array of properties to be ignored by the reset
          * @example  Example of usagey
          * ko.utils.tlpReset.ignore.push(observable/observableArray/sub model/sub object); // push property to be ignored by the reset.
          */
            ignore: ignore
        };
    }();
});
