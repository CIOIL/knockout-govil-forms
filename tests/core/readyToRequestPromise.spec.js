define([
    'common/core/readyToRequestPromise'   
],
    function (readyToRequestPromise) {

        it('readyToRequest promise is not fulfilled', function () {
            expect(readyToRequestPromise.isFulfilled()).toBeFalsy();
        });
        it('readyToRequest promise is resolved when required promises are resolved', function (done) {
            ko.postbox.publish('documentReady');//Causes to resolve domReadyPromise
            //setTimeout(function () {//not work in IE
            //    expect(readyToRequestPromise.isFulfilled()).toBeTruthy();
            //    done();
            //});
            readyToRequestPromise.then(function() {
                expect('readyToRequestPromise now is fullfield').toBe('readyToRequestPromise now is fullfield');
                done();
            });
        });

    });