var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/utilities/stringExtension', 'common/utilities/resourceFetcher', 'common/ko/fn/config', 'common/events/userEventHandler', 'common/elements/dynamicTable', 'common/resources/messageSeverity', 'common/infrastructureFacade/tfsMethods', 'common/core/exceptions', 'common/resources/exeptionMessages'], function ( //eslint-disable-line max-params
stringExtension, resourceFetcher, config, userEventHandler, dynamicTable, messageSeverity, tfsMethods, exceptions, exeptionMessages) {

    describe('Dynamic table', function () {

        var Person = function Person(params) {
            var self = this;
            self.settings = params;
            self.firstName = ko.observable('');
            self.lastName = params || ko.observable('');
            self.dates = ko.observableArray([new Date()]);
        };

        var EventsModel = function EventsModel() {
            var self = this;
            self.eventName = ko.observable('');
            self.contacts = ko.observableArray([new Person()]).config({ type: Person });
        };

        var viewModel, subscriber, title;
        var delay = 500;
        var severity = messageSeverity.information;

        beforeAll(function () {
            title = resourceFetcher.get(dynamicTable.texts.titles).usageError;
        });
        beforeEach(function () {
            ko.postbox.unsubscribeFrom('userBeforeAddTableRow');
            viewModel = {
                contactsList: ko.observableArray([new Person()]).config({ type: Person }),
                events: ko.observableArray([new EventsModel()]).config({ type: EventsModel })
            };
            jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
            loadFixtures('dynamicTable.html');
            ko.applyBindings(viewModel, document.getElementById('jasmine-fixtures'));
            spyOn(tfsMethods.dialog, 'alert');
            if (subscriber) {
                subscriber.dispose();
            }
        });

        afterEach(function () {
            ko.cleanNode(document.getElementById('jasmine-fixtures'));
        });

        it('should include the addRow binding handler', function () {
            expect(ko.bindingHandlers.addRow).toBeDefined();
        });

        it('should include the removeRow binding handler', function () {
            expect(ko.bindingHandlers.removeRow).toBeDefined();
        });

        it('should include texts resources', function () {
            expect(_typeof(dynamicTable.texts)).toEqual('object');
        });

        it('should include events names', function () {
            expect(_typeof(dynamicTable.events)).toEqual('object');
        });

        describe('events', function () {

            it('add row is canceled by the subscriber so row is not added', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeAddTableRow', function (data) {
                    expect(data.publishedData.table).toEqual(viewModel.contactsList);
                    expect(data.deferred).toBeDefined();
                    data.deferred.reject();

                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(1);
                        done();
                    }, delay);
                });

                $('#addRow').click();
            });

            it('add row is approved by the subscriber', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeAddTableRow', function (data) {
                    expect(data.publishedData.table).toEqual(viewModel.contactsList);
                    expect(data.deferred).toBeDefined();
                    data.deferred.resolve();

                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(2);
                        done();
                    }, delay);
                });

                $('#addRow').click();
            });

            it('subscriber is notified after row is added', function (done) {
                subscriber = ko.postbox.subscribe('userAfterAddTableRow', function (data) {
                    expect(data.table).toEqual(viewModel.contactsList);
                    expect(viewModel.contactsList().length).toBe(2);
                    done();
                });
                $('#addRow').click();
            });

            it('remove row is canceled by the subscriber so row is not removed', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeRemoveTableRow', function (data) {
                    expect(data.publishedData.table).toEqual(viewModel.contactsList);
                    expect(data.deferred).toBeDefined();
                    data.deferred.reject();

                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(2);
                        done();
                    }, delay);
                });

                $('#addRow').click();
                $('#dellRow').click();
            });

            it('remove row is approved  by the subscriber so row is removed', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeRemoveTableRow', function (data) {
                    expect(data.publishedData.table).toEqual(viewModel.contactsList);
                    expect(data.deferred).toBeDefined();
                    data.deferred.resolve();

                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(1);
                        done();
                    }, delay);
                });

                $('#addRow').click();
                $('#dellRow').click();
            });

            it('subscriber is notified after row is removed', function (done) {
                subscriber = ko.postbox.subscribe('userAfterRemoveTableRow', function (data) {
                    expect(data.table).toEqual(viewModel.contactsList);
                    expect(viewModel.contactsList().length).toBe(1);
                    done();
                });
                $('#addRow').click();
                $('#dellRow').click();
            });
        });

        //addRow: contactsList, tableModel: 'person', maxRows: 3 args: { index: 1234, test: 456 }
        describe('add row', function () {

            it('not to throw when model is defined', function () {
                viewModel.contactsList().config = { type: Person };

                expect(function () {
                    ko.bindingHandlers.addRow.init($('#addRow')[0], viewModel.contactsList, function () {
                        return {};
                    });
                }).not.toThrow();
            });

            it('throw when model is not defined', function () {
                delete viewModel.contactsList.config;
                expect(function () {
                    ko.bindingHandlers.addRow.init($('#addRow')[0], viewModel.contactsList, function () {
                        return {};
                    });
                }).toThrowError(exceptions.FormError);
                viewModel.contactsList().config = { type: Person };
            });

            it('uppon button clicks', function (done) {
                for (var i = 0; i < 3; i++) {
                    $('#addRow').click();
                }

                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(4);
                    done();
                }, delay);
            });

            it('uppon button click in internal dynamic table', function (done) {
                $('#addRowEvents').click();
                $('#internalAddRowContacts').click();

                setTimeout(function () {
                    expect(viewModel.events().length).toBe(2);
                    expect(viewModel.events()[0].contacts().length).toBe(2);
                    done();
                }, delay);
            });

            it('is avoided when max rows are reached', function (done) {
                for (var i = 0; i < 6; i++) {
                    $('#addRowMax').click();
                }

                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(3);
                    done();
                }, delay);
            });

            it('show message when max rows are reached', function (done) {
                for (var i = 0; i < 6; i++) {
                    $('#addRowMax').click();
                }

                setTimeout(function () {
                    var message = stringExtension.format(resourceFetcher.get(dynamicTable.texts.messages).maxRows, 3);
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title, severity);
                    done();
                }, delay);
            });

            describe('max rows', function () {
                it('when max rows are reached a message is showed', function (done) {
                    for (var i = 0; i < 6; i++) {
                        $('#addRowMax').click();
                    }

                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(3);
                        done();
                    }, delay);
                });

                it('is avoided when max rows in internal dynamic table are reached', function (done) {

                    $('#addRowEvents').click();
                    for (var i = 0; i < 6; i++) {
                        $('#internalAddRowContactsMax').click();
                    }

                    setTimeout(function () {
                        expect(viewModel.events().length).toBe(2);
                        expect(viewModel.events()[0].contacts().length).toBe(3);
                        done();
                    }, delay);
                });

                it('max rows from config can be observable/computed', function (done) {
                    viewModel.contactsList = ko.observableArray([new Person()]).config({ type: Person, maxRows: ko.computed(function () {
                            return 2;
                        }) });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    for (var i = 0; i < 3; i++) {
                        $('#addRowMax').click();
                    }
                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(2);
                        done();
                    }, delay);
                });

                it('max rows from config unwraped on click time', function (done) {
                    var maxRows = ko.observable(0);
                    viewModel.contactsList = ko.observableArray([new Person()]).config({ type: Person, maxRows: maxRows });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    for (var i = 0; i < 3; i++) {
                        maxRows(i + 1);
                        $('#addRowMax').click();
                    }
                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(3);
                        done();
                    }, delay);
                });

                it('max rows from config is strongger than in the allBindings - regular dynamicTable', function (done) {
                    viewModel.contactsList = ko.observableArray([new Person()]).config({ type: Person, maxRows: 2 });
                    var addRowBind = { addRow: viewModel.contactsList, maxRows: 3, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    for (var i = 0; i < 3; i++) {
                        $('#addRowMax').click();
                    }
                    setTimeout(function () {
                        expect(viewModel.contactsList().length).toBe(2);
                        done();
                    }, delay);
                });

                it('max rows from config is strongger than in the allBindings - internal dynamicTable', function (done) {

                    var EventsModel = function EventsModel() {
                        var self = this;
                        self.eventName = ko.observable('');
                        self.contacts = ko.observableArray([new Person()]).config({ type: Person, maxRows: 2 });
                    };

                    viewModel.events = ko.observableArray([new EventsModel()]).config({ type: EventsModel });
                    var addRowBind = { addRow: viewModel.events };
                    ko.applyBindingsToNode($('#addRowEvents').get(0), addRowBind);
                    var innerAddRowBind = { addRow: viewModel.events()[0].contacts, maxRows: 3, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#internalAddRowContactsMax').get(0), innerAddRowBind);
                    $('#addRowEvents').click();
                    for (var i = 0; i < 3; i++) {
                        $('#internalAddRowContactsMax').click();
                    }

                    setTimeout(function () {
                        expect(viewModel.events().length).toBe(2);
                        expect(viewModel.events()[0].contacts().length).toBe(2);
                        done();
                    }, delay);
                });
            });

            describe('params', function () {

                it('params passed to constructor of the new row item', function (done) {
                    var maxRows = 4;
                    viewModel.contactsList = ko.observableArray().config({ type: Person, maxRows: maxRows, params: { firstName: 'Eddie' } });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    $('#addRowMax').click();
                    setTimeout(function () {
                        expect(viewModel.contactsList()[0].settings).toEqual({ firstName: 'Eddie' });
                        done();
                    }, delay);
                });
                it('params taken from config if defined', function (done) {
                    var maxRows = 4;
                    viewModel.contactsList = ko.observableArray().config({ type: Person, maxRows: maxRows, params: { firstName: 'Eddie' } });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    $('#addRowMax').click();
                    setTimeout(function () {
                        expect(viewModel.contactsList()[0].settings).toEqual({ firstName: 'Eddie' });
                        done();
                    }, delay);
                });
                it('params taken from allBindings if not defined in config', function (done) {
                    var maxRows = 4;
                    viewModel.contactsList = ko.observableArray().config({ type: Person, maxRows: maxRows });
                    var addRowBind = { addRow: viewModel.contactsList, params: { firstName: 'Joshua' }, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    $('#addRowMax').click();
                    setTimeout(function () {
                        expect(viewModel.contactsList()[0].settings).toEqual({ firstName: 'Joshua' });
                        done();
                    }, delay);
                });
                it('empty object set to params if not defined', function (done) {
                    var maxRows = 4;
                    viewModel.contactsList = ko.observableArray().config({ type: Person, maxRows: maxRows });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    $('#addRowMax').click();
                    setTimeout(function () {
                        expect(viewModel.contactsList()[0].settings).toEqual({});
                        done();
                    }, delay);
                });
                it('falsy parameter passed', function (done) {
                    var maxRows = 4;
                    viewModel.contactsList = ko.observableArray().config({ type: Person, maxRows: maxRows, params: false });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    $('#addRowMax').click();
                    setTimeout(function () {
                        expect(viewModel.contactsList()[0].settings).toEqual(false);
                        done();
                    }, delay);
                });
                it('params unwrapped if subscribable', function (done) {
                    var maxRows = 4;
                    viewModel.contactsList = ko.observableArray().config({ type: Person, maxRows: maxRows, params: ko.observable('Kate') });
                    var addRowBind = { addRow: viewModel.contactsList, args: { index: 1234, test: 456 } };
                    ko.applyBindingsToNode($('#addRowMax').get(0), addRowBind);
                    $('#addRowMax').click();
                    setTimeout(function () {
                        expect(_typeof(viewModel.contactsList()[0].settings)).toEqual('function');
                        done();
                    }, delay);
                });
            });
        });

        describe('remove row', function () {
            it('uppon click', function (done) {

                $('#addRow').click();
                $('#addRow').click();
                $('#dellRow').click();

                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(2);
                    done();
                }, delay);
            });

            it('uppon click in internal dynamic table', function (done) {
                $('#addRowEvents').click();
                $('#internalAddRowContacts').click();
                $('#internalAddRowContacts').click();
                $('#internalDellRow').click();

                setTimeout(function () {
                    expect(viewModel.events()[0].contacts().length).toBe(2);
                    done();
                }, delay);
            });

            it('always keep one row', function (done) {

                $('#addRow').click();
                $('#dellRow').click();
                $('#dellRow').click();
                $('#dellRow').click();

                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(1);
                    done();
                }, delay);
            });

            it('show message when trying to delete last row', function (done) {

                $('#addRow').click();
                $('#dellRow').click();
                $('#dellRow').click();
                $('#dellRow').click();

                setTimeout(function () {
                    var message = resourceFetcher.get(dynamicTable.texts.messages).atLeastOneRow;
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title, severity);
                    done();
                }, delay);
            });

            it('always keep one row in internal dynamic table', function (done) {

                $('#addRowEvents').click();
                $('#internalAddRowContacts').click();
                $('#internalDellRow').click();
                $('#internalDellRow').click();
                $('#internalDellRow').click();

                setTimeout(function () {
                    expect(viewModel.events()[0].contacts().length).toBe(1);
                    done();
                }, delay);
            });

            it('send minimum rows by binding', function (done) {

                $('#addRow').click();
                $('#internalDellRowMin').click();
                $('#internalDellRowMin').click();
                $('#internalDellRowMin').click();
                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(2);
                    done();
                }, delay);
            });

            it('show message when violating minimal rows restrictin', function (done) {

                $('#addRow').click();
                $('#internalDellRowMin').click();
                $('#internalDellRowMin').click();
                $('#internalDellRowMin').click();

                setTimeout(function () {
                    var message = stringExtension.format(resourceFetcher.get(dynamicTable.texts.messages).atLeastMultipleRows, 2);
                    expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message, title, severity);
                    done();
                }, delay);
            });

            it('send minimum rows by binding - internal dynamic table', function (done) {

                $('#addRowEvents').click();
                $('#internalAddRowContacts').click();
                $('#internalAddRowContacts').click();
                $('#internalDellRowMin').click();
                $('#internalDellRowMin').click();
                $('#internalDellRowMin').click();

                setTimeout(function () {
                    expect(viewModel.events()[0].contacts().length).toBe(2);
                    done();
                }, delay);
            });
        });

        describe('clear', function () {
            beforeEach(function (done) {
                $('#addRow').click();
                $('#addRow').click();
                $('#addRowEvents').click();
                $('#addRowEvents').click();
                $('[id=internalAddRowContacts]')[0].click();
                $('[id=internalAddRowContacts]')[0].click();
                setTimeout(function () {
                    $('[id=internalAddRowContacts]')[1].click();
                    $('[id=internalAddRowContacts]')[1].click();
                    done();
                }, delay);
            });

            it('delete dynamic rows', function (done) {
                setTimeout(function () {
                    dynamicTable.clear();
                    expect($('#contacts >tbody >tr').length).toBe(1);
                    done();
                }, delay);
            });

            it('delete internal dynamic table rows', function (done) {
                setTimeout(function () {
                    dynamicTable.clear();
                    expect($('#internalContacts >tbody >tr').length).toBe(1);
                    done();
                }, delay);
            });

            it('delete dynamic in container', function (done) {
                setTimeout(function () {
                    dynamicTable.clear('#user');
                    expect($('#contacts >tbody >tr').length).toBe(1);
                    done();
                }, delay);
            });

            it('do not delete dynamic in other container', function (done) {
                setTimeout(function () {
                    dynamicTable.clear('#aaa');
                    expect($('#contacts >tbody >tr').length).toBe(3);
                    done();
                }, delay);
            });
        });

        describe('mapping', function () {

            it('should be defined', function () {
                expect(dynamicTable.createMappingRules).toEqual(jasmine.any(Function));
            });
            it('array param are mandatory', function () {
                expect(function () {
                    dynamicTable.createMappingRules();
                }).toThrowError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'array', 'observableArray'));
            });

            it('array param must vave a type on configuration of table', function () {
                var array = ko.observableArray();
                expect(function () {
                    dynamicTable.createMappingRules(array);
                }).toThrowError();
            });

            it('should return object ', function () {
                var array = ko.observableArray().config({ type: Person });
                var mapping = {
                    array: dynamicTable.createMappingRules(array)
                };
                expect(mapping.array).toEqual(jasmine.any(Object));
            });

            it('should return mapping rule for mapping array', function () {
                var array = ko.observableArray().config({ type: Person });
                var data = [{ firstName: 'אא', lastName: 'בב' }, { firstName: '', lastName: '' }];
                var mapping = dynamicTable.createMappingRules(array);
                ko.mapping.fromJS(data, mapping, array);
                expect(array().length).toEqual(data.length);
                expect(array()[0]).toEqual(jasmine.any(Person));
                expect(ko.mapping.toJSON(array)).toEqual(ko.toJSON(data));
            });
        });

        describe('remove row updates', function () {
            beforeEach(function () {
                ko.cleanNode(document.body);
                Person = function Person() {
                    var self = this;
                    self.firstName = ko.observable('');
                    self.lastName = ko.observable('');
                    self.dates = ko.observableArray([new Date(), new Date(), new Date()]).config({ type: Date, minRows: 2 });
                };
                viewModel = {
                    contactsList: ko.observableArray([new Person(), new Person(), new Person()]).config({ type: Person, minRows: 2 }),
                    events: ko.observableArray([new EventsModel()]).config({ type: EventsModel })
                };
                jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
                loadFixtures('dynamicTable.html');
                ko.applyBindings(viewModel);
            });

            afterEach(function () {
                ko.cleanNode(document.body);
            });
            it('min rows taken from config', function (done) {
                $('#removeRow').click();
                $('#removeRow').click();
                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(2);
                    done();
                }, delay);
            });
            it('min rows from config is strongger than in the allBindings - regular dynamicTable', function (done) {
                $('#removeRowMin').click();
                $('#removeRowMin').click();

                setTimeout(function () {
                    expect(viewModel.contactsList().length).toBe(2);
                    done();
                }, delay);
            });

            it('min rows from config is strongger than in the allBindings - internal dynamicTable', function (done) {
                $('#removeInternalRowMin').click();
                $('#removeInternalRowMin').click();

                setTimeout(function () {
                    expect(viewModel.contactsList()[0].dates().length).toBe(2);
                    done();
                }, delay);
            });
        });
    });
});