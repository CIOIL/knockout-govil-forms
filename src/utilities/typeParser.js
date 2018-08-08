define(['common/external/date'],
function () {//eslint-disable-line max-params

    /**
    * @function date
    * @description parse value to Date type 
    * @param {object} val contains the value to parse
    * @param {object} format of val to enable correct parsing other set default format 'dd/MM/yyyy'
    * @returns {Date} value as Date instance 
     */
    function checkFullFormat(val) {
        var notFound = -1;
        return val.indexOf('PM') !== notFound || val.indexOf('AM') !== notFound;
    }
    function handleMisparsedFullFormat(parsedDate) {
        if (!parsedDate) {
            return;
        }
        var midnight = 0, midday = 12;
        if (parsedDate.getHours() === midnight || parsedDate.getHours() === midday) {
            parsedDate.addHours(-12);//eslint-disable-line
        }
    }
    function getFormat(format) {
        return format || 'dd/MM/yyyy';
    }
    var date = function (val, format) {
        if (val) {
            format = getFormat(format);
            val = val.toString(format);
            var isFullFormat = checkFullFormat(val);
            //backward compatibility-after change the default format to 'dd/MM/yyyy' according to Common Language document. parse to format 'd/MM/yyyy' if failed.
            val = Date.parseExact(val, format) || Date.parseExact(val, 'd/MM/yyyy');
            //due to bug in Date.js AM & PM are mixed up between the hours 12 to 1. 
            //to fix this the function subs 12 hours from the parsed date
            if (isFullFormat) {
                handleMisparsedFullFormat(val);
            }
        }
        return val;
    };

    /**
    * @function string
    * @description parse value to String type
    * @param {object} val contains the value to parse
    * @returns {String} value as String instance 
     */
    var string = function (val) {
        return val.toString();
    };

    /**
    * @function number
    * @description parse value to Number type
    * @param {object} val contains the value to parse
    * @returns {Number} value as Number instance 
     */
    var number = function (val) {
        if (val && typeof val !== 'boolean') {
            val = Number(val);
        }
        return val;
    };

    /**
    * @function int
    * @description parse value to Number type
    * @param {object} val contains the value to parse
    * @returns {Number} value as Number instance 
     */
    //support previouse versions
    var int = function (val) {
        return number(val);
    };

    return {
        int: int,
        date: date,
        string: string,
        number: number
    };
});