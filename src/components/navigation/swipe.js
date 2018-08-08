
define(['common/viewModels/languageViewModel', 'common/infrastructureFacade/tfsMethods'],
    function (languageViewModel, tfsMethods) {

        var containerBySides = function (containersViewModel) {
            return {
                leftContainer: {
                    rtl: containersViewModel.getPrevContainer,
                    ltr: containersViewModel.getNextContainer

                },
                rightContainer: {
                    rtl: containersViewModel.getNextContainer,
                    ltr: containersViewModel.getPrevContainer
                }
            };
        };

        var left = {
            name: 'left',
            funcToAction: function (containersViewModel) {
                var getLeft = containerBySides(containersViewModel).leftContainer[languageViewModel.getDirection()];
                var nextContainer = getLeft();
                var deferredNavigation = nextContainer.containersViewModel.moveToContainer(nextContainer);
                nextContainer.containersViewModel.handleAfterMoveToContainer(deferredNavigation);
            }
        };

        var right = {
            name: 'right',
            funcToAction: function (containersViewModel) {
                var getRight = containerBySides(containersViewModel).rightContainer[languageViewModel.getDirection()];
                var nextContainer = getRight();
                var deferredNavigation = nextContainer.containersViewModel.moveToContainer(nextContainer);
                nextContainer.containersViewModel.handleAfterMoveToContainer(deferredNavigation);
            }
        };

        function applySwipeEvent(element, direction, containersViewModel) {
            $(element).on('swipe' + direction.name, function () {
                if (tfsMethods.isMobile()) {
                    if (typeof direction.funcToAction === 'function') {
                        direction.funcToAction.call(this, containersViewModel);
                    }
                }
            });
        }

        ko.bindingHandlers.swipe = {
            init: function (element, valueAccessor) {
                var containersViewModel = valueAccessor();
                applySwipeEvent(element, left, containersViewModel);
                applySwipeEvent(element, right, containersViewModel);
            }

        };

    });