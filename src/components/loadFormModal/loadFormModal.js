define(['common/core/applyBindingsCompletedPromise'],
    function (applyBindingsCompletedPromise) {
        $('.mainBody').addClass('no-scroll');
        applyBindingsCompletedPromise.promise.then(function () {
            $('.load-form-modal').hide();
            $('.mainBody').removeClass('no-scroll');
        });

    });