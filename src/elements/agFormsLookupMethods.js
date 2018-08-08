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
    'common/utilities/stringExtension',
    'common/resources/tfsAttributes',
    'common/resources/infrastructureEnums'
], function (exceptions, exceptionsMessages, stringExtension, tfsAttributes, infrastructureEnums) {//eslint-disable-line max-params


    function throwInvalidElementTypeException() {
        exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', infrastructureEnums.dataTypes.lookupwindow));
    }

    function throwUndefinedElementException(paramName) {
        exceptions.throwFormError(stringExtension.format(exceptionsMessages.undefinedParam, paramName));
    }

    var innerIsLookUp = function innerIsLookUp(element) {
        if (typeof $(element).attr(tfsAttributes.TFSLOOKUPWINDOW) !== 'undefined'
            && ($(element).prev('select')).length > 0
            && ($(element).siblings('input:button,button')).length > 0) {
            return true;
        }
        return false;
    };

    var isExist = function isExist(element) {
        return ($(element) && $(element).length);
    };

    var globalFunction = function globalFunction(callback, param) {//eslint-disable-line consistent-return
        if (isExist(param)) {
            if (innerIsLookUp(param)) {
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

    var isLookUp = function isLookUp(element) {//eslint-disable-line consistent-return
        if (isExist(element)) {
            if (innerIsLookUp(element)) {
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

    var getSelectElement = function getSelectElement(element) {
        var innerGetSelectElement = function innerGetSelectElement(element) {//eslint-disable-line consistent-return
            var select = $(element).prev('select');
            if (select.length > 0 && select.get(0).getAttribute(tfsAttributes.TFSDATATYPE).toLowerCase() === infrastructureEnums.dataTypes.lookupwindow.toLowerCase()) {
                return select;
            }
            else {
                throwInvalidElementTypeException();
            }
        };
        return globalFunction(innerGetSelectElement, element);
    };

    var getArrowElement = function getArrowElement(element) {
        var innerGetArrowElement = function (element) {
            var arrow = $(element).siblings('button');
            //var arrow = $(element).next('input:button,button');
            if (arrow.length === 0) {
                throwInvalidElementTypeException();
            }
            return arrow;
        };
        return globalFunction(innerGetArrowElement, element);
    };

    var getLabelElement = function getLabelElement(element) {
        var noLabelFound = 'no label element has been found for "{0}"';
        var getLabel = function getLabel(element) {
            var label = $(element).closest('div[class^="col-"]').find('label');
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
        return globalFunction(getLabel, element);
    };

    var getWrapperElement = function getWrapperElement(element) {
        var getWrapper = function getWrapper(element) {
            var wrapper = $(element).parent('div .select');
            if (wrapper.length > 0) {
                return wrapper;
            }
            else {
                return;//eslint-disable-line consistent-return
            }
        };
        return globalFunction(getWrapper, element);
    };

    var hasLookupValue = function hasLookupValue(element) {
        var innerHasLookupValue = function () {
            var input = getValidInput(element);
            return input.attr(tfsAttributes.TFSVALUE) && input.attr(tfsAttributes.TFSVALUE) !== '';
        };
        return globalFunction(innerHasLookupValue, element);
    };

    var getLookupValue = function getLookupValue(element) {
        var innerGetLookupValue = function () {
            var input = getValidInput(element);
            return input.attr(tfsAttributes.TFSVALUE);
        };
        return globalFunction(innerGetLookupValue, element);
    };

    return {
        /**
        * @public
        * @function <b>hasLookupValue</b>
        * @description Checking if lookup element has 'tfsValue' attribute
        * @param {object} element jQuery lookup element
        * @returns {boolean} 'tfsValue' attribute existing
        * @throws {FormError} element not valid lookup
        * @throws {FormError} element not exists
        */
        hasLookupValue: hasLookupValue,
        /**
        * @public
        * @function <b>getLookupValue</b>
        * @description Get the 'tfsValue' attribute of lookup element
        * @param {object} element jQuery lookup element
        * @returns {String} 'tfsValue' attribute of element
        * @throws {FormError} element not valid lookup
        * @throws {FormError} element not exists
        */
        getLookupValue: getLookupValue,
        /**
        * @public
        * @function <b>getSelectElement</b>
        * @description Get the created infrastructure select of lookup element
        * @param {object} element jQuery select element
        * @returns {object} created infrastructure select of lookup element as jQuery element
        * @throws {FormError} element not valid lookup
        * @throws {FormError} element not exists
        */
        getSelectElement: getSelectElement,
        /**
         * @public
         * @function <b>getArrowElement</b>
         * @description Get the created infrastructure arrow button of lookup element
         * @param {object} element jQuery select element
         * @returns {object} created infrastructure arrow button of lookup element as jQuery element
         * @throws {FormError} element not valid lookup
         * @throws {FormError} element not exists
         */

        getArrowElement: getArrowElement,

        /**
         * @public
         * @function <b>getLabelElement</b>
         * @description Get the label element that's pushed aside by infrastructure elements
         * @param {object} element jQuery input element //your input element
         * @returns {object} label element
         * @throws {FormError} element not valid lookup
         * @throws {FormError} element not exists
         */

        getLabelElement: getLabelElement,

        /**
        * @public
        * @function <b>getWrapperElement</b>
        * @description Get the div that wraps lookup element
        * @param {object} element jQuery input element //your input element
        * @returns {object} div element
        * @throws {FormError} element not valid lookup
        * @throws {FormError} element not exists
        */

        getWrapperElement: getWrapperElement,
        /**
         * @public
         * @function <b>getValidInput</b>
         * @description Get the input element of lookup if valid
         * @param {object} element jQuery input element
         * @returns {object} input of lookup element as jQuery element if valid
         * @throws {FormError} if element not valid lookup
         * @throws {FormError} if element not exists
        */
        getValidInput: getValidInput,
        /**
         * @public
         * @function <b>isLookUp</b>
         * @description return element is infrastructure attachment of LookUp element
         * @param {object} element jQuery input element
         * @returns {bool} is infrastructure input of LookUp element
         * @throws {FormError} element not exists
         */
        isLookUp: isLookUp
    };

});