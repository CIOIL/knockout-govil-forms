define(['common/ko/fn/defineType', 'common/external/q', 'common/ko/globals/defferedObservable'],
function (defaultValue, Q) {//eslint-disable-line no-unused-vars
    describe('fn defineType', function () {

        var testPromise;
        var message;


        beforeAll(function () {
            testPromise = Q.fcall(function () {
                return 10;
            });
        });

        it('should create the defineType on ko.observable and writableComputed', function () {
            expect(ko.observable().defineType).toBeDefined();
            expect(ko.defferedObservable({ deferred: testPromise }).defineType).toBeDefined();
        });

        it('should throw error when use on ko.observableArray', function () {
            message = 'property schemaType is not supported for ko.observableArray';
            expect(function () {
                ko.observableArray().defineType();
            }
                ).toThrowError(message);
        });

        it('should create the defineType as function', function () {
            expect(typeof ko.observable().defineType).toBe('function');
        });

        it('should set propety schemaType on the observable', function () {
            var observable = ko.observable('').defineType('string');
            var defferedObservable = ko.defferedObservable({ deferred: testPromise }).defineType('string');
            expect(observable.schemaType).toBeDefined();
            expect(defferedObservable.schemaType).toBeDefined();
        });

        it('schemaType should be the sent arg when it is a valid type', function () {
            var observable = ko.observable('').defineType('number');
            var defferedObservable = ko.defferedObservable({ deferred: testPromise }).defineType('number');
            expect(observable.schemaType).toEqual('number');
            expect(defferedObservable.schemaType).toEqual('number');
        });

        it('schemaType should throw error when arg is not a valid type', function () {
            message = 'cannot set property schemaType, value is not a valid type';
            expect(function () {
                ko.observable('').defineType('aaa');
            }).toThrowError(message);
            expect(function () {
                ko.defferedObservable({ deferred: testPromise }).defineType('aaa');
            }).toThrowError(message);
        });

        it('schemaType should not be affected by initial value type', function () {
            var observable = ko.observable('abc').defineType('number');
            expect(observable.schemaType).toEqual('number');
        });

        it('return right this', function () {
            var observable = ko.observable('bbb');
            var defaultValueObj = observable.defineType('number');
            expect(observable).toEqual(defaultValueObj);
        });

    });

});
define('spec/defaultValueSpec.js', function () { });
