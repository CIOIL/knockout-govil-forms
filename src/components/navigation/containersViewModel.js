define(['common/viewModels/ModularViewModel',
    'common/components/navigation/ContainerVM',
    'common/components/navigation/containersValidation',
    'common/components/navigation/texts',
    'common/core/exceptions',
    'common/viewModels/languageViewModel',
    'common/components/navigation/swipe',
    'common/components/navigation/utils',
    'common/utilities/stringExtension',
    'common/resources/exeptionMessages',
    'common/external/q',
    'common/actions/submit',
    'common/actions/print',
    'common/ko/globals/multiLanguageObservable',
    'common/components/navigation/bindingHandlers'
],
    function (ModularViewModel, ContainerVM, containersValidation, texts, formExceptions, languageViewModel, swipe, utils, stringExtension, exeptionMessages, Q, submit, print) {//eslint-disable-line max-params

        var resources = {
            errorMessages: {
                containerNotFound: 'This container is not found',
                invalidContainerModel: 'This container has invalid data in the model',
                containerNotEnabled: 'This container is not enabled'
            },
            showSendButton: 'ShowSendButton',
            showPrintButton: 'ShowPrintButton',
            navigateEvent: 'NavigateToContainer',
            stateTypes: { notValidated: 'notValidated', invalid: 'invalid', completed: 'completed' }//todo: duplicated with containerVM resources
        };

        var publishNavigationTools = function (tabsMode) {
            window.tlp = window.tlp || {};
            window.tlp.navigation = {
                setDrawersView: function () {
                    tabsMode(false);
                    utils.scrollTop();
                },
                setTabsView: function () {
                    tabsMode(true);
                    utils.scrollTop();
                }
            };
        };

        var viewModel = (function () {

            var model = {
                showSendButton: ko.observable(true).defaultValue(true).subscribeTo(resources.showSendButton),
                showPrintButton: ko.observable(true).defaultValue(true).subscribeTo(resources.showPrintButton),
                isTabsMode: ko.observable(true),
                currentContainerName: ko.observable(''),
                validatedStatus: ko.observable(true)
            };
            var containersViewModel = new ModularViewModel(model);
            var containersList = ko.observableArray([]);
            var containersCollection = {};
            var loadContainers = function (containers) {
                var self = this;
                containersCollection = containers;
                for (var container in containers) {
                    if (containers.hasOwnProperty(container)) {
                        var newContainer = containers[container];
                        if (newContainer instanceof ContainerVM) {
                            newContainer.name(container);
                            containersList.push(newContainer);
                            self[container] = newContainer;
                        }
                    }
                }
                model.currentContainerName(containersList()[0].name());
            };

            var isDrawsMode = ko.computed(function () {
                return !model.isTabsMode();
            });

            var setCurrentContainer = function (containername) {
                model.currentContainerName(containername);
            };

            var getClosestEnabledContainer = function (array) {
                return ko.utils.arrayFirst(array, function (container) {
                    return ko.unwrap(container.isEnabled);
                });
            };
            var getContainerByName = function (containerName) {//todo: check if needed
                var container = containersCollection[containerName];
                if (container instanceof ContainerVM) {
                    return container;
                }
                throw formExceptions.throwFormError(resources.errorMessages.containerNotFound);
            };

            var getContainerByIndex = function (index) {
                var container = containersList()[index];
                if (typeof container !== 'undefined') {
                    return container;
                }
                throw formExceptions.throwFormError(resources.errorMessages.containerNotFound);
            };

            var getContainerIndex = function (containerName) {
                var containerToGetIndex = ko.utils.arrayFirst(containersList(), function (container) {//todo use getContainerByName?
                    return containerName === container.name();
                });
                var index = containersList().indexOf(containerToGetIndex);
                var NOTFOUND = -1;
                if (index !== NOTFOUND) {
                    return index;
                }
                throw formExceptions.throwFormError(resources.errorMessages.containerNotFound);
            };

            var getNextClosestEnabledContainer = function (currentContainerIndex) {
                var index = currentContainerIndex;
                var closest = getClosestEnabledContainer(containersList().slice(index + 1));
                return closest ? getContainerByName(closest.name()) : containersList()[currentContainerIndex];
            };

            var getPrevClosestEnabledContainer = function (currentContainerIndex) {
                var index = currentContainerIndex;
                var closest = getClosestEnabledContainer(containersList().slice(0, index).reverse());
                return closest ? getContainerByName(closest.name()) : containersList()[currentContainerIndex];
            };

            var getCurrentContainer = ko.computed(function () {
                return ko.utils.arrayFirst(containersList(), function (container) {
                    return model.currentContainerName() === container.name();
                });
            });

            var currentContainer = ko.computed(function () {
                return containersCollection[model.currentContainerName()];//getContainerByName(model.currentContainerName());
            });

            var disableValidations = function () {
                model.validatedStatus(false);
            };

            var enableValidations = function () {
                model.validatedStatus(true);
            };

            var getNextContainer = function () {
                var nextContainer;
                var nextContainerName = currentContainer().next();
                if (nextContainerName) {
                    nextContainer = getContainerByName(nextContainerName);
                    if (!ko.unwrap(nextContainer.isEnabled)) { throw formExceptions.throwFormError(resources.errorMessages.containerNotEnabled); }
                }
                else {
                    nextContainer = getNextClosestEnabledContainer(getContainerIndex(model.currentContainerName()));
                }
                return nextContainer;
            };

            var getPrevContainer = function () {
                var prevContainer;
                var prevContainerName = currentContainer().prev();
                if (prevContainerName) {
                    prevContainer = getContainerByName(prevContainerName);
                    if (!ko.unwrap(prevContainer.isEnabled)) { throw formExceptions.throwFormError(resources.errorMessages.containerNotEnabled); }
                }
                else {
                    prevContainer = getPrevClosestEnabledContainer(getContainerIndex(model.currentContainerName()));

                }
                return prevContainer;
            };

            var isPrevContainerCompleted = function (targetContainer) {
                var targetIndex = getContainerIndex(targetContainer.name());
                if (targetIndex > 0) {
                    return getContainerByIndex(targetIndex - 1).shouldBeValidated() ? getContainerByIndex(targetIndex - 1).state() === resources.stateTypes.completed : true;
                }
                else {
                    return true;
                }
            };

            var isContainersShouldBeValidate = function () {

                var containersShouldBeValidated = ko.utils.arrayFirst(containersList(), function (container) {
                    return container.shouldBeValidated() && container.state() !== resources.stateTypes.completed;
                });

                return containersShouldBeValidated ? true : false;
            };

            var isNextTab = function (targetContainer) {
                return targetContainer === getNextContainer();
            };

            var isEnabled = function (targetContainer) {
                //takes in account isEnabled that is part of container's custom settings
                var customIsEnabledTarget = ko.unwrap(targetContainer.isEnabled);
                //checks if containers from current to target are available,
                var containersShouldBeValidate = isContainersShouldBeValidate(targetContainer);
                if (!containersShouldBeValidate) {
                    return customIsEnabledTarget;
                }

                //var currentIndex = getContainerIndex(currentContainer().name());
                return (isPrevContainerCompleted(targetContainer) || isNextTab(targetContainer)) && customIsEnabledTarget;

            };

            var navigate = function (sourceContainer, targetContainer) {
                setCurrentContainer(targetContainer.name());
                sourceContainer.init();
                sourceContainer.onLeave();
                targetContainer.onEnter();
                sourceContainer.setDrawerState(true);
                targetContainer.setDrawerState(false);
            };

            var updateValidationState = function (targetContainer) {

                //if trying to navigate to previous container do so, no question asked
                if (targetContainer.isBeforeCurrentContainer()) {
                    return true;
                }
                if (!isEnabled(targetContainer)) {
                    return false;
                }

                //if targetContainer is available, then, if currentContainer.shouldBeValidated is true
                //make a list of the container from the current to target and check if the way is open,
                //if is, do navigate, otherwise reject.
                //if currentContainer.shouldBeValidated is falsy, do navigate
                if (ko.unwrap(currentContainer().shouldBeValidated)) {
                    var enabledContainers = containersList().slice(getContainerIndex(model.currentContainerName()), getContainerIndex(targetContainer.name()));
                    var formValidationPromise = containersValidation.getInvalidContainers(enabledContainers, true);
                    return formValidationPromise.then(function (results) {
                        var firstInvalidContainer = ko.utils.arrayFirst(results, function (item) {
                            return item ? item.isValidState === false : item;
                        });
                        if (firstInvalidContainer) { return false; }

                        return true;
                    });
                }
                else { return true; }
            };

            ko.postbox.subscribe('userBeforeNavigateToContainer', function (data) {
                Q.fcall(updateValidationState, data.publishedData.currentContainer)
                    .then(function () {//if state is valid let the navigation proceed
                        data.deferred.resolve();
                    }).fail(function () {//if state is invalid block navigation
                        ko.postbox.publish('onValidationFailure');
                        data.deferred.reject();
                    });
            });

            function validateContainer(targetContainer) {
                if (!(targetContainer instanceof ContainerVM)) {
                    throw formExceptions.throwFormError(resources.errorMessages.containerNotFound);
                }
            }

            function invokeBeforeNavigation(deferred, sourceContainer, targetContainer) {
                if (typeof sourceContainer.beforeNavigation === 'function') {
                    sourceContainer.beforeNavigation({ 'source': sourceContainer, 'target': targetContainer, 'deferred': deferred });
                } else {
                    deferred.resolve();
                }
            }

            function navigateToContainer(sourceContainer, targetContainer) {
                var deferred = Q.defer();
                if (sourceContainer.name() === targetContainer.name()) {
                    deferred.resolve();
                } else {
                    invokeBeforeNavigation(deferred, sourceContainer, targetContainer);
                    deferred.promise.then(() => {
                        navigate(sourceContainer, targetContainer);
                    });
                }
                return deferred.promise;
            }

            /* eslint-disable */
            var moveToContainer = function (targetContainer) {

                var sourceContainer = currentContainer();

                validateContainer(targetContainer);

                var deferredNavigation = Q.fcall(function () {
                    var validationState = updateValidationState(targetContainer);
                    return validationState;
                }).then(function (validationResult) {
                    if (!validationResult) {
                        throw formExceptions.throwFormError('validation failed');
                    }
                    return navigateToContainer(sourceContainer, targetContainer);
                });

                return deferredNavigation;
            };

            var handleAfterMoveToContainer = function (deferredNavigation) {
                if (deferredNavigation) {
                    deferredNavigation.then(function () {
                        utils.scrollTop();
                    }).catch(function (ex) {//TODO:check cause of exceptoin (ex type)
                        handleInvalidContainer();
                    });
                }
            }

            var handleInvalidContainer = function () {
                if (isDrawsMode()) {
                    closeAllDrawers();
                    currentContainer().isClosed(false);
                }
                utils.setValidationFocus();
            };

            var isFirst = ko.computed(function () {
                if (containersList().length > 0) {
                    var closest = getClosestEnabledContainer(containersList().slice(0));
                    return containersList().indexOf(currentContainer()) === getContainerIndex(closest.name());
                }
            });

            var isLast = ko.computed(function () {
                if (containersList().length > 0) {
                    var length = containersList().length;
                    var closest = getClosestEnabledContainer(containersList().slice(0, length).reverse());
                    return containersList().indexOf(currentContainer()) === getContainerIndex(closest.name());
                }
            });
            /* eslint-enable */
            var isCurrentContainerName = function (containerName) {
                return model.currentContainerName() === containerName;
            };

            var isShowNextButton = ko.computed(function () {
                var showAlways = currentContainer() ? currentContainer().showAlwaysNextButton() && model.isTabsMode() : false;
                return showAlways || !isLast() && model.isTabsMode();
            });

            var isShowButtons = function () {
                return (isLast() || !model.isTabsMode()) && !isShowNextButton(); 
            };

            var isShowPrintButton = function () {
                return isShowButtons() && model.showPrintButton();
            };

            var isShowSendButton = ko.computed(function () {
                return isShowButtons() && model.showSendButton();
            });

            var toggleClass = function (removeClass, addClass) {
                $('body').removeClass(removeClass);
                $('body').addClass(addClass);
            };

            var getLeftContainer = function () {
                if (languageViewModel.isEnglish()) {
                    return getPrevContainer();
                }
                return getNextContainer();
            };

            var getRightContainer = function () {
                if (languageViewModel.isEnglish()) {
                    return getNextContainer();
                }
                return getPrevContainer();
            };

            var closeAllDrawers = function () {
                containersList().forEach(function (container) {
                    container.setDrawerState(true);
                });
            };

            model.isTabsMode.subscribe(function (newValue) {//todo: move to body bindings
                if (newValue) {
                    toggleClass('drawers', 'tabs');
                }
                else {
                    closeAllDrawers();
                    toggleClass('tabs', 'drawers');
                }
            });

            var labels = ko.multiLanguageObservable({ resource: texts });

            const buttonsActions = {
                submit: () => submit.submitForm(),
                print: () => print.printForm()
            };

            containersViewModel.closeAllDrawers = closeAllDrawers;
            containersViewModel.containersList = containersList;
            containersViewModel.loadContainers = loadContainers;
            containersViewModel.currentContainer = currentContainer;
            containersViewModel.getCurrentContainer = getCurrentContainer;
            containersViewModel.isCurrentContainerName = isCurrentContainerName;
            containersViewModel.isLast = isLast;
            containersViewModel.isFirst = isFirst;
            containersViewModel.navigate = navigate;
            containersViewModel.navigateToContainer = navigateToContainer;
            containersViewModel.moveToContainer = moveToContainer;
            containersViewModel.handleAfterMoveToContainer = handleAfterMoveToContainer;
            containersViewModel.getPrevContainer = getPrevContainer;
            containersViewModel.getNextContainer = getNextContainer;
            containersViewModel.getContainerIndex = getContainerIndex;
            containersViewModel.getLeftContainer = getLeftContainer;
            containersViewModel.getRightContainer = getRightContainer;
            containersViewModel.enableValidations = enableValidations;
            containersViewModel.disableValidations = disableValidations;
            containersViewModel.handleInvalidContainer = handleInvalidContainer;
            containersViewModel.getContainerByIndex = getContainerByIndex;
            containersViewModel.getContainerByName = getContainerByName;
            containersViewModel.isShowButtons = isShowButtons;
            containersViewModel.isShowSendButton = isShowSendButton;
            containersViewModel.isShowPrintButton = isShowPrintButton;
            containersViewModel.isShowNextButton = isShowNextButton;
            containersViewModel.isDrawsMode = isDrawsMode;
            containersViewModel.labels = labels;
            containersViewModel.isEnabled = isEnabled;
            containersViewModel.resources = resources;
            containersViewModel.buttonsActions = buttonsActions;
            publishNavigationTools(model.isTabsMode);

            return containersViewModel;
        }());

        return viewModel;

    });
