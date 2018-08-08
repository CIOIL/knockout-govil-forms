define([
    'common/elements/multiLanguageList',
    'common/utilities/loadWSList',
    'common/external/q',
    'common/viewModels/languageViewModel',
    'common/infrastructureFacade/tfsMethods'
],
function (multiLanguageList, loadWSList, Q, languageViewModel, tfsMethods) {//eslint-disable-line

    describe('multi Language List', function () {

        describe('languageEntity', function () {
            var listItem;

            beforeEach(function () {
                listItem = {
                    dataCode: '1',
                    languageValues: {
                        hebrew: 'בדיקה',
                        arabic: '?????',
                        english: 'testing',
                        spanish: 'inspecci?n'
                    }
                };
            });

            it('to be defined', function () {
                expect(typeof multiLanguageList.LanguageEntity).toBeDefined();
                var languageEntity = new multiLanguageList.LanguageEntity(listItem);
                expect(languageEntity.dataCode).toBe('1');
                expect(languageEntity.hebrewDataText).toBe('בדיקה');
                expect(languageEntity.arabicDataText).toBe('?????');
                expect(languageEntity.englishDataText).toBe('testing');
                expect(languageEntity.spanishDataText).toBe('inspecci?n');
            });
            it('create languageEntity without paramters not failed', function () {
                expect(function () { new multiLanguageList.LanguageEntity(); }).not.toThrow();
            });
            it('create LanguageEntity with irrelevante keys not affects on the result entity', function () {
                var languageEntity = new multiLanguageList.LanguageEntity({
                    dataCode: '1',
                    dataText: 'בדיקה'
                });
                expect(languageEntity.dataCode).toBe('1');
                expect(languageEntity.englishDataText).toBe(undefined);
            });
        });

        describe('ViewModel', function () {
            var list, science;

            beforeEach(function () {
                list = ko.observableArray();
                list.push({
                    dataCode: '1',
                    hebrewDataText: 'בדיקה',
                    arabicDataText: '?????',
                    englishDataText: 'testing',
                    spanishDataText: 'inspecci?n'

                });
                spyOn(tfsMethods, 'setFormLanguage');

                science = new multiLanguageList.ViewModel({ list: list });
                science.entity.dataCode('1');
            });
            it('to be defined', function () {
                expect(typeof multiLanguageList.ViewModel).toBeDefined();
            });

            it('Text data is updated according to language change', function () {
                languageViewModel.language('english');
                expect(science.currentDataText()).toBe('englishDataText');
                expect(science.entity.dataText()).toBe('testing');

                languageViewModel.language('arabic');
                expect(science.currentDataText()).toBe('arabicDataText');
                expect(science.entity.dataText()).toBe('?????');

                languageViewModel.language('spanish');
                expect(science.currentDataText()).toBe('spanishDataText');
                expect(science.entity.dataText()).toBe('inspecci?n');

                //it('when languageViemModel changed to other language the model DataText stay the last language', function () {

                languageViewModel.language('french');
                expect(science.currentDataText()).toBe('frenchDataText');

                expect(science.entity.dataText()).toBe('inspecci?n');

            });

        });
        describe('createBindListSettings function', function () {
            var settings, bindSettingsList;

            beforeEach(function () {

                settings = {
                    tableName: 'countryOfMeches',
                    dataCode: 'ISOalpha',
                    languageColumnsNames: {
                        hebrew: 'hebrew',
                        arabic: 'CountryNames',
                        english: 'CountryNames'
                    },
                    filter: [{ key: 'ISOalpha', value: '99' }]
                };

                var response = ['{"ISOalpha":"99","hebrew":"קבוצת ארצות - כל העולם","CountryNames":"Worldwide","CountryNames":"Worldwide"}'];

                spyOn(loadWSList, 'getListWithFilters').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve(response);//eslint-disable-line
                    return deferred.promise;
                });
                bindSettingsList = multiLanguageList.createBindListSettings(settings);
            });


            it('to be function', function () {
                expect(typeof multiLanguageList.createBindListSettings).toBe('function');
            });
            it('createBindListSettings return bindSettings and list', function () {
                expect(typeof bindSettingsList.bindSettings).toBe('object');
                expect(typeof bindSettingsList.list).toBe('function');
            });
            it('call createBindListSettings without paramters fail', function () {
                expect(function () { multiLanguageList.createBindListSettings(); }).not.toThrow();

            });
            it('create BindList Settings functionality', function () {
                expect(bindSettingsList.bindSettings.settings.tableName).toBe('countryOfMeches');

            });

            it('load list', function (done) {
                var loadListPromise = loadWSList.getListWithFilters(bindSettingsList.bindSettings);
                bindSettingsList.bindSettings.callback(loadListPromise);
                loadListPromise.done(function () {
                    expect(bindSettingsList.list().length).toBe(1);
                    done();
                });

            });
            it('each list item is instanceof LanguageEntity', function (done) {
                var loadListPromise = loadWSList.getListWithFilters(bindSettingsList.bindSettings);
                bindSettingsList.bindSettings.callback(loadListPromise);
                loadListPromise.done(function () {
                    expect(bindSettingsList.list()[0] instanceof multiLanguageList.LanguageEntity).toBeTruthy();
                    done();
                });

            });

            it('mapToLanguageEntityList create', function (done) {
                var loadListPromise = loadWSList.getListWithFilters(bindSettingsList.bindSettings);
                bindSettingsList.bindSettings.callback(loadListPromise);
                loadListPromise.done(function () {
                    expect(bindSettingsList.list()[0].arabicDataText).toBe('Worldwide');
                    expect(bindSettingsList.list()[0].englishDataText).toBe('Worldwide');
                    expect(bindSettingsList.list()[0].dataCode).toBe('99');
                    expect(bindSettingsList.list()[0].hebrewDataText).toBe('קבוצת ארצות - כל העולם');
                    expect(bindSettingsList.list()[0].frenchDataText).toBe(undefined);

                    done();
                });
            });
            it('call createBindListSettings with key not exists', function (done) {
                var bindSettings = multiLanguageList.createBindListSettings({
                    dataCode: '1',
                    languageColumnsNames: {
                        blabla: 'בדיקה'
                    }
                });
                var loadListPromise = loadWSList.getListWithFilters(bindSettings);
                bindSettings.bindSettings.callback(loadListPromise);
                loadListPromise.done(function () {
                    expect(bindSettings.list()[0].blablaDataText).toBe(undefined);
                    done();
                });
            });
            it('call createBindListSettings with key not exists  and check the length of list', function () {
                var bindSettings = multiLanguageList.createBindListSettings({
                    dataCode: '1',
                    dataText: 'בדיקה'
                });
                expect(bindSettings.list().length).toBe(0);
            });

        });
    });
    afterAll(function () { languageViewModel.language('hebrew') });//eslint-disable-line
});