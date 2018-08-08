/**
 * @module entityBase
*/
define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/viewModels/ModularViewModel',
        'common/utilities/stringExtension',
        'common/ko/globals/defferedObservable'],
function (exceptions, exceptionsMessages, ModularViewModel, stringExtension) {//eslint-disable-line max-params

    var EntityBase = function EntityBase(args) {

        this.dataCode = args.key;
        this.dataText = args.value;
    };

    var ObservableEntityBase = function ObservableEntityBase(args) {
        var self = this;
        var model = {
            dataCode: ko.observable(args.key),
            dataText: ko.observable(args.value)
        };
        ModularViewModel.call(self, model);
    };

    ObservableEntityBase.prototype = Object.create(ModularViewModel.prototype);
    ObservableEntityBase.prototype.constructor = ObservableEntityBase;

    var ExtendableEntityBase = function ExtendableEntityBase(settings) {
        settings = settings || {};
        var self = this;
        var model = {
            dataCode: ko.observable().defaultValue(settings.defaultValue || '').extend(settings.extenders),
            dataText: ko.observable().defaultValue(settings.defaultValue || '').extend(settings.extenders)
        };
        ModularViewModel.call(self, model);
    };

    ExtendableEntityBase.prototype = Object.create(ModularViewModel.prototype);
    ExtendableEntityBase.prototype.constructor = ExtendableEntityBase;

    var DeferredEntityBase = function DeferredEntityBase(args) {
        var self = this;
        var model = {
            dataCode: ko.defferedObservable({ initialValue: args.key, deferred: args.deferred }),
            dataText: ko.observable(args.value)
        };
        ModularViewModel.call(self, model);
    };

    DeferredEntityBase.prototype = Object.create(ModularViewModel.prototype);
    DeferredEntityBase.prototype.constructor = DeferredEntityBase;

    var checkValidArray = function isValidArray(array) {
        if (!array || array.length < 1) {
            exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidParam, 'array'));
        }
    };
    var checkItem = function checkItem(item, prop) {
        if (!item[prop]) { exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'array', 'array of EntityBase')); }
    };

    var utils = {
        getTextByCode: function getTextByCode(array, dataCode) {
            checkValidArray(array);
            var notFound;
            var match = ko.utils.arrayFirst(array, function (item) {
                checkItem(item, 'dataCode');
                return ko.unwrap(item.dataCode) === dataCode;
            });
            if (!match) {
                return notFound;
            }
            else {
                return ko.unwrap(match.dataText);
            }
        },
        getCodeByText: function getCodeByText(array, dataText) {
            checkValidArray(array);
            var notFound;
            var match = ko.utils.arrayFirst(array, function (item) {
                checkItem(item, 'dataText');
                return ko.unwrap(item.dataText) === dataText;
            });
            if (!match) {
                return notFound;
            }
            else {
                return ko.unwrap(match.dataCode);
            }
        }
    };

    return {
        /**
         * @function
         * @type {object}
         * @description entity with code and text. 
         * @param {number} key - for dataCode 
         * @param {string} value - for dateText
        */
        EntityBase: EntityBase,
        /**
         * @function
        * @type {object}
        * @description entity with code and text. 
        * @param {number} key - for dataCode 
        * @param {string} value - for dateText
       */
        ObservableEntityBase: ObservableEntityBase,
        ExtendableEntityBase: ExtendableEntityBase,
        /**
       * @function
      * @type {object}
      * @description entity with code and text, 
      * The code is updated only when the received promise is fulfilled. 
      * @param {number} key - for dataCode 
      * @param {string} value - for dateText
      * @param {promise} deferred -promise that the code depends on it
     */
        DeferredEntityBase: DeferredEntityBase,
        /**
       * @description object that contains functions to . 
       * @exports entityBase/utils
       * @module entityBase: utils
       */
        utils: {
            /**                   
            * @method getTextByCode
            * @description to get text of option by code
            * @param {array} array:  -list
            * @param {number} dataCode:  - selected value
            * @returns {string} -description of selected value 
            * @example Example usage of getTextByCode.
            * getTextByCode(list, 1);
            * returns description of the item with dataCode = 1
            * */
            getTextByCode: utils.getTextByCode,
            /**              
          * @method getCodeByText
          * @description to get code of option by text
          * @param {array} array:  -list
          * @param {string} dataText:  - description of selected value
          * @returns {number} -value of selected description 
          * @example Example usage of getCodeByText.
          * getCodeByText(cityList, "ירושלים");
          * returns dataCode of the item with dataText = ירושלים
          * */
            getCodeByText: utils.getCodeByText

        }
    };

});