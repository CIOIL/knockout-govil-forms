define(['common/utilities/multipleSelect'],
    function (multipleSelectUtils) {
        const initSelectItemBehavior = function (element, avaliableValuesNotInList) {
            let selectedValuesArray = [];

            const getItem = function (term) {
                const currentCursorIndex = $(element)[0].selectionStart;
                const currentWordIndex = multipleSelectUtils.getCurrentWordIndex(term, currentCursorIndex);
                const selectedValuesArray = multipleSelectUtils.split(term);
                return selectedValuesArray[currentWordIndex - 1];

            };
            const removeTermString = function (selectedValuesArrayCopy, isRemoveEvent, entityBaseList) {
                if (!isRemoveEvent && avaliableValuesNotInList && multipleSelectUtils.isInsertInMiddleOfInput($(element).val().length, $(element)[0].selectionStart)) {
                    const currentCursorIndex = $(element)[0].selectionStart;
                    var index = multipleSelectUtils.getCurrentWordIndex($(element).val(), currentCursorIndex);
                    if (entityBaseList.find(entityBaseRecord => entityBaseRecord.dataText === selectedValuesArrayCopy[index + 1])) {
                        return;
                    }
                    selectedValuesArrayCopy.splice(index + 1, 1);
                }
            };

            const setUpdatedValuesInField = function (valuesArray, isRemoveEvent, entityBaseList) {
                let selectedValuesArrayCopy = [...valuesArray];
                removeTermString(selectedValuesArrayCopy, isRemoveEvent, entityBaseList);
                selectedValuesArrayCopy.push('');
                const newValue = selectedValuesArrayCopy.join(', ').replace(/(,+\s*)+/g, ', ');
                $(element).val(newValue);
            };

            const toggleSelectedValueState = function (value, newState, entityBaseList) {
                entityBaseList.filter(entityBaseRecord => entityBaseRecord.dataText === value)
                              .forEach(entityBaseRecord => { entityBaseRecord.visibleState = newState; });
            };

            const insertUpdatedSelectedValuesToField = function (item, entityBaseList) {
                selectedValuesArray.splice(0, 0, item);
                setUpdatedValuesInField(selectedValuesArray, false, entityBaseList);
            };

            const selectvalueFromList = function (item, entityBaseList) {
                const fieldValue = $(element).val();
                if (item === '' && fieldValue !== '') {// item is empty when user insert value that is not in list (function call when insert comma )
                    item = getItem(fieldValue);
                }
                toggleSelectedValueState(item, false, entityBaseList);
                insertUpdatedSelectedValuesToField(item, entityBaseList);
            };

            const insertUnselectedValuesBackToList = function (entityBaseList) {
                const values = multipleSelectUtils.split($(element).val());
                var unselecteValues = selectedValuesArray.filter(value => values.indexOf(value) < 0);
                unselecteValues.forEach(unselecteValue => toggleSelectedValueState(unselecteValue, true, entityBaseList));
            };

            const getValidSelectedValues = function (values, avaliableValuesNotInList) {
                if (avaliableValuesNotInList) {
                    values.pop();
                    return values;
                }
                const notFound = -1;
                let validSelectedValuesArray = values.filter(value => selectedValuesArray.indexOf(value) !== notFound);
                return validSelectedValuesArray;
            };

            const removeUnvalidValues = function (isBlurEvent, entityBaseList, avaliableValuesNotInList) {
                insertUnselectedValuesBackToList(entityBaseList);
                const values = multipleSelectUtils.split($(element).val());
                const validSelectedValuesArray = getValidSelectedValues(values, avaliableValuesNotInList);
                if (isBlurEvent && $(element).val() !== '') {
                    setUpdatedValuesInField(validSelectedValuesArray, true);
                }
                selectedValuesArray = validSelectedValuesArray;
            };


            return {
                selectvalueFromList,
                removeUnvalidValues
            };
        };
        return {
            initSelectItemBehavior
        };
    });