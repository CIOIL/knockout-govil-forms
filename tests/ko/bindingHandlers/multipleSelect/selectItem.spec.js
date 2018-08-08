define(['common/core/exceptions',
        'common/networking/services',
        'common/external/q',
        'common/ko/bindingHandlers/multipleSelect/multipleSelect',
        'common/ko/bindingHandlers/multipleSelect/fillList',
        'common/ko/bindingHandlers/multipleSelect/selectItem',
        'common/external/jquery-ui'
], function (formExceptions, services, Q, multipleSelect, fillList, selectItem) {//eslint-disable-line

    describe('tlpMultipleSelect', function () {
        var selectItemObject;
        var input;
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
                        { dataCode: '7', dataText: 'gjhhjj', visibleState: true }
            ];
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/multipleSelect/templates';
            loadFixtures('selectItem.html');
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
            it('select new item - insert it as first item', function () {
                selectItemObject.selectvalueFromList('caddde', entityBaseList);
                selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                expect($('#multipleSelect').val()).toEqual('aaaab, caddde, ');
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
        describe('select value that not exist in the list', function () {
            var delay = 1;
            beforeEach(function () {
                selectItemObject = selectItem.initSelectItemBehavior($('#multipleSelect'));
                input = document.getElementById('multipleSelect');
            });
            it('insert only new value', function () {
                input.value = 'yyggygygyg,';
                $('#multipleSelect').focus(function () {
                    setTimeout(function () {
                        input.selectionStart = 11;
                        selectItemObject.selectvalueFromList('', entityBaseList);
                        expect($('#multipleSelect').val()).toEqual('yyggygygyg, ');
                    }, delay);
                });
            });

            it('insert value in middle of input', function () {
                selectItemObject.selectvalueFromList('caddde', entityBaseList);
                selectItemObject.selectvalueFromList('aaaab', entityBaseList);
                expect($('#multipleSelect').val()).toEqual('aaaab, caddde, ');
                $('#multipleSelect').val('caddde, sdsd,aaaab, ');
                $('#multipleSelect').focus(function () {
                    setTimeout(function () {
                        input.selectionStart = 13;
                        selectItemObject.selectvalueFromList('', entityBaseList);
                        expect($('#multipleSelect').val()).toEqual('sdsd, aaaab, caddde, ');
                    }, delay);
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

    });

});
