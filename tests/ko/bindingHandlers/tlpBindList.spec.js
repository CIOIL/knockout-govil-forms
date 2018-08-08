define(['common/entities/entityBase',
    'common/networking/services',
    'common/external/q',
    'common/core/exceptions',
    'common/entities/entityBase',
    'common/ko/bindingHandlers/tlpBindList',
    'common/ko/bindingHandlers/tlpLookUp'],
function (entities, services, Q, formExceptions, entityBase) {//eslint-disable-line
    var viewModel;
    var getViewModel;
    describe('tlpBindList', function () {


        describe('loadListTable', function () {
            beforeEach(function () {
                ko.cleanNode(document.body);
                var SubjectsList = function (setting) {
                    var self = this;
                    var model = {
                        authority: ko.observable(setting ? setting.Subject : '')//eslint-disable-line camelcase
                    };
                    entities.ObservableEntityBase.call(self, { key: setting ? setting.Num_Sub_Subject : '', value: setting ? setting.Sub_Subject : '' });
                    self.setModel(model);

                };
                SubjectsList.prototype = Object.create(entities.ObservableEntityBase.prototype);
                SubjectsList.prototype.constructor = SubjectsList;
                getViewModel = function (loadListparams, functionName) {
                    var startLoadListprocess = ko.observable();
                    var allSubjectsList = ko.observableArray();
                    var selectedSubject = new entityBase.ObservableEntityBase({
                        key: '',
                        value: ''
                    });
                    var loadListCallback = function (deffer) {
                        var loadedDataMapping = {
                            create: function (obj) {
                                return new SubjectsList(obj.data);
                            }
                        };
                        deffer.then(function (subjectsResponse) {
                            ko.mapping.fromJS(subjectsResponse, loadedDataMapping, allSubjectsList);
                        })
                        .fail(function () {
                        });
                    };
                    var loadListSettings = {
                        settings: loadListparams,
                        functionName: functionName,
                        value: startLoadListprocess,
                        callback: loadListCallback
                    };
                    return {
                        selectedSubject: selectedSubject,
                        allSubjectsList: allSubjectsList,
                        startLoadListprocess: startLoadListprocess,
                        loadListSettings: loadListSettings
                    };
                };
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
                    return deferred.promise;
                });
            });
            it('init tlpBindList adding span to element.', function () {
                loadFixtures('tlpBindList.html');
                viewModel = getViewModel({ tableName: 'subjects_ContactUs' }, 'getList');
                ko.applyBindings(viewModel);
                var loadingMessageElement = $('#hanchayot').parent().next('.loadingMessage');
                expect(loadingMessageElement.length).toEqual(1);
            });
            it('call tlpBindList without function name will fail', function () {
                expect(function () {
                    loadFixtures('tlpBindList.html');
                    viewModel = getViewModel({ tableName: 'subjects_ContactUs' }, '');
                    ko.applyBindings(viewModel);
                    viewModel.startLoadListprocess(true);
                }).toThrow(new formExceptions.FormError('the requested function is not exist'));
            });
            it('call tlpBindList with unknown function name will fail', function () {
                expect(function () {
                    loadFixtures('tlpBindList.html');
                    viewModel = getViewModel({ tableName: 'subjects_ContactUs' }, 'get');
                    ko.applyBindings(viewModel);
                    viewModel.startLoadListprocess(true);
                }).toThrow(new formExceptions.FormError('the requested function is not exist'));
            });
        });
    });
});