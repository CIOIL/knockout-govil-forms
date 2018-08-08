define(['common/dataServices/listProvider',
        'common/entities/entityBase',
        'common/external/q',
        'common/ko/bindingHandlers/autocompleteBindList',
         'common/external/jquery-ui'
],
function (listProvider, entityBase, Q) {

    describe('autocompleteBindList - ', function () {
        const listAccessor = ko.observableArray();
        const selectedValue = new entityBase.ObservableEntityBase({ key: '', value: '' });
        const filterValue = ko.observable('');
        const vm = {
            selectedValue: selectedValue,
            autocompleteSettings: {}
        };
        var htmlElement;
        
        const htmlStr = ` <div class='row '>
                            <div class='col-md-4 autocomplete-container'>
                                <div>
                                    <label for='lookupAutocomplete4'>autocomplete- הכנסת ערך  מהרשימה בלבד</label>
                                    <input id='lookupAutocomplete4' class ='autocomplete-field tfsInputText' tfsdata data-bind='value: selectedValue.dataText, autocompleteBindList: autocompleteSettings' />
                                </div>
                            </div>
                        </div>`;
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
                expect(function () { ko.applyBindings(vm, htmlElement[0]); }).toThrow();
            });
            it('missing autocompleteParams parameter - throw error', function () {
                vm.autocompleteSettings.autocompleteParams = undefined;
                expect(function () { ko.applyBindings(vm, htmlElement[0]); }).toThrow();
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
                    const vm1 = {
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
