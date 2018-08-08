/** custom bindings for select element.

 tlpSelect valueAccessor must contain selectedObject and options. 
 selectedObject valueAccessor must contain dataCode and dataText.
    responsible for:
    <ul>    
        <li> fill bind options when source list is empty </li>
        <li> update object of selected option respectively </li>
    </ul>
     
    @module tlpSelect 
    @example 
    *    tlpSelect: 
    *       { 
    *         selectedObject: licenseType, 
    *         options: licenseTypeList
    *       }
    * 
    */
define(['common/ko/utils/tlpReset',
        'common/ko/globals/multiLanguageObservable'
],
function () {

    var texts = {
        english: {
            optionCaption: 'Choose'
        },
        hebrew: {
            optionCaption: 'בחר'
        },
        arabic: {
            optionCaption: 'اختر'
        }
    };

    function setOptionCaption(optionCaption) {
        var defaultCaption = ko.multiLanguageObservable({ resource: texts });
        var optionsCaption = ko.computed(function () {
            return optionCaption || defaultCaption().optionCaption;
        });
        return optionsCaption;
    }

    ko.bindingHandlers.tlpSelect = {
        init: function (element, valueAccessor) { //eslint-disable-line complexity
            var optionsWrapper = ko.computed(function () {
                var options = ko.unwrap(valueAccessor().options);
                if (options.length > 0) {
                    return options;
                }
                else {
                    var selectedObject = valueAccessor().selectedObject;
                    return [selectedObject];
                }
            });                      

            valueAccessor().selectedObject.isTlpSelect = ko.observable(true);// for jsonSchema
            valueAccessor().selectedObject.description = ko.observable(element.id || valueAccessor().selectedObject.name);// for jsonSchema

            var newValueAccessor = valueAccessor();
            newValueAccessor.options = optionsWrapper;
            newValueAccessor.value = valueAccessor().selectedObject.dataCode;
            newValueAccessor.optionsValue = valueAccessor().optionsValue || 'dataCode';
            newValueAccessor.optionsText = valueAccessor().optionsText || 'dataText';
            if (!valueAccessor().noOptionsCaption) {
                newValueAccessor.optionsCaption = setOptionCaption(valueAccessor().optionsCaption);
            }
            ko.applyBindingsToNode(element, newValueAccessor);
        }
    };

    ko.bindingHandlers.selectedObject = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) { //eslint-disable-line max-params ,  no-unused-vars
            var optionsValue = allBindings().optionsValue;
            var selectedCode = ko.unwrap(valueAccessor()[optionsValue]);
            var options = ko.unwrap(allBindings().options);
            if (options.length > 0) {
                var selectedItem = ko.utils.arrayFirst(options, function (item) {
                    return ko.unwrap(item[optionsValue]) === selectedCode;
                });
                if (selectedItem) {
                    var object = valueAccessor();
                    ko.mapping.fromJS(selectedItem, {}, object);
                }
                else {
                    ko.utils.tlpReset.resetModel(valueAccessor());
                }
            }
        }
    };

});
