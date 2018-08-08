/** module that adds utility functions for array.
@module array */
/**
    *get filter list of array by search text.
    * @method filter  
    * @param {object} settings Object containing the values:
         searchedText- Without distinguishing between capital letters and lowercase letters, 
         sourceList- array, 
         columns- array
    * @returns {array}  - return filter list
    * @example 
    * const fullName = (row) => row.firstName + ' ' + row.lastName,
      const model ={
        contactsList: ko.observableArray(),
        searchedText: ko.observable()
      },
      const settings = {
          sourceList: model.contactsList,
          columns: ['id', 'firstName', 'lastName',fullName],
          searchedText: model.searchedText
      };
      const filterList =  array.filter(settings) 
*/

define(function () {
    const extractValue = (row, column) => {
        let value = '';
        if (typeof column === 'string') {
            value = row[column];
        }
        if (typeof column === 'function') {
            value = column(row);
        }

        return ko.unwrap(value).toString().toLowerCase();
    };
    const filter = function (settings) {
        if (typeof (settings) === 'object') {
            let searchedText = ko.unwrap(settings.searchedText);
            const sourceList = ko.unwrap(settings.sourceList) || [];
            if (typeof (searchedText) === 'string' && searchedText !== '') {
                searchedText = searchedText.toLowerCase();
                const notFound = -1;

                const filteredList = sourceList.filter((row) => {
                    const isFound = settings.columns.find((column) => {
                        const sourceValue = extractValue(row, column);
                        return sourceValue.indexOf(searchedText) > notFound;
                    });
                    return isFound !== undefined;
                });
                return filteredList;
            }
            return settings.sourceList;
        }
        return [];
    };
    return {
        filter: filter
    };
});