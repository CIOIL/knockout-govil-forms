define(['common/components/navigation/ContainerVM',
    'common/components/navigation/utils',
    'common/external/q',
    'common/core/applyBindingsCompletedPromise'
], function (ContainerVM, utils, Q, applyBindingsCompleted) { //eslint-disable-line max-params

    var toggleDrawState = function (targetContainer) {
        return Q.fcall(function () {
            var targetContainerState = targetContainer.isClosed();
            targetContainer.containersViewModel.closeAllDrawers();
            targetContainer.setDrawerState(!targetContainerState);
        });
    };

    var keys = {
        enter: 13,
        space: 32,
        tab: 9,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };

    ko.bindingHandlers.moveToContainer = {
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            var targetContainer = ko.unwrap(value);
            var isDrawsMode = targetContainer.containersViewModel.isDrawsMode;
            var deferredNavigation;

            var switchTabOnArrowPress = function (event, switchTab, callback) {
                if (switchTab) {
                    deferredNavigation = targetContainer.containersViewModel.moveToContainer(callback());
                    deferredNavigation.then(function () {
                        if (isDrawsMode()) {
                            targetContainer.containersViewModel.closeAllDrawers();
                        }
                    }).catch(function () {//TODO:check cause of exceptoin (ex type)
                        targetContainer.containersViewModel.handleInvalidContainer();
                    });
                }
                else {
                    event.preventDefault();
                }
            };
            /*eslint-disable*/
            $(element).on('keyup', function (event) {
                var key = event.keyCode;
                switch (key) {
                    case keys.up:
                        switchTabOnArrowPress(event, isDrawsMode(), targetContainer.containersViewModel.getPrevContainer);
                        break;
                    case keys.left:
                        switchTabOnArrowPress(event, !isDrawsMode(), targetContainer.containersViewModel.getLeftContainer);
                        break;
                    case keys.down:
                        switchTabOnArrowPress(event, isDrawsMode(), targetContainer.containersViewModel.getNextContainer);
                        break;
                    case keys.right:
                        switchTabOnArrowPress(event, !isDrawsMode(), targetContainer.containersViewModel.getRightContainer);
                        break;
                    case keys.tab:
                        switchTabOnArrowPress(event, isDrawsMode(), () => targetContainer);
                        break;
                    case keys.enter:
                        event.preventDefault();
                        deferredNavigation = toggleDrawState(targetContainer);
                        break;
                    case keys.space:
                        event.preventDefault();
                        deferredNavigation = toggleDrawState(targetContainer);
                        break;
                    default:
                        deferredNavigation = toggleDrawState(targetContainer);
                }
            });
            /*eslint-enable*/

            $(element).off('click').on('click', function () {//what is this?
                if (targetContainer instanceof ContainerVM) {
                    if ($(element).attr('disabled')) {
                        return;
                    }
                    if (targetContainer.isCurrentContainer()) {//if currentContainer has been clicked, just open/close container
                        deferredNavigation = toggleDrawState(targetContainer);
                    }
                    else {//if other container has been clicked perform moveToContainer, then open/close the newly currentContainer
                        deferredNavigation = targetContainer.containersViewModel.moveToContainer(targetContainer);
                    }
                    //after reach/open a container handleAfterMoveToContainer (focus on first element)
                    targetContainer.containersViewModel.handleAfterMoveToContainer(deferredNavigation);

                }
            });
        }
    };

    ko.bindingHandlers.containerVisibleTab = {
        update: function (element, valueAccessor, allBindings) {
            var value = valueAccessor();

            var valueUnwrapped = ko.unwrap(value);

            var conditionValue = allBindings().conditionValue;// || '';
            if (conditionValue) {
                if (valueUnwrapped === conditionValue) {
                    $(element).removeClass('invisibleTab');
                    $(element).addClass('visibleTab');
                }
                else {
                    $(element).addClass('invisibleTab');
                    $(element).removeClass('visibleTab');
                }
            }
            else {
                if (valueUnwrapped) {
                    $(element).removeClass('invisibleTab').addClass('visibleTab');
                }
                else {
                    $(element).addClass('invisibleTab').removeClass('visibleTab');
                }
            }
            //   $(element).toggleClass('visibleTab', valueUnwrapped);
            //  $(element).toggleClass('invisibleTab', !valueUnwrapped);
        }
    };

    ko.bindingHandlers.containerCloseDrawer = {
        update: function (element, valueAccessor) {
            var isClosed = ko.unwrap(valueAccessor());
            isClosed ? $(element).addClass('closed') : $(element).removeClass('closed');
        }
    };

    ko.bindingHandlers.setRoleTablist = {
        update: function (element, valueAccessor) {
            var isDrawsMode = ko.unwrap(valueAccessor());
            if (isDrawsMode) {
                element.setAttribute('role', 'tablist');
                element.setAttribute('aria-orientation', 'vertical');
            }
            else {
                element.removeAttribute('role');
                element.removeAttribute('aria-orientation');
            }
        }
    };

    ko.bindingHandlers.activateTab = {
        init: function (element, valueAccessor) {
            var isActiveTab = ko.unwrap(valueAccessor());
            applyBindingsCompleted.promise.then(function () {
                if (isActiveTab) {
                    element.focus();
                }
            });
        },
        update: function (element, valueAccessor) {
            var isActiveTab = ko.unwrap(valueAccessor());
            if (isActiveTab) {
                element.setAttribute('tabIndex', '0');
                element.focus();
            }
            else {
                element.setAttribute('tabIndex', '-1');
            }
        }
    };

    ko.bindingHandlers.handleTabInDrawMode = {
        init: function (element, valueAccessor) {
            var targetContainer = ko.unwrap(valueAccessor());
            var isCurrentAndDrawsState = ko.computed(function () {
                return ko.unwrap(targetContainer.containersViewModel.isDrawsMode) && ko.unwrap(targetContainer.isCurrentContainer);
            });


            ko.applyBindingsToNode(element, {
                css: { 'active-tab': isCurrentAndDrawsState },
                attr: { 'aria-selected': isCurrentAndDrawsState, 'id': 'tab_' + targetContainer.name() }
            });

        },
        update: function (element, valueAccessor) {
            var targetContainer = ko.unwrap(valueAccessor());
            var isDrawsMode = targetContainer.containersViewModel.isDrawsMode;
            var isExpanded = ko.computed(function () {
                return !targetContainer.isClosed();
            });
            var isPrevContainerActive = ko.computed(() => {
                var prevContainer, currentContainerIndex = targetContainer.containersViewModel.getContainerIndex(targetContainer.name());
                if (currentContainerIndex > 0) {
                    prevContainer = targetContainer.containersViewModel.getContainerByIndex(currentContainerIndex - 1);
                    return !prevContainer.isClosed() && targetContainer.isEnabled();
                }
                return true;
            });


            if (isDrawsMode()) {
                element.setAttribute('role', 'tab');
                element.setAttribute('aria-expanded', isExpanded());
                element.setAttribute('aria-controls', 'tabpanel_' + targetContainer.name());
                ko.bindingHandlers.activateTab.update(element, targetContainer.isCurrentContainer);
                if (isPrevContainerActive()) {
                    element.setAttribute('tabIndex', 0);
                }
            }
            else {
                element.removeAttribute('role');
                element.removeAttribute('tabIndex');
                element.removeAttribute('aria-expanded');
                element.removeAttribute('aria-controls');
            }
        }
    };

    ko.bindingHandlers.addAccessibilityContainerAttrs = {
        init: function (element, valueAccessor) {
            var name = ko.unwrap(valueAccessor());
            var containerId = 'tabpanel_' + name;
            var containerLabelId = 'tab_' + name;

            ko.applyBindingsToNode(element, {
                attr: { 'id': containerId, 'aria-labelledby': containerLabelId }
            });
        }
    };

});