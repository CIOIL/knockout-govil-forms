define(['common/core/exceptions',
        'common/utilities/stringExtension',
        'common/networking/services',
        'common/utilities/reflection',
         'common/entities/entityBase',
         'common/external/q',
         'common/resources/domains',
         'common/core/generalAttributes',
         'common/infrastructureFacade/tfsMethods',
         'common/components/formInformation/formInformationViewModel',
         'common/core/readyToRequestPromise'
],
    function (formExceptions, stringExtension, services, reflection, entityBase, Q, domains, generalAttributes, tfsMethods, formInformation, readyToRequestPromise) {//eslint-disable-line
        var loadWSListUtils = function () {

            var generalSettings = {
                method: 'GET',
                dataType: 'json',
                cache: true,
                environmentName: ''
            };

            var defaultSettings = {
                getEntityBaseList: {
                    tableName: '',
                    withFilter: false,
                    dataTextColumn: '',
                    dataCodeColumn: '',
                    filter: []// the expected value object: [{key: '', value: ''} ]
                },
                getList: {
                    tableName: '',
                    format: 'json'
                },
                getListWithFilters: {
                    tableName: '',
                    columnsNames: [''],
                    filters: []// the expected value object: [{ key: '', value: '' }]
                },
                getListByURL: {
                    url: ''
                },
                getListByWebServiceList: {
                    url: '',
                    dataType: 'XML'
                },
                getListByWebServiceWithFilter: {
                    url: '',
                    dataType: 'XML',
                    filter: ''
                }

            };
            var listManagerUrls = {
                getList: 'ListManager/GetTable?tableName=',
                getEntityBaseList: 'ListManager/GetColumnsByMultiFilter?listManagerGetColumnsModel=',
                rowsWithFilter: 'ListManager/GetRowsByMultiFilter?listManagerGetRowsModel='
            };

            var webServiceListMethodsNames = ['getListByWebServiceList', 'getListByWebServiceWithFilter'];

            var validateSettingsObject = function (settings) {
                if (!settings || typeof (settings) !== 'object' || settings === {}) {
                    formExceptions.throwFormError('wrong settings, settings must be object with keys');
                }
            };

            var validateRequiredParameter = function (param) {
                if (!param || param === '') {
                    formExceptions.throwFormError('missing required parameter');
                }
            };

            var validateSettingsParameters = function (settingsParameters) {
                settingsParameters.forEach(function (settingsParameter) {
                    validateRequiredParameter(settingsParameter);
                    if (typeof (settingsParameter) !== 'string') {
                        formExceptions.throwFormError('parameter type is wrong. expect get string');
                    }
                });
            };

            var getFiltersArray = function (filrers) {
                var filtersArray = [];
                filrers.forEach(function (filter) {
                    validateSettingsParameters([ko.unwrap(filter.key), ko.unwrap(filter.value)]);
                    filtersArray.push({ NameCol: ko.unwrap(filter.key), Value: ko.unwrap(filter.value) });
                });
                return filtersArray;
            };

            var getMappedSettings = function (functionName, settings) {
                var functionDefaultSettings = reflection.extendSettingsWithDefaults(defaultSettings[functionName], generalSettings);
                var newSettings = reflection.extendSettingsWithDefaults(settings, functionDefaultSettings);
                if (functionName === 'getListByURL') {
                    return newSettings;
                }
                var mappedSettings = {};
                for (var paramName in newSettings) {
                    if (functionDefaultSettings.hasOwnProperty(paramName)) {
                        mappedSettings[paramName] = newSettings[paramName];
                    }
                }
                return mappedSettings;
            };

            var generateUrl = function (functionName, params, dataType) {
                validateSettingsParameters([listManagerUrls[functionName], dataType]);
                return listManagerUrls[functionName] + params + '&type=' + dataType;
            };

            var generateEntityBaseListUrl = function (settings) {
                var filterSettings = settings.filter;
                var params = {
                    tableName: settings.tableName,
                    OptionColumnsName: { 'dataText': settings.dataTextColumn, 'dataCode': settings.dataCodeColumn }
                };
                if (settings.withFilter && filterSettings) {
                    params.parameters = getFiltersArray(filterSettings);
                }
                return generateUrl('getEntityBaseList', JSON.stringify(params), settings.dataType);
            };

            var generateListWithFiltersUrl = function (settings) {
                var params = {
                    tableName: settings.tableName,
                    colNames: settings.columnsNames
                };
                if (settings.filters) {
                    params.parameters = getFiltersArray(settings.filters);
                }
                return generateUrl('rowsWithFilter', JSON.stringify(params), settings.dataType);
            };

            var getURLFromSettings = function (settings) {
                return ko.unwrap(settings.url);
            };

            var generateGetListURL = function (settings) {
                return generateUrl('getList', settings.tableName, settings.format);
            };

            var generateWebServiceByFilterURL = function (settings) {
                validateRequiredParameter(settings.filter);
                var filter = ko.unwrap(settings.filter) || '';
                return settings.url + '&filter=' + filter;
            };

            var generateURLFunctions = {
                getEntityBaseList: generateEntityBaseListUrl,
                getList: generateGetListURL,
                getListWithFilters: generateListWithFiltersUrl,
                getListByURL: getURLFromSettings,
                getListByWebServiceList: getURLFromSettings,
                getListByWebServiceWithFilter: generateWebServiceByFilterURL
            };

            var isWebSeviceListRequest = function (methodName) {
                return webServiceListMethodsNames.indexOf(methodName) !== -1;//eslint-disable-line
            };

           
            const getDomain = (methodName, environmentName) => {
                const serviceDomains = isWebSeviceListRequest(methodName) ? domains['listManagerDomains'] : domains['govServiceListDomains'];
                return serviceDomains[environmentName] || serviceDomains[generalAttributes.getTargetEnvoirment()];
            };
            var getListByOtherDomain = function (settings, methodName) {//eslint-disable-line
                return readyToRequestPromise.then(function () {
                    var dataType = (settings.dataType || settings.format || 'XML').toUpperCase();
                    var deffer = Q.defer();
                    if (!formInformation.serverMode()) {
                        var domain = getDomain(methodName, settings.environmentName);
                        var url = domain + settings.route;
                        tfsMethods.crossDomain.crossDomainRequest(deffer, url, dataType);
                    }
                    return deffer.promise;
                });
            };

            var isCrossDomainRequest = function (settings) {
                return !generalAttributes.isGovForm() && settings.environmentName;
            };
           
            var getRequestParams = function (settings, validateSettingsParamsArray, methodName) {
                validateSettingsObject(settings);
                validateSettingsParameters(validateSettingsParamsArray);
                var mappedSettings = getMappedSettings(methodName, settings);
                var url = generateURLFunctions[methodName](mappedSettings);
                if (settings.environmentName && generalAttributes.isGovForm()) {
                    mappedSettings['serverName'] = settings.environmentName;
                }
                mappedSettings['route'] = url;
                return mappedSettings;
            };

            var getRequest = function (settings, validateSettingsParamsArray, methodName) {
                var requestParams = getRequestParams(settings, validateSettingsParamsArray, methodName);
                var request = isCrossDomainRequest(settings) ? getListByOtherDomain(requestParams, methodName) : services.govServiceListRequest(requestParams);
                return request;
            };

            return {
                validateRequiredParameter: validateRequiredParameter,
                getRequest: getRequest,
                getRequestParams: getRequestParams,
                getListByOtherDomain: getListByOtherDomain,
                isCrossDomainRequest: isCrossDomainRequest
            };
        }();
        /**
        *Get list from govServiceList and return data as entityBase object.
        * @method getEntityBaseList  
        * @param {object} settings as define in defaultSettings[getEntityBaseList]
        * tableName dataTextColumn and dataCodeColumn are required.
        * @returns {promise}  - resolve return the data.reject return the fail message
        * @example 
        * var entityBasePromise = getEntityBaseList({tableName:'Language', dataTextColumn:'language_name_h', dataCodeColumn:'language_code'}) 
         */
        var getEntityBaseList = function (settings) {
            var needValidate = [settings.tableName, settings.dataTextColumn, settings.dataCodeColumn];
            var request = loadWSListUtils.getRequest(settings, needValidate, 'getEntityBaseList');
            return request;
        };
        /**
        *Get list from govServiceList all list.
        * @method getList  
        * @param {object} settings as define in defaultSettings[getList]
        * @param {string} filterValue - unknown params
        * @param {function} callBackFunction - unknown params
        * tableName param is required.
        * @returns {promise}  - resolve return the data.reject return the fail message
        * @example 
        * var allLanguages = getList({tableName:'Language'}) 
         */
        var getList = function (settings, filterValue, callBackFunction) {//eslint-disable-line
            var request = loadWSListUtils.getRequest(settings, [settings.tableName], 'getList');
            return request;
        };
        /**
        *Get list from govServiceList and return only reuested columns in columnsNames parameter and only rows that suitable to filter .
        * @method getListWithFilters  
        * @param {object} settings as define in defaultSettings[getListWithFilters]
        * tableName ands columnsNames are required.
        * @returns {promise}  - resolve return the data.reject return the fail message
        * @example 
        * var allLanguages = getListWithFilters({tableName:'Language', columnsNames: ['language_name_h'], filters: [{key: 'language_name_h', value: 'עברית'}]}) 
         */
        var getListWithFilters = function (settings) {
            loadWSListUtils.validateRequiredParameter(settings.columnsNames);
            var request = loadWSListUtils.getRequest(settings, [settings.tableName], 'getListWithFilters');
            return request;
        };
        /**
        *Get result of any function in govServiceList by call the settings.url
        * @method getListByURL  
        * @param {object} settings
        * settings.url is required.
        * @returns {promise}  - resolve return the data. reject return the fail message
        * @example 
        * var allLanguages = getListByURL({url:''ListManager/GetRowsByMultiFilter?listManagerGetRowsModel='}) 
         */
        var getListByURL = function (settings) {
            var request = loadWSListUtils.getRequest(settings, [settings.url], 'getListByURL');
            return request;
        };
        /**
        *Get result of any function in webServiceList by call the settings.url
        * @method getListByWebServiceList  
        * @param {object} settings as define in defaultSettings[getListByWebServiceList]
        * settings.url is required.
        * @returns {object} promise. 
        * @example 
        * var allLanguages = getListByWebServiceList({url:'ExternalWS/justice/GETID.aspx/?ID=1'}) 
         */
        var getListByWebServiceList = function (settings) {
            var requestParams = loadWSListUtils.getRequestParams(settings, [settings.url], 'getListByWebServiceList');
            var request = loadWSListUtils.isCrossDomainRequest(settings) ? loadWSListUtils.getListByOtherDomain(requestParams, 'getListByWebServiceList') : services.webServiceListRequest(requestParams);
            return request;
        };

        var getListByWebServiceWithFilter = function (settings) {
            var requestParams = loadWSListUtils.getRequestParams(settings, [settings.url], 'getListByWebServiceWithFilter');
            var request = loadWSListUtils.isCrossDomainRequest(settings) ? loadWSListUtils.getListByOtherDomain(requestParams, 'getListByWebServiceWithFilter') : services.webServiceListRequest(requestParams);
            return request;
        };
        return {
            generateUrl: loadWSListUtils.generateUrl,
            getList: getList,
            getEntityBaseList: getEntityBaseList,
            getListWithFilters: getListWithFilters,
            getListByURL: getListByURL,
            getListByWebServiceList: getListByWebServiceList,
            getListByWebServiceWithFilter: getListByWebServiceWithFilter
        };
    });