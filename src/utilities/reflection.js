/** module that adds utility functions for strings.
@module reflection */
define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'
],
    function (exceptions, exceptionMessages, stringUtils) {

        var getNestedProperty = function (object, nestedProperty) {

            var validInput = function () {
                return (typeof object === 'object' && typeof nestedProperty === 'string');
            };

            if (!validInput()) {
                exceptions.throwFormError(stringUtils.format(exceptionMessages.funcInvalidParams, 'getNestedProperty'));
            }

            var propertyTree = nestedProperty.split('.');
            while (propertyTree.length) {
                var property = propertyTree.shift();
                if (property in object) {
                    object = object[property];
                } else {
                    return;
                }
            }
            return object; //eslint-disable-line consistent-return
        };

        var innerExtend = function (target, source, prop) {
            if (source[prop] && source[prop].constructor &&
                     source[prop].constructor === Object) {
                target[prop] = target[prop] || {};
                deepExtend(target[prop], source[prop]); //eslint-disable-line no-use-before-define
            } else if (!target.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
            return target;
        };

        //deepExtend added because of the jquery $.extend function does not maintain computed fields connections     
        var deepExtend = function deepExtend(target, source) {
            for (var property in source) {
                if (source.hasOwnProperty(property)) {
                    target = innerExtend(target, source, property);
                }
            }
            return target;
        };

        var extend = function (target, source) {

            if ($.type(target) !== 'object') {
                return ((typeof source === 'object') ? source : {});
            }

            if ($.type(source) !== 'object') {
                return target;
            }

            return deepExtend(target, source);

            //var shallowExtend = function () {
            //    for (var prop in source) {
            //        if (!target.hasOwnProperty(prop) && source.hasOwnProperty(prop)) {
            //            target[prop] = source[prop];
            //        }
            //    }

            //    return target;
            //};

            //if ($.type(target) !== 'object') {
            //    return ((typeof source === 'object') ? source : {});
            //}

            //if ($.type(source) !== 'object') {
            //    return target;
            //}

            //return shallowExtend();
        };

        var extendSettingsWithDefaults = function (settings, defaultSettings) {
            var merged = {};
            return this.extend(extend(merged, settings), defaultSettings);
        };

        return {
            /** retrns new object which extend settings with defaults when they are not specified.
          * @method extendSettingsWithDefaults    
          * @param {target} settings - the specified settings that should be extended
          * @param {target} defaultSettings - the default settings
          * @returns {string}  - brand new object with the extended settings 
          * @example reflection.extendSettingsWithDefaults({required:true},{required:false, visible:true}) 
          *          will output the following:  {required:true, visible:true}
          */
            extendSettingsWithDefaults: extendSettingsWithDefaults,
            /** returns the value of a property that is deeply nested within a given object.
         * @method getNestedProperty    
         * @param {object} object - the object in which the  property is looked for
         * @param {string} nestedProperty - the property of which the value should be returned
         * @returns {string}  - value of the property, undefined if not found.
         * @throws Will throw an error if the first parameter isnt an object or the scond isnt a string. */
            getNestedProperty: getNestedProperty,
            /** performs a shallow extend of a target object with the own properties of a source object
          * @method extend    
          * @param {target} target - the object to be extended
          * @param {target} source - the object from which own properties are cloned to the target object
          * @returns {string}  - the extended (target) object */
            extend: extend
        };
    });
