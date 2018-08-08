define(['common/resources/govFormSelectors'
    , 'common/external/uuidv4'
    , 'common/ko/bindingHandlers/tlpDatepicker'
],
    function (govFormSelectors, uuidv4) {

        const generateUniqueID = (element) => {
            const elementID = element.id;
            if (elementID && !($(element).attr('data-id'))) {
                const uniquID = uuidv4();
                const label = $(element).closest('tr').find('label[for=' + elementID + ']');
                $(element).attr('data-id', elementID);
                $(element).attr('id', uniquID);
                label.attr('for', uniquID);

                if ($(element).hasClass('date-field')) {
                    ko.applyBindingsToNode(element, { tlpDatepicker: $(element).data('datepicker-settings') || {} });
                }
            }
        };

        const generateUniqueIDForAllDynamicTableFields = (tableElement) => {
            const containerFields = $(tableElement).children('tr');
            if (containerFields) {
                containerFields.find(govFormSelectors.fields).each((index, element) => {
                    generateUniqueID(element);
                });
            }
        };

        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.govDynamicTable"
        * @description custom binding which generate unique id (using uuid libary - https://github.com/kelektiv/node-uuid version 4)
          to all fields in dynamic table and update the relevant label for.
          keep the original id in data-id attribute.
          add tlpDatepicker custom binding to date input (the settings should be on data-datepicker-settings attribute.
        * @param {ko.observableArray} valueAccessor 
        * @example should be in the input with the foreach binding
          <tbody id="jobsTable" data-bind="foreach: jobs, govDynamicTable: jobs, accessibilityTable: jobs">
        *  } 
        */
        ko.bindingHandlers.govDynamicTable = {
            update: function (element, valueAccessor) {
                valueAccessor()();
                generateUniqueIDForAllDynamicTableFields(element);
            }
        };

    });