define(['common/elements/attachmentMethods',
    'common/elements/lookUpMethods',
    'common/infrastructureFacade/tfsMethods',
    'common/utilities/reflection',
    'common/resources/texts/address',
    'common/resources/texts/date',
    'common/ko/validate/customizeView',
    'common/ko/bindingHandlers/maxLengthFunctionality',
    'common/ko/utils/isComputed',
    'common/ko/utils/isObservableArray',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/bindingHandlers/tlpTooltip'],
    function (attachmentMethods, lookUpMethods, tfsMethods, reflection, addressTexts, dateTexts) {//eslint-disable-line max-params

        var resources = reflection.extend(addressTexts, dateTexts);
        var tooltipTexts = ko.multiLanguageObservable({ resource: resources.tooltip });
        var labels = ko.multiLanguageObservable({ resource: resources.labels });

        var getRule = function (rules, ruleName) {
            return rules.filter(function (item) {
                return item.ruleName === ruleName || item.rule === ruleName;
            })[0];
        };

        var isCheckBox = function (element) {
            return element.is(':checkbox');
        };

        var isRadio = function (element) {
            return element.is(':radio');
        };

        var elementTypes = {
            lookup: {
                is: lookUpMethods.isLookUp, getLabel: lookUpMethods.getLabelElement
            },
            attachment: {
                is: attachmentMethods.isAttachment, getLabel: attachmentMethods.getLabelElement
            },
            checkbox: {
                is: isCheckBox, getLabel: function () {
                    return;
                }
            },
            radio: {
                is: isRadio, getLabel: function () {
                    return;
                }
            }
        };

        var getLabel = function getLabel(element) {
            element = $(element);

            for (var type in elementTypes) {
                if (elementTypes[type].is(element)) {
                    return elementTypes[type].getLabel(element);
                }
            }

            var parent = element.closest('div[class^="col-"]');//eslint deisable line quotes
            var label;
            label = parent.find('label[for="' + element.attr('id') + '"]')[0] || parent.find('label[data-for="' +element.attr('id') + '"]')[0];//eslint deisable line quotes
            return label;
            //   }
        };

        /**
         * adds a red asterisk on labels to mark fields as mandatory fields.
         * @param {DOMElement} label - the label to put the <span style="color:red;">*</span> on.
         * @param {object} isRequired - The second number.
         * @return {void}.
         */
        var addMarkupToRequiredFields = function (label, isRequired) {
            if (label) {
                label = label.get ? label.get(0) : label;
                ko.applyBindingsToNode(label, {
                    css: {
                        required: isRequired
                    }
                });
            }
        };
        var addAriaAttrToRequiredFields = function (element, isRequired) {
            ko.applyBindingsToNode(element, {
                attr: {
                    'aria-required': isRequired
                }
            });
        };

        var setDirLtr = function (element) {
            $(element).prop('dir', 'ltr');
        };

        /**
        * @description adds a "maxLength" attributes on fields with validationRule of maxLength.
        * <br />
        * <i>the DOM would then block exceeding chars</i>
        * @param {DOMElement} element - the element to put the attr on.
        * @param {number} maxLength - the maxLength value
        * @param {object} maxLengthRule - the maxLength rule
        * @returns {void}
        */
        var addMaxLengthAttr = function (element, maxLength, maxLengthRule) {
            var addMaxLength = ko.computed(function () {
                var isMaxlength = !maxLengthRule.condition ||
                    (maxLengthRule.condition && maxLengthRule.condition());
                return isMaxlength ? ko.unwrap(maxLength) : false;
            });

            ko.applyBindingsToNode(element, {
                attr: {
                    'maxLength': addMaxLength
                }
            });
        };

        var addLinkToZipcodeField = function (element) {
            var linkText = ko.computed(function () {
                return labels().zipCode;
            });
            var linkAriaLabel = ko.computed(function () {
                return tooltipTexts()['zipCode'];
            });
            var linkNewWindowAlert = 'accessibilityNewWindowAlert';
            var link = document.createElement('a');
            link.href = 'http://www.israelpost.co.il/zipcode.nsf/demozip?OpenForm';
            link.target = '_blank';
            link.className = 'zipcode-link noPrint';
            ko.applyBindingsToNode(link, {
                text: linkText,
                attr: {
                    'aria-label': linkAriaLabel
                },
                addDescription: linkNewWindowAlert
            });
            var linkLocation = getLabel(element);
            $(linkLocation).append($(link));
        };

        var addPDFZipCodeSpan = function (element, label) {
            $(label).text('');
            var spanText = ko.computed(function () {
                return labels().zipCode;
            });
            var span = document.createElement('SPAN');
            span.className = 'invisibleElem';
            span.id = 'zipCodeLabel';
            ko.applyBindingsToNode(element, {
                addDescription: span.id
            });
            ko.applyBindingsToNode(span, {
                text: spanText
            });
            $(label).append(span);
        };


        var addTooltipToField = function (element, ruleName) {
            var span = document.createElement('SPAN');
            var tooltipLocation = getLabel(element);
            if (tooltipLocation) {
                var tooltipText = ko.computed(function () {
                    return tooltipTexts()[ruleName];
                });
                $(span).insertAfter(tooltipLocation);
                span.textContent = '?';
                span.id = element.id + '_desc';
                span.className = 'tooltip-help';
                ko.applyBindingsToNode(span, {
                    tlpTooltip: tooltipText
                });
                if (ruleName !== 'zipCode') {
                    ko.applyBindingsToNode(element, {
                        addDescription: span.id
                    });
                }
            }
        };

        var addPaternMask = function (element, ruleName) {
            
            if (ruleName === 'date'&& !tfsMethods.isMobile()) {
                $(element).mask('99/99/9999', { placeholder: 'dd/mm/yyyy' });
            }
            else if (ruleName === 'time') {
                $(element).mask('99:99', { placeholder: 'hh:mm' });
            }

        };

        ko.bindingHandlers.toggleNumericProps = {
            update: function (element, valueAccessor) {
                var numericRule = valueAccessor();
                var isNumeric = numericRule.condition ? ko.unwrap(numericRule.condition) : numericRule.params;
                if (isNumeric) {
                    $(element).prop('type', 'number');
                    $(element).prop('pattern', '\\d*');
                }
                else {
                    $(element).removeProp('type');
                    $(element).removeProp('pattern');
                }
            }
        };


        /**
        * @function <b>requiredWrapper</b> 
        * @description custom binding that applies all "required" related issues on the html
        * <br />
        */
        ko.bindingHandlers.requiredWrapper = {
            init: function (element, valueAccessor, allBindings) {//eslint-disable-line complexity
                var autoMark = typeof allBindings().autoMark !== 'undefined' ? allBindings().autoMark : true;
                var observable = valueAccessor();
                var label = $(element).find('label')[0];
                var rules = typeof observable.rules === 'function' ? observable.rules() : [];
                var requiredRule = getRule(rules, 'required') || getRule(rules, 'requiredCbx');
                if (requiredRule) {
                    var isRequired = requiredRule.condition ? requiredRule.condition : !!requiredRule.params;
                }
                var addAsterisk = ko.computed(function () {
                    return ko.unwrap(isRequired) && ko.unwrap(autoMark);
                });

                addMarkupToRequiredFields(label, addAsterisk);

                ko.applyBindingsToNode(element, {
                    validationElement: observable,
                    validationOptions: {
                        insertMessages: false
                    },
                    attr: {
                        'aria-required': isRequired
                    }
                });
            }
        };

        return {
            required: function (element, requiredRule, obs) {
                var isRequired = requiredRule.condition ? requiredRule.condition : !!requiredRule.params;
                var addAsterisk = ko.computed(function () {
                    return ko.unwrap(isRequired) && (typeof obs.autoMark !== 'undefined' ? ko.unwrap(obs.autoMark) : true);
                });
                addMarkupToRequiredFields(getLabel(element), addAsterisk);
                addAriaAttrToRequiredFields(element, isRequired);
            },
            zipCode: function (element) {
                var label = getLabel(element);
                addPDFZipCodeSpan(element, label);
                addLinkToZipcodeField(element);
                addTooltipToField(element, 'zipCode');
            },
            email: function (element) {
                setDirLtr(element);
            },
            date: function (element) {
                addTooltipToField(element, 'date');
                setDirLtr(element);
                addPaternMask(element, 'date');
            },
            time: function (element) {
                addTooltipToField(element, 'time');
                addPaternMask(element, 'time');
            },
            url: function (element) {
                setDirLtr(element);
            },
            maxLength: function (element, maxLengthRule, observable) {
                var maxLength = maxLengthRule.params;
                var numberRule = getRule(observable.rules(), 'number');
                if (tfsMethods.isMobile() && !!numberRule) {
                    ko.bindingHandlers.maxLengthFunctionality.init(element, maxLength);
                }
                else {
                    addMaxLengthAttr(element, maxLength, maxLengthRule);
                }
            },
            number: function (element, numberRule) {
                if (tfsMethods.isMobile()) {
                    ko.applyBindingsToNode(element, {
                        toggleNumericProps: numberRule
                    });
                }
            }
        };
    });