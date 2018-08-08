define(['common/external/uuidv4'
],
    function (uuidv4) {

        /**     
        * @function generateUniqueID
        * @description generate unique id to elemennt, update the relevant label for and
          keep the original id in data-id attribute.
        * @param {object} element - element to generate unique id for
        * @param {object} parentElement - parentElement of elemnt to find the relevant label
        * @example should b
        */
        const generateUniqueID = (element, parentElement) => {
            const elementID = element ? element.id : undefined;
            if (elementID && !($(element).attr('data-id'))) {
                const uniquID = uuidv4();
                const label = $(parentElement).find('label[for=' + elementID + ']')[0] || $(parentElement).find('label[data-for=' + elementID + ']')[0];
                $(element).attr('data-id', elementID);
                $(element).attr('id', uniquID);
                $(label).attr('for', uniquID);
            }
        };

        const generateUniqueIDForAllDynamicFields = (tableElement) => {
            tableElement.forEach((elem) => {
                $(elem).find('[id]').each((index, e) => {
                    generateUniqueID(e, elem);
                });
            });
        };

        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.foreachUniqueID"
        * @description wrap ko binding foreach and afterRender generateUniqueIDForAllDynamicFields
        * generate unique id (using uuid libary - https://github.com/kelektiv/node-uuid version 4)
          to all fields in dynamic table and update the relevant label for.
          keep the original id in data-id attribute.
        * @param {ko.observableArray} valueAccessor 
        * @example should be instead of foreach binding
          <tbody id="jobsTable" data-bind="foreachUniqueID: jobs">
        */
        ko.bindingHandlers.foreachUniqueID = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {//eslint-disable-line max-params
                var array = valueAccessor();
                ko.applyBindingsToNode(element, { foreach: { data: array, afterRender: generateUniqueIDForAllDynamicFields } }, context);

                return { controlsDescendantBindings: true };
            }
        };

        return { generateUniqueID };

    });