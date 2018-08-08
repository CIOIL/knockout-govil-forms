define(['common/utilities/stringExtension',
    'common/resources/regularExpressions',
    'common/resources/exeptionMessages',
    'common/utilities/argumentsChecker',
    'common/resources/texts/array',
    'common/utilities/typeVerifier',
    'common/utilities/tryParse',
    'common/core/exceptions',
    'common/ko/validate/koValidationMethods',
    'common/ko/globals/multiLanguageObservable'
],
    function (stringExtension, regexSource, exceptionMessages, functionUtilities, resources, typeVerifier, parser, formExceptions) {//eslint-disable-line max-params
        var messages = ko.multiLanguageObservable({ resource: resources });

        function applyIsUnique(item, params) {
            if (!Array.isArray(params.fields)) {
                formExceptions.throwFormError(stringExtension.format(exceptionMessages.invalidElementTypeParam, ['fields', 'array']));
            }
            params.fields.forEach(function (field) {
                if (typeof field.getUniqueItem === 'function') {
                    field.getUniqueItem(item).extend({ isUnique: { params: { array: params.array, getUniqueItem: field.getUniqueItem }, message: params.message, onlyIf: params.onlyIf } });
                }
                else {
                    formExceptions.throwFormError(stringExtension.format(exceptionMessages.invalidElementTypeParam, ['getUniqueItem', 'function']));
                }
            });
        }
        /**     
      * @memberof ko         
      * @function ko.extenders.uniqueItems
      * @description extender for applying 'isUnique' rule on specific field in each row of observableArray.
      * @param {string} target - current observableArray
      * @param {object} params -
      * @param {array} params.fields - array of all fields to be ruled with 'isUnique' 
      * @returns {object} target
      */
        ko.extenders.uniqueItems = function (target, params) {
            params ? params.array = target : formExceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'uniqueItems'));

            target().forEach(function (item) {
                applyIsUnique(item, params);
            });
            target.subscribe(function (changes) {
                changes.forEach(function (change) {
                    if (change.status === 'added') {
                        applyIsUnique(change.value, params);
                    }
                });
            }, null, 'arrayChange');
            return target;
        };

        /**     
       * @memberof ko         
       * @function ko.validation.rules.isUnique
       * @description rule to validate that a value is unique for all rows in a given array
       * @param {object} params -
       * @param {array} params.getUniqueItem - arrow function to fetch the right field 
       */
        ko.validation.rules.isUnique = {
            validator: function (newVal, params) {
                params = params.params || params;
                if (newVal) {
                    var array = params.array || params;
                    var getUniqueItem = params.getUniqueItem;
                    var count = 0;
                    ko.unwrap(array).forEach(function (existingVal) {
                        if (ko.unwrap(getUniqueItem(existingVal)) === newVal) { count++; }
                    });
                    return count < 2;
                }
                return true;
            },
            message: function (params) {
                params = params.params || params;
                return params.message || messages().uniqeItems;
            }
        };

        /**     
      * @memberof ko         
      * @function ko.validation.rules.minItems
      * @description rule to validate that number of items in given observableArray is not less than a given 'minRows' parameter
      * @param {function} array - the observableArray to apply the rule on
      * @param {object} params -
      * @param {int} params.minRows - the minimum number of items an observableArray can contain
      */
        ko.validation.rules.minItems = {
            validator: function (array, params) {
                try {
                    params = params.params || params;
                    var minRows = parser('int', (ko.unwrap(params.minRows) || params));
                } catch (e) {
                    formExceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'minItems'));
                }
                return array.length >= minRows;
            },
            message: function (params) {
                params = params.params || params;
                return ko.unwrap(params.message) || stringExtension.format(messages().minRows, params.minRows || params);
            }
        };

        /**     
      * @memberof ko         
      * @function ko.validation.rules.maxItems
      * @description rule to validate that number of items in given observableArray do not exceed the 'maxRows' parameter
      * @param {function} array - the observableArray to apply the rule on
      * @param {object} params -
      * @param {int} params.maxRows - the maximum number of items an observableArray can contain
      */
        ko.validation.rules.maxItems = {
            validator: function (array, params) {
                try {
                    params = params.params || params;
                    var maxRows = parser('int', (ko.unwrap(params.maxRows) || params));
                } catch (e) {
                    formExceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'maxItems'));
                }
                return array.length <= maxRows;
            },
            message: function (params) {
                params = params.params || params;
                return ko.unwrap(params.message) || stringExtension.format(messages().maxRows, params.maxRows || params);
            }
        };

        ko.validation.registerExtenders();
    });