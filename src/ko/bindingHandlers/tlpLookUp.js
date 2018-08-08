/** custom binding for adjusting the lookup element to the infrastructure layer.
 The valueAccessor must be of lookup EntityBase type
    responsible for:
    <ul>
    <li> defines the properties and binding between the select, input and button elememnt </li>
    <li> creates the tfsValue property and binds it </li>
    <li> updates dataCode when dataText is modified
    <li> block value if not in options according to parameter 'forceValueFromOptions'
    <li> adds validation to the lookup selected value </li>
    <li> adds the information needed for the lookup schema creation </li>
     </ul>
     <b> test lookup in all scenarios are placed on last tab of modularTemplate </b>
    @module tlpLookup 
    @example 
    *    tlpLookUp: 
    *       { 
    *         value: viewModel.street, 
    *         attr: { customAttr: viewModel.companyId },
    *         bindOnAll: { attr: { customAttr: viewModel.companyName } } ,
    *         mockCustomBinding: viewModel.city.dataText, value: viewModel.street ,
    *         bindOnSelect: { attr: { customAttr: viewModel.companyId } },
    *         bindOnArrow: { attr: { customAttr: viewModel.companyId } }
    *       }
    */
define(['common/elements/lookUpMethods',
    'common/components/formInformation/formInformationViewModel',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/utilities/stringExtension',
    'common/entities/entityBase',
    'common/resources/tfsAttributes',
    'common/utilities/reflection'
],
    function (lookUpMethods, formInformation, formExceptions, commonExptionMessages, stringExtension,//eslint-disable-line max-params
        entityBase, tfsAttributes, reflection) {

        var notFound = '-1';

        function getValueByText(arrOptions, text) {
            var optionText = arrOptions[0].hasOwnProperty('text') ? 'text' : 'value';
            var optionValue = optionText === 'text' ? 'value' : 'id';
            var item = ko.utils.arrayFirst(arrOptions, function (option) {
                return option[optionText] === text;
            });
            return item ? item[optionValue] : undefined;
        }

        var getSelectedCode = function getSelectedCode(element, text, code) {
            var arrOptions;
            if (!formInformation.serverMode()) {
                var selectElement = lookUpMethods.getSelectElement(element);
                arrOptions = $(selectElement).data('options');
            }
            if (arrOptions && arrOptions.length > 0) {//if options already loaded
                code = getValueByText(arrOptions, text);
                return code;
            }
            if (code && code !== notFound) {//if options not loaded then if there is saved selected value (use it as options array)
                return code;
            }
            return undefined;//if there is no selected value (dataText taken from input) return undefined and handle later according to forceValueFromOptions param
        };

        ko.bindingHandlers.updateLookUpCode = {
            update: function update(element, valueAccessor, allBindings) {
                var dataText = allBindings().value;
                var dataCode = allBindings().code;

                var forceValueFromOptions = ko.unwrap(allBindings().forceValueFromOptions);
                var code = getSelectedCode(element, dataText(), dataCode.peek());
                if (forceValueFromOptions && !code) {
                    dataText('');
                }

                dataCode(code ? code : notFound);
            }
        };

        ko.bindingHandlers.tlpLookUp = {
            init: function init(element, valueAccessor) {

                var bindingsAccessor = ko.unwrap(valueAccessor());
                var value = bindingsAccessor.value;

                var getInputBindings = function getInputBindings() {
                    if (bindingsAccessor.bindOnAll) {
                        bindingsAccessor = reflection.extend(bindingsAccessor, bindingsAccessor.bindOnAll);
                    }
                    delete bindingsAccessor.bindOnSelect;
                    delete bindingsAccessor.bindOnArrow;
                    delete bindingsAccessor.bindOnAll;
                    return bindingsAccessor;
                };
                var getSelectBindings = function getSelectBindings() {
                    var selectBindings = bindingsAccessor.bindOnSelect || {};
                    if (bindingsAccessor.bindOnAll)
                    { selectBindings = reflection.extend(bindingsAccessor.bindOnAll, selectBindings); }
                    return selectBindings;
                };
                var getArrowBindings = function getArrowBindings() {
                    var ArrowBindings = bindingsAccessor.bindOnArrow || {};
                    if (bindingsAccessor.bindOnAll)
                    { ArrowBindings = reflection.extend(bindingsAccessor.bindOnAll, ArrowBindings); }
                    return ArrowBindings;
                };
                var validateValueType = function validateValueType() {
                    if (!(value instanceof entityBase.ObservableEntityBase) && !(value instanceof entityBase.ExtendableEntityBase)) {
                        formExceptions.throwFormError(stringExtension.format(commonExptionMessages.invalidElementTypeParam, 'value', 'entityBase.ObservableEntityBase'));
                    }
                };

                var updateLooKUpCode = function updateLooKUpCode(element, bindingsAccessor) {
                    setTimeout(function () {
                        var tfsValue = $(element).attr(tfsAttributes.TFSVALUE);//caseSensentive
                        if (bindingsAccessor() !== tfsValue)
                        { bindingsAccessor(tfsValue); }
                    }, 1);
                };
                var getValueBindings = function getValueBindings() {
                    var tfsValue = value.dataCode;
                    var text = value.dataText;
                    return {
                        attr: { tfsValue: tfsValue },
                        event: {
                            change: function (data, event) {
                                updateLooKUpCode(event.target, tfsValue);
                            }
                        },
                        value: text,
                        updateLookUpCode: {},
                        forceValueFromOptions: typeof bindingsAccessor.forceValueFromOptions !== 'undefined' ? bindingsAccessor.forceValueFromOptions : true,
                        code: tfsValue
                    };
                };
                var isValidationMessageExist = function (wrapperElement) {
                    return wrapperElement.find('.validationMessage').get(0);
                };
                var blockMultipleValidationMessages = function () {
                    var wrapperElement = lookUpMethods.getWrapperElement(element);

                    if (isValidationMessageExist(wrapperElement)) {//if span of validation message already appended, prevent koValidation engine from plating 
                        ko.applyBindingsToNode(wrapperElement.get(0), { validationOptions: { insertMessages: false } });
                    }
                };
                var bindingElements = function bindingElements() {

                    var inputElement = $(element);

                    if (!formInformation.serverMode()) {

                        var selectElement = lookUpMethods.getSelectElement(element);

                        var ArrowElements = lookUpMethods.getArrowElement(element);

                        var selectBindings = getSelectBindings(bindingsAccessor);
                        if (!$.isEmptyObject(selectBindings)) {
                            blockMultipleValidationMessages();
                            ko.applyBindingsToNode(selectElement.get(0), selectBindings);
                        }

                        var ArrowBindings = getArrowBindings(bindingsAccessor);
                        if (!$.isEmptyObject(ArrowBindings)) {
                            blockMultipleValidationMessages();
                            $.each(ArrowElements, function (index, item) {
                                ko.applyBindingsToNode(item, ArrowBindings);
                            });
                        }
                    }
                    var inputBindings = getInputBindings(bindingsAccessor);
                    ko.applyBindingsToNode(inputElement.get(0), inputBindings);
                };

                validateValueType();

                bindingsAccessor = reflection.extend(getValueBindings(), bindingsAccessor);

                bindingElements(element, bindingsAccessor);

            }
        };
    });