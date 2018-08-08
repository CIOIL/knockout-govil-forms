define(['common/utilities/arrayExtensions'], function () {
    const selectorsResources = {
        selectedOption: 'option:selected',
        selectForPrintClass: '.select-input-for-print',
        hideClass: 'hide',
        select: 'select'
    };
    const addInput = function (select, selectedOption) {
        const inputTemplate = `<input class='select-input-for-print' width=${selectedOption.width()} value=${selectedOption.text()} />`;
        $(inputTemplate).insertBefore(select);
        $(select).addClass(selectorsResources.hideClass);
    };

    const existSelectedOption = function (selectedOption) {
        if (selectedOption.length <= 0 || selectedOption.index() < 0) {
            return false;
        }
        return true;
    };

    const replaceSelectsWithInputs = function () {
        const selectCollection = $(selectorsResources.select);
        selectCollection.each((index, select) => {
            const selectedOption = $(select).find(selectorsResources.selectedOption);
            if (existSelectedOption(selectedOption)) {
                addInput(select, selectedOption);
            }
        });
    };

    const rollbackSelect = function () {
        const inputForPrintCollection = $(selectorsResources.selectForPrintClass);
        inputForPrintCollection.each((index, input) => {
            $(input).remove();
        });
        const selectCollection = $(selectorsResources.select);
        selectCollection.each((index, select) => {
            $(select).removeClass(selectorsResources.hideClass);
        });
    };
    return {
        replaceSelectsWithInputs,
        rollbackSelect
    };
});