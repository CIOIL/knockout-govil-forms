define(function () {
    ko.observable.fn.config = function (value) {

        this.config = value;

        return this;
    };
});