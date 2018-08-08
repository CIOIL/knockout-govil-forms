define(['common/core/exceptions',
        'common/ko/bindingHandlers/multipleSelect/fillList',
        'common/ko/bindingHandlers/multipleSelect/selectItem',
        'common/utilities/multipleSelect',
        'common/components/formInformation/formInformationViewModel',
        'common/core/UIProvider'
],
    function (formExceptions, fillList, selectItem, autocompleteUtils, formInformation, UIProvider) {//eslint-disable-line max-params
       
        const defaultLimit = 5;
        const initAutocompleteElement = function (element,  { dataType = 'entityBase', limit = defaultLimit, ...settings} = {}) {
            
            const resources = {
                selectors:{
                    autocompleteWidget: 'widget',
                    firstUIOption: '.ui-menu-item:first',
                    arrow: '.autocomplete-arrow'
                }
            };            

            let mappedList = [];
            const fillListHandler = fillList.initFillListBehavior(element, limit, settings.contains, false);
            const mapSelectedValueFunctions = {entityBase: autocompleteUtils.updateValueAsEntityBase};
                     
            const setMenueHeightByLimit = function () {
                const elementHeight = $(element).autocomplete(resources.selectors.autocompleteWidget).find(resources.selectors.firstUIOption).outerHeight();
                $(element).autocomplete(resources.selectors.autocompleteWidget).outerHeight(elementHeight * limit);
            };
            
            const bindArrowElement = function () {
                const arrowElement = $(element).parent().find(UIProvider.resources.autocomplete.arrow);
                const arrowBindings = settings.bindOnArrow || {};
                if (!$.isEmptyObject(arrowBindings)) {
                    ko.applyBindingsToNode(arrowElement[0], arrowBindings);
                }
                $(arrowElement).on('click',() => {
                    $(element).focus();
                    $(element).autocomplete('search', $(element).val());
                });
            };

            const validateAutocompleteValue = function () {
                const notExist = -1;
                const elementExistInList = mappedList.map(item => ko.unwrap(item.dataText)).indexOf($(element).val()) !== notExist;
                if (!(settings.avaliableValuesNotInList || elementExistInList)) {
                    $(element).val('');
                }
            };
            var isAfterSelect = false;

            const bindAutocompleteElementEvents = function(){
                $(element)
                //.on('focus', () => $(element).autocomplete('search', ''))
                .on('keydown', event =>  {
                    autocompleteUtils.isKeyAvaliable(event, false, settings.avaliableValuesNotInList, isAfterSelect);
                    isAfterSelect = false;
                })
                .on('blur',  () => {
                    validateAutocompleteValue();
                    mapSelectedValueFunctions[dataType](element, mappedList, settings);
                    $(element).autocomplete(resources.selectors.autocompleteWidget).hide();
                    isAfterSelect = false;
                });
               
                $(element).autocomplete(resources.selectors.autocompleteWidget).on('scroll', () => {
                    fillListHandler.loadNextBatchOnScrollBinding( $(element).autocomplete(resources.selectors.autocompleteWidget));
                });
            };

            const bindElementToAutocomplete = function () {
                $(element).after(UIProvider.resources.autocomplete.arrowTemplate);
                if ($(element).is(':disabled')) {
                    $(element).next(UIProvider.resources.autocomplete.arrow).attr('disabled', true);
                }
                let isFirstSelect = true;
                $(element).autocomplete({
                    minLength: ko.unwrap(settings.filterMinlength) || 0,
                    //autoFocus: true,
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
                        $(element).val(ui.item.value || '');
                        mapSelectedValueFunctions[dataType](element, mappedList, settings);
                        return false;
                    }
                });
                bindArrowElement();
                bindAutocompleteElementEvents();
                if(settings.widgetClass){
                    $(element).autocomplete(resources.selectors.autocompleteWidget).addClass(settings.widgetClass);
                }
                $(element).autocomplete(resources.selectors.autocompleteWidget).off('mouseenter');//fix IOS bug
            };

            const setMapSelectedValueFunction = function(){
                if (settings.mapSelectedValueFunction){
                    mapSelectedValueFunctions[dataType] = settings.mapSelectedValueFunction;
                }
            };
            const requiredParams = {
                mappingObject: settings.mappingObject, value: settings.value, 
                listAccessor: settings.listAccessor
            };
            setMapSelectedValueFunction();
            autocompleteUtils.validateRequiredParams(requiredParams, dataType, mapSelectedValueFunctions);
            settings.value.isAutocomplete = ko.observable(true);// for jsonSchema
            settings.value.description = ko.observable(element.id || settings.value.name);// for jsonSchema
            bindElementToAutocomplete();
            const sourceList = ko.computed (() => {
                return ko.unwrap(settings.listAccessor);
            });
            sourceList.subscribe(() => {
                mappedList = autocompleteUtils.mapList('entityBase', ko.unwrap(sourceList), settings.mappingObject, settings.value);
            });
            mappedList = autocompleteUtils.mapList('entityBase', ko.unwrap(sourceList), settings.mappingObject, settings.value);
        };
        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.tlpAutocomplete"
        * @description custom binding that init field autocomplete field. the list is observableArray parameter call listAccessor. 
        * @param {ko.observable} valueAccessor: settings object.
        *    var autocompleteSettings = {
                listAccessor: ko.observableArray(),
                contains: true,
                limit: 15,
                filterMinlength: 0,
                avaliableValuesNotInList: false,
                mappingObject: { dataCode: 'dataCode', dataText: 'dataText' },
                value: model.selectedValue1
            };
        * @example  Example of usage
        * <div class="row ">
                <div class="col-md-4">
                    <div class="autocomplete-container">
                        <label for="lookupAutocomplete4">autocomplete- הכנסת ערך  מהרשימה בלבד</label>
                        <input id="lookupAutocomplete4" class="autocomplete-field tfsInputText" data-bind="value: selectedValue1.dataText, tlpAutocomplete: autocompleteSettings" />
                    </div>
                </div>
            </div>
        */

        ko.bindingHandlers.tlpAutocomplete = {
            init: function (element, valueAccessor) {
                try {
                    if (formInformation.serverMode()) {
                        return;
                    }
                    var settings = ko.unwrap(valueAccessor());
                    initAutocompleteElement(element, settings);
                }
                catch(ex){
                    formExceptions.throwFormError(ex.message);
                }

            }
        };

    });
