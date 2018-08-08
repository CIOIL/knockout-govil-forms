define(['common/viewModels/ModularViewModel'
, 'common/components/formInformation/formInformationViewModel'
, 'common/core/mappingManager'
, 'common/utilities/reflection'
, 'common/utilities/resourceFetcher'
, 'common/resources/texts/indicators'
, 'common/events/userEventHandler'
, 'common/components/navigation/containersViewModel'
, 'common/components/navigation/containersValidation'
, 'common/components/navigation/utils'
, 'common/accessibility/utilities/accessibilityMethods'
, 'common/core/exceptions'],
function //eslint-disable-line max-params
(
    ModularViewModel
    , formInformation
    , mappingManager
    , reflection
    , resourceFetcher
    , indicationMessages
    , userEventHandler
    , containersViewModel
    , containersValidation
    , navigationUtils
    , accessibilityMethods
    , formExceptions) {


    var model = {
        containersViewModel: containersViewModel,
        formInformation: formInformation
    };
    var viewModel = new ModularViewModel(model);
    
    var getViewModelJSON = function (args) {
        return ko.toJSON(viewModel.getPureModel(), function (key, value) {
            var notFuond = -1;
            if (args.ignore && args.ignore.indexOf(key) !== notFuond) {
                return;
            }
            if (args.saveUndefined && value === undefined) {//todo: ask??
                value = null;
            }
            return value;//eslint-disable-line consistent-return
        });
    };

    var loadViewModel = function (saverVal) {
        ko.mapping.fromJSON(saverVal, mappingManager.get(), viewModel);
    };

    /* @function <b>getDisabledContainers</b>
     * @description Returns the disabled containers to avoid keeping them in the dataModelSaver in the function: saveViewModel
     * @returns {object} list of the disabled containers
    */
    var getDisabledContainers = function () {
        var containersToIgnore = model.containersViewModel.containersList().filter(function (item) {
            return !item.isEnabled();
        }).map(function (item) {
            return item.name();
        });
        return containersToIgnore;
    };

    var saveViewModel = function (args) {
        args =  args || {ignore: []};
        if(!args.hasOwnProperty('isSvaeDisabledContainers'))
        {
            args.ignore = args.ignore.concat(getDisabledContainers());
        }
        var defaultArgs = { ignore: [] };
        args = reflection.extendSettingsWithDefaults(args, defaultArgs);
        model.formInformation.dataModelSaver(getViewModelJSON(args));
    };

    var handleInvalidForm = function (deferred, needFocusFirstInvalidField, firstInvalidContainer) {
        if (needFocusFirstInvalidField) {
            containersViewModel.navigate(containersViewModel.currentContainer(), firstInvalidContainer.container);
        }
        deferred.reject();
        var focusDelay = 600;
        var alertLocation = 'header';
        accessibilityMethods.appendNotifyElement($(alertLocation), resourceFetcher.get(indicationMessages.errors, ko.unwrap(formInformation.language)).inputsError);
        $('.hiddenAccessibilityAlert').focus();
        if (needFocusFirstInvalidField) {
            setTimeout(function () {
                navigationUtils.setValidationFocus();
            }, focusDelay);
        }

    };

    var validateForm = function (deferred, settings = {}) {

        var activeElement = document.activeElement;
        document.activeElement.blur();
        activeElement.focus();

        settings.focusFirstInvalidField = settings.focusFirstInvalidField || true;

        var formValidationPromise = containersValidation.getInvalidContainers(model.containersViewModel.containersList(), false, settings.validationExcludeRequire );
        var validateFailureMessage = 'validating form failed due to: ';

        formValidationPromise.then(function (results) {
            var firstInvalidContainer = ko.utils.arrayFirst(results, function (item) {//eslint-disable-line consistent-return
                if (item) {
                    return item.isValidState === false;
                }
            });
            if (firstInvalidContainer) {
                handleInvalidForm(deferred, settings.focusFirstInvalidField, firstInvalidContainer);
            }
            else {
                deferred.resolve();
            }
        }).fail(function (ex) {
            formExceptions.throwFormError(validateFailureMessage + ex.message);
        });
    };

    //#region public properties

    viewModel.loadViewModel = loadViewModel;
    viewModel.saveViewModel = saveViewModel;
    viewModel.getViewModelJSON = getViewModelJSON;
    viewModel.validateForm = validateForm;
    //#endregion 
    return viewModel;

});