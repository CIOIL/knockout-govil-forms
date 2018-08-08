/// <reference path='../../lib/jasmine-2.0.0/boot.js' />
/// <reference path='../../lib/jasmine-2.0.0/jasmine.js' />
define(['common/ko/bindingHandlers/lookupOptions', 'common/entities/entityBase', 'common/ko/bindingHandlers/tlpLookUp'], function (lookupOptions, entityBase) {
    //eslint-disable-line


    describe('lookupOptions', function () {

        var AreaCode = function AreaCode(setting) {

            var self = this;
            this.type = ko.observable(setting ? setting.type : '');
            entityBase.ObservableEntityBase.call(self, { key: setting ? setting.id : '', value: setting ? setting.AreaCode : '' });
        };
        AreaCode.prototype = Object.create(entityBase.ObservableEntityBase.prototype);
        AreaCode.prototype.constructor = AreaCode;

        var viewModel = function () {
            var self = this;
            self.areaCode = new AreaCode();
            return self;
        }();
        ko.cleanNode(document.body);
        ko.applyBindings(viewModel);

        describe('options list with enhanced entityBase', function () {
            var resultArray = [{ id: '11', value: '02' }, { id: '22', value: '03' }, { id: '33', value: '050' }];
            var allAreaCodes = ko.observableArray();
            allAreaCodes.push(new AreaCode({ type: '1', id: '11', AreaCode: '02' }));
            allAreaCodes.push(new AreaCode({ type: '1', id: '22', AreaCode: '03' }));
            allAreaCodes.push(new AreaCode({ type: '2', id: '33', AreaCode: '050' }));
            var lookup;
            var pickupLookup;
            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                loadFixtures('lookupOptions.html');
                lookup = $('#lookUpOptionsElement');
                pickupLookup = $('#pickUp_lookUpOptionsElement');
                var lookUpOptionBinding = { tlpLookUp: { value: viewModel.areaCode, bindOnSelect: { lookupOptions: allAreaCodes } } };
                ko.applyBindingsToNode(lookup.get(0), lookUpOptionBinding);
                // ko.applyBindingsToNode(pickupLookup.get(0), lookUpOptionBinding);
            });

            it('load the list to the lookup options', function () {
                expect(pickupLookup.data('options')).toEqual(resultArray);
            });

            it('load the list to the lookup options after adding the obsarvable array.', function () {
                allAreaCodes.push(new AreaCode({ type: '2', id: '44', AreaCode: '054' }));
                resultArray.push({ id: '44', value: '054' });
                expect(pickupLookup.data('options')).toEqual(resultArray);
            });

            it('lookup options has the right list updated to the filtering obsarvable array.', function () {

                allAreaCodes(ko.utils.arrayFilter(allAreaCodes(), function (item) {
                    return item.type() === '1';
                }));

                resultArray = [{ id: '11', value: '02' }, { id: '22', value: '03' }];
                expect(pickupLookup.data('options')).toEqual(resultArray);
            });
        });

        describe('options list without  entityBase', function () {
            var resultArray2 = [{ id: '11', value: '02' }, { id: '22', value: '03' }, { id: '33', value: '050' }];
            var allAreaCodes2 = ko.observableArray();
            allAreaCodes2.push({ type: '1', id: '11', AreaCode: '02' });
            allAreaCodes2.push({ type: '1', id: '22', AreaCode: '03' });
            allAreaCodes2.push({ type: '2', id: '33', AreaCode: '050' });
            var lookup2;
            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                loadFixtures('lookupOptions.html');
                lookup2 = $('#lookUpOptionsElement');
                var lookUpOptionBinding2 = { tlpLookUp: { value: viewModel.areaCode, bindOnSelect: { lookupOptions: allAreaCodes2, optionsText: 'AreaCode', optionsValue: 'id' } } };
                ko.cleanNode(lookup2);
                ko.cleanNode($('#pickUp_lookUpOptionsElement'));
                ko.cleanNode(lookup2).siblings('button');
                ko.applyBindingsToNode(lookup2.get(0), lookUpOptionBinding2);
            });

            it('options list without entityBase, object key for optionsText sent in computed', function () {
                var resultArray2 = [{ id: '11', value: '02' }, { id: '22', value: '03' }, { id: '33', value: '050' }];
                var allAreaCodes2 = ko.observableArray();
                allAreaCodes2.push({ type: '1', id: '11', AreaCode: '02' });
                allAreaCodes2.push({ type: '1', id: '22', AreaCode: '03' });
                allAreaCodes2.push({ type: '2', id: '33', AreaCode: '050' });
                viewModel.columnName = ko.computed(function () {
                    return 'AreaCode';
                });
                var lookUpOptionBinding2 = { tlpLookUp: { value: viewModel.areaCode, bindOnSelect: { lookupOptions: allAreaCodes2, optionsText: viewModel.columnName, optionsValue: 'id' } } };
                ko.cleanNode(lookup2);
                ko.cleanNode($('#pickUp_lookUpOptionsElement'));
                ko.cleanNode(lookup2).siblings('button');
                ko.applyBindingsToNode(lookup2.get(0), lookUpOptionBinding2);
                expect($('#pickUp_lookUpOptionsElement').data('options')).toEqual(resultArray2);
            });

            it('lookup options before and after a change in the observable array', function () {

                expect($('#pickUp_lookUpOptionsElement').data('options')).toEqual(resultArray2);

                allAreaCodes2(ko.utils.arrayMap(allAreaCodes2(), function (item) {
                    return item['AreaCode'];
                }));

                resultArray2 = [{ id: '02', value: '02' }, { id: '03', value: '03' }, { id: '050', value: '050' }];

                expect($('#pickUp_lookUpOptionsElement').data('options')).toEqual(resultArray2);
            });

            it('lookup options after empting the observable array', function () {

                allAreaCodes2([]);

                resultArray2 = [];

                expect($('#pickUp_lookUpOptionsElement').data('options')).toEqual(resultArray2);
            });
        });
    });
});
define('spec/lookupOptionsSpec.js', function () {});