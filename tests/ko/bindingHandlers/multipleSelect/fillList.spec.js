define(['common/core/exceptions',
        'common/networking/services',
        'common/external/q',
        'common/ko/bindingHandlers/multipleSelect/multipleSelect',
        'common/ko/bindingHandlers/multipleSelect/fillList',
        'common/ko/bindingHandlers/multipleSelect/selectItem',
        'common/external/jquery-ui'
], function (formExceptions, services, Q, multipleSelect, fillList, selectItem) {//eslint-disable-line

    describe('fillList', function () {
        var selectItemObject;
        var fillListObject;
        var filterList = [];
        var updateArray = function (list) {
            filterList = list;
        };
        var input, withContains = false, withMultiple = true;
        var entityBaseList;
        beforeEach(function () {
            ko.cleanNode(document.body);
            entityBaseList = [
                        { dataCode: '0', dataText: 'aaaab', visibleState: true },
                        { dataCode: '2', dataText: 'abcccd', visibleState: true },
                        { dataCode: '3', dataText: 'caddde', visibleState: true },
                        { dataCode: '4', dataText: 'effffg', visibleState: true },
                        { dataCode: '1', dataText: 'abbbc', visibleState: true },
                        { dataCode: '5', dataText: 'fggggh', visibleState: true },
                        { dataCode: '6', dataText: 'ghhhhj', visibleState: true },
                        { dataCode: '7', dataText: 'gjhhjj', visibleState: true },
                        { dataCode: '8', dataText: 'caaaab', visibleState: true }
            ];
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/multipleSelect/templates';
            loadFixtures('fillList.html');
        });

        describe('filll source list behavior with multiple', function () {
           
            describe('fill list rase by search without contains', function () {
                beforeEach(function () {
                    fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 10, withContains, withMultiple);
                    selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                    input = document.getElementById('multipleSelect');
                });
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

            describe('fill list rase by search with contains', function () {
                beforeEach(function () {
                    withContains = true;
                    fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 10, withContains, withMultiple);
                    selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                    input = document.getElementById('multipleSelect');
                });
                it('filll list by term in last of input', function () {
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(5);
                    expect(filterList[0].value).toEqual(entityBaseList[0].dataText);
                    expect(filterList[1].value).toEqual(entityBaseList[1].dataText);
                    expect(filterList[2].value).toEqual(entityBaseList[2].dataText);
                    expect(filterList[3].value).toEqual(entityBaseList[4].dataText);
                    expect(filterList[4].value).toEqual(entityBaseList[8].dataText);

                });
                it('filll list by term in middle of input - will bring results by term until comma', function () {
                    $('#multipleSelect').val('aaaab, abcccd');
                    input.selectionStart = 3;
                    fillListObject.loadListByFilter({ term: 'aaaa, abcccd' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(2);
                    expect(filterList[0].value).toEqual(entityBaseList[0].dataText);
                    expect(filterList[1].value).toEqual(entityBaseList[8].dataText);
                });
                it('list filled by term not include selected values', function () {
                    selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                    input.selectionStart = 3;
                    fillListObject.loadListByFilter({ term: 'aaaa, abcccd' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(1);
                    expect(filterList[0].value).toEqual(entityBaseList[8].dataText);
                });
            });
        });
        describe('filll source list behavior without multiple', function () {
            
            describe('fill list rase by search without contains', function () {
                beforeEach(function () {
                    withMultiple = false;
                    withContains = false;
                    fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 10, withContains, withMultiple);
                    selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                    input = document.getElementById('multipleSelect');
                });
                it('filll list by term', function () {
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(3);
                    expect(filterList[0].value).toEqual(entityBaseList[0].dataText);
                    expect(filterList[1].value).toEqual(entityBaseList[1].dataText);
                    expect(filterList[2].value).toEqual(entityBaseList[4].dataText);
                });
                it('fill list always by term and not by input selectionStart', function () {
                    $('#multipleSelect').val('aaaab, abcccd');
                    input.selectionStart = 3;

                    fillListObject.loadListByFilter({ term: 'aaaa, abcccd' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(0);
                });
                it('list filled by term not include selected values', function () {
                    selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(2);
                    expect(filterList[0].value).toEqual(entityBaseList[1].dataText);
                });
            });

            describe('fill list rase by search with contains', function () {
                beforeEach(function () {
                    withContains = true;
                    fillListObject = fillList.initFillListBehavior($('#multipleSelect'), 10, withContains, withMultiple);
                    selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                    input = document.getElementById('multipleSelect');
                });
                it('filll list by term only', function () {
                    fillListObject.loadListByFilter({ term: 'a' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(5);
                    expect(filterList[0].value).toEqual(entityBaseList[0].dataText);
                    expect(filterList[1].value).toEqual(entityBaseList[1].dataText);
                    expect(filterList[2].value).toEqual(entityBaseList[2].dataText);
                    expect(filterList[3].value).toEqual(entityBaseList[4].dataText);
                    expect(filterList[4].value).toEqual(entityBaseList[8].dataText);

                });
              
                it('list filled by term not include selected values', function () {
                    selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                    fillListObject.loadListByFilter({ term: 'aaaa' }, updateArray, entityBaseList);
                    expect(filterList.length).toEqual(1);
                    expect(filterList[0].value).toEqual(entityBaseList[8].dataText);
                });
            });
        });
    });

});
