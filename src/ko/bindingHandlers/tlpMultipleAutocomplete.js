define(['common/ko/bindingHandlers/tlpBindList',
        'common/core/exceptions',
        'common/ko/bindingHandlers/multipleSelect/fillList',
        'common/ko/bindingHandlers/multipleSelect/selectItem',
        'common/ko/bindingHandlers/multipleSelect/texts',
        'common/utilities/multipleSelect',
        'common/ko/globals/multiLanguageObservable',
        'common/components/formInformation/formInformationViewModel',
        'common/external/q'
],
    function (tlpBindList, formExceptions, fillList, selectItem, texts, autocompleteUtils, multiLanguageObservable, formInformation, Q) {//eslint-disable-line max-params
        const defaultLimit = 10;
        const initMultipleSelectElement = function (element, { dataType = 'string', limit = defaultLimit, ...settings } = {}) {//eslint-disable-line complexity
            let mappedList,
                customCallback;
            let widgetElement;
            const listFromServiceSettings = settings.listFromServiceSettings ? Object.assign({},settings.listFromServiceSettings) : undefined;

            const listType = settings.listFromServiceSettings ? 'listFromService' : 'constList';
            const bindListFunctions = {};

            const labels = ko.multiLanguageObservable({ resource: texts });
            const resources = {
                selectors:{
                    autocompleteWidget: 'widget',
                    firstUIOption: '.ui-menu-item:first',
                    arrow: '.autocomplete-arrow',
                    arrowTemplate:`<button title=${labels().arrowTitle} value=${labels().arrowTitle} class="autocomplete-arrow" type="button"><i class="ic-autocomplete-arrow"></i></button>`,
                    defaultsSanClass:'col-md-8',
                    autocompleteContainerSelector: '.autocomplete-container',
                    autocompleteContainer: 'autocomplete-container',
                    spanValues: '.selected-values-span',
                    autocompleteClass: 'multiple-autocomplete-field'
                },
                errors: {
                    valuesSpanHTMLStructure: 'input with tlpMultipleAutocomplete binding should have parent div with  autocomplete-container class, and parent with row class',
                    unvalidRecordInList: 'exist recoeds in the list that not include the required code or text columns'
                }
            };

            const viewSelectedValuesSpan = function () {
                if (!(settings.viewSelectedValuesSpan)) {
                    return;
                }
                var spanGridClass = settings.spanGridClass || resources.selectors.defaultsSanClass;
                var selectedValuesSpanTemplate = `<div class='span-container ${spanGridClass}'><span class="selected-values-span"></span></div>`;
                $(element).closest('div[class^=\'col-md-\']').after(selectedValuesSpanTemplate);
                var selectedValuesSpan = $(element).closest('.row').find(resources.selectors.spanValues);
                if (!selectedValuesSpan[0]) {
                    formExceptions.throwFormError(resources.errors.valuesSpanHTMLStructure);
                    return;
                }
                ko.applyBindingsToNode(selectedValuesSpan[0], { text: settings.value });
                
            };
            if (formInformation.serverMode()) {
                viewSelectedValuesSpan();
                return;
            }

            const fillListHandler = fillList.initFillListBehavior(element, limit, settings.contains, true);
            const selectItemHandler = selectItem.initSelectItemBehavior(element, settings.avaliableValuesNotInList);
            
            const mapSelectedValueAsString = function(){
                settings.value($(element).val());
            };
            const mapSelectedValueFunctions = {string: mapSelectedValueAsString};

            const setMenueHeightByLimit = function () {
                const elementHeight = $(widgetElement).find(resources.selectors.firstUIOption).outerHeight();
                $(widgetElement).outerHeight(elementHeight * limit);
            };
            
            const bindArrowElement = function () {
                var arrowElement = $(element).parent().find(resources.selectors.arrow);
                var ArrowBindings = settings.bindOnArrow || {};
                if (!$.isEmptyObject(ArrowBindings)) {
                    ko.applyBindingsToNode(arrowElement[0], ArrowBindings);
                }
                $(arrowElement).on('click',() => $(element).focus());
            };
            var isAfterSelect = false;

            const bindAutocompleteElementEvents = function(){
                $(element)
                .on('focus', () => {
                    $(element).autocomplete('search', '');
                })
                .on('blur',  () => {
                    selectItemHandler.removeUnvalidValues(true, mappedList, settings.avaliableValuesNotInList);
                    mapSelectedValueFunctions[dataType]();
                    $(element).autocomplete(resources.selectors.autocompleteWidget).hide();
                })
                .on('keydown', event => {
                    autocompleteUtils.isKeyAvaliable(event, true, settings.avaliableValuesNotInList, isAfterSelect);
                    isAfterSelect = false;
                })
                .on('keyup', event => {
                    if (autocompleteUtils.isDeleteKeys(event.keyCode)) {
                        selectItemHandler.removeUnvalidValues(false, mappedList, settings.avaliableValuesNotInList);
                        mapSelectedValueFunctions[dataType]();
                    }
                    if (autocompleteUtils.needInsertNotInListValue(event, settings.avaliableValuesNotInList)) {
                        selectItemHandler.selectvalueFromList('', mappedList);
                        autocompleteUtils.removeUnnessacryrItemsFromHTML(element);
                        return false;
                    }
                    return true;
                });
                $(widgetElement).on('scroll', function(){
                    fillListHandler.loadNextBatchOnScrollBinding( $(widgetElement));
                });
                $(widgetElement).off('mouseenter');//fix IOS bug
            };

            const bindElementToAutocomplete = function () {
                let isFirstSelect = true;
                $(element).autocomplete({
                    minLength: settings.filterMinlength || 0,
                    source: (request, response) => {
                        var isListFilled = fillListHandler.loadListByFilter(request, response, mappedList);
                        if (isFirstSelect && isListFilled) {
                            setMenueHeightByLimit();
                            isFirstSelect = false;
                        }
                    },
                    focus: () =>  false ,
                    select: (event, ui) => {
                        isAfterSelect = true;
                        autocompleteUtils.removeUnnessacryrItemsFromHTML(element);
                        selectItemHandler.removeUnvalidValues(false, mappedList, settings.avaliableValuesNotInList);
                        selectItemHandler.selectvalueFromList(ui.item.value, mappedList);
                        mapSelectedValueFunctions[dataType]();
                        autocompleteUtils.openOptionsWindow(element);
                        $(element).focus();
                        return false;
                    }
                });
                widgetElement = $(element).autocomplete(resources.selectors.autocompleteWidget);
                bindArrowElement();
                viewSelectedValuesSpan();
                bindAutocompleteElementEvents();
                if(settings.widgetClass){
                    $(widgetElement).addClass(settings.widgetClass);
                }
            };

            const setSelectedValuesAfterImport = function () {
                const value = ko.unwrap(settings.value);
                if (!value) {
                    return;
                }
                const selectedValues = autocompleteUtils.split(value);
                selectedValues.reverse();
                selectedValues.filter(selectedValue => selectedValue !== '')
                              .forEach(selectedValue => selectItemHandler.selectvalueFromList(selectedValue, mappedList));
            };

            const loadListCallback = function (deffer) {
                if (customCallback && typeof(customCallback) === 'function') {
                    customCallback(deffer);
                }
                deffer.then(() => {
                    const list = listFromServiceSettings ? ko.unwrap(listFromServiceSettings.listAccessor) : ko.unwrap(settings.constListSettings.listAccessor);
                    mappedList = autocompleteUtils.mapList('entityBase', list, settings.mappingObject);
                    setSelectedValuesAfterImport();
                    bindElementToAutocomplete();
                })
                .done({
                });
                
            };
            const setMapSelectedValueFunction = function(){
                if (settings.mapSelectedValueFunction){
                    mapSelectedValueFunctions[dataType] = settings.mapSelectedValueFunction;
                }
            };

            const requiredParams = {
                mappingObject: settings.mappingObject, value: settings.value, listType: settings.listType
            };

            const listSettingsParams = {
                constList: {source: settings.constListSettings},listFromService:{source: listFromServiceSettings}
            };
            Object.assign(requiredParams, listSettingsParams[settings.listType]);
            setMapSelectedValueFunction();
            autocompleteUtils.validateRequiredParams(requiredParams, dataType, mapSelectedValueFunctions);
            $(element).after(resources.selectors.arrowTemplate);

            if ($(element).is(':disabled')) {
                $(element).next(resources.selectors.arrow).attr('disabled', true);
            }

            bindListFunctions.constList = function () {
                customCallback = settings.customCallback;
                const deferred = Q.defer();
                loadListCallback(deferred.promise);
                deferred.resolve();
            };

            bindListFunctions.listFromService = function(){
                customCallback = listFromServiceSettings.callback;
                listFromServiceSettings.callback = loadListCallback;// the loadListCallback is called by tlpBindList when load list process finished 
                ko.applyBindingsToNode(element, { tlpBindList: listFromServiceSettings});
            };
            
            bindListFunctions[listType]();

        };
        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.tlpMultipleAutocomplete"
        * @description custom binding that init field as MultipleAutocomplete field. fill the values list by use tlpBindList or by const list. 
        * @param {ko.observable} valueAccessor: settings object.
        *     var multipleAutocompleteSettings = {
                listFromServiceSettings: {
                    settings: {
                        url: 'GetComboValuesWS.asmx/getXMLDocForCombo?tableName=City&addEmptyValue=false'
                    },
                    xmlNodeName: 'City',
                    listAccessor: ko.observableArray(),
                    value: ko.observable(true),
                    functionName: 'getListByWebServiceList'
                },
                contains: true,
                listType: 'listFromService',
                limit: 15,
                filterMinlength: 0,
                avaliableValuesNotInList: false,
                mappingObject: { dataCode: 'dataCode', dataText: 'dataText' },
                value: model.selectedValue3,
                viewSelectedValuesSpan: true,
                spanGridClass: 'col-md-4',
                widgetClass: 'wide-loopkup'
            };
        * @example  Example of usage
        *
           <div class="row ">
                <div class="col-md-4">
                    <div class="multiple-autocomplete-container">
                        <label for="multipleSelect">בחירה מרובה- הכנסת ערכים לא מהרשימה</label>
                        <input id="multipleSelect" class="multiple-autocomplete-field" data-bind="value: selectedValue, tlpMultipleAutocomplete: multipleAutocompleteWithValuesNotInList" />
                    </div>
                </div>
            </div>
        */

        ko.bindingHandlers.tlpMultipleAutocomplete = {
            init: function (element, valueAccessor) {
                try {                   
                    var settings = ko.unwrap(valueAccessor());
                    initMultipleSelectElement(element, settings);
                }
                catch(ex){
                    formExceptions.throwFormError(ex);
                }

            }
        };

    });
