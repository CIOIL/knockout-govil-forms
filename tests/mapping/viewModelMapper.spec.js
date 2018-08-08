define(['common/mapping/viewModelMapper',
    'common/elements/dynamicTable',
    'common/viewModels/ModularViewModel',
    'common/ko/bindingHandlers/checkbox',
    'common/ko/bindingHandlers/tlpLookUp',
    'common/ko/bindingHandlers/attachment',
    'common/entities/entityBase',
    'common/ko/fn/config'],

function (viewModelMapper, dynamicTable, ModularViewModel, checkbox, tlpLookUp, attachment, entityBase) {//eslint-disable-line max-params , no-unused-vars

    describe('view Model Mapper', function () {

        var testingObjects = function () {

            var dataModel = function (args) {
                var ignore = ko.computed(function () {
                    return true;
                });
                var notIgnore = ko.computed(function () {
                    return false;
                });
                var model = {
                    noExit: ko.observable('default value'),
                    text1: ko.observable(),
                    firstFull1: ko.observable(),
                    firstFull2: ko.observable(),
                    fullText: ko.observable(),
                    emptyText: ko.observable(),
                    checkBoxFalse: ko.observable(),
                    checkBoxTrue: ko.observable(),
                    lookUp: new entityBase.ObservableEntityBase({}),
                    select: ko.observable(),
                    attachment: ko.observable(),
                    radio: ko.observable(),
                    primitiveArr: ko.observableArray(),
                    ignoreText: ko.observable('ignore').config({ ignoreMap: true }),
                    ignoreOnlyIfTrue: ko.observable('ignore').config({ ignoreMap: ignore }),
                    ignoreOnlyIfFals: ko.observable('ignore').config({ ignoreMap: notIgnore }),
                    ignoreCheckbox: ko.observable('ignore').config({ ignoreMap: true }),
                    ignoreAttachment: ko.observable('ignore').config({ ignoreMap: true }),
                    ignoreLookUp: new entityBase.ObservableEntityBase({})//key: 'ignore', value: 'ignore'

                };

                var _dataModel = new ModularViewModel(model);

                var statusList = [{ key: '1', value: 'נשוי' },
                                  { key: '2', value: 'גרוש' },
                                  { key: '3', value: 'אלמן' },
                                  { key: '4', value: 'רווק' }];

                _dataModel.params = args && args.params ? args.params : 'default';
                _dataModel.lable = args && args.lable ? args.lable : '123';
                _dataModel.statusList = statusList;

                return _dataModel;
            };

            var listDataModel = function (args) {
                var model = {
                    list: ko.observableArray([new dataModel({ lable: '123' })]).config({ type: dataModel, params: { lable: 'from params' } }),
                    ignoreList: ko.observableArray([]).config({ type: dataModel, ignoreMap: true })
                };
                var _listModel = new ModularViewModel(model);

                var mappingRules = {
                    list: dynamicTable.createMappingRules(model.list, { lable: 'newRow', params: args && args.params ? args.params : undefined }),
                    ignoreList: dynamicTable.createMappingRules(model.list, { lable: 'newRow', params: args && args.params ? args.params : undefined })
                };

                _listModel.setMappingRules(mappingRules);
                return _listModel;
            };

            var nestedListDataModel = function () {
                var model = {
                    outerList: ko.observableArray([new listDataModel()]).config({ type: listDataModel })
                };

                var _innerListModel = new ModularViewModel(model);

                var mappingRules = {
                    outerList: dynamicTable.createMappingRules(model.outerList, { params: 'from viewModel' })
                };

                _innerListModel.setMappingRules(mappingRules);
                return _innerListModel;
            };

            var nestedListWithoutMapSettingsDataModel = function () {
                var model = {
                    outerList: ko.observableArray([new listDataModel()]).config({ type: listDataModel })
                };

                var _innerListModel = new ModularViewModel(model);

                return _innerListModel;
            };

            var viewModel = (function () {
                var model = {
                    dataModel: new dataModel({ lable: '1' }),
                    listDataModel: new listDataModel(),
                    nestedListDataModel: new nestedListDataModel(),
                    nestedListWithoutMapSettings: new nestedListWithoutMapSettingsDataModel()
                };

                var _viewModel = new ModularViewModel(model);

                return _viewModel;
            }());

            var mapSettings = {};

            mapSettings.list = {
                create: function (item) {
                    var newDataModel = new dataModel({ lable: 'common2', params: 'from mapSettings' });
                    ko.mapping.fromJS(item.data, mapSettings, newDataModel);
                    return newDataModel;
                }
            };
            mapSettings.outerList = {
                create: function (item) {
                    var newListDataModel = new listDataModel();
                    ko.mapping.fromJS(item.data, mapSettings, newListDataModel);
                    return newListDataModel;
                }
            };

            return {
                viewModel: viewModel,
                dataModel: dataModel,
                listDataModel: listDataModel,
                nestedListDataModel: nestedListDataModel,
                mapSettings: mapSettings
            };
        };

        var viewModel;
        var mapSettings;
        var xml;
        var newMappingRule;
        var initializationTestingObjects = function () {
            var test = testingObjects();
            viewModel = test.viewModel;
            mapSettings = test.mapSettings;
        };


        beforeAll(function () {
            initializationTestingObjects();
            jasmine.getFixtures().fixturesPath = '/base/Tests/mapping/templates';
            loadFixtures('viewModelMapper.html');
            ko.cleanNode(document.body);
            ko.applyBindings(viewModel);
            xml = $('#xmlTag').html();
            viewModelMapper.mapXmlToViewModel(xml, viewModel.dataModel);
            viewModelMapper.mapXmlToViewModel(xml, viewModel.listDataModel);
            viewModelMapper.mapXmlToViewModel(xml, viewModel.nestedListDataModel);
            newMappingRule = {
                condition: function (property) {
                    return property.newMappingRule;
                },
                map: function (source, destination) {
                    return destination('new');
                },
                priority: 100
            };
            viewModel.dataModel.fullText.newMappingRule = true;
        });

        describe('mapXmlToViewModel', function () {
            it('not found in xml source doesn\'t overwite model value ', function () {
                expect(viewModel.dataModel.noExit()).toEqual('default value');
            });

            it('empty value in xml source return undefined', function () {
                expect(viewModel.dataModel.emptyText()).toEqual(undefined);
            });

            it('mapping first full object', function () {
                expect(viewModel.dataModel.firstFull1()).toEqual('1');
                expect(viewModel.dataModel.firstFull2()).toEqual('2');
            });

            it('ignore', function () {
                expect(viewModel.dataModel.ignoreText()).toEqual('ignore');
                expect(viewModel.dataModel.ignoreCheckbox()).toEqual('ignore');
                expect(viewModel.dataModel.ignoreAttachment()).toEqual('ignore');
                expect(viewModel.dataModel.ignoreOnlyIfTrue()).toEqual('ignore');
                expect(viewModel.dataModel.ignoreOnlyIfFals()).toEqual('not ignore');
                //expect(viewModel.dataModel.ignoreLookUp.dataText()).toEqual('ignore');
                //expect(viewModel.dataModel.ignoreLookUp.dataCode()).toEqual('ignore');
            });

            describe('mappingTypes', function () {

                it('mapValue - mapping text value from xml', function () {
                    expect(viewModel.dataModel.fullText()).toEqual('a');
                });

                it('mapLookUp - mapping dataText and dataCode', function () {
                    expect(viewModel.dataModel.lookUp.dataText()).toEqual('ירושלים');
                    expect(viewModel.dataModel.lookUp.dataCode()).toEqual('5');
                });

                it('mapBoolian - mapping boolian value', function () {
                    expect(viewModel.dataModel.checkBoxFalse()).toEqual(false);
                    expect(viewModel.dataModel.checkBoxTrue()).toEqual(true);
                });

                it('mapAttachment - mapping fileName ', function () {
                    expect(viewModel.dataModel.attachment()).toEqual('1.jpg');
                });

                it('rdio - mapping checked value', function () {
                    expect(viewModel.dataModel.radio()).toEqual('2');
                });

                it('primitive array', function () {
                    expect(viewModel.dataModel.primitiveArr()[0]).toEqual('1');
                    expect(viewModel.dataModel.primitiveArr()[1]).toEqual('2');
                    expect(viewModel.dataModel.primitiveArr()[2]).toEqual('3');
                });

                describe('observable array - dynamic table', function () {


                    it('create new rows by xml items list count', function () {
                        expect(viewModel.listDataModel.list().length).toEqual(3);
                    });

                    it('ignore table', function () {
                        expect(viewModel.listDataModel.ignoreList().length).toEqual(0);
                    });

                    it('mapValue - mapping text value from xml', function () {
                        expect(viewModel.listDataModel.list()[0].fullText()).toEqual('row1');
                        expect(viewModel.listDataModel.list()[1].fullText()).toEqual('row2');
                        expect(viewModel.listDataModel.list()[2].fullText()).toEqual('row3');
                    });

                    it('mapLookUp - mapping dataText and dataCode', function () {
                        expect(viewModel.listDataModel.list()[0].lookUp.dataText()).toEqual('בת ים');
                        expect(viewModel.listDataModel.list()[0].lookUp.dataCode()).toEqual('4');

                        expect(viewModel.listDataModel.list()[1].lookUp.dataText()).toEqual('הרצליה');
                        expect(viewModel.listDataModel.list()[1].lookUp.dataCode()).toEqual('1');

                        expect(viewModel.listDataModel.list()[2].lookUp.dataText()).toEqual('אשדוד');
                        expect(viewModel.listDataModel.list()[2].lookUp.dataCode()).toEqual('8');
                    });

                    it('mapBoolian - mapping boolian value', function () {
                        expect(viewModel.listDataModel.list()[0].checkBoxFalse()).toEqual(false);
                        expect(viewModel.listDataModel.list()[0].checkBoxTrue()).toEqual(true);

                        expect(viewModel.listDataModel.list()[1].checkBoxFalse()).toEqual(false);
                        expect(viewModel.listDataModel.list()[1].checkBoxTrue()).toEqual(true);

                        expect(viewModel.listDataModel.list()[2].checkBoxFalse()).toEqual(false);
                        expect(viewModel.listDataModel.list()[2].checkBoxTrue()).toEqual(true);
                    });

                    it('mapAttachment - mapping fileName ', function () {
                        expect(viewModel.listDataModel.list()[0].attachment()).toEqual('2.jpg');
                        expect(viewModel.listDataModel.list()[1].attachment()).toEqual('3.jpg');
                        expect(viewModel.listDataModel.list()[2].attachment()).toEqual('8.jpg');
                    });

                    it('mapSettings taken from the viewModel - match common3 template, parameters posted from view model mapping rule', function () {
                        expect(viewModel.listDataModel.list()[0].lable).toEqual('newRow');
                        expect(viewModel.listDataModel.list()[1].lable).toEqual('newRow');
                        expect(viewModel.listDataModel.list()[2].lable).toEqual('newRow');
                    });


                    it('mapSettings posted by parameter to the mapping - match common2 template', function () {
                        viewModel.listDataModel.list.mapped = undefined;
                        viewModelMapper.mapXmlToViewModel(xml, viewModel.listDataModel, mapSettings);

                        expect(viewModel.listDataModel.list()[0].lable).toEqual('common2');
                        expect(viewModel.listDataModel.list()[1].lable).toEqual('common2');
                        expect(viewModel.listDataModel.list()[2].lable).toEqual('common2');
                    });
                    it('mapSettings doesn\'t exist - create array items by default settings ({config{type}})', function () {
                        viewModel.listDataModel.list.mapped = undefined;
                        viewModelMapper.mapXmlToViewModel(xml, viewModel.listDataModel, {});
                        expect(viewModel.listDataModel.list()[0].lable).toEqual('from params');
                        expect(viewModel.listDataModel.list()[1].lable).toEqual('from params');
                        expect(viewModel.listDataModel.list()[2].lable).toEqual('from params');
                    });
                });

                describe('nested table', function () {

                    it('create new rows by xml items list count', function () {
                        expect(viewModel.nestedListDataModel.outerList().length).toEqual(2);
                        expect(viewModel.nestedListDataModel.outerList()[0].list().length).toEqual(1);
                        expect(viewModel.nestedListDataModel.outerList()[1].list().length).toEqual(2);
                    });

                    it('mapValue - mapping text value from xml', function () {
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].fullText()).toEqual('11');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].fullText()).toEqual('22');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].fullText()).toEqual('33');
                    });

                    it('mapLookUp - mapping dataText and dataCode', function () {
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].lookUp.dataText()).toEqual('רעננה');
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].lookUp.dataCode()).toEqual('3');

                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].lookUp.dataText()).toEqual('תל אביב');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].lookUp.dataCode()).toEqual('6');

                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].lookUp.dataText()).toEqual('פתח תקוה');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].lookUp.dataCode()).toEqual('7');
                    });

                    it('mapBoolian - mapping boolian value', function () {
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].checkBoxFalse()).toEqual(false);
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].checkBoxTrue()).toEqual(true);

                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].checkBoxFalse()).toEqual(false);
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].checkBoxTrue()).toEqual(true);

                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].checkBoxFalse()).toEqual(false);
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].checkBoxTrue()).toEqual(true);
                    });

                    it('mapAttachment - mapping fileName ', function () {
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].attachment()).toEqual('4.jpg');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].attachment()).toEqual('5.jpg');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].attachment()).toEqual('6.jpg');
                    });

                    it('mapSettings taken from the viewModel - match common3 template', function () {
                        expect(viewModel.nestedListDataModel.outerList()[0].list()[0].params).toEqual('from viewModel');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[0].params).toEqual('from viewModel');
                        expect(viewModel.nestedListDataModel.outerList()[1].list()[1].params).toEqual('from viewModel');
                    });
                });
            });
        });

        describe('register', function () {
            beforeEach(function () {
                viewModelMapper.register('newMappingRule', newMappingRule);
                viewModelMapper.mapXmlToViewModel(xml, viewModel.dataModel);

            });
            afterEach(function () {
                ko.cleanNode(document.body);
            });
            it('register new mapping rule', function () {
                expect(viewModel.dataModel.fullText()).toEqual('new');
            });
        });

    });

});
