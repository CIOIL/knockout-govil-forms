define(function () {

    var objectArrayMap = function (array, optipnText, optionsValue) {

        return array.map(function (item) {
            return { id: ko.unwrap(item[ko.unwrap(optionsValue)]), value: ko.unwrap(item[ko.unwrap(optipnText)]) };
        });

    };

    var primitiveArrayMap = function (array) {
        return array.map(function (item) {
            return { id: ko.unwrap(item), value: ko.unwrap(item) };
        });
    };

    /**     
  * @memberof ko         
  * @function "ko.bindingHandlers.lookupOptions"
  * @description custom binding which enhances the knockout options by binding observableArray object. 
    updates the list of the lookUp Options also after manipulating the observableArray. 
  * @param {ko.observableArray} valueAccessor 
  * @param {ko.observable} [allBindings.optionsText] 
  * @param {ko.observable} [allBindings.optionsValue] 
  * @example
  * tlpLookUp: { value: viewModel.areaCode, // type of entityBase
  * bindOnSelect: { lookupOptions: allAreaCodes, optionsText: 'AreaCode', optionsValue: 'id' }
  *  } 
  */
    ko.bindingHandlers.lookupOptions = {
        update: function (element, valueAccessor, allBindings) { //eslint-disable-line complexity
            var array = ko.unwrap(valueAccessor()) || [];
            var optionsArray;
            var optipnText;
            var optionsValue;

            if (array.length < 0) {
                return;
            }

            if (typeof (array[0]) === 'object') {
                optipnText = allBindings.get('optionsText') || 'dataText';
                optionsValue = allBindings.get('optionsValue') || 'dataCode';
                optionsArray = objectArrayMap(array, optipnText, optionsValue);
            }
            else {
                optionsArray = primitiveArrayMap(array);
            }

            $(element).data('options', optionsArray);
        }

    };
});