define(['common/ko/bindingHandlers/tlpDatepicker', 'common/ko/bindingHandlers/tlpDatepickerWrapper'], function () {
    
    const selectorsResources = {
        agatCalander: '.tfsCalendar',
        dataTypeAttr: 'tfsdatatype',
        inputDates: 'input[tfsdatatype=\'date\']',
        dataBindAttr: 'data-bind'
    };
    const isInDynamicTable = function (element) {
        return element.hasAttribute('tfsrowdata') || $(element).parents('.dtable').length > 0;
    };
    const convertAgatDateFieldsToTlpDatepicker = function () {
        $(selectorsResources.agatCalander).remove();
        $(selectorsResources.inputDates).each((index, agatDateField) => {
            $(agatDateField).removeAttr(selectorsResources.dataTypeAttr);
            const currentBindings = $(agatDateField).attr(selectorsResources.dataBindAttr) || '';
            const datepickerBindingName = isInDynamicTable(agatDateField) ? 'tlpDatepickerWrapper' : 'tlpDatepicker';        
            $(agatDateField).attr(selectorsResources.dataBindAttr, `${currentBindings}, ${datepickerBindingName}: {}`);
            //ko.applyBindingsToNode(agatDateField, { tlpDatepicker: settings});
        });
    };
    return {
        convertAgatDateFieldsToTlpDatepicker
    };
});