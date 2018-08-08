define(['common/infrastructureFacade/tfsMethods',
    'common/viewModels/languageViewModel',    
    'common/utilities/stringExtension',
    'common/resources/exeptionMessages',
    'common/core/formMode'
],
    function (infsMethods,languageViewModel, stringExtension, exceptionsMessages, formMode) {//eslint-disable-line

        describe('languageViewModel', function () {
            var fakeAgatAccess = function (language) {
                return language;
            };
          
            it('should be defined', function () {
                expect(languageViewModel).toBeDefined();
            });

            it('should contain language', function () {
                expect(languageViewModel.language).toBeDefined();
            });

            it('should contain valid languages', function () {
                expect(languageViewModel.validLanguages).toBeDefined();
            });
             
            describe('languagesList', function () {
                it('should be defined', function () {
                    expect(languageViewModel.languagesList).toBeDefined();
                });

                describe('update languagesList should update validLanguages & defaultLanguages', function () {
                    var languagesListArray = [
                            { longName: 'newLanguage', shortName: 'aa', text: 'newLanguage', defaultLanguage: 'english', dir: 'ltr' }
                    ];
                    ko.utils.arrayPushAll(languageViewModel.languagesList, languagesListArray);
                    it('validLanguages contains the new language', function () {
                        expect(languageViewModel.validLanguages.newLanguage).toBeDefined();
                    });

                    it('defaultLanguages contains the language', function () {
                        expect(languageViewModel.defaultLanguages.newLanguage).toEqual('english');
                    });
                });
            });

            describe('change language dynamically', function myfunction() {
                beforeEach(function () {
                    spyOn(infsMethods, 'setFormLanguage').and.callFake(fakeAgatAccess);
                });

                it('should change agat language', function () {
                    const lastFormMode = formMode.mode();
                    formMode.mode(formMode.validModes.client);
                    languageViewModel.language('english');
                    expect(infsMethods.setFormLanguage).toHaveBeenCalled();
                    formMode.mode(lastFormMode);
                });

                it('isEnglish should return true', function () {
                    expect(languageViewModel.isEnglish()).toBeTruthy();
                });
                it('isHebrew should return true', function () {
                    languageViewModel.language('hebrew');
                    expect(languageViewModel.isHebrew()).toBeTruthy();
                });
                it('isArabic should return true', function () {
                    languageViewModel.language('arabic');
                    expect(languageViewModel.isArabic()).toBeTruthy();
                });

                it('should publish "formLanguageChanged" event', function (done) {
                    var subscriber = ko.postbox.subscribe('formLanguageChanged', function (data) {
                        setTimeout(function () {
                            expect(data.newLanguage).toBeDefined();
                            done();
                        }, 500);//eslint-disable-line no-magic-numbers
                    });
                    languageViewModel.language('spanish');
                    ko.postbox.unsubscribeFrom('formLanguageChanged');
                    subscriber.dispose();
                });
                it('languageObject is changed', function () {
                    languageViewModel.language('arabic');
                    expect(languageViewModel.languageObject()).toEqual(jasmine.objectContaining({
                        longName: 'arabic'
                    }));
                });
                it('languageObject by default English', function () {
                    languageViewModel.language('dddd');
                    expect(languageViewModel.languageObject()).toEqual(jasmine.objectContaining({
                        longName: 'english'
                    }));
                });
                it('isRtl is changed according to languageObject - rtl', function () {
                    languageViewModel.language('arabic');
                    expect(languageViewModel.isRtl()).toBeTruthy();
                });
                it('isRtl is changed according to languageObject - ltr', function () {
                    languageViewModel.language('english');
                    expect(languageViewModel.isRtl()).toBeFalsy();
                });

                it('getDirection is changed according to languageObject - rtl', function () {
                    languageViewModel.language('arabic');
                    expect(languageViewModel.getDirection()).toEqual('rtl');
                });
                it('getDirection is changed according to languageObject - ltr', function () {
                    languageViewModel.language('english');
                    expect(languageViewModel.getDirection()).toEqual('ltr');
                });
            });

            describe('getLanguageByLongName', function () {

                it('should be function', function () {
                    expect(typeof languageViewModel.getLanguageByLongName).toEqual('function');
                });

                describe('return object by params', function () {
                    beforeEach(function () {
                        languageViewModel.languagesList = ko.observableArray([
                            { longName: 'english', shortName: 'en', text: 'English', defaultLanguage: 'english', dir: 'ltr' },
                            { longName: 'hebrew', shortName: 'he', text: 'עברית', defaultLanguage: 'hebrew', dir: 'rtl' }
                        ]);
                    });

                    it('undefined should return null', function () {
                        var a;
                        expect(languageViewModel.getLanguageByLongName()).toEqual(null);
                        expect(languageViewModel.getLanguageByLongName(undefined)).toEqual(null);
                        expect(languageViewModel.getLanguageByLongName(a)).toEqual(null);
                    });

                    it('return type of object if language exist in languageViewModel.languagesList', function () {
                        expect(typeof (languageViewModel.getLanguageByLongName('english'))).toEqual('object');
                    });

                    it('return the language object from languageViewModel.languagesList if language exist', function () {
                        expect(languageViewModel.getLanguageByLongName('english')).toEqual(languageViewModel.languagesList()[0]);
                    });

                    it('return null if language not exist in languageViewModel.languagesList', function () {
                        expect(languageViewModel.getLanguageByLongName('xxx')).toEqual(null);
                    });
                });
            });

            describe('getDefaultLanguage', function () {
                it('should be function', function () {
                    expect(typeof languageViewModel.getDefaultLanguage).toEqual('function');
                });

                describe('return default language or "english"', function () {
                    beforeEach(function () {
                        languageViewModel.languagesList = ko.observableArray([
                                { longName: 'arabic', shortName: '', text: 'العربي', defaultLanguage: 'english', dir: 'rtl' },
                                { longName: 'russian', shortName: 'ru', text: 'русский', defaultLanguage: 'english', dir: 'ltr' },
                                { longName: 'amharic' }
                        ]);
                    });

                    it('undefined or null should return "english"', function () {
                        expect(languageViewModel.getDefaultLanguage(undefined)).toEqual('english');
                        expect(languageViewModel.getDefaultLanguage(null)).toEqual('english');
                    });

                    it('return the deafult language as in languagesList', function () {
                        expect(languageViewModel.getDefaultLanguage('russian')).toEqual('english');
                    });

                    it('return "english" if language not contains default in languagesList', function () {
                        expect(languageViewModel.getDefaultLanguage('amharic')).toEqual('english');
                    });

                    it('return "english" if language not exist in languagesList ', function () {
                        expect(languageViewModel.getDefaultLanguage('xxx')).toEqual('english');
                    });
                });
            });

            describe('get Available Languages', function myfunction() {
                var arrayLanguages;

                it('should be function', function () {
                    expect(typeof languageViewModel.getAvailableLanguages).toEqual('function');
                });

                describe('params', function () {
                    it('settings parameter could be undefined', function () {
                        expect(languageViewModel.getAvailableLanguages()).toEqual([]);
                    });

                    it('settings parameter should be array', function () {
                        var settings = 1;
                        expect(function () { languageViewModel.getAvailableLanguages(settings); }).toThrowError(stringExtension.format(exceptionsMessages.invalidParam, settings));
                    });
                });

                describe('return params', function () {

                    it('should return Array of object', function () {
                        arrayLanguages = ['english'];
                        var languagesList = languageViewModel.getAvailableLanguages(arrayLanguages);
                        expect(Object.prototype.toString.call(languagesList)).toEqual('[object Array]');
                    });

                    it('should throw error for not valid language', function () {
                        arrayLanguages = ['english', 'xxx'];
                        expect(function () { languageViewModel.getAvailableLanguages(arrayLanguages); }).toThrowError(stringExtension.format(exceptionsMessages.languageNameIsNotValid, 'xxx'));
                    });

                    it('should return length Array like settings param length', function () {
                        arrayLanguages = ['english', 'hebrew'];
                        var languagesList = languageViewModel.getAvailableLanguages(arrayLanguages);
                        expect(languagesList.length).toEqual(arrayLanguages.length);
                    });

                    it('should return array of objects that contain longName', function () {
                        arrayLanguages = ['english'];
                        var languagesList = languageViewModel.getAvailableLanguages(arrayLanguages);
                        expect(languagesList[0].longName).toBeDefined();
                    });

                    it('should return array of objects that contain text', function () {
                        arrayLanguages = ['english'];
                        var languagesList = languageViewModel.getAvailableLanguages(arrayLanguages);
                        expect(languagesList[0].text).toBeDefined();
                    });

                });

            });
            describe('getShortName', function () {
                beforeEach(function () {
                    languageViewModel.languagesList = ko.observableArray([
                        { longName: 'english', shortName: 'en', text: 'English', defaultLanguage: 'english', dir: 'ltr' },
                        { longName: 'hebrew', shortName: 'he', text: 'עברית', defaultLanguage: 'hebrew', dir: 'rtl' }
                    ]);
                });
                it('should be function', function () {
                    expect(typeof languageViewModel.getShortName).toEqual('function');
                });

                it('return short name by string', function () {
                    languageViewModel.language('hebrew');
                    expect(languageViewModel.getShortName()).toEqual('he');
                });

                it('return short name by string - defualt english', function () {
                    languageViewModel.language('dddd');
                    expect(languageViewModel.getShortName()).toEqual('en');
                });

            });

        });
        afterAll(function () { languageViewModel.language('hebrew') });//eslint-disable-line

    });