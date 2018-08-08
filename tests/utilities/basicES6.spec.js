define(['common/utilities/basicES6'],
    function (es6Pilot) {

        describe('es6 - Template Literals -', function () {

            it('multiline', function () {
                expect(es6Pilot.multilineTemplateLiterals).toEqual('Hello\n            world');
            });
            it('access any variable accessible in the scope', function () {
                expect(es6Pilot.templateLiteralsWithParams).toEqual('hey Yael');
            });
            it('throw error when use Undeclared variable', function () {
                expect(function () { es6Pilot.templateLiteralsWithUndeclaredVariables(); }).toThrow();
            });
            it('use expressions', function () {
                expect(es6Pilot.templateLiteralsWithExprresion).toEqual('10 items cost 2.50.');
            });
        });
        describe('es6 - Default parameters values -', function () {

            it('regular values', function () {
                var age = 35;
                expect(es6Pilot.getPersonParams()).toEqual('name: Yael, age: 25');
                expect(es6Pilot.getPersonParams('Hana', age)).toEqual('name: Hana, age: 35');
            });
            it('Expressions values', function () {
                expect(es6Pilot.add(1, 1)).toEqual(2);
                expect(es6Pilot.add(1)).toEqual(6);
            });

        });
        describe('es6 - Rest parameters', function () {

            it('rest', function () {
                var result = [2, 4, 6];
                var secondResult = [3, 6, 9];
                expect(es6Pilot.multiply(2, 1, 2, 3)).toEqual(result);
                expect(es6Pilot.multiply(3, 1, 2, 3)).toEqual(secondResult);
            });

        });
        describe('es6 - Spread operator - ', function () {

            it('in function arguments', function () {
                var args = [2, 4, 6];
                var spreadResult = 12;
                expect(es6Pilot.spread(args)).toEqual(spreadResult);
            });

            it('Create a new Array with the existing one being part of it', function () {
                var parts = ['shoulders', 'knees'];
                var newArray = ['head', 'and', 'toes'];
                expect(es6Pilot.getNewArrayUseSpread(newArray, parts)).toEqual(['shoulders', 'knees', 'head', 'and', 'toes']);
            });
            it('copy arrays', function () {
                var originalArray = ['shoulders', 'knees'];
                var newItem = 'head';
                expect(es6Pilot.copyArrayUSeSpread(originalArray, newItem)).toEqual(['shoulders', 'knees', 'head']);
                expect(originalArray).toEqual(['shoulders', 'knees']);
            });
        });
        describe('es6 -Arrow functions - ', function () {
            it('simple function ', function () {
                var result = 11;
                expect(es6Pilot.simpleArrowFunction(5, 6)).toEqual(result);
            });
            it('simple function ', function () {
                var id = 1;
                expect(es6Pilot.arrowFunctionReturnObject(id)).toEqual({ id: 1, name: 'Temp' });
            });
            
        });
        describe('Object Literal - ', function () {
            it('object assign ', function () {
                var a = { 1: 1 }, b = { 2: 2 };
                expect(es6Pilot.assignObjects(a, b)).toEqual({1:1,2: 2});
            });
        });
        describe('Destructuring - ', function () {
            it(' Assignment', function () {
                expect(es6Pilot.setNodeObject()).toEqual({
                    type: 'Identifier',
                    name1: 'foo'
                });
            });
            it(' Default Values', function () {
                expect(es6Pilot.getPerson()).toEqual({ name2: 'foo', age2: 20, gender: 'male', city: undefined });
            });
            it(' Destructuring To Different Names', function () {
                expect(es6Pilot.getPersonwithDifferentNames()).toEqual({ localType: 'Identifier', localName: 'foo', shouldBeSaved: true });//eslint-disable-line
            });
            it(' object destructuring', function () {
                expect(es6Pilot.getNestedObjectDestructuring()).toEqual({ line:1, column:1 });//eslint-disable-line
            });
            it(' Destructured Parameters', function () {
                expect(es6Pilot.destructuredParameters('a', 'b', { type: 'foo', name: 'bar', date: '01/01', value: 1 })).toEqual({ type: 'foo', name: 'bar', date: '01/01', value: 1 });//eslint-disable-line
            });
        }); 
        describe('Classes - ', function () {
            it(' constractor', function () {
                expect(es6Pilot.person.sayName()).toEqual('Avi');
            });
           
        });
    });
