var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/utilities/eventsHandlers'], function (eventsHandlers) {

    var userAfterPrint;

    describe('eventsHandlers', function () {

        it('to be defined', function () {
            expect(eventsHandlers).toBeDefined();
        });

        it('window.userAfterPrint should be undefined before call createEventHandler', function () {
            expect(_typeof(window.userAfterPrint)).toEqual('undefined');
        });
    });

    describe('createEventHandler', function () {

        beforeEach(function () {
            userAfterPrint = function userAfterPrint() {};
            var settings = {
                userAfterPrint: userAfterPrint
            };
            eventsHandlers.createEventHandler(settings);
        });

        it('window.userAfterPrint should be defined after call createEventHandler', function () {
            expect(_typeof(window.userAfterPrint)).toEqual('function');
        });
    });
});