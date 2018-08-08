define(function () {

    /**     
   * @memberof ko         
   * @function "ko.bindingHandlers.tlpBind"
   * @description custom bindings for wrapping infrustructure attribute tfsBind.
   * @example 
   * 'select tfsdatatype="LookUpWindow" id="Street" data-bind="tlpBind:bind"'
   *  } 
   */
    ko.bindingHandlers.tlpBind = {
        init: function (element, valueAccessor) {
            var underlyingObservable = valueAccessor();
            ko.applyBindingsToNode(element, { attr: { tfsBind: underlyingObservable } });
        }
    };

});