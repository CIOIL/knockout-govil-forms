define(['common/utilities/reflection',
    'common/viewModels/ModularViewModel',
    'common/components/navigation/texts',
    'common/core/exceptions',
    'common/ko/utils/tlpReset',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/fn/defaultValue'],
    function (reflection, ModularViewModel, texts, formExceptions) {//eslint-disable-line max-params

        var resources = {
            errorMessages: {
                cantDeclare: 'Cannot declare containerVM without name',
                containerNotFound: 'This container is not found',
                shouldReturnBool: 'The returned type must be boolean',
                containerNotEnabled: 'This container is not enabled',
                containersViewModel: 'containersViewModel not provided or not valid'
            },

            stateTypes: { notValidated: 'notValidated', invalid: 'invalid', completed: 'completed' }
        };

        var defaultSettings = {
            state: resources.stateTypes.notValidated,
            next: '',
            prev: '',
            shouldBeValidated: true,
            isEnabled: true,
            texts: texts
        };

        var ContainerVM = function (settings, containersViewModel) {//eslint-disable-line complexity

            if (!containersViewModel || typeof containersViewModel.isCurrentContainerName === 'undefined') {
                throw formExceptions.throwFormError(resources.errorMessages.containersViewModel);
            }

            settings = reflection.extendSettingsWithDefaults(settings, defaultSettings);
            var labels = ko.multiLanguageObservable({ resource: settings.texts });
            var longTitle = ko.computed(function () {//todo: change the resource?
                return labels().longTitle ? labels().longTitle : labels().title;
            });

            var self = this;

            var model = {
                name: ko.observable(''),
                state: ko.observable(settings.state).defaultValue(settings.state),
                next: ko.observable(settings.next),
                prev: ko.observable(settings.prev),
                isClosed: ko.observable(true)
            };
            ModularViewModel.call(self, model);

            //store the containerVM model's fields in the global ignore array
            //(then, when reset the model in a container, the core fields would not lost).
            ko.utils.tlpReset.ignore.push(model.name);
            ko.utils.tlpReset.ignore.push(model.next);
            ko.utils.tlpReset.ignore.push(model.prev);
            ko.utils.tlpReset.ignore.push(model.isClosed);
            
            //extend between the current model and the model which have been sent from a container
            if (settings.model) {
                model = reflection.extendSettingsWithDefaults(self.getModel(), settings.model);
                self.setModel(model);
            }

            var init = function () {
                if (typeof (settings.init) === 'function') {
                    return settings.init.call(self, self);
                }
                return true;
            };

            var onEnter = function () {
                if (typeof (settings.onEnter) === 'function') {
                    return settings.onEnter.call(self, self);
                }
                return true;
            };

            var onLeave = function () {
                if (typeof (settings.onLeave) === 'function') {
                    return settings.onLeave.call(self, self);
                }
                return true;
            };

            var setValidationState = function (validationExcludeRequire) {
                ko.postbox.publish('validateForm');
                var isValid = self.validateModel(validationExcludeRequire);
                !isValid ? model.state(resources.stateTypes.invalid) : model.state(validationExcludeRequire ? resources.stateTypes.notValidated : resources.stateTypes.completed);
                if (model.state() !== resources.stateTypes.invalid) {
                    return true;
                }
                else {
                    return false;
                }
            };

            var isStateNotValidated = ko.computed(function () {
                return model.state() === resources.stateTypes.notValidated;
            });

            var isStateInvalid = ko.computed(function () {
                return model.state() === resources.stateTypes.invalid;
            });

            var isStateCompleted = ko.computed(function () {
                return model.state() === resources.stateTypes.completed;
            });

            //var getContainerIndex = function (containerName) {
            //    return containersViewModel.containersList.indexOf(containersViewModel.getContainerByName(containerName));
            //}

            var isCurrentContainer = ko.computed(function () {
                return containersViewModel.isCurrentContainerName(model.name());
            });

            var isBeforeCurrentContainer = function () {
                var currentContainerIndex = containersViewModel.getContainerIndex(containersViewModel.currentContainerName());
                return containersViewModel.getContainerIndex(model.name()) < currentContainerIndex;
            };

            var setDrawerState = function (isClosed) {
                model.isClosed(isClosed);
            };
            var getIndex = function () {
                return containersViewModel.getContainerIndex(model.name());

            };
            var shouldBeValidated = ko.computed(function () {
                return (ko.unwrap(settings.shouldBeValidated) && containersViewModel.validatedStatus());
            });
            shouldBeValidated.subscribe(function (newValue) {
                if (newValue === false) {
                    model.state(model.state.defaultVal);
                }
            });
            var showAlwaysNextButton = ko.computed(function () {
                return ko.unwrap(settings.showAlwaysNextButton);
            });

            var isEnabled = ko.computed(function () {
                return ko.unwrap(settings.isEnabled);
            }).extend({ rateLimit: 200 });

            var isDisabled = ko.computed(function () {
                return !isEnabled();
            });

            isEnabled.subscribe(function (newValue) {
                if (model.state() === resources.stateTypes.invalid && !newValue) {
                    self.setValidationState();
                    model.state() !== resources.stateTypes.invalid ? model.state(resources.stateTypes.defaultVal) : model.state();
                }
            });

            self.setFocus = function () {
                $('input.validationElement:visible,select.validationElement:visible div.validationElement:input').first().focus();
            };

            self.labels = labels;
            self.longTitle = longTitle;
            self.setValidationState = setValidationState;
            self.shouldBeValidated = shouldBeValidated;
            self.showAlwaysNextButton = showAlwaysNextButton;
            self.isEnabled = isEnabled;
            self.isDisabled = isDisabled;
            self.init = init;
            self.onLeave = onLeave;
            self.onEnter = onEnter;
            self.isStateNotValidated = isStateNotValidated;
            self.isStateInvalid = isStateInvalid;
            self.isStateCompleted = isStateCompleted;
            self.setDrawerState = setDrawerState;
            self.isCurrentContainer = isCurrentContainer;
            self.beforeNavigation = settings.beforeNavigation;
            self.containersViewModel = containersViewModel;
            self.isBeforeCurrentContainer = isBeforeCurrentContainer;
            self.getIndex = getIndex;
        };
        ContainerVM.prototype = Object.create(ModularViewModel.prototype);
        ContainerVM.prototype.constructor = ContainerVM;
        ContainerVM.prototype.defaultSettings = defaultSettings;
        ContainerVM.stateTypes = resources.stateTypes;


        return ContainerVM;
    });
