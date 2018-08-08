/// <reference path='../../lib/jasmine-2.0.0/jasmine.js' />
define(['common/viewModels/ModularViewModel', 'common/core/mappingManager'],
    function (ModularViewModel, mappingManager) {

        describe('ModularViewModel', function () {
            describe('object functions', function () {
                var viewModel;
                beforeEach(function () {
                    var model = {
                        userFirstName: ko.observable(''),
                        userLastName: ko.observable(''),
                        idnum: ko.observable('')
                    };
                    viewModel = new ModularViewModel(model);
                });

                it('functions shuold be definde', function () {
                    expect(viewModel).toBeDefined();
                    expect(viewModel.getModel).toBeDefined();
                    expect(viewModel.setModel).toBeDefined();
                    expect(viewModel.toJSON).toBeDefined();
                });
                describe('model', function () {
                    it('getModel should return the model', function () {
                        var gModel = viewModel.getModel();
                        expect(gModel.userFirstName).toBeDefined();
                        expect(gModel.userLastName).toBeDefined();
                        expect(gModel.idnum).toBeDefined();
                    });

                    it('setModel should set the new model', function () {
                        var model = { name: ko.observable('avi') };
                        viewModel.setModel(model);
                        expect(ko.toJSON(viewModel.getModel())).toEqual(ko.toJSON(model));
                    });
                    describe('make public model properties', function () {

                        var viewModel;
                        var model;
                        beforeEach(function () {
                            model = {
                                heigth: ko.observable(''),
                                points: ko.observableArray(['', '']),
                                next: new ModularViewModel(
                                    new ModularViewModel({ heigth: ko.observable() })
                                    )
                            };
                            viewModel = new ModularViewModel(model);
                        });
                        //todo: check null model
                        it('setModel', function () {
                            viewModel = new ModularViewModel({});
                            viewModel.setModel(model);
                            expect(viewModel.heigth()).toBeDefined();
                        });

                        it('constructor', function () {
                            viewModel = new ModularViewModel(model);
                            expect(viewModel.heigth()).toBeDefined();
                        });

                        it('change the property should change it in the model', function () {
                            viewModel.heigth('3');
                            viewModel.points()[0] = '0';
                            viewModel.next.heigth('4');

                            expect(viewModel.getModel().heigth()).toEqual('3');
                            expect(viewModel.getModel().points()[0]).toEqual('0');
                            expect(viewModel.getModel().next.heigth()).toEqual('4');

                        });

                        it('change the property in the model should change it in the view model', function () {
                            viewModel.getModel().heigth(3);
                            viewModel.getModel().points()[0] = '0';
                            viewModel.getModel().next.heigth('4');

                            expect(viewModel.heigth()).toEqual(3);
                            expect(viewModel.points()[0]).toEqual('0');
                            expect(viewModel.next.heigth()).toEqual('4');
                        });

                        it('at primitive type change the property should not change it in the model', function () {
                            var sourceModel = {
                                width: 3,
                                isUseFull: true,
                                role: '',
                                nothing: null,
                                noProperty: undefined
                            };
                            viewModel = new ModularViewModel(sourceModel);
                            viewModel.width = 4;
                            viewModel.isUseFull = false;
                            viewModel.nothing = new Date();
                            viewModel.noProperty = new ModularViewModel({});
                            expect(ko.toJSON(viewModel.getModel())).toEqual(ko.toJSON(sourceModel));
                        });

                    });
                });
                describe('mappingRules', function () {
                    var mappingRules = {
                        viewModel: {
                            create: function () { }
                        }
                    };
                    it('getMappingRules should return the mappingRules object', function () {
                        expect(viewModel.getMappingRules()).toEqual(jasmine.any(Object));
                    });


                    it('setMappingRules should set the new mappingRules', function () {
                        viewModel.setMappingRules(mappingRules);
                        expect(ko.toJSON(viewModel.getMappingRules())).toEqual(ko.toJSON(mappingRules));
                    });

                    it('setMappingRules should update the mappingManager if isSingleInstance', function () {
                        viewModel.setMappingRules(mappingRules, true);
                        expect(ko.toJSON(mappingManager.get().viewModel)).toEqual(ko.toJSON(mappingRules.viewModel));
                    });

                });
            });
            describe('prototype functions', function () {
                describe('toJSON', function () {
                    var viewModel;
                    var model;
                    beforeEach(function () {
                        model = {
                            userFirstName: ko.observable(''),
                            userLastName: ko.observable(''),
                            idnum: ko.observable('')
                        };
                        viewModel = new ModularViewModel(model);
                        viewModel.fullName = ko.computed(function () {
                            return model.userFirstName() + ' ' + model.userLastName();
                        });
                    });
                    it('just the model shuold be in the output', function () {
                        viewModel.userFirstName('יהודה');
                        viewModel.userLastName('המכבי');
                        var vmJSON = viewModel.toJSON();
                        expect(vmJSON.fullName).not.toBeDefined();
                        expect(ko.toJSON(vmJSON)).toEqual(ko.toJSON(ko.toJS(model)));
                    });
                });

            });
            describe('innerite', function () {
                var PersonVM = function () {
                    var model = {
                        userFirstName: ko.observable(''),
                        userLastName: ko.observable(''),
                        idnum: ko.observable('')
                    };
                    var self = this;
                    ModularViewModel.call(self, model);
                    self.fullName = ko.computed(function () {
                        return model.userFirstName() + ' ' + model.userLastName();
                    });
                };
                PersonVM.prototype = Object.create(ModularViewModel.prototype);
                PersonVM.constructor = PersonVM;

                var person = new PersonVM();
                it('functions shuold be definde', function () {
                    expect(person).toBeDefined();
                    expect(person.getModel).toBeDefined();
                    expect(person.setModel).toBeDefined();
                    expect(person.toJSON).toBeDefined();
                });

            });

        });

    });