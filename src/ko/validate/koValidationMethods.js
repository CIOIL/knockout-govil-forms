/**
* @description ???
* @module koValidationMethods
*/

define(['common/utilities/stringExtension',
    'common/ko/validate/koValidationInsertMessage',
    'common/resources/texts/basicValidation',
    'common/ko/validate/koValidationCustomizer',
    'common/ko/globals/multiLanguageObservable'


], function (stringExtension, koValidationInsertMessage, resources) {//eslint-disable-line max-params
    koValidationInsertMessage = koValidationInsertMessage.insertValidationMessage;

    var messages = ko.multiLanguageObservable({ resource: resources });
    var kv = ko.validation;

    /**
  * @function <b>setCustomMessage</b>
  * @description applies custom messages to ko.validation native rules using ko.multiLanguageObservable to support dynamic language change.
  * remove unnecessary rules (=no suitable message found in resource).
  * @param {string} rule
  */

    function setCustomMessage(rule) {
        if (!messages()[rule] && rule !== 'pattern') {
            delete ko.validation.rules[rule];
        }
        else {
            ko.validation.rules[rule].message = function () {
                var currentRule = rule;
                return function (param) {
                    param = param.param || param;
                    if (typeof param !== 'undefined' && typeof param !== 'boolean') {
                        return stringExtension.format(messages()[currentRule], ko.unwrap(param));
                    }
                    return messages()[currentRule];
                };
            }();
        }
    }

    var shouldClearFlags = {
        maxLength: false,
        minLength: false
    };

    /**
  * @function <b>addShouldClearOnFailure</b>
  * @description adds flag 'shouldClearOnFailure' 
  * to indicate whether to clear the value if isn't valid on not
  * @param {string} rule
  */

    function addShouldClearOnFailure(rule) {
        if (ko.validation.rules[rule]) {
            ko.validation.rules[rule].shouldClearOnFailure = shouldClearFlags[rule] !== undefined ? shouldClearFlags[rule] : true;
        }
    }


    var useObjectLiteral = function (params) {
        if (typeof params === 'object') {
            return params.hasOwnProperty('onlyIf') || params.hasOwnProperty('params');
        }
        return false;
    };

    /**
   * @function <b>addPropertyRuleName</b>
   * @description adds extra property to rule object that holds the rule name (to support various validations that use rule 'pattern' and cannot be detected by name.
   * @param {string} rule
   */

    function addPropertyRuleName(rule) {
        if (ko.extenders[rule]) {
            ko.extenders[rule] = function () {
                var currentRule = rule;
                return function (observable, params) {
                    if (useObjectLiteral(params)) { //if it has a message or condition object, then its an object literal to use
                        return kv.addRule(observable, {
                            rule: currentRule,
                            message: params.message,
                            params: kv.utils.isEmptyVal(params.params) ? true : params.params,
                            condition: params.onlyIf,
                            ruleName: params.ruleName || kv.rules[currentRule].ruleName
                        });
                    }
                    else {
                        return kv.addRule(observable, {
                            rule: currentRule,
                            params: params,
                            ruleName: kv.rules[currentRule].ruleName
                        });
                    }
                };
            }();
        }
    }

    var customizeExistingRules = function () {
        for (var rule in ko.validation.rules) {
            if (ko.validation.rules.hasOwnProperty(rule)) {
                //messages
                setCustomMessage(rule);
                //clearOnFailure
                addShouldClearOnFailure(rule);
                //add rule name
                addPropertyRuleName(rule);
            }
        }
    };

    /**
    * @function init
    * @description initialize the configuration settings of ko.validation
    * @returns {object} init
    * @public
    */
    (function () {
        ko.validation.init({
            insertMessages: true,
            errorsAsTitle: false,
            errorsAsTitleOnModified: true,
            errorElementClass: 'validationElement',
            errorMessageClass: 'validationMessage',
            decorateInputElement: true
        }, true);
        ko.validation.insertValidationMessage = koValidationInsertMessage;
        customizeExistingRules();
    })();

    //todo: create function updateSettings
    return {
        init: function () { }
    };
});