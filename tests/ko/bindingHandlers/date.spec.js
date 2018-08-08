define([
    'common/ko/bindingHandlers/date'
],
function (date) {//eslint-disable-line 
    var viewModel = function () {
        var self = this;
        self.enabledDate = ko.observable(true);
        self.disabledDate = ko.observable(false);
        self.disableDateFunction = function () {
            return false;
        };
        self.disableDateByComputed = ko.computed(function () {
            return self.disabledDate();
        });
        self.undefinedFunction = function () {
            return undefined;
        };
        return self;
    }();
    ko.cleanNode(document.body);
    ko.applyBindings(viewModel);
    var notFound = -1;
    describe('tlpEnableDate', function () {
        beforeAll(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('date.html');
        });

        it('should create the binding handler', function () {
            expect(ko.bindingHandlers.tlpEnableDate).toBeDefined();
        });

        describe('enable date by observable', function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('date.html');
            var abc = $('#enabledDate');
            var datePicker = abc.next('input.tfsCalendar');
            it('date', function () {
                expect(abc.attr('disabled')).toBeUndefined();
            });
            it('datePicker', function () {
                expect(datePicker.attr('disabled')).toBeUndefined();
            });
        });
        describe('disable date by observable', function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('date.html');
            var disabledDate = $('#disabledDate');
            var datePicker = disabledDate.next('input.tfsCalendar');
            it('date', function () {
                expect(disabledDate.attr('disabled')).toEqual('disabled');
            });
            it('datePicker', function () {
                expect(datePicker.attr('disabled')).toEqual('disabled');
            });

        });
        describe('disable date by function that returns false', function () {
            var disableDateByFunction = $('#disableDateByFunction');
            var datePicker = disableDateByFunction.next('input.tfsCalendar');
            it('date', function () {
                expect(disableDateByFunction.attr('disabled')).toEqual('disabled');
            });
            it('datePicker', function () {
                expect(datePicker.attr('disabled')).toEqual('disabled');
            });

        });
        describe('disable date by function that return undefined', function () {
            var disableDateByUndefined = $('#disableDateByUndefined');
            var datePicker = disableDateByUndefined.next('input.tfsCalendar');
            it('date', function () {
                expect(disableDateByUndefined.attr('disabled')).toEqual('disabled');
            });
            it('datePicker', function () {
                expect(datePicker.attr('disabled')).toEqual('disabled');
            });
        });
        it('disable date by computed function that return false', function () {
            var disableDateByComputed = $('#disableDateByComputed');
            var datePicker = disableDateByComputed.next('input.tfsCalendar');
            it('date', function () {
                expect(disableDateByComputed.attr('disabled')).toEqual('disabled');
            });
            it('datePicker', function () {
                expect(datePicker.attr('disabled')).toEqual('disabled');
            });
        });

        it('throw exeption when tlpEnableDate is put not on date', function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('date.html');
            var simpleInput = $('#simpleInput');
            var dateBindinig = { tlpEnableDate: false };
            try {
                ko.applyBindingsToNode(simpleInput.get(0), dateBindinig);
            }
            catch (e) {
                expect(e.message.indexOf('the parameter "element" must be of date type') !== notFound).toBeTruthy();
            }
        });

    });


});
define('spec/date.js', function () {
});