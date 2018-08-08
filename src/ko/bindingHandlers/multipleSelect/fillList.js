define(['common/utilities/multipleSelect'],
function (multipleSelectUtils) {
    const initFillListBehavior = function (element, limit, contains, isMultipleSelect) {//eslint-disable-line max-params

        let filterList;
        let setItemsInUlElement;
        let viewRowsCounter;
        let scrollByCode;
        let lastSearchString = '';

        const onlyStartWithTermFilter = function (array, term) {
            const matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex(term), 'i');
            return $.grep(array, value => {
                return matcher.test(value.label || value.value || value);
            }); 
        };
        const filterFunction = !contains ? onlyStartWithTermFilter : $.ui.autocomplete.filter;

        const initViewRowsCounter = function () {
            viewRowsCounter = limit + 1;
        };

        const getSearchString = function (term) {
            var currentCursorIndex = $(element)[0].selectionStart;
            if (multipleSelectUtils.isInsertInMiddleOfInput(term.length, currentCursorIndex)) {
                var currentWordIndex = multipleSelectUtils.getCurrentWordIndex(term, currentCursorIndex);
                var selectedValuesArray = multipleSelectUtils.split(term);
                return selectedValuesArray[currentWordIndex];
            }
            return multipleSelectUtils.extractLast(term);
        };

        const getCurrentList = function (entityBaseList) {
            return entityBaseList.filter(obj => obj.visibleState)
                                 .map(obj => {
                                     return {
                                         label: obj.dataText, value: obj.dataText
                                     };
                                 });
        };

        const loadListByFilter = function (request, response, entityBaseList) {
            if (!entityBaseList) {
                return false;
            }
            initViewRowsCounter();
            setItemsInUlElement = response;
            lastSearchString = isMultipleSelect ? getSearchString(request.term) : request.term;
            var list = getCurrentList(entityBaseList);
            filterList = filterFunction(list, lastSearchString);
            setItemsInUlElement(filterList.slice(0, viewRowsCounter));
            return filterList.length > 0;
        };

        const isScrollInEnd = function (elem) {
            return elem[0].scrollHeight - elem.scrollTop() === elem.outerHeight() - 2;
        };

        const existHiddenItems = function () {
            return filterList.length >= viewRowsCounter;
        };

        const loadNextBatchItems = function (elem) {
            var currentScrollTop = elem.scrollTop();
            setItemsInUlElement(filterList.slice(0, viewRowsCounter));
            elem.scrollTop(currentScrollTop);
        };

        const loadNextBatchOnScrollBinding = function (elem) {
            if (scrollByCode || !(isScrollInEnd($(elem)) && existHiddenItems())) {
                scrollByCode = false;
                return;
            }
            viewRowsCounter += limit;
            loadNextBatchItems($(elem));
            scrollByCode = true;
        };
        return {
            loadNextBatchOnScrollBinding,
            loadListByFilter,
            lastSearchString
        };
    };
    return {
        initFillListBehavior
    };
});