define(['common/viewModels/ModularViewModel', 'common/utilities/reflection', 'common/utilities/stringExtension', 'common/resources/exeptionMessages', 'common/components/groups/FormComponent', 'common/ko/validate/extensionRules/personalDetails'], function (ModularViewModel, reflection, stringExtension, exceptionMessages, FormComponent) {
    //eslint-disable-line max-params

    describe('FormComponent base class', function () {
        var testComponent;
        var settings;
        var prop;
        var getRule = function getRule(rules, ruleName) {
            return rules.filter(function (item) {
                return item.ruleName === ruleName || item.rule === ruleName;
            })[0];
        };
        it('verify existence', function () {
            expect(FormComponent).toBeDefined();
        });
        describe('extendModelProperty', function () {
            beforeEach(function () {
                testComponent = new FormComponent();
                prop = ko.observable();
            });
            it('verify proper type', function () {
                expect(testComponent instanceof FormComponent).toBeTruthy();
                expect(testComponent instanceof ModularViewModel).toBeTruthy();
                expect(testComponent.extendModelProperty).toBeDefined();
                expect(testComponent.baseSettings).toBeDefined();
                expect(testComponent.hasOwnProperty('isModelRequired')).toBeTruthy();
            });
            it('extendModelProperty params', function () {
                expect(function () {
                    testComponent.extendModelProperty();
                }).toThrowError(stringExtension.format(exceptionMessages.funcInvalidParams, ['extendModelProperty']));
            });
            it('flat settings treated as model settings', function () {
                settings = {
                    isModelRequired: false,
                    prop: {
                        extenders: { required: true },

                        ignore: []
                    }
                };
                testComponent = new FormComponent({}, settings);
                expect(testComponent.settings.model).toBeDefined;
                expect(testComponent.settings.model).toEqual(settings);
            });
            it('settings with nested model settings', function () {
                settings = {
                    isModelRequired: false,
                    model: {
                        prop: {
                            extenders: { required: true },
                            ignore: []
                        }
                    }
                };
                testComponent = new FormComponent({}, settings);
                expect(testComponent.settings).toEqual(settings);
            });

            describe('extenders', function () {
                describe('isModelRequired', function () {
                    it('isModelRequired = false and required=true', function () {
                        settings = {
                            isModelRequired: false,
                            prop: {
                                extenders: { required: true },

                                ignore: []
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required').condition).toBeUndefined();
                        expect(getRule(prop.rules(), 'required').params).toBeFalsy();
                    });
                    it('isModelRequired = false and required=false', function () {
                        settings = {
                            isModelRequired: false,
                            prop: {
                                extenders: { required: false },

                                ignore: []
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required').condition).toBeUndefined();
                        expect(getRule(prop.rules(), 'required').params).toBeFalsy();
                    });
                    it('isModelRequired = true and required=true', function () {
                        settings = {
                            isModelRequired: true,
                            prop: {
                                extenders: { required: true },

                                ignore: []
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required').condition).toBeUndefined();
                        expect(getRule(prop.rules(), 'required').params).toBeTruthy();
                    });
                    it('isModelRequired = true and required=false', function () {
                        settings = {
                            isModelRequired: true,
                            prop: {
                                extenders: { required: false },

                                ignore: []
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required').condition).toBeUndefined();
                        expect(getRule(prop.rules(), 'required').params).toBeFalsy();
                    });
                    it('isModelRequired or required =conditional', function () {
                        settings = {
                            isModelRequired: false,
                            prop: {
                                extenders: { required: { onlyIf: ko.computed(function () {
                                            return true;
                                        }) } },

                                ignore: []
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required').condition).toBeDefined();
                        expect(getRule(prop.rules(), 'required').params).toBeTruthy();
                        settings = {
                            isModelRequired: ko.computed(function () {
                                return true;
                            }),
                            prop: {
                                extenders: { required: false },
                                ignore: []
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required').condition).toBeDefined();
                        expect(getRule(prop.rules(), 'required').params).toBeTruthy();
                    });
                });
                describe('ignore array', function () {
                    it('rule is ignored', function () {
                        settings = {
                            isModelRequired: false,
                            prop: {
                                extenders: { required: true, hebrewName: true },

                                ignore: ['hebrewName']
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'hebrewName')).toBeUndefined();
                        expect(getRule(prop.rules(), 'required')).toBeDefined();
                    });
                    it('rule required is ignored with isModelRequired=true', function () {
                        settings = {
                            isModelRequired: true,
                            prop: {
                                extenders: { required: true, hebrewName: true },

                                ignore: ['required']
                            }
                        };
                        testComponent = new FormComponent({}, settings);
                        prop = testComponent.extendModelProperty(prop, 'prop');
                        expect(getRule(prop.rules(), 'required')).toBeUndefined();
                        expect(getRule(prop.rules(), 'hebrewName')).toBeDefined();
                    });
                });
            });
            describe('defaultValue', function () {
                it('defaultValue is set on observable', function () {
                    settings = {
                        isModelRequired: false,
                        prop: {
                            extenders: { required: true },
                            defaultValue: 'אאא',
                            ignore: []
                        }
                    };
                    testComponent = new FormComponent({}, settings);
                    prop = testComponent.extendModelProperty(prop, 'prop');
                    expect(prop()).toEqual('אאא');
                });
            });
        });

        describe('formComponent constructor', function () {
            beforeEach(function () {
                testComponent = new FormComponent();
            });

            describe('forceModelAndMerge', function () {
                it('extend model ignore properties that are not owned property of defaultSettings', function () {
                    settings = {
                        isModelRequired: false,
                        model: {
                            prop: {
                                args: {}
                            }
                        }
                    };
                    var defaultSettings = {
                        isModelRequired: false,
                        model: {
                            prop: {
                                args: {
                                    value: ['a', 'b']
                                }
                            }
                        }
                    };
                    testComponent = new FormComponent(defaultSettings, settings);
                    expect(testComponent.settings.model.prop.args).toEqual(defaultSettings.model.prop.args);
                });
            });
        });
    });
});