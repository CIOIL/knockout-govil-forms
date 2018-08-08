define(['common/ko/globals/defferedObservable', 'common/external/q'], function (defferedObservable, Q) {
    describe('ko.defferedObservable', function () {
        var successResult, fulfilledPromise, rejectedPromise, value;
        it('defferedObservable is declare on ko', function () {
            expect(ko.defferedObservable).toBeDefined();
        });
        describe('parameters', function () {
            beforeEach(function () {
                successResult = 10;
                fulfilledPromise = Q.fcall(function () {
                    return successResult;
                });
                rejectedPromise = Q.fcall(function () {
                    throw new Error('Cant do it');
                });
            });
            it('settings cant be undefined', function () {
                expect(function () {
                    ko.defferedObservable();
                }).toThrowError('the parameter "settings" is undefined');
            });
            it('settings.initialValue - observable initialized with empty string if parameter not sent', function () {
                var value = ko.defferedObservable({ deferred: rejectedPromise });
                expect(value()).toEqual('');
            });
            it('settings.initialValue - observable initialized with undefined if parameter sent with undefined string if parameter not sent', function () {
                var value = ko.defferedObservable({ initialValue: undefined, deferred: rejectedPromise });
                expect(value()).toEqual(undefined);
            });
            it('settings.initialValue - observable value init by initialValue', function () {
                var value = ko.defferedObservable({ initialValue: '01/01/2016', deferred: rejectedPromise });
                expect(value()).toEqual('01/01/2016');
            });
            it('settings.deferredInitialValue - observable init by deferredInitialValue when promise is fulfilled', function (done) {
                var value = ko.defferedObservable({ deferredInitialValue: '01/01/2016', deferred: fulfilledPromise });
                fulfilledPromise.then(function () {
                    expect(value()).toEqual('01/01/2016');
                    done();
                });
            });
            it('settings.defferd - undefined is invalid', function () {
                expect(function () {
                    ko.defferedObservable({});
                }).toThrowError('the parameter "settings.deferred" is invalid');
            });
            it('settings.defferd - empty object is invalid', function () {
                expect(function () {
                    ko.defferedObservable({ deferred: {} });
                }).toThrowError('the parameter "settings.deferred" is invalid');
            });
            it('settings.defferd - string is invalid', function () {
                expect(function () {
                    ko.defferedObservable({ deferred: 'Hi' });
                }).toThrowError('the parameter "settings.deferred" is invalid');
            });
        });
        describe('fulfilled promise', function () {
            beforeEach(function () {
                successResult = 10;
                fulfilledPromise = Q.fcall(function () {
                    return successResult;
                });
                rejectedPromise = Q.fcall(function () {
                    throw new Error('Cant do it');
                });
                value = ko.defferedObservable({ deferred: fulfilledPromise });
            });
            it('value isnt updated as long as the promise isnt fulfilled', function () {
                value('01/01/2016');
                expect(value()).toEqual('');
            });

            it('value is updated when promise is fulfilled', function (done) {
                fulfilledPromise.then(function () {
                    value('01/01/2016');
                    expect(value()).toEqual('01/01/2016');
                    done();
                });
            });
            it('when promise is already fulfilled - value is updated immediately', function (done) {
                var defered = Q.defer();
                defered.resolve();
                var value = ko.defferedObservable({ initialValue: '01/01/2016', deferred: defered.promise });
                value('newValue');
                expect(value()).toEqual('newValue');
                done();
            });
        });
        describe('rejected promise', function () {
            beforeEach(function () {
                successResult = 10;
                fulfilledPromise = Q.fcall(function () {
                    return successResult;
                });
                rejectedPromise = Q.fcall(function () {
                    throw new Error('Cant do it');
                });
            });
            it('value isnt updated when promise is rejected', function (done) {
                var value = ko.defferedObservable({ initialValue: '01/01/2016', deferred: rejectedPromise });
                value('newValue');
                rejectedPromise.catch(function () {
                    expect(value()).toEqual('01/01/2016');
                    done();
                });
            });
        });
        it('returned value is computed observable', function () {
            var value = ko.defferedObservable({ deferred: fulfilledPromise });
            expect(ko.isComputed(value)).toBeTruthy();
        });
    });
});
define('spec/defferedObservableSpec.js', function () {});