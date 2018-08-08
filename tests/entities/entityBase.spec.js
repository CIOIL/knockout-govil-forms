define([
    'common/entities/entityBase'
    , 'common/external/q'
],
function (entityBase,Q) {
    var error = 'the parameter "array" must be of array of EntityBase type';
    var invalidError = 'the parameter "array" is invalid';
    var notFound = undefined;
    var fulfilledPromise = Q.fcall(function () {
        return 10;
    });
    var rejectedPromise = Q.fcall(function () {
        throw new Error('Cant do it');
    });
    describe('EntityBase', function () {
        it('to be defined', function () {
            expect(entityBase.EntityBase).toBeDefined();
        });
        describe('init values', function () {
            var entity = new entityBase.EntityBase({ key: 1, value: 'צהוב' });
            it('dataCode', function () {
                expect(entity.dataCode).toBe(1);
            });
            it('dataText', function () {
                expect(entity.dataText).toBe('צהוב');
            });
        });
    });

    describe('ObservableEntityBase', function () {
        it('to be defined', function () {
            expect(entityBase.ObservableEntityBase).toBeDefined();
        });
        describe('init values', function () {
            var observableEntity = new entityBase.ObservableEntityBase({ key: 1, value: 'צהוב' });
            it('dataCode', function () {
                expect(observableEntity.dataCode()).toBe(1);
            });
            it('dateText', function () {
                expect(observableEntity.dataText()).toBe('צהוב');
            });
        });


    });
    describe('DeferredEntityBase', function () {
        it('to be defined', function () {
            expect(entityBase.DeferredEntityBase).toBeDefined();
        });
        describe('init values', function () {
            describe('fulfilledPromise', function () {
                var deferredEntity = new entityBase.DeferredEntityBase({ key: 1, value: 'צהוב', deferred:fulfilledPromise });
                it('dataCode', function (done) {
                    expect(deferredEntity.dataCode()).toBe(1);
                    deferredEntity.dataCode(2);
                    fulfilledPromise.then(function () {
                        expect(deferredEntity.dataCode()).toBe(2);
                        done();
                    });
                });
                it('dateText', function () {
                    expect(deferredEntity.dataText()).toBe('צהוב');
                });
            });
            describe('rejectedPromise', function () {
                var deferredEntity = new entityBase.DeferredEntityBase({ key: 1, value: 'צהוב',  deferred:rejectedPromise });
                it('dataCode', function (done) {
                    expect(deferredEntity.dataCode()).toBe(1);
                    deferredEntity.dataCode(2);
                    rejectedPromise.catch(function () {
                        expect(deferredEntity.dataCode()).toBe(1);
                        done();
                    });
                });
                it('dateText', function () {
                    expect(deferredEntity.dataText()).toBe('צהוב');
                });
            });

        });


    });
    describe('getTextByCode', function () {
        describe('EntityBase', function () {
            var array = [new entityBase.EntityBase({ key: 1, value: 'צהוב' }),
                         new entityBase.EntityBase({ key: 2, value: 'ירוק' }),
                         new entityBase.EntityBase({ key: 3, value: 'אדום' }),
                         new entityBase.EntityBase({ key: 3, value: 'ירוק' }),
                         new entityBase.EntityBase({ key: '5', value: 'שחור' })];

            it('valid get description by value', function () {
                expect(entityBase.utils.getTextByCode(array, 2)).toEqual('ירוק');
            });

            it('value not exist', function () {
                expect(entityBase.utils.getTextByCode(array, 4)).toEqual(notFound);
            });

            it('test get value that exists twice', function () {
                expect(entityBase.utils.getTextByCode(array, 3)).toEqual('אדום');
            });

            it('test empty array', function () {
                expect(function () { entityBase.utils.getTextByCode([], 3); }).toThrowError(invalidError);
            });

            it('test undefined value (no second parameter)', function () {
                expect(function () { entityBase.utils.getTextByCode(); }).toThrowError(invalidError);
            });

            it('test string value', function () {
                var res = entityBase.utils.getTextByCode(array, '5');
                expect(res).toEqual('שחור');
            });

        });
        describe('ObservableEntityBase', function () {
            var array = [new entityBase.EntityBase({ key: 1, value: 'צהוב' }),
                   new entityBase.EntityBase({ key: 2, value: 'ירוק' }),
                   new entityBase.EntityBase({ key: 3, value: 'אדום' }),
                   new entityBase.EntityBase({ key: 3, value: 'ירוק' }),
                   new entityBase.EntityBase({ key: '5', value: 'שחור' })];
        

            it('valid get description by value', function () {
                expect(entityBase.utils.getTextByCode(array, 2)).toEqual('ירוק');
            });

            it('value not exist', function () {
                expect(entityBase.utils.getTextByCode(array, 4)).toEqual(notFound);
            });

            it('test get value that exists twice', function () {
                expect(entityBase.utils.getTextByCode(array, 3)).toEqual('אדום');
            });

            it('test empty array', function () {
                expect(function () { entityBase.utils.getTextByCode([], 3); }).toThrowError(invalidError);
            });

            it('test undefined value (no second parameter)', function () {
                expect(function () { entityBase.utils.getTextByCode(); }).toThrowError(invalidError);
            });

            it('test string value', function () {
                var res = entityBase.utils.getTextByCode(array, '5');
                expect(res).toEqual('שחור');
            });

        });
    });

    describe('getCodeByText', function () {

        describe('EntityBase', function () {
            var array = [new entityBase.EntityBase({ key: 1, value: 'צהוב' }),
                   new entityBase.EntityBase({ key: 2, value: 'ירוק' }),
                   new entityBase.EntityBase({ key: 3, value: 'אדום' }),
                   new entityBase.EntityBase({ key: 3, value: 'ירוק' }),
                   new entityBase.EntityBase({ key: '5', value: 5 })];

            it('valid get value by description', function () {
                expect(entityBase.utils.getCodeByText(array, 'ירוק')).toEqual(2);
            });

            it('description not exist in array', function () {
                expect(entityBase.utils.getCodeByText(array, 'כחול')).toEqual(notFound);
            });

            it('test get value that exists twice', function () {
                expect(entityBase.utils.getCodeByText(array, 'ירוק')).toEqual(2);
            });

            it('test empty array', function () {
                expect(function () { entityBase.utils.getCodeByText([], 'צהוב'); }).toThrowError(invalidError);
            });

            it('test undefined value (no second parameter)', function () {
                expect(function () { entityBase.utils.getCodeByText(); }).toThrowError(invalidError);
            });

            it('test string value', function () {
                expect(entityBase.utils.getCodeByText(array, 5)).toEqual('5');
            });
        });

        describe('ObservableEntityBase', function () {
            var array = [new entityBase.EntityBase({ key: 1, value: 'צהוב' }),
                new entityBase.EntityBase({ key: 2, value: 'ירוק' }),
                new entityBase.EntityBase({ key: 3, value: 'אדום' }),
                new entityBase.EntityBase({ key: 3, value: 'ירוק' }),
                new entityBase.EntityBase({ key: '5', value: 5 })];

            it('valid get value by description', function () {
                expect(entityBase.utils.getCodeByText(array, 'ירוק')).toEqual(2);
            });

            it('description not exist in array', function () {
                expect(entityBase.utils.getCodeByText(array, 'כחול')).toEqual(notFound);
            });

            it('test get value that exists twice', function () {
                expect(entityBase.utils.getCodeByText(array, 'ירוק')).toEqual(2);
            });

            it('test empty array', function () {
                expect(function () { entityBase.utils.getCodeByText([], 'צהוב'); }).toThrowError(invalidError);
            });

            it('test undefined value (no second parameter)', function () {
                expect(function () { entityBase.utils.getCodeByText(); }).toThrowError(invalidError);
            });

            it('test string value', function () {
                expect(entityBase.utils.getCodeByText(array, 5)).toEqual('5');
            });
        });

    });

    describe('invalid type', function () {

        it('getCodeByText', function () {
            var array = ['ירוק', 'צהוב'];
            expect(function () { entityBase.utils.getCodeByText(array, 'צהוב'); }).toThrowError(error);
        });
        it('getCodeByText', function () {
            var array = [1, 2];
            expect(function () { entityBase.utils.getTextByCode(array, 1); }).toThrowError(error);
        });
    });

    //$(document).ready(function () {

    //    window.executeTests();
    //});

});
define('spec/entityBase.js', function () { });