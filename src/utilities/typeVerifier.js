define(['common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/resources/regularExpressions'],
    function (formExceptions, exceptionToThrow, regexSource) {

        Number.isInteger = Number.isInteger || function (value) {
            return typeof value === 'number' &&
              isFinite(value) &&
              Math.floor(value) === value;
        };

        var array = function (val) {
            return Array.isArray(val);
        };

        var string = function (val) {
            return typeof val === 'string';
        };

        var int = function (val) {
            return Number.isInteger(val);
        };

        var date = function (val) {
            return (val instanceof Date);
        };

        var decimal = function (val) {
            return (!val || !regexSource.decimal.test(val));
        };

        var number = function (val) {
            return $.isNumeric(val);
        };

        function domElement(obj) {
            return (
              typeof HTMLElement === 'object' ? obj instanceof HTMLElement : //DOM2
              obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
          );
        }

        function jQueryElement(obj) {
            return (
                typeof jQuery !== 'undefined' ? obj instanceof jQuery && obj.length > 0 : false
                );
        }
        function json(val) {
            try {
                JSON.parse(val);
            } catch (e) {
                return false;
            }
            return true;
        }
        function object(val) {
            return val && typeof val === 'object';
        }
        function arrayBuffer(val) {
            return val instanceof ArrayBuffer; //eslint-disable-line  no-undef
        }
        return {
            string,
            int,
            date,
            decimal,
            number,
            array,
            domElement,
            jQueryElement,
            json,
            object,
            arrayBuffer
        };
    });

