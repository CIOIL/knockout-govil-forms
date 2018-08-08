define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/utilities/typeVerifier',
    'common/utilities/typeParser'
],
    function (formExceptions, exeptionMessages, stringExtension, typeVerifier, typeParser) {//eslint-disable-line max-params

        var forceTruthyResult = function forceTruthyResult(fn) {
            if (typeof fn !== 'function') {
                formExceptions.throwFormError(exeptionMessages.invalidElementTypeParam);
            }
            return function (val) { //eslint-disable-line semi
                var args = Array.prototype.slice.call(arguments, 0);
                var result = fn.apply(this, args);
                if (result !== true) {
                    //TODO: have exception passed as a parameter
                    throw new formExceptions.throwFormError(stringExtension.format(exeptionMessages.invalidParam, val));
                }
                return result;
            };
        };

        return function (type, val, params) {
            var res;
            if (typeParser[type]) {
                res = typeParser[type](val, params);
            }
            else {
                res = val;
            }
            forceTruthyResult(typeVerifier[type])(res);
            return res;
        };

    });

