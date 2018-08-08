/** A collection of rules mappings.
* Each module can add its own rules when creating the module.
* The form will use these rules when mapping data to viewModel by ko.mapping.
 * @module mappingManager
 */
define(['common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension'],
    function (formExceptions, exeptionMessages, stringExtension) {

        var resources = {
            isExitsExeption: 'the rule \"{0}\" already exits in mappingRules'
        };

        var _mappingRules = {};

        var isExitsRule = function (ruleName) {
            return _mappingRules.hasOwnProperty(ruleName);
        };
        var isArray = function (data) {
            return (data instanceof Array);
        };

        var addRule = function (ruleName, newRule) {
            if (isExitsRule(ruleName)) {
                var exitsRule = _mappingRules[ruleName];
                if (isArray(exitsRule)) {
                    newRule = exitsRule.concat(newRule);
                }
                else {
                    formExceptions.throwFormError(stringExtension.format(resources.isExitsExeption, ruleName));
                }
            }

            _mappingRules[ruleName] = newRule;
        };
        /** Gets the collection of rules mappings that was added to the manager.
        * @method get
        * @returns {object} mappingRules -  collection of rules mappings  
        * @example Example usage of get.
        * ko.mapping.fromJSON(saverVal, mappingManager.get(), viewModel);
        */
        var get = function () {
            return _mappingRules;
        };

        /** Update the collection with rules mappings.
        * @method update
        * @param {object} mappingRules -  rulles (object that contain object, arrays and functions) to add.  
        * @throws when rule already exits
        * @returns {undefined}
        * @example Example usage of update:
        * var mappingRules = {
                         contactList: {
                             update: function () { }
                         },
                         ignore: ['stageStatus'],
                         child: {
                             create: function () { }
                         }
                     };
    
            mappingManager.update(mappingRules);        
        */
        var update = function (mappingRules) {
            for (var ruleName in mappingRules) {
                if (
                    mappingRules.hasOwnProperty(ruleName)) {
                    addRule(ruleName, mappingRules[ruleName]);
                }
            }

        };

        var utils = (function utils() {

            var create = function create(data, type, params) {
                if (typeof data !== 'object') {
                    formExceptions.throwFormError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'data', 'object'));
                }
                if (typeof type !== 'function') {
                    formExceptions.throwFormError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'type', 'constructor'));
                }
                var modularViewModel = new type(params);
                var mappingRules = (typeof modularViewModel.getMappingRules === 'function') ? modularViewModel.getMappingRules() : {};
                return ko.mapping.fromJS(data, mappingRules, modularViewModel);

            };

            return {
                /**
            * <b>utils.create</b>
            * @export mappingManager.utils  
            * @function
            * @name create 
            * @param {object} data -  object literal that contains data.  
            * @param {function} type -  constructor of type.  
            * @throws when rule already exits
            * @example Example usage of create: 
            * mappingManager.utils.create(data,type) */
                create: create
            };
        }());

        return {
            get: get,
            update: update,
            /** contains utility functions for mapping json into view models
     * @type {object}
    */

            utils: utils
        };
    });
