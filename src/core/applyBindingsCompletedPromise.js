define(['common/external/q'],
function (Q) {
    var applyBindingsCompletedPromise = Q.defer();

    ko.postbox.subscribe('applyBindingsCompleted', function () {
        applyBindingsCompletedPromise.resolve();
    });

    return applyBindingsCompletedPromise;

});