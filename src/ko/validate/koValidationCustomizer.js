/**
 * @module koValidationCustomizer
 * @description collection of various functions for customizing ko.validation
 */

define(['common/ko/validate/utilities/elementGettersByType',
    'common/ko/validate/customizeView',
    'common/viewModels/languageViewModel',
    'common/utilities/stringExtension',
    'common/components/formInformation/formInformationViewModel'
], function (elementGettersByType, viewUtils, languageViewModel, stringExtension, formInformation) {//eslint-disable-line max-params

    var originalValidationCoreInit = ko.bindingHandlers.validationCore.init;
    var originalAddRule = ko.validation.addRule;

    //#region changes on view

    var setTextAreaClearFlag = function (element, observable) {
        if ($(element).is('textArea')) {
            observable.clearAfterValidation(false);
        }
    };

    const adjustViewByRules = (element, observable) => {
        var visitedFunctions = [];
        var rules = ko.unwrap(observable.rules);
        rules.forEach(function (rule) {
            if (typeof viewUtils[rule.ruleName] === 'function' && !visitedFunctions.includes(rule.ruleName)) {
                viewUtils[rule.ruleName](element, rule, observable);
                visitedFunctions.push(rule.ruleName);
            }
            if (typeof viewUtils[rule.rule] === 'function' && !visitedFunctions.includes(rule.rule)) {
                viewUtils[rule.rule](element, rule, observable);
                visitedFunctions.push(rule);
            }
        });
    };

    /**
    * @function <b>validationCore.init</b>
    * @description responsible for: 
    *   <ul>
                <li>adding red asterisk to required fields</li>
                <li>adding attribute maxLength when needed</li>
                <li>add property type='number' to numeric fields in mobile</li>
                <li>set attribute 'dir' of email fields to 'ltr'</li>
                <li>marking textArea elements as 'not to be cleared when not valid'</li>
            </ul>
    * <i>overrides the original ko.validation.validationCore, plants the *** and directs to the original function</i>
    */
    ko.bindingHandlers.validationCore = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {//eslint-disable-line
            if (window.bExecutingOnServerSide !== true) {
                var observable = valueAccessor();
                if (ko.validation.utils.isValidatable(observable)) {
                    observable.validationExcludeRequire = ko.observable(false);
                    observable.validationExcludeRequire.state = false;
                    ko.postbox.subscribe('validationExcludeRequire', function (data) {
                        observable.validationExcludeRequire.state = data.val;
                        if (!data.updateStateOnly) {
                            if (ko.unwrap(observable.validationExcludeRequire) === data.val) {
                                observable.validationExcludeRequire.notifySubscribers();
                            }
                            else {
                                observable.validationExcludeRequire(data.val);
                            }
                        }
                    });
                    adjustViewByRules(element, observable);
                    setTextAreaClearFlag(element, observable);
                }
                originalValidationCoreInit(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext); //eslint-disable-line
            }
        }
    };

    //#endregion


    ko.validation.addRule = function (observable, rule) {
        observable.clearAfterValidation = ko.observable(true);
        // if (window.bExecutingOnServerSide !== true) {
        originalAddRule(observable, rule);
        // }
        return observable;
    };

    //overrides the original ko.validation.addExtender, to add property ruleName on the rule. so it can be detected
    ko.validation.addExtender = function (ruleName) {
        var kv = ko.validation;
        ko.extenders[ruleName] = function (observable, params) {//eslint-disable-line complexity
            if (params && (params.message || params.onlyIf)) { //if it has a message or condition object, then its an object literal to use
                return kv.addRule(observable, {
                    rule: ruleName,
                    message: params.message,
                    params: kv.utils.isEmptyVal(params.params) ? true : params.params,
                    condition: params.onlyIf,
                    ruleName: params.ruleName || kv.rules[ruleName].ruleName
                });
            }
            else {
                return kv.addRule(observable, {
                    rule: ruleName,
                    params: params,
                    ruleName: kv.rules[ruleName].ruleName
                });
            }
        };
    };

    /**     
    * @memberof ko         
    * @function 'ko.bindingHandlers.altValidationApplicator'
    * @description custom binding that applies ko.bindingHandlers.validationCore to the element 
    * in order to prevent unnecessary exposure to ko.validation native code.
    * for use in cases where there is no use in native knockout bindings 
    * @example 
    * altValidationApplicator: text
    */
    ko.bindingHandlers.altValidationApplicator = {
        init: function (element, valueAccessor) {
            var observable = valueAccessor();
            ko.applyBindingsToNode(element, {
                validationCore: observable
            });
        }
    };

    const getLabelForParticularTypes = (currentElement) => {
        let label;
        for (var type in elementGettersByType) {
            if (elementGettersByType[type].is(currentElement)) {
                if (typeof elementGettersByType[type].getLabel === 'function') {
                    label = elementGettersByType[type].getLabel(currentElement);
                }
            }
        }
        return label;
    };

    const getElementLabel = function (id) {
        let label;
        const currentElement = $('#' + id);
        if (currentElement.length > 0) {
            label = getLabelForParticularTypes(currentElement);
            if (!label) {
                var parent = currentElement.closest('div[class^="col-"]');//eslint deisable line
                label = parent.find('label[for="' + id + '"]')[0] || parent.find('label[data-for="' + id + '"]')[0];//eslint deisable line
            }
        }
        return label;
    };

    const isValidationMessageForRadioElement = function (element) {
        if ($(element).closest('.radio')[0]) {
            return true;
        }
        return false;
    };

    const getRadioLabel = function (element) {
        var radioDiv = $(element).closest('.radio')[0];
        var ariaLabelledbyAttribute = $(radioDiv).attr('aria-labelledby');
        var label = $('#' + ariaLabelledbyAttribute);
        return label[0];
    };

    const getElementId = function (element) {
        return element.id.match(/_(\w+)/) ? element.id.match(/_(\w+)/)[1] : undefined;
    };

    const getMessageWithElementName = function (message, elementName) {
        const getHebrewMessage = (message, unwrappedName) => {
            return stringExtension.format(message, unwrappedName || 'זה');
        };
        const getEnglishMessage = (message, unwrappedName) => {
            return stringExtension.format(message, unwrappedName ? 'the field ' + unwrappedName : 'This field');
        };
        const getUnwrapedElementName = () => {
            return elementName && elementName.trim() !== '' ? elementName.replace('*', '') : undefined;
        };
        if (message) {
            const unwrappedName = getUnwrapedElementName();
            if (languageViewModel.isHebrew()) {
                return getHebrewMessage(message, unwrappedName);
            }
            if (languageViewModel.isEnglish()) {
                return getEnglishMessage(message, unwrappedName);
            }
        }
        return message;
    };

    const getLabelContent = (label) => {
        return label.textContent;
    };

    var originalTextUpdate = ko.bindingHandlers.text.update;
    ko.bindingHandlers.text.update = function (element, valueAccessor) {
        originalTextUpdate(element, valueAccessor);
        if (formInformation.isMultiLanguage()) {
            if ($(element).is('label') || $($(element), 'label').length === 1) {
                $(element).trigger('change');
            }
        }
    };

    ko.bindingHandlers.notifyTextContent = {
        init: function (element, valueAccessor) {
            var content = valueAccessor();
            content(getLabelContent(element));
            $(element).children().andSelf().each(function () {
                $(this).on('change', function () {
                    content(getLabelContent(element));
                });
            });
        }
    };

    ko.bindingHandlers['validationMessage'].init = function (element, valueAccessor) {//eslint-disable-line complexity
        const obsv = valueAccessor();
        if (obsv.elementName) {
            return;
        }

        let boundElementId, label;
        if (isValidationMessageForRadioElement(element)) {
            label = getRadioLabel(element);
        }
        else {
            boundElementId = getElementId(element);
            label = getElementLabel(boundElementId);
        }       
              
        obsv.elementName = ko.observable();
        if (label) {
            if (!formInformation.isMultiLanguage()) {
                obsv.elementName(getLabelContent(label));
                return;
            }
            ko.applyBindingsToNode(label, { notifyTextContent: obsv.elementName });
        }
    };

    ko.bindingHandlers['validationMessage'].update =
        function (element, valueAccessor) {//eslint-disable-line complexity
            var kv = ko.validation;

            var obsv = valueAccessor(),
                config = kv.utils.getConfigOptions(element),
                isModified = false,
                isValid = false,
                validationExcludeRequire,
                validationExcludeRequireState;

            if (obsv === null || typeof obsv === 'undefined') {
                throw new Error('Cannot bind validationMessage to undefined value. data-bind expression: ' +
                    element.getAttribute('data-bind'));
            }

            isModified = obsv.isModified && obsv.isModified();
            isValid = obsv.isValid && obsv.isValid();
            validationExcludeRequire = obsv.validationExcludeRequire;
            validationExcludeRequireState = validationExcludeRequire ? ko.unwrap(validationExcludeRequire) && validationExcludeRequire.state : false;
            var error = null;
            if (!config.messagesOnModified || isModified) {
                var requireErrorExcludeValidation = validationExcludeRequireState && obsv.error.isRequireError;
                error = ko.computed(function () {
                    if (isValid || requireErrorExcludeValidation) {
                        return null;
                    }
                    // if (obsv.error()) {
                    //const boundElementId = getElementId(element);
                    //elementName = ko.unwrap(obsv.elementName) || getElementLabelContent(boundElementId);
                    // }
                    return getMessageWithElementName(obsv.error(), ko.unwrap(obsv.elementName));

                });
            }

            var isVisible = !config.messagesOnModified || isModified ? !isValid : false;
            var isCurrentlyVisible = element.style.display !== 'none';

            if (config.allowHtmlMessages) {
                ko.utils.setHtml(element, error);
            } else {
                ko.bindingHandlers.text.update(element, function () { return error; });
            }

            if (isCurrentlyVisible && !isVisible) {
                element.style.display = 'none';
            } else if (!isCurrentlyVisible && isVisible) {
                element.style.display = '';
            }
        };


    ko.validation.utils.values = function (o) {
        var r = [];
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                r.push(o[i] && typeof (o[i]) === 'object' && o[i].getModel ? o[i].getModel() : o[i]);
            }
        }
        return r;
    };

});