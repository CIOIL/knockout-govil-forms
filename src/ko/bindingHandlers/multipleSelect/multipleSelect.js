define(['common/ko/bindingHandlers/tlpBindList',
        'common/core/exceptions',
        'common/ko/bindingHandlers/multipleSelect/fillList',
        'common/ko/bindingHandlers/multipleSelect/selectItem',
        'common/utilities/multipleSelect',
        'common/components/formInformation/formInformationViewModel'
],
    function (tlpBindList, formExceptions, fillList, selectItem, multipleSelectUtils, formInformation) {//eslint-disable-line max-params

        const initMultipleSelectElement = function (element, settings = {bindListSettings:{}}) {
            let entityBaseList;
            let customCallback;
            let isFirstSelect = true;

            const bindListSettings = Object.assign({},settings.bindListSettings);
            const limit = settings.limit || 10;
            const fillListObject = fillList.initFillListBehavior(element, limit, settings.contains, true);
            const selectItemObject = selectItem.initSelectItemBehavior(element);

            const setMenueHeightByLimit = function (isListFilled) {
                if (!(isFirstSelect && isListFilled)) {
                    return;
                }
                var elementHeight = $(element).autocomplete('widget').find('.ui-menu-item:first').outerHeight();
                $(element).autocomplete('widget').outerHeight(elementHeight * limit);
                isFirstSelect = false;
            };

            const updateValueAccessorAfterAutocomplete = function () {
                $(element).data('ui-autocomplete')._trigger('change');
            };

            const viewSelectedValuesSpan = function () {
                if (settings.viewSelectedValuesSpan) {
                    var spanGridClass = settings.spanGridClass || 'col-md-8';
                    var selectedValuesSpanTemplate = `<div class=${spanGridClass}><span class="selected-values-span"></span></div>`;
                    $(element).closest('.multiple-selecte-container').after(selectedValuesSpanTemplate);
                    var selectedValuesSpan = $(element).closest('.row').find('.selected-values-span');
                    if (!selectedValuesSpan[0]) {
                        formExceptions.throwFormError('input with tlpMultipleSelect binding should have parent div with multiple-selecte-container class, and parent with row class');
                        return;
                    }
                    ko.applyBindingsToNode(selectedValuesSpan[0], { text: settings.valueAccessor });
                }
            };

            const bindArrowElement = function () {
                var arrowTemplate = '<button title="בחר מרשימה" class="lookup-arrow lookup-arrow-override" type="button" tfsshowdropdownbtn="false"><i class="ic-lookup-arrow"></i></button>';
                $(element).after(arrowTemplate);
                var arrowElement = $(element).parent().find('.lookup-arrow');
                $(arrowElement).click(function () {
                    $(element).autocomplete('search', fillListObject.lastSearchString, true);
                });
            };

            const bindElementToAutocomplete = function () {
                viewSelectedValuesSpan();
                bindArrowElement();
                $(element)
                .on('focus', function () {
                    $(element).autocomplete('search', '');
                })
                .blur(function () {
                    selectItemObject.removeUnvalidValues(true, entityBaseList, settings.avaliableValuesNotInList);
                }).on('keydown', function (event) {//eslint-disable-line consistent-return
                    if (event.keyCode === $.ui.keyCode.TAB && multipleSelectUtils.isAutocompleteMenueOpen(element)) {
                        event.preventDefault();
                    }
                    if (event.key === ',' && !settings.avaliableValuesNotInList) {
                        return false;
                    }
                }).on('keyup', function (event) {
                    if (multipleSelectUtils.isDeleteKeys(event.keyCode)) {
                        selectItemObject.removeUnvalidValues(false, entityBaseList, settings.avaliableValuesNotInList);
                    }
                    if (event.key === ',' && settings.avaliableValuesNotInList) {
                        selectItemObject.selectvalueFromList('', entityBaseList);
                        multipleSelectUtils.removeUnnessacryrItemsFromHTML(element);
                        return false;
                    }
                    updateValueAccessorAfterAutocomplete();
                    return true;
                }).autocomplete({
                    minLength: settings.filterMinlength || 0,
                    autoFocus: true,
                    source: function (request, response, isArrowSearch) {
                        var isListFilled = fillListObject.loadListByFilter(request, response, entityBaseList, isArrowSearch);
                        setMenueHeightByLimit(isListFilled);
                    },
                    focus: function () {
                        // prevent value inserted on focus
                        return false;
                    },
                    change: function () {
                        settings.valueAccessor($(element).val());
                    },
                    select: function (event, ui) {
                        multipleSelectUtils.removeUnnessacryrItemsFromHTML(element);
                        selectItemObject.removeUnvalidValues(false, entityBaseList, settings.avaliableValuesNotInList);
                        selectItemObject.selectvalueFromList(ui.item.value, entityBaseList);
                        updateValueAccessorAfterAutocomplete();
                        setTimeout(function () {
                            $(element).autocomplete('search', '');
                        }, 1);
                        return false;
                    }
                });
                fillListObject.loadNextBatchOnScrollBinding();
            };

            const setSelectedValuesAfterImport = function () {
                var selectedValues = multipleSelectUtils.split(settings.valueAccessor());
                for (var i = 0; i < selectedValues.length; i++) {
                    selectItemObject.selectvalueFromList(selectedValues[i], entityBaseList);
                }
            };

            const defaultCallback = function (deffer) {
                if (customCallback && typeof(customCallback) === 'function') {
                    customCallback();
                }
                deffer.then(function () {
                    entityBaseList = bindListSettings.listAccessor().map(function (obj) {
                        return {
                            dataCode: obj[settings.mappingRules.dataCode],
                            dataText: obj[settings.mappingRules.dataText],
                            visibleState: true
                        };
                    });
                    var existImportedValues = settings.valueAccessor();
                    if (existImportedValues) {
                        setSelectedValuesAfterImport();
                    }
                    bindElementToAutocomplete();
                });
                
            };

            const bindList = function () {
                customCallback = bindListSettings.callback;
                bindListSettings.callback = defaultCallback;
                ko.applyBindingsToNode(element, { tlpBindList: bindListSettings     });
            };

            const requiredParams = {
                bindListSettings: bindListSettings, mappingRules: settings.mappingRules, valueAccessor: settings.valueAccessor
            };
            var isExistParameter = function (parameterKey, parameterValue) {
                return parameterKey && parameterValue;
            };
            var handleRequiredParams = function (requiredParams) {
                for (var parameter in requiredParams) {
                    if (requiredParams.hasOwnProperty(parameter)) {
                        if (!isExistParameter(parameter, requiredParams[parameter])) {
                            formExceptions.throwFormError('missing required parameter ' + parameter);
                        }
                    }
                }
            };
            handleRequiredParams(requiredParams);

            bindList();
        };
        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.tlpMultipleSelect"
        * @description custom binding that init field as multipleSelect field. fill the values list by use tlpBindList. 
        * @param {ko.observable} valueAccessor: settings object.
        * var multipleSelectSettings = {
            bindListSettings: {
                settings:{
                    url: 'GetComboValuesWS.asmx/getXMLDocForCombo?tableName=City&addEmptyValue=false',
                    environmentName: 'production'
                },
                xmlNodeName: 'City',
                listAccessor: selectList,
                value: loadList,
                functionName: 'getListByWebServiceList'
            },// settings for tlpBindList
            contains: true, // if avaliable contains filter
            limit: 15, // how many records view in window in every scroll
            filterMinlength: 0, // The minimum number of characters a user has to type before the Autocomplete activates.
            avaliableValuesNotInList: true, //avaliable insert value that not exist in the original list
            mappingRules: { dataCode: 'dataCode', dataText: 'dataText' }, // setiings for map list 
            valueAccessor: selectedValue, // the observable that save the input data
            viewSelectedValuesSpan: true // if view span the view copy of yhe input value
        };
        * @example  Example of usage
        *<div class="row ">
            <div class="col-md-4 multiple-selecte-container" >
                <div>
                    <label>בחירה מרובה- הכנסת ערכים לא מהרשימה</label>
                    <input id="multipleSelect" class="autocomplete-field tfsInputText" tfsdata data-bind="value: selectedValue, tlpMultipleSelect: multipleSelectSettings" />
                </div>
            </div>
        </div>
        */
        ko.bindingHandlers.tlpMultipleSelect = {
            init: function (element, valueAccessor) {
                try {
                    if (formInformation.serverMode()) {
                        return;
                    }
                    var settings = ko.unwrap(valueAccessor());
                    initMultipleSelectElement(element, settings);
                }
                catch(ex){
                    formExceptions.throwFormError(ex);
                }

            }
        };

    });
