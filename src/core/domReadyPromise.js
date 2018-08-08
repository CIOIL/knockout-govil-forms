define(['common/external/q'],
function (Q) {
    var domReadyPromise = Q.defer();

    ko.postbox.subscribe('documentReady', function () {
        domReadyPromise.resolve();
    });

    return domReadyPromise;

});