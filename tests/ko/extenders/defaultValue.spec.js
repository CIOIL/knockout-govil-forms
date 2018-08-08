define(['common/ko/extenders/defaultValue', 'common/external/q', 'common/ko/globals/defferedObservable'],
function (defaultValue, Q) {//eslint-disable-line no-unused-vars
    describe('extender defaultValue', function () {

        describe('on declaration', function () {
            it('set defaultValue to empty string observable value', function () {
                var observable = ko.observable('').extend({ defaultValue: 'default value' });
                expect(observable()).toBe('default value');
            });
            it('set defaultValue to undefined observable value', function () {
                var observable = ko.observable().extend({ defaultValue: 'default value' });
                expect(observable()).toBe('default value');
            });
            it('observable value when it is not empty', function () {
                var observable = ko.observable('other value').extend({ defaultValue: 'default value' });
                expect(observable()).toBe('other value');
            });
        });

        describe('after changing', function () {
            it('set defaultValue to observable value when remove value', function () {
                var observable = ko.observable('other value').extend({ defaultValue: 'default value' });
                observable('');
                expect(observable()).toBe('default value');
            });

            it('set defaultValue to observable value when set undefined value', function () {
                var observable = ko.observable('other value').extend({ defaultValue: 'default value' });
                observable(undefined);
                expect(observable()).toBe('default value');
            });

            it('set value to observable value when set undefined value', function () {
                var observable = ko.observable('other value').extend({ defaultValue: 'default value' });
                observable('new value');
                expect(observable()).toBe('new value');
            });

        });

        describe('with subscribe', function () {
            it('check original subscribe and extender subscribe are called', function () {
                var result;
                var observable = ko.observable('other value').extend({ defaultValue: 'default value' });
                observable.subscribe(function () {
                    result = observable();
                });
                observable('bla');
                expect(result).toBe('bla');
                observable('');
                expect(observable()).toBe('default value');
                expect(result).toBe('default value');
            });

        });

    });

});
define('spec/defaultValueSpec.js', function () { });
