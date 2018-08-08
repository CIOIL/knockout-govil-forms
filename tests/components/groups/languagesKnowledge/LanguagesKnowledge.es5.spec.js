define(['common/components/groups/FormComponent', 'common/components/groups/languagesKnowledge/LanguagesKnowledge'], function (FormComponent, LanguagesKnowledge) {

    describe('Languages Knowledge', function () {

        var testLanguagesKnowledge = void 0;

        it('should be defined', function () {
            expect(LanguagesKnowledge).toBeDefined();
        });

        it('defaultSettings should be declared on class', function () {
            expect(LanguagesKnowledge.defaultSettings).toBeDefined();
        });

        describe('create new instance', function () {

            it('verify proper inheritence', function () {
                testLanguagesKnowledge = new LanguagesKnowledge();
                expect(testLanguagesKnowledge instanceof LanguagesKnowledge).toBeTruthy();
                expect(testLanguagesKnowledge instanceof FormComponent).toBeTruthy();
                expect(testLanguagesKnowledge.extendModelProperty).toBeDefined();
                expect(testLanguagesKnowledge.labels).toBeDefined();
                expect(testLanguagesKnowledge.settings).toBeDefined();
                expect(testLanguagesKnowledge.hasOwnProperty('isDynamicLanguage')).toBeTruthy();
            });

            it('model should contain all peropertirs', function () {
                testLanguagesKnowledge = new LanguagesKnowledge();
                var languagesKnowledgeModel = testLanguagesKnowledge.getModel();
                expect(languagesKnowledgeModel.selectedLanguage).toBeDefined();
                expect(languagesKnowledgeModel.language).toBeDefined();
                expect(languagesKnowledgeModel.speaking).toBeDefined();
                expect(languagesKnowledgeModel.writing).toBeDefined();
                expect(languagesKnowledgeModel.reading).toBeDefined();
            });

            describe('use defaultSettings', function () {

                beforeEach(function () {
                    testLanguagesKnowledge = new LanguagesKnowledge({});
                });

                it('expect settings is a default', function () {
                    expect(testLanguagesKnowledge.selectedLanguage.dataText.rules()[0].rule === 'required').toBeTruthy();
                    expect(testLanguagesKnowledge.language.defaultValue).toBeDefined();
                });
                it('expect dynamicLanguage is default', function () {
                    expect(testLanguagesKnowledge.isDynamicLanguage()).toBeTruthy();
                });
            });

            describe('setting are send', function () {

                it('defaultValue taken from settings and the extenders applied', function () {
                    var settings = {
                        model: {
                            language: {
                                extenders: {
                                    required: true
                                },
                                defaultValue: 'english'
                            },
                            speaking: {
                                extenders: {
                                    required: true
                                }
                            },
                            selectedLanguage: {
                                extenders: {
                                    required: false
                                }
                            },
                            reading: {
                                extenders: {
                                    required: false
                                }
                            }
                        }
                    };
                    testLanguagesKnowledge = new LanguagesKnowledge(settings);
                    expect(testLanguagesKnowledge.language()).toEqual('english');
                    expect(testLanguagesKnowledge.speaking.dataCode.rules()[0].rule === 'required').toBeTruthy();
                    expect(testLanguagesKnowledge.reading.dataCode.rules()[0].condition()).toBeFalsy();
                    expect(testLanguagesKnowledge.selectedLanguage.dataText.rules()[0].condition()).toBeFalsy();
                });
            });
            describe('isPresetLanguage taken from settings', function () {

                beforeEach(function () {
                    var settings = {
                        model: {},
                        isPresetLanguage: true
                    };
                    testLanguagesKnowledge = new LanguagesKnowledge(settings);
                });

                it('expect presetLanguage is true', function () {
                    expect(testLanguagesKnowledge.isPresetLanguage()).toBeTruthy();
                });

                it('expect affected by isPresetLanguage', function () {
                    expect(testLanguagesKnowledge.isRatingRequired()).toBeTruthy();
                    expect(testLanguagesKnowledge.isDynamicLanguage()).toBeFalsy();
                });
            });
        });
    });
});