define(['common/core/applyBindingsCompletedPromise','common/ko/fn/afterLoadSubscribe'],
     function (applyBindingsCompletedPromise) {
         describe('fn afterLoadSubscribe', function () {

             it('should create the afterLoadSubscribe on ko.subscribable', function () {
                 expect(ko.observable().afterLoadSubscribe).toBeDefined();
                 expect(ko.computed(function () { }).afterLoadSubscribe).toBeDefined();
                 expect(ko.observableArray().afterLoadSubscribe).toBeDefined();
             });

             it('should create the afterLoadSubscribe as function', function () {
                 expect(typeof ko.observable().afterLoadSubscribe).toBe('function');
             });

             it('should return ko subscription', function () {
                 var subscription = ko.observable().afterLoadSubscribe(() => { });
                 expect(subscription.hasOwnProperty('dispose')).toBe(true);
             });

             describe('set subscribe function', function () {
                 var observable = ko.observable();
                 var context = {};
                 beforeEach(function () {
                     spyOn(observable, 'subscribe');
                     observable.afterLoadSubscribe(() => { }, context, 'beforeChange');
                 });
                 it('should set subscribe function on target', function () {
                     expect(observable.subscribe).toHaveBeenCalled();
                 });
                 it('should set subscribe function on target with the right parameters', function () {
                     var callArgs = observable.subscribe.calls.first().args;
                     expect(callArgs.length).toEqual(3);
                     expect(typeof callArgs[0]).toBe('function');
                     expect(callArgs[1]).toEqual(context);
                     expect(callArgs[2]).toEqual('beforeChange');
                 });
             });

             describe('manage subscription according to applyBindingsCompletedPromise', function () {
                 var fulfilled, observable = ko.observable();
                 var functionParams = {
                     callback () { }
                 };
                 var isFulfilled =  () => fulfilled;

                 beforeEach(function () {
                     spyOn(functionParams, 'callback');
                     spyOn(applyBindingsCompletedPromise.promise, 'isFulfilled').and.callFake(isFulfilled);
                     observable('');
                     observable.afterLoadSubscribe(functionParams.callback);

                 });

                 it('should call callback function if applyBindingsCompletedPromise isFulfilled', function () {
                     fulfilled = true;
                     observable('a');
                     expect(functionParams.callback).toHaveBeenCalled();
                 });

                 it('should not call callback function if applyBindingsCompletedPromise is not fulfilled', function () {
                     fulfilled = false;
                     observable('a');
                     expect(functionParams.callback).not.toHaveBeenCalled();
                 });

                 it('should call the callback function with new value', function () {
                     fulfilled = true;
                     observable('New Value');
                     expect(functionParams.callback).toHaveBeenCalledWith('New Value');
                 });

             });

         });

     });
define('spec/afterLoadSubscribe.js', function () { });