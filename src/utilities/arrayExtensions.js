define(function () {//eslint-disable-line complexity


    //polyfill for findIndex Array method which is not defined in IE
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex 
    Array.prototype.findIndex = Array.prototype.findIndex || function (predicate) { //eslint-disable-line complexity, no-extend-native
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1; //eslint-disable-line no-magic-numbers
    };


    //var arr = [{ 'id': '73', 'foo': 'bar' }, { 'id': '45', 'foo': 'bar' }];
    //var result = arr.findObjectByKey('id', '45');
    //result = Object {id: "45", foo: "bar"}
    Array.prototype.findObjectByKey = function (key, value) {//eslint-disable-line no-extend-native
        var self = this;

        if (self === null) {
            throw new TypeError('Array.prototype.findObjectByKey called on null or undefined');
        }
        for (var i = 0; i < self.length; i++) {
            if (ko.unwrap(self[i][key]) === value) {
                return self[i];
            }
        }
        return null;
    };
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function (callback/*, thisArg*/) {//eslint-disable-line complexity, no-extend-native

            var T, k;

            if (this === null) {
                throw new TypeError('this is null or not defined');
            }

            // 1. Let O be the result of calling toObject() passing the
            // |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get() internal
            // method of O with the argument "length".
            // 3. Let len be toUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If isCallable(callback) is false, throw a TypeError exception. 
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let
            // T be undefined.
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // 6. Let k be 0.
            k = 0;

            // 7. Repeat while k < len.
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //    This is implicit for LHS operands of the in operator.
                // b. Let kPresent be the result of calling the HasProperty
                //    internal method of O with argument Pk.
                //    This step can be combined with c.
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal
                    // method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as
                    // the this value and argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined.
        };
    }
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (searchElement /*, fromIndex*/) {//eslint-disable-line complexity, no-extend-native
            'use strict';
            if (this === null) {
                throw new TypeError('Array.prototype.includes called on null or undefined');
            }

            var O = Object(this);
            var len = parseInt(O.length, 10) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1], 10) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) { k = 0; }
            }
            var currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement ||
                   (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                    return true;
                }
                k++;
            }
            return false;
        };
    }
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {//eslint-disable-line no-extend-native
            value: function (predicate) {//eslint-disable-line complexity
                // 1. Let O be ? ToObject(this value).
                if (this === null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }

    if (!Array.from) {
        Array.from = (function () {
            var toStr = Object.prototype.toString;
            var isCallable = function (fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {//eslint-disable-line complexity
                var number = Number(value);
                if (isNaN(number)) { return 0; }
                if (number === 0 || !isFinite(number)) { return number; }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));//eslint-disable-line no-magic-numbers
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;//eslint-disable-line no-magic-numbers
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            // The length property of the from method is 1.
            return function from(arrayLike/*, mapFn, thisArg */) {//eslint-disable-line complexity
                // 1. Let C be the this value.
                var C = this;//eslint-disable-line consistent-this
                // 2. Let items be ToObject(arrayLike).
                var items = Object(arrayLike);

                // 3. ReturnIfAbrupt(items).
                if (arrayLike === null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }

                // 4. If mapfn is undefined, then let mapping be false.
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    // 5. else
                    // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                // 10. Let lenValue be Get(items, "length").
                // 11. Let len be ToLength(lenValue).
                var len = toLength(items.length);

                // 13. If IsConstructor(C) is true, then
                // 13. a. Let A be the result of calling the [[Construct]] internal method 
                // of C with an argument list containing the single item len.
                // 14. a. Else, Let A be ArrayCreate(len).
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                // 16. Let k be 0.
                var k = 0;
                // 17. Repeat, while k < len… (also steps a - h)
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                // 18. Let putStatus be Put(A, "length", len, true).
                A.length = len;
                // 20. Return A.
                return A;
            };
        }());
    }

    if (!Array.prototype.fill) {
        Object.defineProperty(Array.prototype, 'fill', {//eslint-disable-line no-extend-native

            value: function (value) {//eslint-disable-line complexity

                // Steps 1-2.
                if (this === null) {
                    throw new TypeError('this is null or not defined');
                }

                var O = Object(this);

                // Steps 3-5.
                var len = O.length >>> 0;

                // Steps 6-7.
                var start = arguments[1];
                var relativeStart = start >> 0;

                // Step 8.
                var k = relativeStart < 0 ?
                  Math.max(len + relativeStart, 0) :
                  Math.min(relativeStart, len);

                // Steps 9-10.
                var end = arguments[2];
                var relativeEnd = end === undefined ?
                    len : end >> 0;

                // Step 11.
                var final = relativeEnd < 0 ?
                  Math.max(len + relativeEnd, 0) :
                  Math.min(relativeEnd, len);

                // Step 12.
                while (k < final) {
                    O[k] = value;
                    k++;
                }

                // Step 13.
                return O;
            }
        });
    }

    if (!Array.prototype.some) {
        Array.prototype.some = function (fun/*, thisArg*/) {//eslint-disable-line complexity, no-extend-native
            'use strict';

            if (this === null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }

            if (typeof fun !== 'function') {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }
});