
define(function () {

    /**     
    * @memberof ko         
    * @function "ko.bindingHandlers.tlpInitialValue"
    * @description custom bindings for setting value from tha DOM element to the model.
    * @example 
    * '<input type="text" id="valMessage" data-bind="tlpInitialValue: myViewModel.generalModel"/>'
    *   when first initializing the model myViewModel.generalModel will be set with the value of $("#valMessage").val('aaa') 
    */
    ko.bindingHandlers.tlpInitialValue = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {//eslint-disable-line max-params
            var obvsarble = valueAccessor();
            obvsarble($(element).val());
            ko.bindingHandlers.value.init(element, valueAccessor, allBindings, viewModel, bindingContext);
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {//eslint-disable-line max-params
            ko.bindingHandlers.value.update(element, valueAccessor, allBindings, viewModel, bindingContext);

        }
    };

      /**     
    * @memberof ko         
    * @function "ko.bindingHandlers.tlpInitialText"
    * @description custom bindings for setting text from tha DOM element to the model.
    * @example 
    * '<input type="text" id="valMessage" data-bind="tlpInitialText: myViewModel.generalModel"/>'
    *   when first initializing the model myViewModel.generalModel will be set with the value of $("#valMessage").text('aaa') 
    */
    ko.bindingHandlers.tlpInitialText = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {//eslint-disable-line max-params
            var obvsarble = valueAccessor();
            obvsarble($(element).text());
            ko.bindingHandlers.text.init(element, valueAccessor, allBindings, viewModel, bindingContext);
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {//eslint-disable-line max-params
            ko.bindingHandlers.text.update(element, valueAccessor, allBindings, viewModel, bindingContext);

        }
    };
});
