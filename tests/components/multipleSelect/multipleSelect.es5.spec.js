define(['common/core/exceptions', 'common/networking/services', 'common/external/q', 'common/ko/bindingHandlers/multipleSelect/multipleSelect', 'common/ko/bindingHandlers/multipleSelect/fillList', 'common/ko/bindingHandlers/multipleSelect/selectItem', 'common/external/jquery-ui'], function (formExceptions, services, Q, multipleSelect, fillList, selectItem) {
    //eslint-disable-line

    describe('tlpMultipleSelect', function () {
        var selectItemObject;
        var fillListObject;
        var filterList = [];
        var updateArray = function updateArray(list) {
            filterList = list;
        };
        var input;
        var loadList = ko.observable(false);
        var selectList = ko.observableArray();
        var valueAccessor = ko.observable();
        var defaultBindListSettings = {
            settings: {
                tableName: 'PniyotAttachments',
                columnsNames: ['AttachCode', 'AttachText', 'AttachTooltip'],
                filters: [{ 'key': 'PniyaSubjectCode', 'value': '2' }]
            },
            functionName: 'getListWithFilters',
            value: loadList,
            listAccessor: selectList
        };
        var entityBaseList;
        var multipleSelectSettings;
        beforeEach(function () {
            ko.cleanNode(document.body);
            entityBaseList = [{ dataCode: '0', dataText: 'aaaab', visibleState: true }, { dataCode: '2', dataText: 'abcccd', visibleState: true }, { dataCode: '3', dataText: 'caddde', visibleState: true }, { dataCode: '4', dataText: 'effffg', visibleState: true }, { dataCode: '1', dataText: 'abbbc', visibleState: true }, { dataCode: '5', dataText: 'fggggh', visibleState: true }, { dataCode: '6', dataText: 'ghhhhj', visibleState: true }, { dataCode: '7', dataText: 'gjhhjj', visibleState: true }];
            jasmine.getFixtures().fixturesPath = 'base/Tests/components/multipleSelect/templates';
            loadFixtures('multipleSelect.html');
        });
        describe('params', function () {
            beforeEach(function () {
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
                    return deferred.promise;
                });
                multipleSelectSettings = {
                    mappingRules: { dataCode: 'Num_Sub_Subject', dataText: 'Sub_Subject' },
                    contains: true,
                    limit: 15,
                    filterMinlength: 2,
                    bindListSettings: defaultBindListSettings,
                    valueAccessor: valueAccessor,
                    viewSelectedValuesSpan: false
                };
            });
            it('call tlpMultipleSelect without bindListSettings will fail', function () {
                expect(function () {
                    loadList(false);
                    multipleSelectSettings.bindListSettings = { value: loadList };
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    multipleSelectSettings.bindListSettings.value(true);
                }).toThrow();
            });
            it('call tlpMultipleSelect without valueAccessor will fail', function () {
                expect(function () {
                    loadList(false);
                    multipleSelectSettings.valueAccessor = undefined;
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    multipleSelectSettings.bindListSettings.value(true);
                }).toThrow();
            });
            it('call tlpMultipleSelect without mappingRules will fail', function () {
                expect(function () {
                    loadList(false);
                    multipleSelectSettings.mappingRules = undefined;
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    multipleSelectSettings.bindListSettings.value(true);
                }).toThrow();
            });
            describe('contains option', function () {
                it('filll list with contains=true filter words contains the term too', function () {
                    multipleSelectSettings.contains = true;
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 4, multipleSelectSettings.contains, true);
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(4);
                });
                it('filll list with contains=false filter only words start with term', function () {
                    multipleSelectSettings.contains = false;
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 4, multipleSelectSettings.contains, true);
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(3);
                });
            });
            describe('view selcted values in span option', function () {
                beforeEach(function () {
                    services.webServiceListRequest = jasmine.createSpy().and.callFake(function () {
                        var deferred = Q.defer();
                        deferred.resolve([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
                        return deferred.promise;
                    });
                });
                it('init tlpMultipleSelect when viewSelectedValuesSpan is false- not add span element', function () {
                    multipleSelectSettings.bindListSettings.value(true);
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    var selectedValuesSpan = $('#multipleSelect').closest('.row').find('.selected-values-span');
                    expect(selectedValuesSpan.length).toEqual(0);
                });
                it('init tlpMultipleSelect when viewSelectedValuesSpan is true-  add span element', function (done) {
                    multipleSelectSettings.viewSelectedValuesSpan = true;
                    multipleSelectSettings.bindListSettings.value(true);
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    var delay = 600;
                    setTimeout(function () {
                        var selectedValuesSpan = $('#multipleSelect').closest('.row').find('.selected-values-span');
                        expect(selectedValuesSpan.length).toEqual(1);
                        done();
                    }, delay);
                });
                xit('span element update when select value', function (done) {
                    multipleSelectSettings.viewSelectedValuesSpan = true;
                    multipleSelectSettings.bindListSettings.value(true);
                    ko.applyBindings({ multipleSelectSettings: multipleSelectSettings });
                    var delay = 600;
                    //selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                    setTimeout(function () {
                        $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'aaaab' } });
                        var selectedValuesSpan = $('#multipleSelect').closest('.row').find('.selected-values-span');

                        expect($(selectedValuesSpan).val()).toEqual('aaaab, ');
                        done();
                    }, delay);
                });
            });
        });
        describe('select item behavior', function () {
            beforeEach(function () {
                selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
            });

            it('select value will insert it to element with comma and space', function () {
                selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                expect($('#multipleSelect').val()).toEqual('aaaab, ');
            });
            it('select value will remove it from list- in order to avoid duplicate selects', function () {
                selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                expect(entityBaseList[0].visibleState).toEqual(false);
            });
            describe('select value when cursor in middle of input. ', function () {
                beforeEach(function () {
                    selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                    selectItemObject.selectvalueFromList('abcccd', entityBaseList);
                    input = document.getElementById('multipleSelect');
                });
                it('cursor in start of input -  will insert new value as first value', function () {
                    input.selectionStart = 7;

                    selectItemObject.selectvalueFromList('caddde', entityBaseList);
                    expect($('#multipleSelect').val()).toEqual('caddde, abcccd, aaaab, ');
                });
            });
        });
        describe('remove item behavior ', function () {
            beforeEach(function () {
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
                    return deferred.promise;
                });
                selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                selectItemObject.selectvalueFromList('abcccd', entityBaseList);
                selectItemObject.selectvalueFromList('caddde', entityBaseList);
                //input = document.getElementById('multipleSelect');
            });
            describe('on keydown event with delete or backspace', function () {
                it('the field value not change (only impacts results list) ', function () {
                    $('#multipleSelect').val('ca, abcccd, aaaab, ');
                    selectItemObject.removeUnvalidValues(false, entityBaseList);
                    expect($('#multipleSelect').val()).toEqual('ca, abcccd, aaaab, ');
                });
                it('unselect value will insert it back to list', function () {
                    expect(entityBaseList[2].visibleState).toEqual(false);
                    $('#multipleSelect').val('ca, abcccd, aaaab');
                    selectItemObject.removeUnvalidValues(false, entityBaseList);
                    expect(entityBaseList[2].visibleState).toEqual(true);
                });
            });
            describe('on blur event', function () {
                it('the field value will update with valid values only ', function () {
                    $('#multipleSelect').val('aaaab, ca, abcccd, fff');
                    selectItemObject.removeUnvalidValues(true, entityBaseList);
                    expect($('#multipleSelect').val()).toEqual('aaaab, abcccd, ');
                });
                it('unselect value will insert it back to list', function () {
                    expect(entityBaseList[2].visibleState).toEqual(false);
                    $('#multipleSelect').val('aaaab, ca, abcccd, fff');
                    selectItemObject.removeUnvalidValues(true, entityBaseList);
                    expect(entityBaseList[2].visibleState).toEqual(true);
                });
            });
        });
        describe('filll source list behavior ', function () {
            beforeEach(function () {
                fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 10, false, true);
                selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                input = document.getElementById('multipleSelect');
            });
            describe('fill list rase by search', function () {
                it('filll list by term in last of input', function () {
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(3);
                    expect(filterList[0].value).toEqual(entityBaseList[0].dataText);
                    expect(filterList[1].value).toEqual(entityBaseList[1].dataText);
                    expect(filterList[2].value).toEqual(entityBaseList[4].dataText);
                });
                it('filll list by term in middle of input - will bring results by term until comma', function () {
                    $('#multipleSelect').val('aaaab, abcccd');
                    input.selectionStart = 3;

                    fillListObject.loadListByFilter({ term: 'aaaa, abcccd' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(1);
                    expect(filterList[0].value).toEqual(entityBaseList[0].dataText);
                });
                it('list filled by term not include selected values', function () {
                    selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(2);
                    expect(filterList[0].value).toEqual(entityBaseList[1].dataText);
                });
            });
        });
    });
});