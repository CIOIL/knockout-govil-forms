define(['common/dataServices/listProvider', 'common/entities/entityBase', 'common/external/q', 'common/ko/bindingHandlers/autocompleteBindList', 'common/external/jquery-ui'], function (listProvider, entityBase, Q) {

    describe('autocompleteBindList - ', function () {
        var listAccessor = ko.observableArray();
        var selectedValue = new entityBase.ObservableEntityBase({ key: '', value: '' });
        var filterValue = ko.observable('');
        var vm = {
            selectedValue: selectedValue,
            autocompleteSettings: {}
        };
        var htmlElement;

        var htmlStr = ' <div class=\'row \'>\n                            <div class=\'col-md-4 autocomplete-container\'>\n                                <div>\n                                    <label for=\'lookupAutocomplete4\'>autocomplete- \u05D4\u05DB\u05E0\u05E1\u05EA \u05E2\u05E8\u05DA  \u05DE\u05D4\u05E8\u05E9\u05D9\u05DE\u05D4 \u05D1\u05DC\u05D1\u05D3</label>\n                                    <input id=\'lookupAutocomplete4\' class =\'autocomplete-field tfsInputText\' tfsdata data-bind=\'value: selectedValue.dataText, autocompleteBindList: autocompleteSettings\' />\n                                </div>\n                            </div>\n                        </div>';
        beforeEach(function () {
            spyOn(listProvider, 'getEntityBase').and.callFake(function () {
                var deferred = Q.defer();
                deferred.resolve([{ 'dataText': 'משטרת ישראל', 'dataCode': '0' }, { 'dataCode': '1', 'dataText': ' 1משטרת ישראל' }]);
                return deferred.promise;
            });
            vm.autocompleteSettings = {
                autocompleteParams: {
                    listAccessor: listAccessor,
                    contains: true,
                    limit: 15,
                    filterMinlength: 0,
                    mappingObject: { dataCode: 'dataCode', dataText: 'dataText' },
                    value: selectedValue
                },
                listParams: {
                    filters: [{ key: 'test7', value: filterValue }],
                    listName: 'testList',
                    dataTextColumn: 'test2',
                    dataCodeColumn: 'test7'
                }
            };
            htmlElement = $(htmlStr);
        });

        it('autocompleteBindList is defined', function () {
            expect(ko.bindingHandlers.autocompleteBindList).toBeDefined();
        });
        describe('required params', function () {
            it('missing listParams parameter - throw error', function () {
                vm.autocompleteSettings.listParams = undefined;
                expect(function () {
                    ko.applyBindings(vm, htmlElement[0]);
                }).toThrow();
            });
            it('missing autocompleteParams parameter - throw error', function () {
                vm.autocompleteSettings.autocompleteParams = undefined;
                expect(function () {
                    ko.applyBindings(vm, htmlElement[0]);
                }).toThrow();
            });
        });
        describe('listParams settings - ', function () {
            describe('filters - ', function () {
                it('exist filters with empty values - not call server', function () {
                    ko.applyBindings(vm, htmlElement[0]);
                    expect(listProvider.getEntityBase).not.toHaveBeenCalled();
                });
                it('exist filters with empty values - empty listAccessor', function () {
                    vm.autocompleteSettings.autocompleteParams.listAccessor([{ dataCode: 'a', dataText: 'b' }]);
                    ko.applyBindings(vm, htmlElement[0]);
                    expect(vm.autocompleteSettings.autocompleteParams.listAccessor()).toEqual([]);
                });
                it('not exist filters - should call server', function () {
                    vm.autocompleteSettings.listParams.filters = undefined;
                    ko.applyBindings(vm, htmlElement[0]);
                    expect(listProvider.getEntityBase).toHaveBeenCalled();
                });
                it('exist filters - change filter cause listProvider.getEntityBase to call', function () {
                    ko.applyBindings(vm, htmlElement[0]);
                    expect(listProvider.getEntityBase).not.toHaveBeenCalled();
                    filterValue('ש');
                    expect(listProvider.getEntityBase).toHaveBeenCalled();
                });
            });
            describe('condition - ', function () {
                it('exist condition with no value - not call server', function () {
                    vm.autocompleteSettings.listParams.condition = ko.observable();
                    ko.applyBindings(vm, htmlElement[0]);
                    expect(listProvider.getEntityBase).not.toHaveBeenCalled();
                });
                it('exist condition with value - should call server', function () {
                    vm.autocompleteSettings.listParams.condition = ko.observable(true);
                    ko.applyBindings(vm, htmlElement[0]);
                    expect(listProvider.getEntityBase).toHaveBeenCalled();
                });
            });
            describe('otherOption - ', function () {
                xit('exist otherOption -  add it to list', function (done) {
                    var vm1 = {
                        selectedValue: selectedValue,
                        autocompleteSettings: {
                            autocompleteParams: {
                                listAccessor: ko.observableArray(),
                                contains: true,
                                limit: 15,
                                filterMinlength: 0,
                                mappingObject: { dataCode: 'dataCode', dataText: 'dataText' },
                                value: selectedValue
                            },
                            listParams: {
                                otherOption: { dataCode: 'other', dataText: 'other' },
                                listName: 'testList',
                                dataTextColumn: 'test2',
                                dataCodeColumn: 'test7'
                            }
                        }
                    };
                    var delay = 1000;
                    ko.applyBindings(vm1, htmlElement[0]);
                    setTimeout(function () {
                        expect(vm1.autocompleteSettings.autocompleteParams.listAccessor()[2].dataCode).toEqual('other');
                        expect(vm1.autocompleteSettings.autocompleteParams.listAccessor()[2].dataText).toEqual('other');
                        done();
                    }, delay);
                });
            });
        });
    });
});