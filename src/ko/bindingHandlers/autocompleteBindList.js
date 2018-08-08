define(['common/dataServices/listProvider',
    'common/utilities/resourceFetcher',
    'common/core/exceptions',
    'common/components/dialog/dialog',
    'common/resources/texts/indicators',
    'common/ko/bindingHandlers/tlpAutocomplete',
    'common/ko/bindingHandlers/loader/loader'
],
    function (listProvider, resourceFetcher, formExceptions, dialog, indicatorsTexts) {//eslint-disable-line max-params

        const selectResources = {
            english: 'Select',
            hebrew: 'בחר',
            arabic: 'اختر'
        };

        const errorCode = -1;

        const autocomlpeteDefaultSettings = {
            mappingObject: { dataCode: 'dataCode', dataText: 'dataText' }
        };
        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.autocompleteBindList"
        * @description custom bindings which load entityBase list and fill autocomplete. 
        * get valueAccessor as object of settings for tlpAutocomplete customBinding and for the function getEntityBase in listProvider.
        * @param {object}  settings
        * @example 
        * loadListSettings = {
            autocompleteParams: {
                listAccessor: listAccessor,
                contains: true,
                limit: 5,
                filterMinlength: 0,
                avaliableValuesNotInList: true,
                value: model.selectedValue4
            },
            listParams: {
                filters: [{ dataCodeColumn: 'city_name_en', filterValue}],
                listName: 'City',
                dataTextColumn: 'city_name_he',
                dataCodeColumn: 'city_code'
            }
        }
        *<div class="col-md-4">
                <div>
                    <label for="autocomplete">autocompleteBindList- הכנסת ערך  מהרשימה בלבד</label>
                    <input id="autocomplete" class="autocomplete-field tfsInputText" tfsdata data-schemaType="autocomplete" data-bind="value: selectedValue1.dataText, autocompleteBindList: autocompleteSettings" />
                </div>
            </div>
        */

        ko.bindingHandlers.autocompleteBindList = {
            init: function (element, valueAccessor) {
                const settings = ko.utils.unwrapObservable(valueAccessor());
                if (!settings.autocompleteParams) {
                    throw formExceptions.throwFormError(`missing required param autocompleteParams in autocompleteBindList binding. element is: ${element.id}`);
                }
                if (!settings.listParams) {
                    throw formExceptions.throwFormError(`missing required param listParams in autocompleteBindList binding. element is: ${element.id}`);
                }
                $(element).attr('placeholder', ko.unwrap(settings.placeholderText) || resourceFetcher.get(selectResources));
                const autocompleteParams = Object.assign({}, autocomlpeteDefaultSettings, settings.autocompleteParams);
                ko.applyBindingsToNode(element, { tlpAutocomplete: autocompleteParams });
            },
            update: function (element, valueAccessor) {
                const settings = ko.unwrap(valueAccessor());
                const listParams = ko.toJS(settings.listParams);
                const filters = listParams.filters || [];
                const existFilterVal = filters.some(x => x.value);
                if (settings.listParams.condition && !listParams.condition) {
                    return;
                }
                if (filters.length > 0 && !existFilterVal) {
                    settings.autocompleteParams.listAccessor([]);
                    return;
                }
                ko.bindingHandlers.visibleLoader.update(element, true);
                const request = listProvider.getEntityBase(listParams);
                request.then((response) => {
                    if (response.ResponseCode === errorCode) {
                        throw response;
                    }
                    if (settings.listParams.otherOption) {
                        response.Data.List.push(settings.listParams.otherOption);
                    }
                    settings.autocompleteParams.listAccessor(response.Data.List);
                }).fail(() => {
                    dialog.alert({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });
                }).finally(() => {
                    ko.bindingHandlers.visibleLoader.update(element, false);
                });
            }
        };
    });