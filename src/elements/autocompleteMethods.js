/** module that holds utility functions for lookup. 
 * providing information and giving access to elements auto-created by the infrastructure.
 * </br>
 * infrastructure lookup:
 * </br>
 * <ul>
 *  <li>select id="pickUp_Town" class="tfsInputCombo" name="Town" tfsbind="..." tfsselect="" tfsdatatype="LookUpWindow"></select><b>select element - </b> </li>
 *  <li><b>your input</b> input onkeyup="AgatLookupWindow.showLookUpWindowFromKey(event, this)" id="Town" class="tfsInputCombo lookup-input lookup-input-override" onkeydown="AgatLookupWindow.showLookUpWindowFromTabKey(event, this)" tfsdata="" tfsname="ישוב בכרטיסית" tfsshowdropdownbtn="false" placeholder="" tfslookupwindow="" data-role="none" tfsvalue="431"</li>
 *  <li><b>hidden arrow</b> input onclick="showLookUpWindow(this)" id="arrow_Town" class="lookup-arrow lookup-arrow-override" style="..." type="button" tfsshowdropdownbtn="false"</li>
 *  <li><b>arraw</b> button onclick="showLookUpWindow(this)" id="arrow_Town" class="lookup-arrow lookup-arrow-override" tfsshowdropdownbtn="false"</li>
 * </ul>
@module lookUpMethods  
*/

define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
], function (exceptions, exceptionsMessages, stringExtension) {//eslint-disable-line max-params


    function throwInvalidElementTypeException() {
        exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'tlpAutocomplete binding'));
    }

    function throwUndefinedElementException(paramName) {
        exceptions.throwFormError(stringExtension.format(exceptionsMessages.undefinedParam, paramName));
    }

    var isAutocompleteField = function isAutocompleteField(element) {
        return $(element).hasClass('autocomplete-field');
    };

    var isExist = function isExist(element) {
        return ($(element) && $(element).length);
    };

    var globalFunction = function globalFunction(callback, param) {//eslint-disable-line consistent-return
        if (isExist(param)) {
            if (isAutocompleteField(param)) {
                return callback(param);
            }
            else {
                throwInvalidElementTypeException();
            }
        }
        else {
            throwUndefinedElementException('element');
        }
    };

    var isAutocomplete = function isAutocomplete(element) {//eslint-disable-line consistent-return
        if (isExist(element)) {
            if (isAutocompleteField(element)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            throwUndefinedElementException('element');
        }
    };

    var getValidInput = function getValidInput(element) {
        var innerGetValidInput = function innerGetValidInput(element) {
            return $(element);
        };
        return globalFunction(innerGetValidInput, element);
    };

    //var getSelectElement = function getSelectElement(element) {
    //    var innerGetSelectElement = function innerGetSelectElement(element) {//eslint-disable-line consistent-return
    //        var select = $(element).prev('select');
    //        if (select.length > 0 && select.get(0).getAttribute(tfsAttributes.TFSDATATYPE).toLowerCase() === infrastructureEnums.dataTypes.lookupwindow.toLowerCase()) {
    //            return select;
    //        }
    //        else {
    //            throwInvalidElementTypeException();
    //        }
    //    };
    //    return globalFunction(innerGetSelectElement, element);
    //};

    var getArrowElement = function getArrowElement(element) {
        var innerGetArrowElement = function (element) {
            var arrow = $(element).next('.autocomplete-arrow');
            if (arrow.length === 0) {
                throwInvalidElementTypeException();
            }
            return arrow;
        };
        return globalFunction(innerGetArrowElement, element);
    };

    var getLabelElement = function getLabelElement(element) {
        var noLabelFound = 'no label element has been found for "{0}"';
        var label = $(element).closest('.autocomplete-container').find('label');
        if (label.length > 0) {
            return label.get(0);
        }
        else {
            /*eslint no-console: ["error", { allow: ["warn"] }] */
            if (console) {
                console.warn(stringExtension.format(noLabelFound, element.attr('id')));
            }
            return;//eslint-disable-line consistent-return
        }
    };

    var getWrapperElement = function getWrapperElement(element) {
        var getWrapper = function getWrapper(element) {
            var wrapper = $(element).parent('.autocomplete-container');
            if (wrapper.length > 0) {
                return wrapper;
            }
            else {
                return;//eslint-disable-line consistent-return
            }
        };
        return globalFunction(getWrapper, element);
    };

    var hasAutocompleteValue = function hasAutocompleteValue(element) {
        var innerHasAutocompleteValue = function () {
            if ($(element).val()) {
                return true;
            }
            return false;
        };
        return globalFunction(innerHasAutocompleteValue, element);
    };

    var getAutocompleteValue = function getAutocompleteValue(element) {
        var innerGetAutocompleteValue = function () {
            return $(element).val();
        };
        return globalFunction(innerGetAutocompleteValue, element);
    };

    return {
        /**
        * @public
        * @function <b>hasLookupValue</b>
        * @description return is element  has value
        * @param {object} element jQuery autocomplete element
        * @returns {boolean} element  has value
        * @throws {FormError} element not valid autocomplete
        * @throws {FormError} element not exists
        */
        hasAutocompleteValue,
        /**
        * @public
        * @function <b>getLookupValue</b>
        * @description Get  autocomplete element value
        * @param {object} element jQuery autocomplete element
        * @returns {String}  autocomplete element value
        * @throws {FormError} element not valid autocomplete
        * @throws {FormError} element not exists
        */
        getAutocompleteValue,
        /**
         * @public
         * @function <b>getArrowElement</b>
         * @description Get the created tlpAutocomplete arrow button of autocomplete element
         * @param {object} element jQuery button element
         * @returns {object} created infrastructure arrow button of autocomplete element as jQuery element
         * @throws {FormError} element not valid autocomplete
         * @throws {FormError} element not exists
         */

        getArrowElement,

        /**
         * @public
         * @function <b>getLabelElement</b>
         * @description Get the label element
         * @param {object} element jQuery input element //your input element
         * @returns {object} label element
         * @throws {FormError} element not valid autocomplete
         * @throws {FormError} element not exists
         */

        getLabelElement,

        /**
        * @public
        * @function <b>getWrapperElement</b>
        * @description Get the div that wraps autocomplete element
        * @param {object} element jQuery input element //your input element
        * @returns {object} div element
        * @throws {FormError} element not valid autocomplete
        * @throws {FormError} element not exists
        */

        getWrapperElement,
        /**
         * @public
         * @function <b>getValidInput</b>
         * @description Get the input element of autocomplete if valid
         * @param {object} element jQuery input element
         * @returns {object} input of lookup element as jQuery element if valid
         * @throws {FormError} if element not valid autocomplete
         * @throws {FormError} if element not exists
        */
        getValidInput,
        /**
         * @public
         * @function <b>isLookUp</b>
         * @description return element is tlpAutocomplete
         * @param {object} element jQuery input element
         * @returns {bool} is tlpAutocomplete input of autocomplete element
         * @throws {FormError} element not exists
         */
        isAutocomplete
    };

});