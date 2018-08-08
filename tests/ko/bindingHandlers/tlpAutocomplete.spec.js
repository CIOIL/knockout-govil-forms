define(['common/core/exceptions',
        'common/networking/services',
        'common/external/q',
        'common/ko/bindingHandlers/multipleSelect/fillList',
        'common/entities/entityBase',
        'common/external/jquery-ui',
        'common/ko/bindingHandlers/tlpAutocomplete'
], function (formExceptions, services, Q, fillList, entities) {//eslint-disable-line

    describe('tlpAutocomplete', function () {
        var valueAccessor = new entities.ObservableEntityBase({ key: '', value: '' });
        var requestDeffer = Q.defer().promise;
        const listAccessor = ko.observableArray([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
        var autocompleteSettings;
        var mapSelectedValueFunction = function (element, mappedList, settings) {
            settings.value($(element).val());
        };
        var autocompleteSettingsWithDataType = {
            dataType: 'customDataType',
            mapSelectedValueFunction: mapSelectedValueFunction,
            contains: true,
            limit: 15,
            filterMinlength: 0,
            mappingObject: { dataCode: 'code', dataText: 'name' },
            listAccessor: ko.observableArray([{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }]),
            value: ko.observable()
        };
        beforeEach(function () {
            ko.cleanNode(document.body);
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpAutocomplete.html');
        });
        describe('params', function () {
            beforeEach(function () {
                autocompleteSettings = {
                    mappingObject: { dataCode: 'Num_Sub_Subject', dataText: 'Sub_Subject' },
                    contains: true,
                    limit: 15,
                    filterMinlength: 2,
                    value: valueAccessor,
                    listAccessor: listAccessor
                };
            });
            describe('required params', function () {

                it('mappingObject - call tlpAutocomplete without mappingObject will fail', function () {
                    expect(function () {
                        autocompleteSettings.mappingObject = undefined;
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
                it('no pass value will fail', function () {
                    expect(function () {
                        autocompleteSettings.value = undefined;
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
                it('no pass listAccessor will fail', function () {
                    expect(function () {
                        autocompleteSettings.listAccessor = undefined;
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
            });

            it('no dataType - value type must be entityBase', function () {
                expect(function () {
                    autocompleteSettings.value = { dataCode: 'a', dataText: 'b' };
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                }).toThrow();
            });
            it('dataType - value should not be entityBase', function () {
                expect(function () {
                    autocompleteSettings.dataType = 'notEntityBase';
                    autocompleteSettings.mapSelectedValueFunction = mapSelectedValueFunction;
                    autocompleteSettings.value = ko.observable();
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                }).not.toThrow();
            });

            it('custom dataType without mapSelectedValueFunction will fail', function () {
                expect(function () {
                    autocompleteSettings.dataType = 'object';
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                }).toThrow();
            });
            it('widgetClass parameter - will add its value to widget element', function () {
                autocompleteSettings.widgetClass = 'wide-loopkup';
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                expect(function () {
                    $('#multipleSelect').autocomplete('widget').hasClass('wide-loopkup');
                }).toBeTruthy();
            });
            it('bindOnArrow attr binding', function (done) {
                var a = ko.observable('8');
                autocompleteSettings.bindOnArrow = { attr: { customAttr: a } };
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                var delay = 500;
                setTimeout(function () {
                    expect($('#multipleSelect').parent().find('.autocomplete-arrow').attr('customAttr')).toEqual('8');
                    done();
                }, delay);
            });
            it('bindOnArrow visible', function () {
                var isVisible = ko.observable(false);
                autocompleteSettings.bindOnArrow = { visible: isVisible };
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                expect($('#multipleSelect').parent().find('.autocomplete-arrow').is(':visible')).toBeFalsy();
            });
            it('bindOnArrow disabled when input is disabled', function () {
                $('#multipleSelect').attr('disabled', true);
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                expect($('#multipleSelect').parent().find('.autocomplete-arrow').is(':disabled')).toBeTruthy();
            });
        });
        describe('select item behavior - ', function () {
            var autocompleteSettingsWithDataType1;

            beforeEach(function () {
                ko.cleanNode(document.body);
                autocompleteSettings = {
                    contains: true,
                    limit: 15,
                    filterMinlength: 0,
                    mappingObject: { dataCode: 'code', dataText: 'name' },
                    listAccessor: ko.observableArray([{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }]),
                    value: valueAccessor,
                    viewSelectedValuesSpan: false
                };
                autocompleteSettingsWithDataType1 = autocompleteSettingsWithDataType;
            });
            it('call tlpAutocomplete with custom dataType - mapSelectedValueFunction will call', function () {
                ko.applyBindings({ autocompleteSettings: autocompleteSettingsWithDataType1 });
                $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'yael' } });
                expect(autocompleteSettingsWithDataType1.value()).toEqual('yael');

            });
            it('select value without custom dataType - will update valueAccessor as observableEntityBase', function () {
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'yael' } });
                expect($('#multipleSelect').val()).toEqual('yael');
                expect(autocompleteSettings.value.dataCode()).toEqual('0');
                expect(autocompleteSettings.value.dataText()).toEqual('yael');
            });
            it('select empty value  - dataCode is updating as undefined', function () {
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: '' } });
                expect(autocompleteSettings.value.dataCode()).toEqual('-1');
                expect(autocompleteSettings.value.dataText()).toEqual('');
            });
            it('select value will insert it to element', function () {
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'yael' } });
                expect($('#multipleSelect').val()).toEqual('yael');


            });
        });
        describe('handle insert values not in list - ', function () {
            describe('avaliableValuesNotInList parameter is true', function () {
                beforeEach(function () {
                    autocompleteSettings = {
                        contains: true,
                        limit: 15,
                        filterMinlength: 0,
                        mappingObject: { dataCode: 'code', dataText: 'name' },
                        listAccessor: ko.observableArray([{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }]),
                        value: valueAccessor
                    };
                    autocompleteSettings.avaliableValuesNotInList = true;
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                });
                it('input value not remove in blur', function () {
                    $('#multipleSelect').val('aaaab, abcdefghi,');
                    $('#multipleSelect').blur();
                    expect($('#multipleSelect').val()).toEqual('aaaab, abcdefghi,');


                });
                it('value observable is update as entityBase with -1 code', function () {
                    $('#multipleSelect').val('aaaab, abcdefghi,');
                    $('#multipleSelect').blur();
                    expect(autocompleteSettings.value.dataText()).toEqual('aaaab, abcdefghi,');
                    expect(autocompleteSettings.value.dataCode()).toEqual('-11');

                });
            });
            describe('avaliableValuesNotInList parameter is true and  exist notInListDataCode parameter ', function () {
                beforeEach(function () {
                    autocompleteSettings = {
                        contains: true,
                        limit: 15,
                        filterMinlength: 0,
                        mappingObject: { dataCode: 'code', dataText: 'name' },
                        listAccessor: ko.observableArray([{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }]),
                        value: valueAccessor,
                        notInListDataCode: 'notInList'
                    };
                    autocompleteSettings.avaliableValuesNotInList = true;
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                });
                it('value observable is update as entityBase with notInListDataCode value', function () {
                    $('#multipleSelect').val('aaaab, abcdefghi,');
                    $('#multipleSelect').blur();
                    expect(autocompleteSettings.value.dataText()).toEqual('aaaab, abcdefghi,');
                    expect(autocompleteSettings.value.dataCode()).toEqual('notInList');


                });
            });

            describe('avaliableValuesNotInList parameter is false', function () {
                beforeEach(function () {
                    autocompleteSettings.avaliableValuesNotInList = false;
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                });
                it('insert not exist value will empty field', function () {
                    $('#multipleSelect').val('aaaab, abcdefghi,');
                    $('#multipleSelect').blur();
                    expect($('#multipleSelect').val()).toEqual('');
                });
                it('insert value from list wont empty field', function () {
                    $('#multipleSelect').val('yael');
                    $('#multipleSelect').blur();
                    expect($('#multipleSelect').val()).toEqual('yael');
                });
            });

        });
        describe('map autocomplete list behavior', function () {
            describe('map list as entityBase', function () {
                beforeEach(function () {
                    autocompleteSettings = {
                        contains: true,
                        limit: 15,
                        filterMinlength: 0,
                        mappingObject: { dataCode: 'code', dataText: 'name' },
                        listAccessor: ko.observableArray([{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }]),
                        value: valueAccessor
                    };
                    autocompleteSettings.avaliableValuesNotInList = true;
                });
                it('when no results return from server - data code is undefined', function () {
                    autocompleteSettings.listAccessor = [{ name: 'אין נתונים', code: '' }];
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    expect(autocompleteSettings.listAccessor[0].dataCode).toEqual(undefined);

                });
                it('listAccessor records format as object with dataCode and dataText', function () {
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    expect(autocompleteSettings.listAccessor()[0].name).toEqual('yael');
                    expect(autocompleteSettings.listAccessor()[0].code).toEqual('0');


                });
                xit('throw error when records format not equal mappingObject format', function (done) {
                    requestDeffer.then(function () {
                        done();
                    }).catch(function (ex) {
                        expect(ex.message).toEqual('exist recoeds in the list that not include the required code or text columns');
                        done();
                    });
                });
            });
        });
    });

});
