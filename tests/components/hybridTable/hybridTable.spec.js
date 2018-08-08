define(['common/viewModels/ModularViewModel',
    'common/components/hybridTable/hybridTable',
    'common/ko/fn/config',
    'common/utilities/arrayExtensions'
],function(ModularViewModel, hybridTable){//eslint-disable-line

    var hybridTabletExtender, Contact, extendType, typeInstance, viewModel;
    const hybridListArray = ko.observableArray();
   
    const matchers = {
        exceptionContains: function () {
            return {
                compare: function (actualValue, expectedResult) {
                    var res = { pass: false };
                    if (typeof actualValue === 'function') {
                        try {
                            actualValue();
                        }
                        catch (ex) {
                            if (ex.message.indexOf(expectedResult) > -1) { //eslint-disable-line no-magic-numbers
                                res.pass = true;
                            }
                        }
                    }
                    return res;
                }
            };
        }
    };

    describe('hybridTable', function () {

        beforeAll(function () {
            jasmine.addMatchers(matchers);
        });
        beforeEach(function () {

            Contact = function (settings) { //eslint-disable-line no-unused-vars
                const self = this;
                const model = {
                    type: ko.observable(),
                    identityNumber: ko.observable()
                };
                ModularViewModel.call(self, model);
            };
            Contact.prototype = Object.create(ModularViewModel.prototype);
            Contact.prototype.constructor = Contact;

            //return Contact;
            //var contactSetting = {
            //    type: { defaultValue: '1' },
            //    migrationDate: { extenders: { pastDate: { compareTo: '22/06/2017' } } }
            //};
            hybridTabletExtender = hybridTable.hybridTableTypeExtender;//eslint-disable-line              
        });
        describe('hybridTable Type', function () {
            beforeEach(function () {
                extendType = hybridTabletExtender(Contact);//eslint-disable-line
                typeInstance = new extendType();//eslint-disable-line
            });
            it('should be a object', function () {
                expect(typeof Contact === 'function').toBeTruthy();
            });
            it('should be instance of hybridTableExtend', function () {
                expect(typeInstance instanceof Contact).toBeTruthy();//eslint-disable-line
                expect(typeInstance instanceof extendType).toBeTruthy();//eslint-disable-line
            });
            it('after extend should have isOpenContent property', function () {
                expect(typeInstance.isOpenContent).toBeDefined();
            });
        });

        describe('hybridTable Extender ', function () {
            beforeEach(function () {
                //hybridListArray.extend({ hybridTable: { showElementsIds: ['contactIdentityNumber'], openContent: true, showInOrder: false, openContenAfterImport: false } });
                hybridListArray.extend({ hybridTable: { showElementsIds: [''] } });
            });
            it('should get object parameter', function () {
                expect(function () {
                    hybridListArray.extend({ hybridTable: true });
                }).toThrow();
            });
            it('should create the config on ko.observableArray', function () {
                expect(hybridListArray.config).toBeDefined();
            });

            it('should have tableType parameter on config', function () {
                expect(hybridListArray.config).toEqual(jasmine.objectContaining({ tableType: 'hybrid' }));
            });

            it('should have isOpenContent obsrervable', function () {
                expect(hybridListArray.isOpenContent).toBeDefined();
                expect(hybridListArray.isOpenContent()).toBeTruthy();
            });
            describe('params', function () {
                it('showElementsIds,openContent, showInOrder, openContenAfterImport is defind', function () {
                    expect(hybridListArray.config['showElementsIds']).toBeDefined();
                    expect(hybridListArray.config['openContent']).toBeDefined();
                    expect(hybridListArray.config['showInOrder']).toBeDefined();
                    expect(hybridListArray.config['openContenAfterImport']).toBeDefined();
                });

                it('showElementsIds empty array', function () {
                    expect(function () {
                        hybridListArray.extend({ hybridTable: {} });
                    }).toThrow();
                });
                it('when showInOrder is false, showElementsIds can be empty', function () {
                    expect(function () {
                        hybridListArray.extend({ hybridTable: { showInOrder: false } });
                    }).not.toThrow();
                });

            });

        });

        describe('extend dynamicTable module', function () {
            it('should include the addRow binding handler', function () {
                expect(ko.bindingHandlers.addRow).toBeDefined();
            });

            it('should include the removeRow binding handler', function () {
                expect(ko.bindingHandlers.removeRow).toBeDefined();
            });

            it('should include texts resources', function () {
                expect(typeof hybridTable.texts).toEqual('object');
            });

            it('should include events names', function () {
                expect(typeof hybridTable.events).toEqual('object');
            });

        });

        describe('collapse/expand', function () {
            beforeEach(function () {
                ko.cleanNode(document.body);
                jasmine.getFixtures().fixturesPath = '/base/Tests/components/hybridTable/templates';
                loadFixtures('hybridTable.html');
                //settings
                viewModel = {
                    contactListHybrid: ko.observableArray([new (hybridTabletExtender(Contact))()]).config({ type: Contact, maxRows: 6, params: {} }).extend({ hybridTable: { showElementsIds: ['contactIdentityNumber'], openContent: true, showInOrder: false, openContenAfterImport: false } }),//eslint-disable-line
                    contactListDynmic: ko.observableArray([new (Contact)()]).config({ type: Contact, maxRows: 6, params: {} })//eslint-disable-line
                };

                ko.applyBindings(viewModel);
            });
            describe('collapse Expand all rows', function () {
                it('should include the collapseExpandAll binding handler', function () {
                    expect(ko.bindingHandlers.collapseExpandAll).toBeDefined();
                });
                it('row inside table should be expanded', function () {
                    viewModel.contactListHybrid.isOpenContent(true);
                    const firstRow = viewModel.contactListHybrid()[0];
                    expect(firstRow.isOpenContent()).toBeTruthy();
                });
                it('row inside table should be collapsed', function () {
                    viewModel.contactListHybrid.isOpenContent(false);
                    const firstRow = viewModel.contactListHybrid()[0];
                    expect(firstRow.isOpenContent()).toBeFalsy();
                });
                //tohavebeencalled = ko.bin
                it('collapse / expand all binding', function () {
                    spyOn(ko.bindingHandlers.collapseExpandAll, 'init');
                    ko.cleanNode(document.body);
                    ko.applyBindings(viewModel);
                    expect(ko.bindingHandlers.collapseExpandAll.init).toHaveBeenCalled();
                });
                it('should get table as bindingAccessor', function () {
                    viewModel.contactListHybrid = undefined;
                    ko.cleanNode(document.body);
                    expect(function () { ko.applyBindings(viewModel); }).exceptionContains('table name is missing');
                });
            });

            describe('collapse expand row', function () {
                it('should include the collapseExpandRow binding handler', function () {
                    expect(ko.bindingHandlers.collapseExpandAll).toBeDefined();
                });
                it('expand row', function () {
                    const firstRow = viewModel.contactListHybrid()[0];
                    firstRow.isOpenContent(true);
                    expect(viewModel.contactListHybrid.isOpenContent()).toBeTruthy();
                });
                it('collapse row', function () {
                    const firstRow = viewModel.contactListHybrid()[0];
                    firstRow.isOpenContent(false);
                    expect(viewModel.contactListHybrid.isOpenContent()).toBeTruthy();
                });
                it('class', function () {
                    const firstRow = viewModel.contactListHybrid()[0];
                    firstRow.isOpenContent(true);
                    expect(viewModel.contactListHybrid.isOpenContent()).toBeTruthy();
                });
                it('collapseExpandRow binding', function () {
                    spyOn(ko.bindingHandlers.collapseExpandRow, 'init');
                    ko.cleanNode(document.body);
                    ko.applyBindings(viewModel);
                    expect(ko.bindingHandlers.collapseExpandRow.init).toHaveBeenCalled();
                });
                //tohavebeencalled = ko.bin
                it('should get table as bindingAccessor', function () {
                    viewModel.contactListHybrid = undefined;
                    ko.cleanNode(document.body);
                    expect(function () { ko.applyBindings(viewModel); }).exceptionContains('table name is missing');
                });
                describe('show elements on view mode', function () {
                    //beforeEach(function () {
                       
                    //});
                    //it('blblaa', function () {
                    //    const viewElement = $('#viewElement');
                    //    const contactSetting = {
                    //        type: { defaultValue: '1' },
                    //        migrationDate: { extenders: { pastDate: { compareTo: '22/06/2017' } } }
                    //    };
                    //    viewModel.contactListHybrid = ko.observableArray([new (hybridTabletExtender(Contact))(contactSetting)]).config({ type: Contact, maxRows: 6, params: {} }).extend({ hybridTable: { showElementsIds: ['contactIdentityType'], showInOrder: true } });//eslint-disable-line                        
                    //    viewModel.contactListHybrid.isOpenContent(false);
                    //    ko.cleanNode(document.body);
                    //    ko.applyBindings(viewModel);
                    //    expect(viewElement).toHaveClass('shown-element');//span-field
                    //});
                    //it('asterisk prepend to label', function () {
                    //    const viewElement = $('#unViewElement'); 
                    //    const contactSetting = {
                    //        type: { defaultValue: '1' },
                    //        migrationDate: { extenders: { pastDate: { compareTo: '22/06/2017' } } }
                    //    };
                    //    viewModel.contactListHybrid = ko.observableArray([new (htExtender(Contact))(contactSetting)]).config({ type: Contact, maxRows: 6, params: {} }).extend({ hybridTable: { showElementsIds: ['contactIdentityType'], showInOrder: true } });//eslint-disable-line                        
                    //    viewModel.contactListHybrid.isOpenContent(false);
                    //    ko.cleanNode(document.body);
                    //    ko.applyBindings(viewModel);
                    //    expect(viewElement).toHaveClass('unshown-element');
                    //});
                    //it('asterisk prepend to label', function () {
                    //    const viewElement = $('#unViewElement');//?
                    //    viewModel.contactListHybrid = ko.observableArray([new (htExtender(Contact))()]).config({ type: Contact, maxRows: 6, params: {} }).extend({ hybridTable: { showInOrder: false } });//eslint-disable-line                        
                    //    viewModel.contactListHybrid.isOpenContent(false);
                    //    ko.cleanNode(document.body);
                    //    ko.applyBindings(viewModel);
                    //    expect(viewElement).toHaveClass('unshown-element');
                    //});
                });
                //tohaveClass
            });

            describe('add new row', function () {
                it('hybridTable row should have isOpenContent', function (done) {
                    var addRowElement = $('#addHybridRow');

                    ko.cleanNode(document.body);
                    ko.applyBindings(viewModel);
                    ko.postbox.subscribe('userAfterAddTableRow', function () {
                        expect(viewModel.contactListHybrid()[1].isOpenContent).toBeDefined();
                        done();
                    });
                    addRowElement.click();
                });

                //it('dynamicTable row should not have isOpenContent', function (done) {
                    //const dynmicViewModel = {
                    //    contactListDynmic: ko.observableArray([new (Contact)()]).config({ type: Contact, maxRows: 6, params: {} })//eslint-disable-line
                    //};
                    //var addRowElement = $('#addDynmicRow');

                    //ko.cleanNode(document.body);
                    //ko.applyBindings(viewModel);
                    //ko.postbox.subscribe('userAfterAddTableRow', function () {
                    //    expect(dynmicViewModel.contactListDynmic()[1].isOpenContent).not.toBeDefined();
                    //    done();
                    //});
                    //addRowElement.click();
                //});

            });

            var item;
            describe('createMappingRules', function () {
                beforeEach(function () {
                    item = {
                        data: {
                            type: { defaultValue: '1' },
                            migrationDate: { extenders: { pastDate: { compareTo: '22/06/2017' } } }
                        }
                    };
                });
                it('return hybridTable object type ', function () {
                    var array = ko.observableArray().config({ type: Contact }).extend({ hybridTable: { showInOrder: false } });
                    var mapping = hybridTable.createMappingRules(array);
                    var mappedItem = mapping.create(item);
                    expect(mappedItem.isOpenContent).toBeDefined();
                });
                it('row after import by default is closed', function () {
                    var array = ko.observableArray().config({ type: Contact }).extend({ hybridTable: { showInOrder: false } });
                    var mapping = hybridTable.createMappingRules(array);
                    var mappedItem = mapping.create(item);
                    expect(mappedItem.isOpenContent()).toBeFalsy();
                });
                it('row after import is open', function () {
                    //var array = ko.observableArray().config({ type: Contact }).extend({ hybridTable: { showInOrder: false, openContenAfterImport: false } });
                    //var mapping = hybridTable.createMappingRules(array);
                    //var mappedItem = mapping.create(item);
                    //expect(mappedItem.isOpenContent()).toBeTruthy();
                });
                it('return dynamicTable object', function () {
                    var array = ko.observableArray().config({ type: Contact });
                    var mapping = hybridTable.createMappingRules(array);
                    var mappedItem = mapping.create(item);
                    expect(mappedItem.isOpenContent).not.toBeDefined();
                });

            });

            describe('validate form', function () {
                it('form is not valid', function () {
                    const firstRow = viewModel.contactListHybrid()[0];
                    firstRow.isOpenContent(false);
                    spyOn(firstRow, 'validateModel').and.callFake(function () {
                        return true;
                    });
                    ko.postbox.publish('validateForm');
                    expect(firstRow.isOpenContent()).toBeFalsy();
                });
                it('form is valid', function () {
                    const firstRow = viewModel.contactListHybrid()[0];
                    firstRow.isOpenContent(false);
                    spyOn(firstRow, 'validateModel').and.callFake(function () {
                        return false;
                    });
                    ko.postbox.publish('validateForm');
                    expect(firstRow.isOpenContent()).toBeTruthy();
                });

            });
        });
    });
});

