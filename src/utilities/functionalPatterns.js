/** Module enables to ensure the creation of a single instance for an object
@module functionalPatterns */
define(['common/resources/exeptionMessages', 'common/core/exceptions'], function (exeptionMessages, exceptions) {

    var once = function once(creatorFunction) {

        if (typeof creatorFunction !== 'function') {
            exceptions.throwFormError(exeptionMessages.invalidElementTypeParam);
        }
        var first = true;
        return function () {//eslint-disable-line consistent-return
            if (!first) {
                exceptions.throwFormError(exeptionMessages.once);
            }
            else {
                first = false;
                var args = Array.prototype.slice.call(arguments, 0);
                return creatorFunction.apply(undefined, args);
            }
        };

    };

    return {
        /**
        * wrapp function for prevent the executing more than once.
        * @method once  
        * @param {function} creatorFunction - function to wrap
        * @returns {function}  - wrapped function that throw error in the second running
        * @example 
        * var createTowerOfPisa = once(function (name, location) {
             return {
             property1: name,
             property2: location
             };
         });
         
         var towerOfPisa = createTowerOfPisa("pisa", "France");         
         var anotherTowerOfPisa = createTowerOfPisa("pisa", "Spain"); //<B>Exception is thrown!!!  </B>     
                */
        once: once
    };

});
