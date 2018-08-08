define(['common/viewModels/languageViewModel', 'common/ko/bindingHandlers/tlpDatepicker'],
    function () {

        const resources = {
            dataBindAttr: 'data-bind',
            hideClass: 'hide',
            datepickerWrapperBinding: 'tlpDatepickerWrapper',
            dateFieldClass: 'date-field'
        };

        const getUniqe = function () {
            const number2 = 1000000;
            const k = Math.floor(Math.random() * number2);
            return k;
        };

        const hideOriginalField = function (element) {
            $(element).addClass(resources.hideClass);
            $(element).addClass(resources.dateFieldClass);
            $(element).parent().find(`#vmsg_${element.id}`).addClass(resources.hideClass);
        };

        const bindNewField = function (inputID, settings, allBindings) {
            const newInput = $(`#${inputID}`)[0];
            const allBindingsObject = allBindings();
            delete allBindingsObject[resources.datepickerWrapperBinding];
            ko.applyBindingsToNode(newInput, { tlpDatepicker: settings });
            ko.applyBindingsToNode(newInput, allBindingsObject);
        };

        const addDatepickerInput = function (element, settings, allBindings) {
            const guidId = getUniqe();
            const newInputId = `${element.id}_${guidId}`;
            const inputTemplate = `<input id='${newInputId}' ignoreBySchema class='${element.className} text-field ${resources.dateFieldClass}'>`;
            $(inputTemplate).insertBefore(element);
            hideOriginalField(element);
            bindNewField(newInputId, settings, allBindings);
        };

        ko.bindingHandlers.tlpDatepickerWrapper = {
            init: function (element, valueAccessor, allBindings) {
                const settings = ko.utils.unwrapObservable(valueAccessor());
                addDatepickerInput(element, settings, allBindings);
            }
        };

    });