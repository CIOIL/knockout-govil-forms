define(['common/viewModels/ModularViewModel',
    'common/utilities/tryParse',
    'common/utilities/typeVerifier',
    'common/utilities/reflection',
    'common/utilities/stringExtension',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/ko/fn/defaultValue'
],
    function (ModularViewModel, parser, typeVerifier, commonReflection, stringExtension, exceptions, exceptionMessages) {//eslint-disable-line max-params

        var baseSettings = {
            value: '',
            type: 'string',
            displayName: ''
        };

        function extendSettingsWithBase(arg) {
            return commonReflection.extend(arg, baseSettings);
        }

        const getDefaultValidator = (arg) => {
            return function (value) {
                var type = arg.type || typeof arg;
                return parser(type, value);
            };
        };

        function getValidArgument(arg, userArg) {
            if (typeof arg.validator !== 'function') {
                arg.validator = getDefaultValidator(arg);
            }
            try {
                return arg.validator(userArg);
            } catch (e) {
                exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'FormControl'));
            }
            return true;
        }

        const isPropInitialOrDefaultValue = (prop) => {
            return prop === 'initialValue' || prop === 'defaultValue';
        };

        const isPropExist = (props, prop) => {
            return props.hasOwnProperty(prop) && props[prop];
        };

        var mergeSettings = function (defaultSettings, settings) {
            var mergedSettings = commonReflection.extendSettingsWithDefaults({}, defaultSettings);

            const setArgsValue = () => {
                if (settings.args) {
                    const defaultArgs = mergedSettings.args;
                    const userArgs = settings.args;
                    for (var a in defaultArgs) {
                        if (userArgs[a]) {
                            defaultArgs[a].value = getValidArgument(defaultArgs[a], userArgs[a]);
                        }
                    }
                }
            };

            const setSelectedValue = function () {

                if (!settings.selectedValue) {
                    return;
                }
                const defaultValues = mergedSettings.selectedValue;
                const userValues = settings.selectedValue;
                for (var prop in userValues) {
                    if (isPropExist(userValues, prop)) {
                        defaultValues[prop] = function () {
                            if (isPropInitialOrDefaultValue(prop)) {
                                return getValidArgument(defaultValues, userValues[prop]);
                            }
                            return userValues[prop];
                        }();
                    }
                }
            };

            for (var arg in mergedSettings.args) {
                if (mergedSettings.args.hasOwnProperty(arg)) {
                    extendSettingsWithBase(mergedSettings.args[arg]);
                }
            }
            setArgsValue();

            setSelectedValue();

            return mergedSettings;
        };

        var FormControl = function (defaultSettings, settings) {

            settings = settings || {};

            var self = this;

            settings = mergeSettings(defaultSettings, settings);

            ModularViewModel.call(self, {});

            self.settings = settings;
        };

        FormControl.prototype = Object.create(ModularViewModel.prototype);
        FormControl.prototype.constructor = FormControl;

        return FormControl;

    });
