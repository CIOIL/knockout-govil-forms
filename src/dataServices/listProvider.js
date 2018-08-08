define(['common/networking/ajax',
        'common/core/exceptions',
        'common/networking/services'
],
    function (ajax, formExceptions, services) {//eslint-disable-line max-params
        /**
         * @module listProvider 
         */
        const defaultSettings = {
            method: 'POST',
            dataType: 'json'
            //cache: true,
            //crossDomain: true
        };

        const methodsNames = {
            getList: 'GetList',
            IsExistItem: 'IsExistItem',
            getFirstItem: 'GetFirstItem',
            getAsEntityBase: 'GetAsEntityBase',
            getLists:'GetLists',
            getEntityBaseLists:'GetAsEntityBaseLists'
        };
       
        const validator = function() {
            const validateListName=function(data, methodname){
                if (!data.listName) {
                    throw formExceptions.throwFormError(`missing required param listName in ${methodname} function (listProvider module)`);
                }
            };
            const validateEntityBase=function(data, methodname){
                if (!data.dataCodeColumn) {
                    throw formExceptions.throwFormError(`missing required param dataCodeColumn, listName: ${data.listName} in ${methodname} function (listProvider module)`);
                }
                if (!data.dataTextColumn) {
                    throw formExceptions.throwFormError(`missing required param dataTextColumn, listName: ${data.listName}. in ${methodname} function (listProvider module)`);
                }  
                validateListName(data, methodname);
            };
            const validateFilters=function(data, methodname){
                if (!data.filters) {
                    throw formExceptions.throwFormError(`missing required param filters, listName: ${data.listName}, in ${methodname} function (listProvider module)`);
                }  
                validateListName(data, methodname);
            };
            const validateEntityBaseLists=function(data, methodname){
                if (!data.paramsList) {
                    throw formExceptions.throwFormError(`missing required param paramsList in ${methodname} function (listProvider module)`);
                }  
                data.paramsList.forEach((params) => {
                    validateEntityBase(params, methodname);
                });
            };
            const validateLists=function(data, methodname){
                if (!data.paramsList) {
                    throw formExceptions.throwFormError(`missing required param paramsList in ${methodname} function (listProvider module)`);
                }  
                data.paramsList.forEach((params) => {
                    validateListName(params, methodname);
                });
            };
            return {
                validateListName,
                validateEntityBase,
                validateFilters,
                validateEntityBaseLists,
                validateLists
            };
        }();

        const createRequest = function (data, methodName, settings) {
            const requestSettings = Object.assign({}, defaultSettings, settings);
            requestSettings.route = `ListProvider/${methodName}`;
            requestSettings.data = data;
            return services.govServiceListRequest(requestSettings);
        };

        const getList = function (data, settings = {}) {
            validator.validateListName(data, methodsNames.getList);
            return createRequest(data, methodsNames.getList, settings);
        };

        const getLists = function (data, settings = {}) {
            validator.validateLists(data, methodsNames.getLists);
            return createRequest(data, methodsNames.getLists, settings);
        };

        const getEntityBase = function (data, settings = {}) {
            validator.validateEntityBase(data, methodsNames.getAsEntityBase);
            return createRequest(data, methodsNames.getAsEntityBase, settings);
        };

        const getEntityBaseLists = function (data, settings = {}) {
            validator.validateEntityBaseLists(data, methodsNames.getEntityBaseLists);
            return createRequest(data, methodsNames.getEntityBaseLists, settings);
        };

        const getFirstItem = function (data, settings = {}) {
            validator.validateListName(data, methodsNames.getFirstItem);
            return createRequest(data, methodsNames.getFirstItem, settings);
        };

        const IsExistItem = function (data, settings = {}) {
            validator.validateFilters(data, methodsNames.IsExistItem);
            return createRequest(data, methodsNames.IsExistItem, settings);
        };

        return {
            /**
             * Get List from ListProvider controller
             * @method getList
             * @memberof listProvider
             * @param {object} data - params of getList function          
             * @param {object} data.listName    
             * @param {array} [data.filters]   
             * @param {string} data.filters.key 
             * @param {string} data.filters.value  
             * @param {string} [data.sortColumn]  
             * @param {object} [settings] - settings of ajax rquest , for example method 
             * @returns {object} a promise object of the request
             * @example Example of usage 
             * listProvider.getList({ listName: 'City' });
            */
            getList,
            /**
             * Get List of lists from ListProvider controller
             * @method getLists
             * @memberof listProvider
             * @param {object} data - params of getLists function          
             * @param {object} data.paramsList    
             * @param {object} data.paramsList.listName    
             * @param {array} [data.paramsList.filters]   
             * @param {string} data.paramsList.filters.key 
             * @param {string} data.paramsList.filters.value  
             * @param {string} [data.paramsList.sortColumn]  
             * @param {object} [settings] - settings of ajax request , for example method 
             * @returns {object} a promise object of the request
             * @example Example of usage 
             * listProvider.getLists({ paramsList: [{ listName: 'City', filters: [{ key: 'city_code', value: '1278' }] }, { listName: 'City' }] });
            */
            getLists,
            /**
             * Get List as entityBase from ListProvider controller
             *  @memberof lisProvider
             * @method getEntityBase
             * @param {object} data - params of getEntityBase function
             * @param {object} data.listName 
             * @param {string} data.dataCodeColumn - name of column as dataCode
             * @param {string} data.dataTextColumn - name of column as dataText
             * @param {array} [data.filters]   
             * @param {string} data.filters.key 
             * @param {string} data.filters.value  
             * @param {string} [data.sortColumn=dataTextColumn] 
             
             * @param {object} settings - settings of ajax rquest , for example method 
             * @returns {object} a promise object of the request
             * @example Example of usage 
             * listProvider.getEntityBase( {
                filters: [{ key: 'MegishPniyaCode', value: model.selectedSubject.dataCode }],
                listName: 'PniotSubjects',
                dataTextColumn: 'NosePniyaText',
                dataCodeColumn: 'NosePniyaCode'
            });
            */
            getEntityBase,
            /**
             * Get List of lists as entityBase from ListProvider controller
             *  @memberof lisProvider
             * @method getEntityBaseLists
             * @param {object} data - params of getEntityBaseLists function
             * @param {object} data.paramsList 
             * @param {object} data.paramsList.listName 
             * @param {string} data.paramsList.dataCodeColumn - name of column as dataCode
             * @param {string} data.paramsList.dataTextColumn - name of column as dataText
             * @param {array} [data.paramsList.filters]   
             * @param {string} data.paramsList.filters.key 
             * @param {string} data.filters.paramsList.value  
             * @param {string} [data.paramsList.sortColumn=dataTextColumn] 
             
             * @param {object} settings - settings of ajax rquest , for example method 
             * @returns {object} a promise object of the request
             * @example Example of usage 
             * listProvider.getEntityBaseLists({ 
               paramsList: [
               { listName: 'City', 
                 dataCodeColumn: 'city_code', 
                 dataTextColumn: 'city_name_he', 
                 filters: [{ key: 'city_code', value: '1278' }] },
               { listName: 'City', 
                 dataCodeColumn: 'city_code', 
                 dataTextColumn: 'city_name_en' }] });
            */
            getEntityBaseLists,
            /**
             * Get List from ListProvider controller
             *  @memberof lisProvider
             * @method getFirstItem
             * @param {object} data - params of getFirstItem function
             * @param {object} data.listName    
             * @param {array} [data.filters]   
             * @param {string} data.filters.key 
             * @param {string} data.filters.value  
             * @param {object} settings - settings of ajax rquest , for example method 
             * @returns {object} a promise object of the request
             * @example Example of usage 
             * listProvider.getFirstItem({ listName: 'City' });
            */
            getFirstItem,
            /**
             * Get List as entityBase from ListProvider controller
             *  @memberof lisProvider
             * @method IsExistItem
             * @param {object} data - params of IsExistItem function   
              * @param {object} data.listName    
             * @param {array} data.filters  
             * @param {string} data.filters.key 
             * @param {string} data.filters.value  
             * @param {object} settings - settings of ajax rquest , for example method 
             * @returns {object} a promise object of the request
             * @example Example of usage 
             * listProvider.IsExistItem( {listName: 'PniotSubjects', filters: [{ key: 'MegishPniyaCode', value: model.selectedSubject.dataCode }]});
            */
            IsExistItem                
        };
    });