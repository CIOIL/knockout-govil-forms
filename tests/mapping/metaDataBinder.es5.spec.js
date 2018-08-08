define(['common/mapping/viewModelMapper', 'common/elements/dynamicTable', 'common/viewModels/ModularViewModel', 'common/ko/bindingHandlers/checkbox', 'common/ko/bindingHandlers/tlpLookUp', 'common/ko/bindingHandlers/attachment', 'common/entities/entityBase', 'common/ko/fn/config'], function (viewModelMapper, dynamicTable, ModularViewModel, checkbox, tlpLookUp, attachment, entityBase) {
    //eslint-disable-line max-params , no-unused-vars

    describe('metaDataBinder', function () {

        var testingObjects = function () {

            var dataModel = function dataModel() {
                var model = {
                    text1: ko.observable(),
                    firstFull1: ko.observable(),
                    checkBoxFalse: ko.observable(),
                    lookUp: new entityBase.ObservableEntityBase({}),
                    attachment: ko.observable(),
                    radio: ko.observable()
                };

                var _dataModel = new ModularViewModel(model);

                return _dataModel;
            };

            var listDataModel = function listDataModel() {
                var model = {
                    list: ko.observableArray([new dataModel()])
                };
                var _listModel = new ModularViewModel(model);

                return _listModel;
            };

            var nestedListDataModel = function nestedListDataModel() {
                var model = {
                    outerList: ko.observableArray([new listDataModel()])
                };

                var _innerListModel = new ModularViewModel(model);

                return _innerListModel;
            };

            var viewModel = function () {
                var model = {
                    dataModel: new dataModel(),
                    listDataModel: new listDataModel(),
                    nestedListDataModel: new nestedListDataModel()
                };

                var _viewModel = new ModularViewModel(model);

                return _viewModel;
            }();

            return {
                viewModel: viewModel,
                dataModel: dataModel,
                listDataModel: listDataModel,
                nestedListDataModel: nestedListDataModel
            };
        }();

        jasmine.getFixtures().fixturesPath = './base/Tests/mapping/templates';
        loadFixtures('mataDataBinder.html');
        ko.cleanNode(document.body);
        ko.applyBindings(testingObjects.viewModel);
        afterEach(function () {
            ko.cleanNode(document.body);
        });

        it('text', function () {
            expect(testingObjects.viewModel.dataModel.text1.boundElementsTag).toEqual(['text1']);
        });

        it('value', function () {
            expect(testingObjects.viewModel.dataModel.firstFull1.boundElementsTag).toEqual(['firstfull1_1', 'firstfull1_1']);
        });

        it('lookup', function () {
            expect(testingObjects.viewModel.dataModel.lookUp.boundElementsTag).toEqual(['select:street']);
        });

        it('combo', function () {
            expect(testingObjects.viewModel.dataModel.checkBoxFalse.boundElementsTag).toEqual(['checkbox:signf']);
        });

        it('radio', function () {
            expect(testingObjects.viewModel.dataModel.radio.boundElementsTag).toEqual(['formtype']);
        });

        it('attachment', function () {
            expect(testingObjects.viewModel.dataModel.attachment.boundElementsTag).toEqual(['attachment:fileidprint']);
        });

        it('dynamic table', function () {
            expect(testingObjects.viewModel.listDataModel.list.boundElementsTag).toEqual(['listdatamodel']);
        });

        it('nested table', function () {
            expect(testingObjects.viewModel.nestedListDataModel.outerList()[0].list.boundElementsTag).toEqual(['innerlist']);
        });
    });
});