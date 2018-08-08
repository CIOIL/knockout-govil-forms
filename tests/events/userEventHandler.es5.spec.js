/// <reference path="userEventHandler.spec.js" />
define(['common/utilities/stringExtension', 'common/events/userEventHandler', 'common/core/exceptions'], function ( //eslint-disable-line max-params
stringExtension, userEventHandler, exceptions) {

    jasmine.getFixtures().fixturesPath = './elements/templates';

    describe('userEventHandler', function () {

        describe('invoke: ', function () {

            var delay = 500;

            var subscriber;

            var args = {
                name: 'avi',
                age: 30
            };

            var foo = { bar: function bar() {
                    return true;
                } };
            var baz = { bar: function bar() {
                    return false;
                } };

            var eventSettings = {
                event: 'CustomEvent',
                callback: foo.bar,
                afterEvent: true,
                publishedData: { args: args }
            };

            beforeEach(function () {

                if (subscriber && subscriber.dispose) {
                    subscriber.dispose();
                }
            });

            it('subscribers to the before event get the published data', function (done) {

                subscriber = ko.postbox.subscribe('userBeforeCustomEvent', function (data) {
                    setTimeout(function () {
                        expect(data.publishedData.args).toEqual(args);
                        done();
                    }, delay);
                });

                userEventHandler.invoke(eventSettings);
            });

            it('subscribers to the before event get a pending promise', function (done) {
                subscriber = ko.postbox.subscribe('userBeforeCustomEvent', function (data) {
                    setTimeout(function () {
                        expect(data.deferred.promise).toBeDefined();
                        expect(data.deferred.promise.isPending).toBeTruthy();
                        done();
                    }, delay);
                });

                userEventHandler.invoke(eventSettings);
            });

            it('subscribers to the after event get the published data', function (done) {
                subscriber = ko.postbox.subscribe('userAfterCustomEvent', function (data) {
                    setTimeout(function () {
                        expect(data.args).toEqual(args);
                        done();
                    }, delay);
                });

                userEventHandler.invoke(eventSettings);
            });

            it('callback is activated when subscriber resolves', function (done) {

                spyOn(foo, 'bar');

                subscriber = ko.postbox.subscribe('userBeforeCustomEvent', function (data) {
                    data.deferred.resolve();
                    setTimeout(function () {
                        expect(foo.bar).toHaveBeenCalled();
                        done();
                    }, delay);
                });
                eventSettings.callback = foo.bar.bind(foo);
                userEventHandler.invoke(eventSettings);
            });

            it('callback is activated when no subscribers', function (done) {
                spyOn(foo, 'bar');
                eventSettings.callback = foo.bar.bind(foo);
                userEventHandler.invoke(eventSettings);

                setTimeout(function () {
                    expect(foo.bar).toHaveBeenCalled();
                    done();
                }, delay);
            });

            it('callback is not activated when subscriber rejects', function (done) {
                spyOn(foo, 'bar');

                subscriber = ko.postbox.subscribe('userBeforeCustomEvent', function (data) {
                    data.deferred.reject();
                    setTimeout(function () {
                        expect(foo.bar).not.toHaveBeenCalled();
                        done();
                    }, delay);
                });
                eventSettings.callback = foo.bar.bind(foo);
                userEventHandler.invoke(eventSettings);
            });

            it('fcallback is activated when subscriber rejects', function (done) {
                spyOn(baz, 'bar');

                subscriber = ko.postbox.subscribe('userBeforeCustomEvent', function (data) {
                    data.deferred.reject();
                    setTimeout(function () {
                        expect(baz.bar).toHaveBeenCalled();
                        done();
                    }, delay);
                });
                eventSettings.callback = foo.bar.bind(foo);
                eventSettings.fcallback = baz.bar.bind(baz);
                userEventHandler.invoke(eventSettings);
            });

            it('after event  is activated by default', function (done) {

                var called = false;
                subscriber = ko.postbox.subscribe('userAfterCustomEvent', function () {
                    //set indication that the userAfterCustomEvent was published
                    called = true;
                });

                setTimeout(function () {
                    expect(called).toBeTruthy();
                    done();
                }, delay);

                userEventHandler.invoke({
                    event: 'CustomEvent',
                    callback: foo.bar,
                    publishedData: { args: args }
                });
            });

            it('after event  is not activated when set to false', function (done) {
                var called = false;
                subscriber = ko.postbox.subscribe('userAfterCustomEvent', function () {
                    //This code is expected to never run
                    called = true;
                });

                setTimeout(function () {
                    expect(called).toBeFalsy();
                    done();
                }, delay);

                userEventHandler.invoke({
                    event: 'CustomEvent',
                    callback: foo.bar,
                    afterEvent: false,
                    publishedData: { args: args }
                });
            });

            it('after event  is not activated when before subscriber rejects', function (done) {

                subscriber = ko.postbox.subscribe('userBeforeCustomEvent', function (data) {
                    data.deferred.reject();
                });

                var called = false;
                ko.postbox.subscribe('userAfterCustomEvent', function () {
                    //This code is expected to never run
                    called = true;
                });

                setTimeout(function () {
                    expect(called).toBeFalsy();
                    done();
                }, delay);

                userEventHandler.invoke(eventSettings);
            });

            describe('exceptions', function () {
                it('throw when there is no callback', function () {
                    expect(function () {
                        userEventHandler.invoke({
                            event: 'CustomEvent',
                            callback: undefined,
                            afterEvent: true,
                            publishedData: { args: args }
                        });
                    }).toThrowError(exceptions.FormError);
                });

                it('throw when there is no event', function () {
                    expect(function () {
                        userEventHandler.invoke({
                            event: undefined,
                            callback: foo.bar,
                            afterEvent: true,
                            publishedData: { args: args }
                        });
                    }).toThrowError(exceptions.FormError);
                });
            });
        });
    });
});