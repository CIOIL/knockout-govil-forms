define(['common/core/exceptions'], function (formExceptions) {

    var messages = {
        invalidNumericParam: 'Invalid number was given as parameter'
    };

    //polyfill for the isInteger Numeric method which is not defined in IE
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
    Number.isInteger = Number.isInteger || function (value) {
        return typeof value === 'number' &&
               isFinite(value) &&
               Math.floor(value) === value;
    };

    //polyfill for the isNaN Numeric method which is not defined in IE
    //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    Number.isNaN = Number.isNaN || function (value) {
        return typeof value === 'number' && value !== value;
    };

    var checkNumber = function (number1, number2) {
        if ((Number.isNaN(number1) || Number.isNaN(number2))) {
            formExceptions.throwFormError(messages.invalidNumericParam);
        }
    };

    var compare = function (number1, number2) {

        number1 = parseFloat(number1, 10);
        number2 = parseFloat(number2, 10);

        checkNumber(number1, number2);

        if (number1 > number2) {
            return 1;
        }

        if (number2 > number1) {
            return -1; //eslint-disable-line no-magic-numbers
        }

        return 0;
    };
    var isInRange = function (number, min, max) {
        var intNumber = parseInt(number, 10);
        var intMin = parseInt(min, 10);
        var intMax = parseInt(max, 10);

        if ((Number.isNaN(intNumber) || Number.isNaN(intMin) || Number.isNaN(intMax))) {
            formExceptions.throwFormError(messages.invalidNumericParam);
        }
        return intNumber >= intMin && intNumber <= intMax;

    };
    return {
        compare: compare,
        isInRange: isInRange,
        messages: messages
    };
});