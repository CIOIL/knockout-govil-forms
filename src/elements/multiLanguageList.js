define(['common/viewModels/ModularViewModel',
        'common/viewModels/languageViewModel',
        'common/entities/entityBase',
        'common/utilities/arrayExtensions'
],

function (ModularViewModel, languageViewModel, entityBase) {//eslint-disable-line max-params

    const LanguageEntity = function (settings={languageValues:{}}) {
       
        let self = this;
        self.dataCode = settings.dataCode;
        for (let language in settings.languageValues) {
            if (settings.languageValues.hasOwnProperty(language)) {
                self[language + 'DataText'] = settings.languageValues[language];
            }
        }
    };
    
    const ViewModel = function (settings) {

        settings = settings || {};
        let self = this;

        let model = {
            entity: new entityBase.ObservableEntityBase({ value: '' })
        };

        const list = settings.list;

        const currentDataText = ko.computed(function () {
            return languageViewModel.language() + 'DataText';
        });

        const replaceDataTextByLanguage = function () {
            const currentData = list().find( item => item.dataCode === model.entity.dataCode());
            if (currentData && currentData.hasOwnProperty(currentDataText())) {
                model.entity.dataText(currentData[currentDataText()]);
            }
        };

        languageViewModel.language.subscribe(function () {
            replaceDataTextByLanguage();
        });

        self.currentDataText = currentDataText;
        ModularViewModel.call(self, model);
    };

    ViewModel.prototype = Object.create(ModularViewModel.prototype);
    ViewModel.prototype.constructor = ViewModel;

    const prepareLanguageValues = function(item,languageColumnsNames){
        var languageValues={};
        for (let languageColumnName in languageColumnsNames) {
            if(languageColumnsNames.hasOwnProperty(languageColumnName)){
                languageValues[languageColumnName] = item[languageColumnsNames[languageColumnName]];
            }
        }
        return languageValues;
    };
    const mapToLanguageEntityList = function (response, settings) {
        const dataArray = response.map(function (item) {
            let LanguageEntitySettings = { dataCode: item[settings.dataCode], languageValues: prepareLanguageValues(item,settings.languageColumnsNames)};
            return new LanguageEntity(LanguageEntitySettings);
        });
        return dataArray;
    };

    const createBindListSettings = function (settings={languageColumnsNames:{}}) {
       
        let list = ko.observableArray();


        const callback = function (loadListPromise) {
            loadListPromise.then(function (response) {
                const languageEntityList = mapToLanguageEntityList(response.map(JSON.parse), settings);
                list(languageEntityList);
            });
        };

        const bindSettings = {
            settings: {
                tableName: ko.unwrap(settings.tableName),
                environmentName: 'production',
                filters: settings.filter,
                columnsNames: settings.languageColumnsNames? [settings.dataCode].concat(Object.keys(settings.languageColumnsNames).map(key => settings.languageColumnsNames[key])):undefined
            },
            functionName: 'getListWithFilters',
            callback: callback,
            value: true
        };
        return {
            bindSettings: bindSettings,
            list: list
        };
    };

    return {
        /**
        * Mapping an item in the list to the LanguageEntity objects.
        * @method LanguageEntity  
        * @param {object} settings 
        * @example 
          var languageEntity=  new LanguageEntity({ dataCode: '1', languageValues:{hebrew:  'name_ActivatingActivity', arabic: 'name_a_ActivatingActivity_'}});
         */
        LanguageEntity: LanguageEntity,
        /**
      * Changes currentDataText by current language.
      * @method ViewModel  
      * @param {object} settings 
      * @example 
      * The settings sent should contain the list we received from multiLanguageList.createBindlistSettings or a list containing LanguageEntity values
        var science= new multiLanguageList.ViewModel({ list: lists.science.list })
       */
        ViewModel: ViewModel,
        /**
       * Create bindSettings and list from govServiceList all list.
       * @method createBindListSettings  
       * @param {object} settings 
       * tableName param is required
       * @returns {object}  - return the bindSettings and list from govServiceList.
       * @example 
        var science= multiLanguageList.createBindlistSettings({ dataCode: 'code_Science',languageColumnsNames:{ hebrew: 'name_Science', arabic: 'name_a_Science'}, tableName: 'Science',  filter: [{ key: 'ISOalpha', value: '99' }] })
        */
        createBindListSettings: createBindListSettings
    };
});