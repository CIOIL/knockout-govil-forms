/// <reference path='../../lib/jasmine-2.0.0/boot.js' />
/// <reference path='../../lib/jasmine-2.0.0/jasmine.js' />
define([
    'common/ko/bindingHandlers/tlpLookUp',
    'common/entities/entityBase'
],
function (tlpLookUp, entityBase) {//eslint-disable-line max-params
    var viewModel = (function () {
        this.userType = ko.observable('');
        this.companyName = ko.observable('');
        this.companyId = ko.observable('');
        this.city = new entityBase.ObservableEntityBase('', '');
        this.street = new entityBase.ObservableEntityBase('', '');
        this.attachment = ko.observable('');

        this.city.dataText.subscribe(function () {
            this.street.dataCode('');
            this.street.dataText('');
        }, this);
        this.streetList = ko.observableArray();
        this.forceValueFlag = ko.observable('');
        this.someComputed = ko.computed(function () {
            return this.forceValueFlag();
        });
        return this;
    }());

    ko.cleanNode(document.body);
    ko.applyBindings(viewModel);

    describe('tlpLookUp', function () {
        var city;
        var street;
        var notFound = -1;
        beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpLookUp.html');
            ko.bindingHandlers.mockCustomBinding = {
                update: function () {
                }
            };
            spyOn(ko.bindingHandlers.mockCustomBinding, 'update');
            spyOn(ko.bindingHandlers.updateLookUpCode, 'update').and.callThrough();
            street = $('#Street');
        });

        it('should create the binding handler', function () {
            expect(ko.bindingHandlers.tlpLookUp).toBeDefined();
        });

        describe('input binding', function () {
            it('value on the input ', function () {
                var streetBinding = { tlpLookUp: { value: viewModel.street, forceValueFromOptions: false } };
                ko.applyBindingsToNode(street.get(0), streetBinding);

                viewModel.street.dataText('ירושלים');
                expect(street.val()).toEqual('ירושלים');
            });

            it('duplicate bindOnAll and binding to input ', function () {
                viewModel.companyId('7');
                viewModel.companyName('el-al');
                var streetBinding = { tlpLookUp: { value: viewModel.street, attr: { customAttr: viewModel.companyId }, bindOnAll: { attr: { customAttr: viewModel.companyName } } } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                expect(street.attr('customAttr')).toEqual('7');
                expect(street.prev('select').attr('customAttr')).toEqual('el-al');
            });

            it('input customBinding binding to input ', function () {
                var streetBinding = { tlpLookUp: { mockCustomBinding: viewModel.city.dataText, value: viewModel.street } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.city.dataText('ירושלים');
                expect(ko.bindingHandlers.mockCustomBinding.update).toHaveBeenCalled();
            });
            it('attr binding to input', function () {
                var streetBinding = { tlpLookUp: { mockCustomBinding: viewModel.city.dataText, attr: { customAttr: viewModel.companyName }, value: viewModel.street } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyName('gov.il');
                expect(street.attr('customAttr')).toEqual('gov.il');
            });
        });

        describe('select', function () {
            beforeEach(function () {
                street = $('#Street');
            });
            it('options on the select ', function () {
                var streetBinding = { tlpLookUp: { bindOnSelect: { options: viewModel.streetList, optionText: 'dataText', optionsValue: 'dataCode' }, value: viewModel.street } };
                viewModel.streetList([new entityBase.EntityBase('01', 'יפו'),
                                      new entityBase.EntityBase('02', 'בר אילן'),
                                      new entityBase.EntityBase('03', 'ירמיהו')]);
                ko.applyBindingsToNode(street.get(0), streetBinding);
                expect($('#pickUp_Street option').length).toEqual(3);  //eslint-disable-line no-magic-numbers
            });

            it('bindOnSelect binding to select ', function () {
                street.css('background-color', 'rgb(255, 255, 255)');
                var streetBinding = { tlpLookUp: { bindOnSelect: { mockCustomBinding: viewModel.city.dataText }, value: viewModel.city } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.city.dataText('ירושלים');
                expect(ko.bindingHandlers.mockCustomBinding.update).toHaveBeenCalled();
            });
            it('bindOnSelect attr binding', function () {
                var streetBinding = { tlpLookUp: { bindOnSelect: { attr: { customAttr: viewModel.companyId } }, value: viewModel.street } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyId('5');
                expect(street.prev('select').attr('customAttr')).toEqual('5');
            });
        });

        describe('arrow', function () {
            it('bindOnArrow attr binding', function () {
                var streetBinding = { tlpLookUp: { bindOnArrow: { attr: { customAttr: viewModel.companyId } }, value: viewModel.street } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyId('8');
                expect(street.siblings('button#arrow_Street').attr('customAttr')).toEqual('8');
            });

            it(' visible', function () {
                var streetBinding = { tlpLookUp: { visible: viewModel.isPrivateType, bindOnArrow: { visible: viewModel.isPrivateType }, value: viewModel.street } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.userType('company');
                expect(street.prev('select').is(':visible')).toBeFalsy();
                expect(street.siblings('button#arrow_Street').is(':visible')).toBeFalsy();
            });
        });

        describe('bindOnAll', function () {
            it('bindOnAll binding to input and select and', function () {
                var streetBinding = { tlpLookUp: { bindOnAll: { attr: { customAttr: viewModel.companyName } }, value: viewModel.street } };
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyName('el-al');
                expect(street.attr('customAttr')).toEqual('el-al');
                expect(street.prev('select').attr('customAttr')).toEqual('el-al');
                expect(street.siblings('button#arrow_Street').attr('customAttr')).toEqual('el-al');
            });

        });

        describe('tfsValue', function () {
            beforeEach(function () {
                city = $('#City');
                var cityBindings = { tlpLookUp: { value: viewModel.city } };
                ko.applyBindingsToNode(city.get(0), cityBindings);
                var optionsMock = [{ text: 'אופקים', value: '31' }, { text: 'מודיעין עילית', value: '3797' }, { text: 'נווה אטי"ב', value: '03' }];
                $.data($('#pickUp_City').get(0), 'options', optionsMock);
            });
            it('tfsValue updated when value change ', function () {
                city.val('מודיעין עילית');
                city.eq(0).trigger('change');
                expect(city.attr('tfsValue')).toEqual('3797');
            });

            it('tfsValue on the input ', function () {
                viewModel.city.dataCode('3000');
                expect(city.attr('tfsValue')).toEqual('3000');
            });

        });

        describe('value', function () {
            beforeEach(function () {
                city = $('#City');
                var cityBindings = { tlpLookUp: { value: viewModel.city, forceValueFromOptions: false } };
                ko.applyBindingsToNode(city.get(0), cityBindings);

            });
            it('value updated when value change ', function () {
                city.val('מודיעין עילית');
                city.eq(0).trigger('change');
                expect(viewModel.city.dataText()).toEqual('מודיעין עילית');
            });
            it('value on the input ', function () {
                viewModel.city.dataText('ירושלים');
                expect(city.val()).toEqual('ירושלים');
            });
            it('type of value', function () {
                street = $('#Street');
                var streetBindings = {
                    tlpLookUp: { value: viewModel.companyId }
                };
                try {
                    ko.applyBindingsToNode(street.get(0), streetBindings);
                }
                catch (e) {
                    //expect(e.message.includes('the parameter "value" must be of entityBase.ObservableEntityBase type')).toBeTruthy();
                    expect(e.message.indexOf('the parameter "value" must be of entityBase.ObservableEntityBase type') > notFound).toBeTruthy();
                }
            });

        });

        describe('case insensitive', function () {
            beforeEach(function () {
                street = $('#Street');
            });

            it('case sensitive ', function () {
                var streetBinding = {
                    tlpLookUp: { bindOnAll: { attr: { customAttr: viewModel.companyName } }, value: viewModel.street }
                };
                $('pickUp_Street').attr('tfsDataType', 'LooKupWindow');
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyName('meitav');

                expect(street.attr('customAttr')).toEqual('meitav');
                expect(street.prev('select').attr('customAttr')).toEqual('meitav');
                expect(street.siblings('button#arrow_Street').attr('customAttr')).toEqual('meitav');
            });

            it('lower case', function () {
                var streetBinding = {
                    tlpLookUp: { bindOnAll: { attr: { customAttr: viewModel.companyName } }, value: viewModel.street }
                };
                $('pickUp_Street').attr('tfsdatatype', 'lookupwindow');
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyName('meitav');

                expect(street.attr('customAttr')).toEqual('meitav');
                expect(street.prev('select').attr('customAttr')).toEqual('meitav');
                expect(street.siblings('button#arrow_Street').attr('customAttr')).toEqual('meitav');
            });

            it('upper case', function () {
                var streetBinding = {
                    tlpLookUp: { bindOnAll: { attr: { customAttr: viewModel.companyName } }, value: viewModel.street }
                };
                $('pickUp_Street').attr('TFSDATATYPE', 'LOOKUPWINDOW');
                ko.applyBindingsToNode(street.get(0), streetBinding);
                viewModel.companyName('meitav');

                expect(street.attr('customAttr')).toEqual('meitav');
                expect(street.prev('select').attr('customAttr')).toEqual('meitav');
                expect(street.siblings('button#arrow_Street').attr('customAttr')).toEqual('meitav');
            });
        });

        describe('on other elements', function () {
            it('attachment', function () {
                var streetBinding = {
                    tlpLookUp: { bindOnAll: { attr: { customAttr: viewModel.companyName } }, value: viewModel.street }
                };
                var attachment = $('#attach');
                try {
                    ko.applyBindingsToNode(attachment.get(0), streetBinding);
                }
                catch (e) {
                    expect(e.message.indexOf('the parameter "element" must be of LookUpWindow type') > notFound).toBeTruthy();
                }
            });
        });

        describe('update lookup code', function () {

            beforeEach(function () {
                city = $('#City');
                var optionsMock = [{ text: 'אופקים', value: '31' }, { text: 'תל ציון', value: '02' }, { text: 'נווה אטי"ב', value: '03' }];
                $.data($('#pickUp_City').get(0), 'options', optionsMock);
            });

            it('defined on the bindingHandlers', function () {
                expect(ko.bindingHandlers.updateLookUpCode).toBeDefined();
            });

            it('update code when selected option changes', function () {
                var cityBindings = { tlpLookUp: { value: viewModel.city } };
                ko.applyBindingsToNode(city.get(0), cityBindings);
                city.val('אופקים');
                city.eq(0).trigger('change');
                expect(viewModel.city.dataCode()).toEqual('31');
            });

            it('update code when dataText changes', function () {
                var cityBindings = { tlpLookUp: { value: viewModel.city } };
                ko.applyBindingsToNode(city.get(0), cityBindings);
                viewModel.city.dataText('אופקים');
                expect(viewModel.city.dataCode()).toEqual('31');
            });

            describe('force value from options', function () {

                it('by default forceValueFromOptions=true, value exsits, update code', function () {
                    var cityBindings = { tlpLookUp: { value: viewModel.city } };
                    ko.applyBindingsToNode(city.get(0), cityBindings);
                    city.val('אופקים');
                    city.eq(0).trigger('change');
                    expect(viewModel.city.dataText()).toEqual('אופקים');
                    expect(viewModel.city.dataCode()).toEqual('31');
                    expect(city.val()).toEqual('אופקים');
                });

                it('forceValueFromOptions=true and value not exsits, clear text, update code with -1', function () {
                    var cityBindings = { tlpLookUp: { value: viewModel.city } };
                    ko.applyBindingsToNode(city.get(0), cityBindings);
                    city.val('אופקים1');
                    city.eq(0).trigger('change');
                    expect(viewModel.city.dataText()).toEqual('');
                    expect(viewModel.city.dataCode()).toEqual('-1');
                    expect(city.val()).toEqual('');
                });

                it('forceValueFromOptions=false and value not exsits, update code with undefined', function () {
                    var cityBindings = { tlpLookUp: { value: viewModel.city, forceValueFromOptions: false } };
                    ko.applyBindingsToNode(city.get(0), cityBindings);
                    city.val('test');
                    city.eq(0).trigger('change');
                    expect(viewModel.city.dataText()).toEqual('test');
                    expect(viewModel.city.dataCode()).toEqual('-1');
                    expect(city.val()).toEqual('test');
                });

                it('forceValueFromOptions=computed, clear text or update code with -1 by computed result', function () {
                    viewModel.forceValueFlag(true);
                    var cityBindings = { tlpLookUp: { value: viewModel.city, forceValueFromOptions: viewModel.someComputed } };
                    ko.applyBindingsToNode(city.get(0), cityBindings);
                    city.val('test');
                    city.eq(0).trigger('change');
                    expect(viewModel.city.dataText()).toEqual('');
                    expect(viewModel.city.dataCode()).toEqual('-1');
                    expect(city.val()).toEqual('');

                    viewModel.forceValueFlag(false);
                    city.val('test');
                    city.eq(0).trigger('change');
                    expect(viewModel.city.dataText()).toEqual('test');
                    expect(viewModel.city.dataCode()).toEqual('-1');
                    expect(city.val()).toEqual('test');
                });
            });
        });

        describe('validation messages', function () {
            beforeEach(function () {
                spyOn(ko.bindingHandlers.validationOptions, 'init');
            });
            it('should block validation message from appending if exists', function () {
                ko.applyBindingsToNode(city.get(0), { tlpLookUp: { value: viewModel.city, bindOnSelect: { mockCustomBinding: {} } } });
                expect(ko.bindingHandlers.validationOptions.init).toHaveBeenCalled();
            });

            it('should not block validation message from appending if not already exists', function () {
                ko.applyBindingsToNode(street.get(0), { tlpLookUp: { value: viewModel.street, bindOnSelect: { mockCustomBinding: {} } } });
                expect(ko.bindingHandlers.validationOptions.init).not.toHaveBeenCalled();
            });
        });
    });

});
define('spec/tlpLookUpSpec.js', function () { });