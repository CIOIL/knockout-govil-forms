/** 
  @description module that provide the city list Only one instance for a form 
  @module cityProvider
 */
define(() => {
    const cityList = ko.observableArray();
    const isLoadList = ko.observable(true);

    const loadListCallback = () => {
        isLoadList(false);
    };

    const bindCityListSettings = {
        settings: {
            url: 'GetComboValuesWS.asmx/getXMLDocForCombo?tableName=City&addEmptyValue=false',
            environmentName: 'production',
            method: 'POST',
            dataType: 'XML'
        },
        functionName: 'getListByWebServiceList',
        listAccessor: cityList,
        xmlNodeName: 'City',
        value: isLoadList,
        callback: loadListCallback
    };

    return {
        /** 
        * @property cityList -
        * @description list of cities 
        */
        cityList
        /**  
       * @property bindCityListSettings -
       * @description settings of city lookup for tlpBind
       */
        , bindCityListSettings
    };
});