define(['common/ko/fn/defaultValue', 'common/external/q', 'common/ko/globals/defferedObservable'],
function (defaultValue, Q) {//eslint-disable-line no-unused-vars
    describe('fn  defaultValue', function () {
        var testPromise;
        beforeAll(function () {
            testPromise = Q.fcall(function () {
                return 10;
            });
        });
        it('should create the defaultValue on ko.observable,observableArray, writableComputed', function () {
            expect(ko.observable().defaultValue).toBeDefined();
            expect(ko.observableArray().defaultValue).toBeDefined();
            expect(ko.defferedObservable({ deferred: testPromise }).defaultValue).toBeDefined();
        });
        it('should create the defaultValue as function', function () {
            expect(typeof ko.observable().defaultValue).toBe('function');
        });
        it('set defaultValue to defferedObservable', function (done) {
            var defferedObservable = ko.defferedObservable({ deferred: testPromise }).defaultValue('aaa');
            testPromise.then(function () {
                expect(defferedObservable()).toBe('aaa');
                done();
            });
        });
        it('set defaultValue at empty observable', function () {
            var observable = ko.observable('').defaultValue('aaa');
            expect(observable()).toBe('aaa');
        });
        it('set defaultValue at null observable', function () {
            var observable = ko.observable(null).defaultValue('aaa');
            expect(observable()).toBe('aaa');
        });
        it('set defaultValue at undefined observable', function () {
            var observable = ko.observable().defaultValue('aaa');
            expect(observable()).toBe('aaa');
        });
        it('not move defaultValue to observable value', function () {
            var observable = ko.observable('bbb').defaultValue('aaa');
            expect(observable()).toBe('bbb');
        });
        it('not move defaultValue to observable with value: 0', function () {
            var observable = ko.observable(0).defaultValue('aaa');
            expect(observable()).toBe(0);
        });
        it('not move defaultValue to observable with value: false', function () {
            var observable = ko.observable(false).defaultValue('aaa');
            expect(observable()).toBe(false);
        });
        it('not move defaultValue to observable with null object', function () {
            var observable = ko.observable({}).defaultValue('aaa');
            expect(observable()).toEqual({});
        });
        it('not move defaultValue to observable with value: NaN', function () {
            var observable = ko.observable(NaN).defaultValue('aaa');
            expect(observable()).toBeNaN();
        });
        it('set defaultValue at empty observableArray', function () {
            var observableArray = ko.observableArray([]).defaultValue(['1', '2']);
            expect(observableArray()).toEqual(['1', '2']);
        });
        it('get defaultValue', function () {
            var observable = ko.observable('bbb').defaultValue('aaa');
            expect(observable.defaultVal).toBe('aaa');
        });
        it('return right this', function () {
            var observable = ko.observable('bbb');
            var defaultValueObj = observable.defaultValue('aaa');
            expect(observable).toEqual(defaultValueObj);
        });

    });

});
define('spec/defaultValueSpec.js', function () { });
