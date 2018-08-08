define(['common/core/exceptions',
        'common/entities/entityBase',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension' ],
    function (formExceptions, entityBase, commonExptionMessages, stringExtension) {//eslint-disable-line max-params
        var enterCode = 32, backspaceCode = 8, deleteCode = 46;

        var split = function (val) {
            return val.split(/,\s*/);
        };
        var extractLast = function (term) {
            return split(term).pop();
        };
        var isInsertInMiddleOfInput = function (selectedValuesStrLength, currentCursorIndex) {
            return currentCursorIndex !== selectedValuesStrLength;
        };

        var getCurrentWordIndex = function (term, currentCursorIndex) {
            var stringUntilCursorIndex = term.substring(0, currentCursorIndex);
            var wordsUntilCursorIndexArray = split(stringUntilCursorIndex);
            return wordsUntilCursorIndexArray.length - 1;
        };

        var removeUnnessacryrItemsFromHTML = function (element) {
            $(element).autocomplete('widget').find('.ui-menu-item').remove();
        };

        var isDeleteKeys = function (keyCode) {
            return keyCode === enterCode || keyCode === backspaceCode || keyCode === deleteCode;
        };

        var isAutocompleteMenueOpen = function (element) {
            return $($(element).autocomplete('widget')).is(':visible');
        };

        var isExistParameter = function (parameterKey, parameterValue) {
            return parameterKey && parameterValue;
        };

        var validateValueType = function validateValueType(value, dataType) {
            if (dataType === 'entityBase' && !(value instanceof entityBase.ObservableEntityBase) && !(value instanceof entityBase.ExtendableEntityBase)) {
                formExceptions.throwFormError(stringExtension.format(commonExptionMessages.invalidElementTypeParam, 'value', 'entityBase.ObservableEntityBase'));
            }
        };
        var validateRequiredParams = function (requiredParams, dataType, mapValueAccessorFunctions) {//eslint-disable-line complexity
            validateValueType(requiredParams.value, dataType);
            if (!mapValueAccessorFunctions[dataType]) {
                formExceptions.throwFormError('you should define callback functoin in mapValueAccessorFunctions object for this dataType, or pass it in settings object as mapValueAccessorFunction');
            }
            for (var parameter in requiredParams) {
                if (requiredParams.hasOwnProperty(parameter)) {
                    if (!isExistParameter(parameter, requiredParams[parameter])) {
                        formExceptions.throwFormError('missing required parameter ' + parameter);
                    }
                }
            }
        };

        const openOptionsWindow = function (element) {
            setTimeout(function () {
                $(element).autocomplete('search', '');
            }, 1);
        };

        const isKeyAvaliable = function (event, isMultipleSelect, avaliableValuesNotInList, isAfterSelect) {//eslint-disable-line max-params
            if (event.keyCode === $.ui.keyCode.TAB && isAfterSelect) {
                event.preventDefault();
            }
            if (isMultipleSelect && event.key === ',' && !avaliableValuesNotInList) {
                return false;
            }
            return true;
        };

        const needInsertNotInListValue = function (event, avaliableValuesNotInList) {
            return event.key === ',' && avaliableValuesNotInList;
        };
      
        const isExistValueAsEntityBase = function (selectedValue) {
            return !!ko.unwrap(selectedValue.dataText);
        };

        const mapListToEnityBase = function (list, mappingObject, selectedValue) {
            let mappedList = list.map(obj => {
                const dataCode = obj[mappingObject.dataCode];
                const dataText = obj[mappingObject.dataText];
                if ((!dataCode && dataCode !== '' )  || !dataText) {
                    formExceptions.throwFormError('exist recoeds in the list that not include the required code or text columns');
                }
                return {
                    dataCode,
                    dataText,
                    visibleState: true
                };
            });
            return mappedList.length === 0 && isExistValueAsEntityBase(selectedValue) ? [selectedValue] : mappedList;
        };

        const mapListFunctions = { entityBase: mapListToEnityBase };

        const mapList = function (dataType, list, mappingObject, selectedValue) {//eslint-disable-line max-params
            return mapListFunctions[dataType](list, mappingObject, selectedValue);
        };

        const getSelectedRecordByText = function (selectedValue, mappedList, settings) {//eslint-disable-line complexity
            if (selectedValue === '') {
                return { dataText: '', dataCode: settings.emptyValueDataCode || '-1' };
            }
            let selectedRecord = mappedList.filter(entityBase => ko.unwrap(entityBase.dataText) === selectedValue);
            if (selectedRecord[0]) {
                return selectedRecord[0];
            }
            if (!settings.avaliableValuesNotInList) {
                return false;
            }
            return { dataText: selectedValue, dataCode: settings.notInListDataCode || '-11' };
        };

        const updateValueAsEntityBase = function (element, mappedList, settings) {
            const selectedRecord = getSelectedRecordByText($(element).val(), mappedList, settings);
            if (!selectedRecord) {
                return;
            }
            settings.value.dataCode(selectedRecord.dataCode);
            settings.value.dataText(selectedRecord.dataText);
        };

        return {
            split: split,
            extractLast: extractLast,
            isInsertInMiddleOfInput: isInsertInMiddleOfInput,
            getCurrentWordIndex: getCurrentWordIndex,
            isDeleteKeys: isDeleteKeys,
            removeUnnessacryrItemsFromHTML: removeUnnessacryrItemsFromHTML,
            isAutocompleteMenueOpen: isAutocompleteMenueOpen,
            validateRequiredParams: validateRequiredParams,
            openOptionsWindow: openOptionsWindow,
            isKeyAvaliable: isKeyAvaliable,
            mapList: mapList,
            needInsertNotInListValue: needInsertNotInListValue,
            updateValueAsEntityBase: updateValueAsEntityBase
        };
    });