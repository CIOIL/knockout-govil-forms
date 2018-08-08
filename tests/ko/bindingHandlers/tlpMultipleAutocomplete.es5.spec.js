define(['common/core/exceptions', 'common/networking/services', 'common/external/q', 'common/ko/bindingHandlers/multipleSelect/fillList', 'common/ko/bindingHandlers/multipleSelect/selectItem', 'common/entities/entityBase', 'common/utilities/multipleSelect', 'common/external/jquery-ui', 'common/ko/bindingHandlers/tlpMultipleAutocomplete'], function (formExceptions, services, Q, fillList, selectItem, entities, autocompleteUtils) {
    //eslint-disable-line

    describe('tlpMultipleAutocomplete', function () {

        var valueAccessor = ko.observable('');
        var requestDeffer = Q.defer().promise;

        var delay = 1000;
        var customCallback = function customCallback(deffer) {
            requestDeffer = deffer;
        };

        var listFromServiceSettings = {
            settings: {
                tableName: 'PniyotAttachments',
                columnsNames: ['AttachCode', 'AttachText', 'AttachTooltip'],
                filters: [{ 'key': 'PniyaSubjectCode', 'value': '2' }]
            },
            functionName: 'getListWithFilters',
            value: ko.observable(true),
            listAccessor: ko.observableArray()
        };
        var autocompleteSettings;

        var mapSelectedValueFunction = function mapSelectedValueFunction(element, mappedList, settings) {
            settings.value = ko.observable({ dataCode: '1', dataText: $(element).val() });
        };
        var autocompleteSettingsWithDataType = {
            listType: 'constList',
            dataType: 'customDataType',
            mapSelectedValueFunction: mapSelectedValueFunction,
            contains: true,
            limit: 15,
            filterMinlength: 0,
            mappingObject: { dataCode: 'code', dataText: 'name' },
            constListSettings: { listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }] },
            value: ko.observable(),
            viewSelectedValuesSpan: false,
            customCallback: customCallback
        };
        beforeEach(function () {
            spyOn(services, 'govServiceListRequest').and.callFake(function () {
                var deferred = Q.defer();
                deferred.resolve([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
                return deferred.promise;
            });

            ko.cleanNode(document.body);
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpMultipleAutocomplete.html');
        });
        describe('params', function () {
            beforeEach(function () {

                autocompleteSettings = {
                    mappingObject: { dataCode: 'Num_Sub_Subject', dataText: 'Sub_Subject' },
                    contains: true,
                    limit: 15,
                    filterMinlength: 2,
                    value: valueAccessor,
                    viewSelectedValuesSpan: false
                };
            });
            describe('required params', function () {
                it('list type - call tlpAutocomplete without listType will fail', function () {
                    expect(function () {
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
                it('listFromService - call tlpAutocomplete without listFromServiceSettings when listType is  listFromService will fail', function () {
                    expect(function () {
                        autocompleteSettings.listType = 'listFromService';
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
                it('constListSettings - call tlpAutocomplete without constListSettings when listType is  constList will fail', function () {
                    expect(function () {
                        autocompleteSettings.listType = 'constList';
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
                it('mappingObject - call tlpAutocomplete without mappingObject will fail', function () {
                    expect(function () {
                        autocompleteSettings.mappingObject = undefined;
                        autocompleteSettings.listType = 'listFromService';
                        autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
                it('no pass value will fail', function () {
                    expect(function () {
                        autocompleteSettings.value = undefined;
                        autocompleteSettings.listType = 'listFromService';
                        autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                        ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    }).toThrow();
                });
            });

            it('const list', function () {
                autocompleteSettings.listType = 'constList';
                autocompleteSettings.listFromServiceSettings = undefined;
                autocompleteSettings.mappingObject = { dataCode: 'code', dataText: 'name' };
                autocompleteSettings.constListSettings = { listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }] };

                expect(function () {
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                }).not.toThrow();
            });

            it('custom dataType without mapSelectedValueFunction will fail', function () {
                expect(function () {
                    autocompleteSettings.dataType = 'object';
                    autocompleteSettings.listFromServiceSettings.value(true);
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                }).toThrow();
            });
            it('widgetClass parameter - will add its value to widget element', function () {
                autocompleteSettings.listType = 'listFromService';
                autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                autocompleteSettings.widgetClass = 'wide-loopkup';
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                expect(function () {
                    $('#multipleSelect').autocomplete('widget').hasClass('wide-loopkup');
                }).toBeTruthy();
            });
            it('bindOnArrow attr binding', function (done) {
                var a = ko.observable('8');
                autocompleteSettings.listType = 'listFromService';
                autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                autocompleteSettings.bindOnArrow = { attr: { customAttr: a } };
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                var delay = 500;
                setTimeout(function () {
                    expect($('#multipleSelect').parent().find('.autocomplete-arrow').attr('customAttr')).toEqual('8');
                    done();
                }, delay);
            });
            it('bindOnArrow visible', function (done) {
                var isVisible = ko.observable(false);
                autocompleteSettings.listType = 'listFromService';
                autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                autocompleteSettings.bindOnArrow = { visible: isVisible };
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                setTimeout(function () {
                    expect($('#multipleSelect').parent().find('.autocomplete-arrow').is(':visible')).toBeFalsy();
                    done();
                }, delay);
            });
            it('viewSelectedValuesSpan is false- not add span element', function () {
                autocompleteSettings.listType = 'listFromService';
                autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                var selectedValuesSpan = $('#multipleSelect').closest('.row').find('.selected-values-span');
                expect(selectedValuesSpan.length).toEqual(0);
            });
            it('viewSelectedValuesSpan is true-  add span element', function (done) {
                autocompleteSettings.viewSelectedValuesSpan = true;
                autocompleteSettings.listType = 'listFromService';
                autocompleteSettings.listFromServiceSettings = listFromServiceSettings;
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                var delay = 600;
                setTimeout(function () {
                    var selectedValuesSpan = $('#multipleSelect').closest('.row').find('.selected-values-span');
                    expect(selectedValuesSpan.length).toEqual(1);
                    done();
                }, delay);
            });
        });
        describe('select item behavior - ', function () {
            var autocompleteSettingsWithDataType1;

            beforeEach(function () {
                spyOn(autocompleteUtils, 'openOptionsWindow').and.callFake(function () {
                    return true;
                });
                ko.cleanNode(document.body);
                autocompleteSettings = {
                    listType: 'constList',
                    contains: true,
                    limit: 15,
                    filterMinlength: 0,
                    mappingObject: { dataCode: 'code', dataText: 'name' },
                    constListSettings: { listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }] },
                    value: ko.observable(''),
                    viewSelectedValuesSpan: false,
                    customCallback: customCallback
                };
                autocompleteSettingsWithDataType1 = autocompleteSettingsWithDataType;
            });
            it('call tlpAutocomplete with custom dataType - mapSelectedValueFunction will call', function (done) {
                ko.applyBindings({ autocompleteSettings: autocompleteSettingsWithDataType1 });
                requestDeffer.then(function () {
                    $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'yael' } });
                    expect(autocompleteSettingsWithDataType1.value()).toEqual({ dataCode: '1', dataText: 'yael' });
                    done();
                }).catch(function () {
                    done();
                });
            });
            it('after select open  widget options', function (done) {
                ko.applyBindings({ autocompleteSettings: autocompleteSettingsWithDataType1 });
                requestDeffer.then(function () {
                    $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'yael' } });
                    expect(autocompleteUtils.openOptionsWindow).toHaveBeenCalled();
                    done();
                }).catch(function () {
                    done();
                });
            });

            it('select value without custom dataType - will update value observable as string with comma and space', function (done) {
                ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                requestDeffer.then(function () {
                    $('#multipleSelect').data('ui-autocomplete')._trigger('select', null, { item: { value: 'yael' } });
                    expect(autocompleteSettings.valueAccessor()).toEqual('yael, ');
                    done();
                }).catch(function () {
                    done();
                });
            });
        });
        describe('handle insert values not in list - ', function () {
            describe('avaliableValuesNotInList parameter is true', function () {
                beforeEach(function () {
                    spyOn(autocompleteUtils, 'openOptionsWindow').and.callFake(function () {
                        return true;
                    });
                    autocompleteSettings = {
                        listType: 'constList',
                        contains: true,
                        limit: 15,
                        filterMinlength: 0,
                        mappingObject: { dataCode: 'code', dataText: 'name' },
                        constListSettings: { listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }] },
                        value: ko.observable(),
                        viewSelectedValuesSpan: false,
                        customCallback: customCallback
                    };
                    autocompleteSettings.avaliableValuesNotInList = true;
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                });
                it('input value not remove in blur', function (done) {
                    requestDeffer.then(function () {
                        $('#multipleSelect').value('saasa, yael, ');
                        $('#multipleSelect').blur();
                        expect($('#multipleSelect').val()).toEqual('saasa, yael, ');
                        done();
                    }).catch(function () {
                        done();
                    });
                });
            });
            describe('avaliableValuesNotInList parameter is false', function () {
                beforeEach(function () {
                    autocompleteSettings = {
                        listType: 'constList',
                        contains: true,
                        limit: 15,
                        filterMinlength: 0,
                        mappingObject: { dataCode: 'code', dataText: 'name' },
                        constListSettings: { listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }] },
                        value: ko.observable(),
                        viewSelectedValuesSpan: false,
                        customCallback: customCallback
                    };
                    autocompleteSettings.avaliableValuesNotInList = false;
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                });
                it('insert not exist value will empty field', function (done) {
                    requestDeffer.then(function () {
                        $('#multipleSelect').value('yael, saasa');
                        $('#multipleSelect').blur();
                        expect($('#multipleSelect').val()).toEqual('yael, ');
                        done();
                    }).catch(function () {
                        done();
                    });
                });
            });
        });
        describe('map autocomplete list behavior', function () {
            describe('map list as entityBase', function () {
                beforeEach(function () {
                    autocompleteSettings = {
                        listType: 'constList',
                        contains: true,
                        limit: 15,
                        filterMinlength: 0,
                        mappingObject: { dataCode: 'code', dataText: 'name' },
                        constListSettings: { listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }] },
                        value: ko.observable(),
                        viewSelectedValuesSpan: false,
                        customCallback: customCallback
                    };
                    autocompleteSettings.avaliableValuesNotInList = true;
                });
                it('when no results return from server - data code is undefined', function (done) {
                    autocompleteSettings.constListSettings = { listAccessor: [{ name: 'אין נתונים', code: '' }] };
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    requestDeffer.then(function () {
                        expect(autocompleteSettings.constListSettings.listAccessor()[0].dataCode).toEqual(undefined);
                        done();
                    }).catch(function () {
                        done();
                    });
                });
                it('listAccessor records format as object with dataCode and dataText', function (done) {
                    ko.applyBindings({ autocompleteSettings: autocompleteSettings });
                    requestDeffer.then(function () {
                        expect(autocompleteSettings.constListSettings.listAccessor()[0].dataText()).toEqual('yael');
                        expect(autocompleteSettings.constListSettings.listAccessor()[0].dataCode()).toEqual('0');
                        done();
                    }).catch(function () {
                        done();
                    });
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