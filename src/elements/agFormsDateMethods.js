/** module that holds utility functions for date. 
 * providing information and giving access to elements auto-created by the infrastructure.
 * </br>
 * infrastructure date:
 * </br>
 * <ul>
 *   <li><b>your input</b> input id="OfficeDate" title="בחר תאריך מתאריכון" class="tfsInputDate" tfsdatatype="date" tfsdata="" tfsname="תאריך בכרטיסית" style="margin-left: 0px;"</li>
 *   <li><b>calandar</b> input onclick="jscript:showCalendar(this)" class="tfsCalendar" style=".." type="button" value="..."</li>
 * </ul>
@module dateMethods  
*/
define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/resources/infrastructureEnums'
], function (exceptions, exceptionsMessages, stringExtension, infrastructureEnums) {//eslint-disable-line max-params

    function throwInvalidElementTypeException() {
        exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', infrastructureEnums.dataTypes.date));
    }

    function throwUndefinedElementException(paramName) {
        exceptions.throwFormError(stringExtension.format(exceptionsMessages.undefinedParam, paramName));
    }

    var isExist = function isExist(element) {
        return ($(element) && $(element).length);
    };

    var getButton = function getButton(element) {//eslint-disable-line consistent-return
        var button = $(element).next('.' + infrastructureEnums.classes.tfsCalendar);
        if (button.length > 0) {
            return button;
        }
        else {
            throwInvalidElementTypeException();
        }
    };

    var getButtonElement = function getInputElement(element) {//eslint-disable-line consistent-return
        if (isExist(element)) {
            return getButton(element);
        }
        else {
            throwUndefinedElementException('element');
        }
    };

    var isDate = function isDate(element) {//eslint-disable-line consistent-return
        if (isExist(element)) {
            try {
                getButton(element);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        else {
            throwUndefinedElementException('element');
        }
    };

    return {
        /**
        * @public
        * @function <b>getButtonElement</b>
        * @description Get the created infrastructure button of date element
        * @param {object} element jQuery input element
        * @returns {object} created infrastructure button of date element as jQuery element
        * @throws {FormError} element not valid lookup
        * @throws {FormError} element not exists
        */
        getButtonElement: getButtonElement,
        /**
         * @public
         * @function <b>isDate</b>
         * @description determines whether element is date element of infrastructure 
         * @param {object} element jQuery input element
         * @returns {bool} is date element of infrastructure 
         * @throws {FormError} element not exists
       */
        isDate: isDate
    };
});