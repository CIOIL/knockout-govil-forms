var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/components/navigation/ContainerVM', 'common/components/navigation/containersViewModel', 'common/core/generalAttributes'], function (ContainerVM, containersViewModel, generalAttributes) {
    //eslint-disable-line no-unused-vars

    describe('navigation', function () {
        var resources = containersViewModel.resources;
        var containers, containersList;
        var declarationDisabledCondition;
        beforeEach(function () {

            var containerTexts = {
                hebrew: {
                    title: 'מגיש הבקשה',
                    longTitle: 'פרטי מגיש הבקשה'
                },
                english: {
                    title: 'applicant',
                    longTitle: 'requestor details'
                }
            };
            declarationDisabledCondition = ko.observable(true);
            containers = {
                privateDetails: new ContainerVM({ name: 'privateDetails', texts: containerTexts, shouldBeValidated: false }, containersViewModel),
                contacts: new ContainerVM({ name: 'contacts', texts: { title: 'אנשי קשר' }, shouldBeValidated: false }, containersViewModel),
                declaration: new ContainerVM({
                    name: 'declaration', text: { title: 'הצהרה וחתימה' },
                    shouldBeValidated: false,
                    isEnabled: declarationDisabledCondition
                }, containersViewModel)
            };
            containersViewModel.containersList.removeAll();
            containersViewModel.loadContainers(containers);
        });

        it('should be defined', function () {
            expect((typeof containersViewModel === 'undefined' ? 'undefined' : _typeof(containersViewModel)) === 'object').toBeTruthy();
            expect(_typeof(containersViewModel.containersList()) === 'object').toBeTruthy();
        });

        describe('Containers list creation', function () {

            it('has the correct length', function () {
                expect(containersViewModel.containersList().length).toEqual(3);
            });
            //todo: container must be instance of Container' expect(anotherType).toThrowError(stringExtension.format(exeptionMessages.invalidElementTypeParam,['container','ContainerVM'])),
            //expect(undefined).to??

            it('has the item in the list are instance of ContainerVM', function () {
                expect(containersViewModel.containersList()[0] instanceof ContainerVM).toBeTruthy();
            });
        });

        describe('Containers List', function () {
            beforeEach(function () {
                containersList = containersViewModel.containersList();
            });

            it('default value currentContainer - first item', function () {
                expect(containersViewModel.currentContainerName()).toEqual(containersList[0].name());
            });

            describe('navigateToContainer', function () {
                it('move', function (done) {
                    var navigationPromise = containersViewModel.navigateToContainer(containersList[1], containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersList[2].isCurrentContainer()).toEqual(true);
                        done();
                    });
                });

                it('move to the current container', function (done) {
                    var currentContainer = containersViewModel.currentContainer();
                    var navigationPromise = containersViewModel.navigateToContainer(currentContainer, currentContainer);
                    navigationPromise.then(function () {
                        expect(currentContainer.isCurrentContainer()).toEqual(true);
                        done();
                    });
                });

                it('rejection in beforeNavigation should abort the navigation', function (done) {
                    containersList[0].setValidationState(resources.stateTypes.notValidated);
                    containersList[0].beforeNavigation = function (data) {
                        data.deferred.reject();
                    };
                    var navigationPromise = containersViewModel.navigateToContainer(containersList[0], containersList[1]);
                    navigationPromise.fail(function () {
                        expect(containersList[0].isCurrentContainer()).toEqual(true);
                        done();
                        return;
                    });
                });

                it('resolve in beforeNavigation should complete the navigation', function (done) {
                    containersList[0].setValidationState(resources.stateTypes.notValidated);
                    containersList[0].beforeNavigation = function (data) {
                        data.deferred.resolve();
                    };
                    var navigationPromise = containersViewModel.navigateToContainer(containersList[0], containersList[1]);
                    navigationPromise.then(function () {
                        expect(containersList[1].isCurrentContainer()).toEqual(true);
                        done();
                        return;
                    });
                });
            });

            describe('moveToContainer', function () {

                it('move', function (done) {
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersViewModel.currentContainer()).toEqual(containersList[2]);
                        done();
                    });
                });

                it('move to the current container', function (done) {
                    var currentContainer = containersViewModel.currentContainer();
                    var navigationPromise = containersViewModel.moveToContainer(currentContainer);
                    navigationPromise.then(function () {
                        expect(currentContainer.isCurrentContainer()).toEqual(true);
                        done();
                    });
                });

                it('with error container not move and throw error', function () {
                    containersViewModel.moveToContainer(containers.privateDetails);
                    expect(function () {
                        containersViewModel.moveToContainer(containersList[3]);
                    }).toThrow(new Error(resources.errorMessages.containerNotFound));
                    expect(containers.privateDetails.isCurrentContainer()).toBeTruthy();
                });

                it('rejection in beforeNavigation should abort the navigation', function (done) {
                    containersViewModel.currentContainer().setValidationState(resources.stateTypes.notValidated);
                    containersViewModel.currentContainer().beforeNavigation = function (data) {
                        data.deferred.reject();
                    };
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    // spyOn(navigationPromise, 'fail').and.callThrough();
                    navigationPromise.fail(function () {
                        expect(containersViewModel.currentContainer()).not.toEqual(containersList[2]);
                        // expect(navigationPromise.fail).toHaveBeenCalled();
                        done();
                        return;
                    });
                });

                it('resolve in beforeNavigation should complete the navigation', function (done) {
                    containersViewModel.currentContainer().setValidationState(resources.stateTypes.notValidated);
                    containersViewModel.currentContainer().beforeNavigation = function (data) {
                        data.deferred.resolve();
                    };
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersViewModel.currentContainer()).toEqual(containersList[2]);
                        done();
                    });
                });

                it('invalid currentContainer should abort the namigation where shouldBeValidated = true', function (done) {
                    spyOn(containersViewModel.currentContainer(), 'shouldBeValidated').and.callFake(function () {
                        return true;
                    });
                    spyOn(containersViewModel.currentContainer(), 'setValidationState').and.callFake(function () {
                        return false;
                    });
                    containersViewModel.currentContainer().beforeNavigation = function (data) {
                        data.deferred.resolve();
                    };
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.fail(function () {
                        expect(containersViewModel.currentContainer()).not.toEqual(containersList[2]);
                        done();
                    });
                });
                it('invalid currentContainer should complete the namigation where shouldBeValidated = false', function (done) {
                    spyOn(containersViewModel.currentContainer(), 'shouldBeValidated').and.callFake(function () {
                        return true;
                    });
                    spyOn(containersViewModel.currentContainer(), 'setValidationState').and.callFake(function () {
                        return false;
                    });
                    containersViewModel.currentContainer().beforeNavigation = function (data) {
                        data.deferred.resolve();
                    };
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersViewModel.currentContainer()).toEqual(containersList[2]);
                        done();
                    });
                });

                //todo: change to async test
                it('navigation should open target container and close all others', function (done) {
                    containersViewModel.currentContainer().setValidationState(resources.stateTypes.notValidated);
                    containersViewModel.currentContainer().beforeNavigation = function (data) {
                        data.deferred.resolve();
                    };
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersViewModel.currentContainer().isClosed()).toBeFalsy();
                        ko.utils.arrayForEach(containersViewModel.containersList(), function (container) {
                            if (container !== containersViewModel.currentContainer()) {
                                expect(container.isClosed()).toBeTruthy();
                            }
                        });
                        done();
                    });
                });
                it('targetContainer.onEnter should be called when navigate to it', function (done) {
                    spyOn(containersList[2], 'onEnter').and.callThrough();
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersList[2].onEnter).toHaveBeenCalled();
                        done();
                    });
                });
                it('sourceContainer.onLeave should be called when navigate away', function (done) {
                    spyOn(containersList[0], 'onLeave').and.callThrough();
                    var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                    navigationPromise.then(function () {
                        expect(containersList[0].onLeave).toHaveBeenCalled();
                        done();
                    });
                });
            });
            it('isLast when current is last item', function () {
                containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                expect(containersViewModel.isLast()).toBeTruthy();
            });

            it('isLast when current is last enabled item', function () {
                declarationDisabledCondition(false);
                containersViewModel.currentContainerName(containersList[1].name()); //containersViewModel.moveToContainer(containersList[1]);
                expect(containersViewModel.isLast()).toBeTruthy();
            });

            it('isLast when current is not last item', function () {
                declarationDisabledCondition(true);
                containersViewModel.currentContainerName(containersList[1].name());
                expect(containersViewModel.isLast()).toBeFalsy();
                expect(true).toBeTruthy();
            });

            it('isFirst when current is first item', function () {
                containersViewModel.currentContainerName(containersList[0].name()); //containersViewModel.moveToContainer(containersList[0]);
                expect(containersViewModel.isFirst()).toBeTruthy();
            });

            it('isFirst when current is first enabled item', function () {
                containersViewModel.containersList()[0].isEnabled = ko.observable(false);
                containersViewModel.currentContainerName(containersList[1].name()); //containersViewModel.moveToContainer(containersList[1]);
                expect(containersViewModel.isFirst()).toBeTruthy();
            });

            it('isFirst when current is not first item', function () {
                containersViewModel.containersList()[0].isEnabled = ko.observable(true);
                containersViewModel.currentContainerName(containersList[1].name()); //containersViewModel.moveToContainer(containersList[1]);
                expect(containersViewModel.isFirst()).toBeFalsy();
            });

            describe('getPrevContainer', function () {

                it('get prev', function () {
                    containersViewModel.currentContainerName(containersList[1].name()); //containersViewModel.moveToContainer(containersList[1]);
                    expect(containersViewModel.getPrevContainer()).toEqual(containersList[0]);
                });

                it('getPrevContainer when current is first - return current', function () {
                    containersViewModel.currentContainerName(containersList[0].name()); //containersViewModel.moveToContainer(containersList[0]);
                    expect(containersViewModel.getPrevContainer()).toEqual(containersList[0]);
                });

                it('getPrevContainer when prev isn\'t Enabled get the exist enabled container', function () {
                    containersList[1].isEnabled = ko.observable(false);
                    containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                    expect(containersViewModel.getPrevContainer()).toEqual(containersList[0]);
                });

                it('getPrevContainer when current.prev is not exist throw error', function () {
                    containersList[1].isEnabled = ko.observable(true);
                    containersList[2].prev('customer');
                    containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                    expect(function () {
                        containersViewModel.getPrevContainer();
                    }).toThrow(new Error(resources.errorMessages.containerNotFound));
                });

                it('getPrevContainer when current.prev is exist get it', function () {
                    containersList[2].prev(containersList[0].name());
                    containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                    expect(containersViewModel.getPrevContainer()).toEqual(containersList[0]);
                });
            });

            describe('getNextContainer', function () {

                it('get Next', function () {
                    containersList[1].isEnabled = ko.observable(true);
                    containersViewModel.currentContainerName(containersList[1].name()); //containersViewModel.moveToContainer(containersList[1]);
                    expect(containersViewModel.getNextContainer()).toEqual(containersList[2]);
                });

                it('when current is last - return current', function () {
                    containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                    expect(containersViewModel.getNextContainer()).toEqual(containersList[2]);
                });

                it('when next isn\'t Enabled get the exist enabled container', function () {
                    containersList[1].isEnabled = ko.observable(false);
                    containersViewModel.currentContainerName(containersList[0].name()); //containersViewModel.moveToContainer(containersList[0]);
                    expect(containersViewModel.getNextContainer()).toEqual(containersList[2]);
                });

                it('when current.next is not exist throw error', function () {
                    containersList[1].isEnabled = ko.observable(true);
                    containersList[1].next('customer');
                    containersViewModel.currentContainerName(containersList[1].name()); //containersViewModel.moveToContainer(containersList[1]);
                    expect(function () {
                        containersViewModel.getNextContainer();
                    }).toThrow(new Error(resources.errorMessages.containerNotFound));
                });

                it('when current.next is not enabled throw error', function () {
                    containersList[2].next(containersList[0].name());
                    containersList[0].isEnabled = ko.observable(false);
                    containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                    expect(function () {
                        containersViewModel.getNextContainer();
                    }).toThrow(new Error(resources.errorMessages.containerNotEnabled));
                });

                it('when current.next is exist and enabled get it', function () {
                    containersList[2].next(containersList[0].name());
                    containersList[0].isEnabled = ko.observable(true);
                    containersViewModel.currentContainerName(containersList[2].name()); //containersViewModel.moveToContainer(containersList[2]);
                    expect(containersViewModel.getNextContainer()).toEqual(containersList[0]);
                });
            });

            it('getContainerIndex', function () {
                expect(containersViewModel.getContainerIndex(containersList[1].name())).toEqual(1);
            });

            it('getContainerIndex with error name throw error', function () {
                expect(function () {
                    containersViewModel.getContainerIndex('customer');
                }).toThrow(new Error(resources.errorMessages.containerNotFound));
            });
            describe('getContainerByName', function () {
                it('getContainerByName with exist name', function () {
                    expect(containersViewModel.getContainerByName('declaration')).toEqual(containersList[2]);
                });

                it('getContainerByName with does not exist name', function () {
                    expect(function () {
                        containersViewModel.getContainerByName('notExist');
                    }).toThrow(new Error(resources.errorMessages.containerNotFound));
                });
            });

            it('getContainerByIndex', function () {
                expect(containersViewModel.getContainerByIndex(1)).toEqual(containersList[1]);
            });

            it('getContainerByIndex with error index throw error', function () {
                expect(function () {
                    containersViewModel.getContainerByIndex(4);
                }).toThrow(new Error(resources.errorMessages.containerNotFound));
            });

            it('enableValidations', function () {
                containersViewModel.enableValidations();
                containersViewModel.validatedStatus.valueHasMutated();
                expect(containersList[0].shouldBeValidated()).toBeFalsy();
            });

            it('disableValidations', function () {
                containersViewModel.disableValidations();
                expect(containersList[0].shouldBeValidated()).toBeFalsy();
            });

            it('isShowSendButtons when is isTabs true and is last true and ShowSendButton is true', function () {
                containersViewModel.currentContainerName(containersList[2].name());
                containersViewModel.isTabsMode(true);
                ko.postbox.publish('ShowSendButton', true);
                expect(containersViewModel.isShowSendButton()).toBeTruthy();
            });

            it('isShowSendButtons when is isTabs true and is last true and ShowSendButton is false', function () {
                containersViewModel.currentContainerName(containersList[2].name());
                containersViewModel.isTabsMode(true);
                ko.postbox.publish('ShowSendButton', false);
                expect(containersViewModel.isShowSendButton()).toBeFalsy();
            });

            it('isShowPrintButtons when is isTabs true and is last true and ShowPrintButton is true', function () {
                containersViewModel.currentContainerName(containersList[2].name());
                containersViewModel.isTabsMode(true);
                ko.postbox.publish('ShowPrintButton', true);
                expect(containersViewModel.isShowPrintButton()).toBeTruthy();
            });

            it('isShowPrintButtons when is isTabs true and is last true and ShowPrintButton is false', function () {
                containersViewModel.currentContainerName(containersList[2].name());
                containersViewModel.isTabsMode(true);
                ko.postbox.publish('ShowPrintButton', false);
                expect(containersViewModel.isShowPrintButton()).toBeFalsy();
            });

            it('isShowButtons when is isTabs false and isn\'t last', function () {
                containersViewModel.isTabsMode(false);
                containersViewModel.moveToContainer(containersList[0]);
                expect(containersViewModel.isShowButtons()).toBeTruthy();
            });

            it('isShowButtons when is isTabs true and is last', function (done) {
                containersViewModel.isTabsMode(true);
                var navigationPromise = containersViewModel.moveToContainer(containersList[2]);
                navigationPromise.then(function () {
                    expect(containersViewModel.isShowButtons()).toBeTruthy();
                    done();
                });
            });

            it('isShowButtons when is isTabs true and isn\'t last', function (done) {
                containersViewModel.currentContainerName(containersList[2].name());
                containersViewModel.isTabsMode(true);
                var navigationPromise = containersViewModel.moveToContainer(containersList[0]);
                navigationPromise.then(function () {
                    expect(containersViewModel.isShowButtons()).toBeFalsy();
                    done();
                });
            });
        });
    });
});

define('spec/containersViewModel.spec.js', function () {});