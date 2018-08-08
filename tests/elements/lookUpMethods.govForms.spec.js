define(['common/elements/lookUpMethods',
        'common/ko/bindingHandlers/tlpLookUp',
        'common/entities/entityBase',
        'common/networking/services',
        'common/external/q',
        'common/ko/bindingHandlers/tlpAutocomplete',
        'common/external/jquery-ui'
],
function (lookUpMethods, tlpLookUp, lookUpModel, services, Q) {//eslint-disable-line

    describe('lookup methods in govForms', function () {
        var selectedValue4 = new lookUpModel.ObservableEntityBase({ key: '', value: '' });
        var viewModel, undefinedTown, regularInput, autocompleteElement;

        var mapSelectedValueFunction = function (element, mappedList, settings) {
            settings.value($(element).val());
        };
        var autocompleteSettings = {
            dataType: 'customDataType',
            mapSelectedValueFunction: mapSelectedValueFunction,
            contains: true,
            limit: 15,
            filterMinlength: 0,
            mappingObject: { dataCode: 'code', dataText: 'name' },
            listAccessor: [{ name: 'yael', code: '0' }, { name: 'lea', code: '1' }, { name: 'sara', code: '2' }],
            value: ko.observable(),
            viewSelectedValuesSpan: false
        };
        beforeEach(() => {
            jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
            loadFixtures('autocompleteMethods.html');
            regularInput = $('#regularInput');

            viewModel = {
                autocompleteSettings: autocompleteSettings,
                selectedValue4: selectedValue4
            };
            ko.cleanNode(document.body);
            ko.applyBindings(viewModel);
            autocompleteElement = $('#lookupAutocomplete');
        });

        describe('"hasLookupValue" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.hasLookupValue).toBeDefined();
            });
            it('call with valid autocomplete input', function () {
                $('#lookupAutocomplete').data('ui-autocomplete')._trigger('select', 'autocompleteselect', { item: { value: 'Economical' } });

                $('#lookupAutocomplete').autocomplete('search', 'Economical');
                expect(lookUpMethods.hasLookupValue(autocompleteElement)).toBeTruthy();
            });
            it('call with not a autocomplete element', function () {
                expect(function () { lookUpMethods.hasLookupValue(regularInput); }).toThrowError('the parameter "element" must be of tlpAutocomplete binding type');
            });
            it('call with undefined element', function () {
                expect(function () { lookUpMethods.hasLookupValue(undefinedTown); }).toThrowError('the parameter "element" is undefined');
            });

        });

        describe('"getLookupValue" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getLookupValue).toBeDefined();
            });
            it('call with autocomplete element - return element value', function () {

                $(autocompleteElement).val('ggg');
                expect(lookUpMethods.getLookupValue(autocompleteElement)).toBe('ggg');
            });

            it('call with element that doesnt have value', function () {
                expect(lookUpMethods.getLookupValue(autocompleteElement)).toEqual('');
            });

            it('call with undefined element', function () {
                expect(function () { lookUpMethods.getLookupValue(undefinedTown); }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a tlpAutocomplete element', function () {
                expect(function () { lookUpMethods.getLookupValue(regularInput); }).toThrowError('the parameter "element" must be of tlpAutocomplete binding type');
            });
        });

        describe('"getArrowElement" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getArrowElement).toBeDefined();
            });
            it('call with valid input tlpAutocomplete element', function () {
                expect(lookUpMethods.getArrowElement(autocompleteElement).attr('class')).toBe('autocomplete-arrow noPrint');
            });

            it('call with undefined element', function () {
                expect(function () { lookUpMethods.getArrowElement(undefinedTown); }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a lookup element', function () {
                expect(function () { lookUpMethods.getArrowElement(regularInput); }).toThrowError('the parameter "element" must be of tlpAutocomplete binding type');
            });

        });

        describe('"getLabelElement" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getLabelElement).toBeDefined();
            });
            it('call with valid input tlpAutocomplete element', function () {
                expect($(lookUpMethods.getLabelElement(autocompleteElement)).is('label')).toBeTruthy();

            });

            it('call with undefined element', function () {
                // expect($(lookUpMethods.getLabelElement(withTooltip)).is('label')).toBeTruthy();
            });

            it('call with not a tlpAutocomplete element', function () {
                expect(lookUpMethods.getLabelElement(regularInput)).toBeUndefined();
            });
        });

        describe('"isLookUp" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.isLookUp).toBeDefined();
            });
            it('call with valid lookup element', function () {
                expect(lookUpMethods.isLookUp(autocompleteElement)).toBeTruthy();
            });
            it('call with not a lookup element', function () {
                expect(lookUpMethods.isLookUp(regularInput)).toBeFalsy();
            });
            it('call with undefined element', function () {
                expect(function () { lookUpMethods.isLookUp(undefinedTown); }).toThrowError('the parameter "element" is undefined');
            });
        });

    });

});
define('spec/lookUpMethodsSpec.js', function () { });