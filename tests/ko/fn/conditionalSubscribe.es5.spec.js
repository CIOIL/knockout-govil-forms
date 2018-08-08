var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/ko/fn/conditionalSubscribe', 'common/resources/exeptionMessages', 'common/utilities/stringExtension'], function (conditionalSubscribe, exeptionMessages, stringExtension) {
    describe('fn conditionalSubscribe', function () {

        it('should create the conditionalSubscribe on ko.subscribable', function () {
            expect(ko.observable().conditionalSubscribe).toBeDefined();
            expect(ko.computed(function () {}).conditionalSubscribe).toBeDefined();
            expect(ko.observableArray().conditionalSubscribe).toBeDefined();
        });

        it('should create the conditionalSubscribe as function', function () {
            expect(_typeof(ko.observable().conditionalSubscribe)).toBe('function');
        });

        it('should return ko subscription', function () {
            var subscription = ko.observable().conditionalSubscribe(function () {});
            expect(subscription.hasOwnProperty('dispose')).toBe(true);
        });

        it('should throw exeption if condition parameter is not a function', function () {
            expect(function () {
                ko.observable().conditionalSubscribe(true, function () {});
            }).toThrowError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'condition', 'function'));
        });

        describe('set subscribe function', function () {
            var observable = ko.observable();
            var context = {};
            beforeEach(function () {
                spyOn(observable, 'subscribe');
                observable.conditionalSubscribe(function () {}, function () {}, context, 'beforeChange');
            });
            it('should set subscribe function on target', function () {
                expect(observable.subscribe).toHaveBeenCalled();
            });
            it('should set subscribe function on target with the right parameters', function () {
                var callArgs = observable.subscribe.calls.first().args;
                expect(callArgs.length).toEqual(3);
                expect(_typeof(callArgs[0])).toBe('function');
                expect(callArgs[1]).toEqual(context);
                expect(callArgs[2]).toEqual('beforeChange');
            });
        });

        describe('manage subscription according to condition function parameter', function () {
            var boolean,
                observable = ko.observable();
            var functionParams = {
                callback: function callback() {},
                condition: function condition() {
                    return boolean;
                }
            };
            beforeEach(function () {
                spyOn(functionParams, 'callback');
                ko.observable('');
            });
            it('should call callback function if condition function returns true', function () {
                boolean = true;
                observable.conditionalSubscribe(functionParams.condition, functionParams.callback);
                observable('a');
                expect(functionParams.callback).toHaveBeenCalled();
            });
            it('should not call callback function if condition function returns false', function () {
                boolean = false;
                observable.conditionalSubscribe(functionParams.condition, functionParams.callback);
                observable('a');
                expect(functionParams.callback).not.toHaveBeenCalled();
            });
            it('should call the callback function with new value', function () {
                boolean = true;
                observable.conditionalSubscribe(functionParams.condition, functionParams.callback);
                observable('New Value');
                expect(functionParams.callback).toHaveBeenCalledWith('New Value');
            });
        });
    });
});
define('spec/conditionalSubscribeSpec.js', function () {});