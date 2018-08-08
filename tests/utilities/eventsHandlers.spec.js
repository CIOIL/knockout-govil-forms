define(['common/utilities/eventsHandlers'],
function (eventsHandlers) {

    var userAfterPrint;

    describe('eventsHandlers', function () {

        it('to be defined', function () {
            expect(eventsHandlers).toBeDefined();
        });

        it('window.userAfterPrint should be undefined before call createEventHandler', function () {
            expect(typeof window.userAfterPrint).toEqual('undefined');
        });
    });

    describe('createEventHandler', function () {

        beforeEach(function () {
            userAfterPrint = function () { };
            var settings = {
                userAfterPrint: userAfterPrint
            };
            eventsHandlers.createEventHandler(settings);
        });       
        
        it('window.userAfterPrint should be defined after call createEventHandler', function () {
            expect(typeof window.userAfterPrint).toEqual('function');
        });
    });

});