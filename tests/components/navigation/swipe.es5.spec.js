/// <reference path='templates/swipeSpec.html' />
define(['common/components/navigation/containersViewModel', 'common/components/navigation/ContainerVM', 'common/infrastructureFacade/tfsMethods', 'common/viewModels/languageViewModel'], function (containersViewModel, ContainerVM, tfsMethods, languageViewModel) {
    //eslint-disable-line max-params

    describe('swipe', function () {

        var delay = 500;

        var fakeSetLanguage = function fakeSetLanguage(language) {
            return language;
        };

        var viewModel = {
            containersViewModel: containersViewModel
        };

        describe('swipe binding handler', function () {

            beforeEach(function () {
                containersViewModel.containersList([]);
                containersViewModel.loadContainers({
                    first: new ContainerVM({}, containersViewModel),
                    second: new ContainerVM({}, containersViewModel),
                    third: new ContainerVM({}, containersViewModel)
                });
                jasmine.getFixtures().fixturesPath = 'base/Tests/components/navigation/templates';
                loadFixtures('swipeSpec.html');
                ko.cleanNode($('body')[0]);
                ko.applyBindings(viewModel);
                spyOn(tfsMethods, 'isMobile').and.callFake(function () {
                    return true;
                });
            });

            afterEach(function () {
                ko.cleanNode(document.body);
            });

            it('should be defined', function () {
                expect(ko.bindingHandlers.swipe).toBeDefined();
            });

            describe('hebrew', function () {

                beforeEach(function () {
                    spyOn(tfsMethods, 'setFormLanguage').and.callFake(fakeSetLanguage);
                    languageViewModel.language('hebrew');
                });

                it('swipe right brings next container', function (done) {
                    //ko.postbox.subscribe('userAfterNavigateToContainer', function () {
                    //    expect(containersViewModel.currentContainerName()).toBe('second');
                    //    done();
                    //});
                    $('#user').trigger('swiperight');
                    setTimeout(function () {
                        expect(containersViewModel.currentContainerName()).toBe('second');
                        done();
                    }, delay);
                    //expect(containersViewModel.currentContainerName()).toBe('second');
                    //setTimeout(function () {
                    //    done();
                    //}, 6000);//eslint-disable-line no-magic-numbers
                });

                it('swipe left brings previous container', function (done) {
                    $('#user').trigger('swipeleft');
                    setTimeout(function () {
                        expect(containersViewModel.currentContainerName()).toBe('first');
                        done();
                    }, delay);
                });
            });

            describe('english', function () {

                beforeEach(function () {
                    spyOn(tfsMethods, 'setFormLanguage').and.callFake(fakeSetLanguage);
                    languageViewModel.language('english');
                });

                it('swipe left brings next container', function (done) {
                    //ko.postbox.subscribe('userAfterNavigateToContainer', function () {
                    //    expect(containersViewModel.currentContainerName()).toBe('first');
                    //    done();
                    //});
                    $('#user').trigger('swipeleft');

                    setTimeout(function () {
                        expect(containersViewModel.currentContainerName()).toBe('second');
                        done();
                    }, delay);
                });

                it('swipe right brings previous container', function (done) {
                    //ko.postbox.subscribe('userAfterNavigateToContainer', function () {
                    //    expect(containersViewModel.currentContainerName()).toBe('second');
                    //    done();
                    //});
                    $('#user').trigger('swiperight');

                    setTimeout(function () {
                        expect(containersViewModel.currentContainerName()).toBe('first');
                        done();
                    }, delay);
                });
            });

            describe('other language - direction as english - ltr', function () {

                beforeEach(function () {
                    spyOn(tfsMethods, 'setFormLanguage').and.callFake(fakeSetLanguage);
                    languageViewModel.language('spanish');
                });

                it('swipe left brings next container', function (done) {
                    $('#user').trigger('swipeleft');

                    setTimeout(function () {
                        expect(containersViewModel.currentContainerName()).toBe('second');
                        done();
                    }, delay);
                });

                it('swipe right brings previous container', function (done) {
                    $('#user').trigger('swiperight');

                    setTimeout(function () {
                        expect(containersViewModel.currentContainerName()).toBe('first');
                        done();
                    }, delay);
                });
            });

            it('', function () {
                expect(ko.bindingHandlers.swipe).toBeDefined();
            });

            it('should be defined', function () {
                expect(ko.bindingHandlers.swipe).toBeDefined();
            });
        });
    });

    //$(document).ready(function () {
    //    window.executeTests();
    //});
});

define('spec/swipeSpec.js', function () {});