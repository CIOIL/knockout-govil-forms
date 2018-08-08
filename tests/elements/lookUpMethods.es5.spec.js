define(['common/elements/lookUpMethods', 'common/ko/bindingHandlers/tlpLookUp', 'common/entities/entityBase', 'common/networking/services', 'common/external/q', 'common/ko/bindingHandlers/tlpAutocomplete', 'common/external/jquery-ui'], function (lookUpMethods, tlpLookUp, lookUpModel, services, Q) {
    //eslint-disable-line
    describe('lookup methods in AGForms', function () {

        var viewModel, town, undefinedTown, regularInput, regularInputInDiv, townBinding;

        (function initViewModel() {
            jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
            loadFixtures('lookUpMethods.html');
            viewModel = {
                town: new lookUpModel.ObservableEntityBase({ key: '3000', value: 'ירושלים' })
            };
            ko.cleanNode(document.body);
            ko.applyBindings(viewModel);

            town = $('#Town'), undefinedTown = $('#undefinedTown'), regularInput = $('#regularInput'), regularInputInDiv = $('#regularInputInDiv'), townBinding = {
                tlpLookUp: { value: viewModel.town }
            };
            var optionsMock = [{ value: 'ירושלים', id: '3000' }];
            $.data($('#pickUp_Town').get(0), 'options', optionsMock);
            ko.applyBindingsToNode(town.get(0), townBinding);
        })();

        describe('"hasLookupValue" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.hasLookupValue).toBeDefined();
            });
            it('call with valid tfsValue attribute of input', function () {
                expect(lookUpMethods.hasLookupValue(town)).toBeTruthy();
            });
            it('call with element that doesnt have "tfsValue" attribute', function () {
                town.removeAttr('tfsValue');
                expect(lookUpMethods.hasLookupValue(town)).toBeFalsy();
                town.attr('tfsValue', '431');
            });
            it('call with not a lookup element', function () {
                expect(function () {
                    lookUpMethods.hasLookupValue(regularInput);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
            it('call with not a lookup element in the same div of lookup', function () {
                expect(function () {
                    lookUpMethods.hasLookupValue(regularInputInDiv);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
            it('call with undefined element', function () {
                expect(function () {
                    lookUpMethods.hasLookupValue(undefinedTown);
                }).toThrowError('the parameter "element" is undefined');
            });
        });

        describe('"getLookupValue" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getLookupValue).toBeDefined();
            });
            it('call with valid "tfsValue" attribute of input', function () {
                expect(lookUpMethods.getLookupValue(town)).toBe('431');
            });

            it('call with element that doesnt have "tfsValue" attribute', function () {
                town.removeAttr('tfsValue');
                expect(lookUpMethods.getLookupValue(town)).toBeUndefined();
                town.attr('tfsValue', '431');
            });

            it('call with undefined element', function () {
                expect(function () {
                    lookUpMethods.getLookupValue(undefinedTown);
                }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a lookup element', function () {
                expect(function () {
                    lookUpMethods.getLookupValue(regularInput);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
            it('call with not a lookup element in the same div of lookup', function () {
                expect(function () {
                    lookUpMethods.getLookupValue(regularInputInDiv);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
        });

        describe('"getSelectElement" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getSelectElement).toBeDefined();
            });
            it('call with valid input lookup element', function () {
                expect(lookUpMethods.getSelectElement(town).attr('id')).toBe('pickUp_Town');
            });

            it('call with undefined element', function () {
                expect(function () {
                    lookUpMethods.getSelectElement(undefinedTown);
                }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a lookup element', function () {
                expect(function () {
                    lookUpMethods.getSelectElement(regularInput);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
            it('call with not a lookup element in the same div of lookup', function () {
                expect(function () {
                    lookUpMethods.getSelectElement(regularInputInDiv);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
        });

        describe('"getArrowElement" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getArrowElement).toBeDefined();
            });
            it('call with valid input lookup element', function () {
                expect(lookUpMethods.getArrowElement(town).attr('id')).toBe('arrow_Town');
            });

            it('call with undefined element', function () {
                expect(function () {
                    lookUpMethods.getArrowElement(undefinedTown);
                }).toThrowError('the parameter "element" is undefined');
            });

            it('call with not a lookup element', function () {
                expect(function () {
                    lookUpMethods.getArrowElement(regularInput);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
            it('call with not a lookup element in the same div of lookup', function () {
                expect(function () {
                    lookUpMethods.getArrowElement(regularInputInDiv);
                }).toThrowError('the parameter "element" must be of LookUpWindow type');
            });
        });

        describe('"getLabelElement" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.getLabelElement).toBeDefined();
            });
            it('call with valid input lookup element', function () {
                expect($(lookUpMethods.getLabelElement(town)).is('label')).toBeTruthy();
            });

            it('call with undefined element', function () {
                // expect($(lookUpMethods.getLabelElement(withTooltip)).is('label')).toBeTruthy();
            });

            it('call with not a lookup element', function () {
                expect(function () {
                    $(lookUpMethods.getLabelElement(regularInput));
                }).toThrowError();
            });
            it('call with not a lookup element in the same div of lookup', function () {
                expect(function () {
                    $(lookUpMethods.getLabelElement(regularInputInDiv)).is('label');
                }).toThrowError();
            });
        });

        describe('"isLookUp" function', function () {
            it('to be defined', function () {
                expect(lookUpMethods.isLookUp).toBeDefined();
            });
            it('call with valid lookup element', function () {
                expect(lookUpMethods.isLookUp(town)).toBeTruthy();
            });
            it('call with not a lookup element', function () {
                expect(lookUpMethods.isLookUp(regularInput)).toBeFalsy();
            });
            it('call with not a lookup element in the same div of lookup', function () {
                expect(lookUpMethods.isLookUp(regularInputInDiv)).toBeFalsy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    lookUpMethods.isLookUp(undefinedTown);
                }).toThrowError('the parameter "element" is undefined');
            });
        });
    });
});
define('spec/lookUpMethodsSpec.js', function () {});