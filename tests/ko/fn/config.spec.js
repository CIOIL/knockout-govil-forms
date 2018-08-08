define(['common/ko/fn/config'],
     function () {
         describe('fn config', function () {

             var Person = function () {
                 var self = this;
                 self.firstName = ko.observable('');
                 self.lastName = ko.observable('');
             };

             it('should create the config on ko.observable', function () {
                 expect(ko.observable().config).toBeDefined();
             });

             it('should create the config as function', function () {
                 expect(typeof ko.observable().config).toBe('function');
             });

             it('get config', function () {
                 var observable = ko.observableArray([new Person()]).config({ type: Person });
                 expect(observable.config).toEqual({ type: Person });
             });

             it('return right this', function () {
                 var observable = ko.observable('bbb');
                 var configObj = observable.config({ type: Person });
                 expect(observable).toEqual(configObj);
             });
         });

     });
define('spec/configSpec.js', function () { });