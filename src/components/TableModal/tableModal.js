/** module that is responsible for manage tableModal with JQuery ui dialog for add/ update/ copy a row.
*contains relevant custom bindings and related methods to perform it.
@module table modal */
define('common/components/TableModal/tableModal', ['common/core/exceptions',
        'common/utilities/stringExtension',
        'common/infrastructureFacade/tfsMethods',
        'common/elements/dynamicTable',
        'common/resources/selectors',
        'common/resources/messageSeverity',
        'common/core/mappingManager',
        'common/utilities/resourceFetcher',
        'common/utilities/reflection',
        'common/ko/utils/tlpReset',
        'common/ko/bindingHandlers/tlpLock'
],
    function (exceptions, stringExtension, tfsMethods, dynamicTable, commonSelectors, messageSeverity, mappingManager, resourceFetcher, reflection) {//eslint-disable-line max-params

        var addPropertyForClearTable = (function () {//eslint-disable-line no-unused-vars
            var dynamicTableSelector = commonSelectors.dynamicTables;
            var popupTableSelector = 'table[tlpPopupTable]';
            commonSelectors.dynamicTables = dynamicTableSelector + ',' + popupTableSelector;
        }());
        var modelState = {
            add: 'add',
            update: 'update',
            remove: 'remove',
            copy: 'copy',
            addFirstRow: 'addFirstRow',
            view: 'view'
        };

        var sources = {
            temporaryPopUpReplacer: 'temporaryPopUpReplacer',
            popup: 'Popup',
            note: 'שים לב',
            titlebarCloseSelector: '.ui-dialog-titlebar-close'
        };

        var popArgs = {};

        var defaultArgs = {
            dialogArgs: {
                height: 'auto',
                width: 'auto',
                title: 'פופאפ',
                //autoOpen: false,
                resizable: false,
                responsive: true,
                draggable: false,
                modal: true
            },
            userFunctions: {
                userBeforeRemoveTableRow: function () { return true; },
                userAfterRemoveTableRow: function () { return true; },
                init: function () { },
                userAfterOpenDialog: function () { return true; },
                userBeforeCancel: function () { return true; },
                userBeforeSave: function () { return true; }
            },
            texts: {
                msgBeforeCancel: '',
                cancelButtonValue: 'ביטול',
                saveButtonValue: 'שמור נתונים',
                yesButtonValue: 'כן',
                noButtonValue: 'לא',
                cleanButtonValue: 'נקה',
                closeButtonValue: 'סגור'
            },
            settings: {
                maxRows: 300,
                minRows: 1,
                popUpId: '',
                buttons: [],
                displayCancelButton: true,
                displayCleanButton: false,
                showMessageRowsOutOfRange: true,
                checkValidation: false
            }
        };

        var innerParams = {};

        var popUpTemplate;
        var messages = {
            valueMustBeDifferent: 'the value of \'{0}\' is incorrect, it must be different than {1}',
            incorrectType: 'the type of \'{0}\' is incorrect, it must be {1}',
            incorrectReturnType: 'the function \'{0}\' is incorrect, it must return {1}',
            typeOnConfiguration: 'There must be a type on configuration of table'
        };

        var rollBack = function (table) {
            table.pop();
        };

        var isFirstRow = function () {
            return innerParams.state === modelState.addFirstRow;
        };

        var isUpdateState = function () {
            return innerParams.state === modelState.update;
        };
        var isViewState = function () {
            return innerParams.state === modelState.view;
        };

        var isExceedMaxRows = function () {
            return innerParams.table().length >= popArgs.settings.maxRows;
        };

        var isBelowMinRows = function () {
            return innerParams.table().length <= popArgs.settings.minRows;
        };

        var isFunctoinReturnBooleanType = function (callback, callbackName) {
            var bool = callback(arguments[2]);
            if (typeof (bool) !== 'boolean') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectReturnType, callbackName, 'boolean'));
            }
            return bool;
        };

        var copyNewItemToCurrentRow = function () {
            var table = innerParams.table;
            var row = innerParams.data;
            if (isFirstRow()) {
                table.replace(table()[0], table()[table().length - 1]);
            }
            else {
                table.replace(row, table()[table().length - 1]);
            }
            table.splice(table().length - 1, 1);
        };

        var replacePopUpTemplateWithTemporary = function () {
            $('#' + popArgs.settings.popUpId).replaceWith('<span id=\'' + sources.temporaryPopUpReplacer + '\'></span>');
        };

        var removePopupFromHTML = function () {
            var dialogId = popArgs.settings.popUpId + sources.popup;
            $('#' + sources.temporaryPopUpReplacer).replaceWith(popUpTemplate);
            $('#' + dialogId).remove();
        };

        var canClosePopupAfterCancel = function () {
            return isFunctoinReturnBooleanType(popArgs.userFunctions.userBeforeCancel, 'userBeforeCancel', innerParams);
        };

        var createCancelDialog = function (message) {
            var dialogId = popArgs.settings.popUpId + sources.popup;
            $('<div></div>').appendTo('body')
               .html('<div><h4>' + message + '</h4></div>')
               .dialog({
                   buttons: [{
                       id: 'btn-yes',
                       text: popArgs.texts.yesButtonValue,
                       click: function () {
                           if (canClosePopupAfterCancel()) {
                               rollBack(innerParams.table);
                               $('#' + dialogId).dialog('close');
                               $(this).dialog('close');
                           }
                       }
                   },
                       {
                           id: 'btn-no',
                           text: popArgs.texts.noButtonValue,
                           click: function () {
                               $(this).dialog('close');
                           }
                       }], modal: true,
                   close: function () {
                       $(this).remove();
                   }, title: sources.note
               });
        };

        var createCancelButtonDefinitions = function () {
            return {
                id: 'btn-cancel',
                text: popArgs.texts.cancelButtonValue,
                click: function () {
                    if (popArgs.texts.msgBeforeCancel !== '') {
                        createCancelDialog(popArgs.texts.msgBeforeCancel);
                    }
                }
            };
        };

        var canClosePopupAfterAccept = function () {
            var table = innerParams.table();
            if (popArgs.settings.checkValidation) {
                return table[table.length - 1].validateModel();
            }
            return true;
        };

        var createAcceptButtonDefinitions = function () {
            return {
                id: 'btn-accept',
                text: popArgs.texts.saveButtonValue,
                click: function () {
                    var bool = isFunctoinReturnBooleanType(popArgs.userFunctions.userBeforeSave, 'userBeforeSave', innerParams);
                    if (bool && canClosePopupAfterAccept()) {
                        if (isUpdateState() || isFirstRow()) {
                            copyNewItemToCurrentRow();
                        }
                        $(this).dialog('close');
                    }
                }
            };
        };
        var createCloseButtonDefinitions = function () {
            return {
                id: 'btn-close',
                text: popArgs.texts.closeButtonValue,
                click: function () {
                    $(this).dialog('close');

                }
            };
        };

        var createCleanButton = function () {
            return {
                id: 'btn-clean',
                text: popArgs.texts.cleanButtonValue,
                click: function () {
                    var table = innerParams.table();
                    var ignoreArgs = table[table.length - 1].cleanIgnoreArgs;
                    ko.utils.tlpReset.resetModel(table[table.length - 1], ignoreArgs ? ignoreArgs : []);
                }
            };
        };


        var addConstDialogButtons = function () {
            var dialogId = popArgs.settings.popUpId + sources.popup;
            var buttons = [];
            var cancelButton = createCancelButtonDefinitions();
            var acceptButton = createAcceptButtonDefinitions();
            var closeButton = createCloseButtonDefinitions();
            var cleanButton = createCleanButton();
            if (isViewState()) {
                buttons.push(closeButton);
            } else {
                if (popArgs.settings.displayCancelButton === true) {
                    buttons.push(cancelButton);
                }
                if (popArgs.settings.displayCleanButton === true) {
                    buttons.push(cleanButton);
                }
                buttons.push(acceptButton);
            }
            $('#' + dialogId).dialog('option', 'buttons', $.merge(buttons, popArgs.settings.buttons));
        };

        var addConstDialogEvent = function () {
            var dialogId = popArgs.settings.popUpId + sources.popup;
            var constantEvents = {
                close: function (event) {
                    if (typeof (event.cancelable) !== 'undefined' || isViewState()) {
                        rollBack(innerParams.table);
                    }
                    removePopupFromHTML();
                    ko.postbox.publish('dialogOpened', false);
                },
                beforeClose: function (event) {
                    if (typeof (event.cancelable) !== 'undefined' && popArgs.texts.msgBeforeCancel !== '' && !isViewState()) {
                        return false;
                    }
                    return true;
                }
            };
            $('#' + dialogId).dialog(constantEvents);
        };
      
        var applyBindingsToDialog = function () {
            var popUpId = popArgs.settings.popUpId;
            var table = innerParams.table();
            var popUpDiv = $('#' + popUpId + sources.popup).find('#' + popUpId).get(0);
            ko.cleanNode(popUpDiv);
            $(popUpDiv).find('.validationMessage').not('[data-bind]').remove();
            dynamicTable.clear('#' + popUpId + sources.popup);
            ko.applyBindings(table[table.length - 1], $('#' + popUpId + sources.popup).find('#' + popUpId).get(0));
        };

        var handleAfterOpenDialog = function () {
            applyBindingsToDialog();
            if (typeof (popArgs.userFunctions.userAfterOpenDialog) === 'function') {
                popArgs.userFunctions.userAfterOpenDialog(innerParams);
            }
        };

        var createCancelEvent = function () {
            $(sources.titlebarCloseSelector).on('click', function () {
                if (popArgs.texts.msgBeforeCancel !== '' && !isViewState()) {
                    createCancelDialog(popArgs.texts.msgBeforeCancel);
                }
            });
        };

        var addLockInViewMode = function () {
            if (isViewState()) {
                $('div#' + popArgs.settings.popUpId).attr('data-bind', 'tlpLock:true');
            }
        };

        var buildDialogDiv = function (dialogId) {
            $('<div  id=' + dialogId + ' ></div>').appendTo('body').append(popUpTemplate);
            addLockInViewMode();
        };        

        var createDialog = function () {
            var dialogId = popArgs.settings.popUpId + sources.popup;
            popUpTemplate = $('#' + popArgs.settings.popUpId);
            replacePopUpTemplateWithTemporary();
            buildDialogDiv(dialogId);

            $('#' + dialogId).dialog(popArgs.dialogArgs, {
                modal: true,
                open: function () {
                    createCancelEvent();
                },
                show: {
                    complete: function () {
                        handleAfterOpenDialog();
                        ko.postbox.publish('dialogOpened', true);
                    }
                }
            });
            addConstDialogEvent();
            addConstDialogButtons();
        };

        var getPropertyfromConfig = function (prop) {
            var table = innerParams.table;
            var item;
            if (table.config && table.config[prop]) {
                item = table.config[prop];
            }
            else {
                throw new exceptions.throwFormError(messages.typeOnConfiguration);
            }
            return item;
        };

        var setElementForMapping = function (element) {
            if (innerParams.data.getModel) {
                element = innerParams.data.getModel();
            } else {
                element = innerParams.data;
            }
            return element;
        };

        var isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        };

        var pushItemPerParams = function (item) {
            var params = innerParams.params !== undefined ? innerParams.params : {};
            if (isEmpty(params)) {
                innerParams.table.push(new item());
            } else {
                innerParams.table.push(new item(params));
            }
        };

        var createNewRow = function () {
            var table = innerParams.table;
            var item = getPropertyfromConfig('type');
            pushItemPerParams(item);
            if (innerParams.state === modelState.copy || isUpdateState() || isViewState()) {
                var element;
                element = setElementForMapping(element);
                ko.mapping.fromJSON(ko.mapping.toJSON(element), table()[table().length - 1].getMappingRules(), table()[table().length - 1]);
            }
        };

        var handlingRowsBeyond = function (eMessages, rows) {
            if (popArgs.settings.showMessageRowsOutOfRange) {
                var text = stringExtension.format(eMessages, rows);
                tfsMethods.dialog.alert(text, resourceFetcher.get(dynamicTable.texts.titles).usageError, messageSeverity.error);
            }
        };

        var validatePopupId = function () {
            if (popArgs.settings.popUpId === '') {
                throw new exceptions.throwFormError(stringExtension.format(messages.valueMustBeDifferent, 'popUpId', '\'\''));
            }
            if ($('#' + popArgs.settings.popUpId).get(0) === undefined) {
                throw new exceptions.throwFormError(stringExtension.format(messages.valueMustBeDifferent, 'popUpId', 'undefined'));
            }
        };

        var validateTypesOfArgs = function () {
            if ($.type(popArgs.settings.buttons) !== 'array') {
                throw new exceptions.throwFormError(messages.incorrectButtonsType);
            }
        };

        var validateNumericValues = function () {
            if ($.type(popArgs.settings.maxRows) !== 'number') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'maxRows', 'number'));
            }
            if ($.type(popArgs.settings.minRows) !== 'number') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'minRows', 'number'));
            }
        };

        var validateBooleanValues = function () {
            if ($.type(popArgs.settings.showMessageRowsOutOfRange) !== 'boolean') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'showMessageRowsOutOfRange', 'boolean'));
            }
            if ($.type(popArgs.settings.displayCancelButton) !== 'boolean') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'displayCancelButton', 'boolean'));
            }
            if ($.type(popArgs.settings.checkValidation) !== 'boolean') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'checkValidation', 'boolean'));
            }
        };

        var validateOfFunctions = function () //eslint-disable-line
        {
            if (typeof (popArgs.userFunctions.userBeforeRemoveTableRow) !== 'function') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'userBeforeRemoveTableRow', 'function'));
            }
            if (typeof (popArgs.userFunctions.userAfterRemoveTableRow) !== 'function') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'userAfterRemoveTableRow', 'function'));
            }
            if (typeof (popArgs.userFunctions.userAfterOpenDialog) !== 'function') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'userAfterOpenDialog', 'function'));
            }
            if (typeof (popArgs.userFunctions.userBeforeCancel) !== 'function') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'userBeforeCancel', 'function'));
            }
            if (typeof (popArgs.userFunctions.userBeforeSave) !== 'function') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'userBeforeSave', 'function'));
            }
            if (typeof (popArgs.userFunctions.init) !== 'function') {
                throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'init', 'function'));
            }
        };

        var validateArgs = function () {
            validatePopupId();
            validateTypesOfArgs();
            validateNumericValues();
            validateBooleanValues();
            validateOfFunctions();
        };

        var validatePopupArgs = function (popupArgs) {
            if (popupArgs !== undefined) {
                if ($.type(popupArgs) !== 'object') {
                    throw new exceptions.throwFormError(stringExtension.format(messages.incorrectType, 'popupArgs', 'object'));
                }
            }
            if (isEmpty(popupArgs) && isEmpty(popArgs)) {
                throw new exceptions.throwFormError(stringExtension.format(messages.valueMustBeDifferent, 'popupArgs', 'empty object'));
            }
            return true;
        };

        var extendDefaultArgs = function (userArgs) {
            validatePopupArgs(userArgs);
            if (!isEmpty(userArgs)) {
                popArgs = {};
                popArgs = reflection.extendSettingsWithDefaults(userArgs, defaultArgs);
            }
        };

        var initInnerParams = function (args) {
            innerParams.table = args.table;
            innerParams.params = args.params;
            innerParams.state = args.modelState;
            innerParams.data = args.data;

            validateArgs();
        };

        var open = function (args) {
            initInnerParams(args);
            if (!isUpdateState() && !isViewState() && isExceedMaxRows()) {
                handlingRowsBeyond(resourceFetcher.get(dynamicTable.texts.messages).maxRows, popArgs.settings.maxRows);
            } else {
                createNewRow();
                popArgs.userFunctions.init(innerParams);
                createDialog();
            }
        };

       
        var deleteRow = function (args) {
            initInnerParams(args);
            var bool = isFunctoinReturnBooleanType(popArgs.userFunctions.userBeforeRemoveTableRow, 'userBeforeRemoveTableRow', innerParams);
            if (bool) {
                if (!isBelowMinRows()) {
                    innerParams.table.remove(innerParams.data);
                    popArgs.userFunctions.userAfterRemoveTableRow(innerParams);
                }
                else {
                    if (popArgs.settings.minRows > 1) {
                        handlingRowsBeyond(resourceFetcher.get(dynamicTable.texts.messages).atLeastMultipleRows, popArgs.settings.minRows);
                    } else {
                        handlingRowsBeyond(resourceFetcher.get(dynamicTable.texts.messages).atLeastOneRow, popArgs.settings.minRows);
                    }
                }
            }
        };

        var additionalRow = function () {
            ///  popUpTemplate = $('#' + popArgs.settings.popUpId);
            ///$('#' + sources.temporaryPopUpReplacer).replaceWith(popUpTemplate);
            innerParams.state = modelState.add;
            createNewRow();
            popArgs.userFunctions.init(innerParams);
            handleAfterOpenDialog();
        };
        /**
            * @deprecated since version 3.0.5
        */
        /**
        * <b>ko.bindingHandlers.add</b> - custom bindings for adding new row to table modal by JQuery ui dialog.     
        * @member add
        * @function   
        * @param {object} element - dom element with data-bind
        * @param {function} valueAccessor - observableArray table
        * @param {object} allBindingsAccessor: popupArgs - object that contains the user settings and behavior for this dialog (As the structure of defaultArgs object),
        *                                      params - optional object that contains params to using when creating new item of observableArray table.
        * @param {object} viewModel.
        * @param {object} bindingContext from ko.
        */
        ko.bindingHandlers.add = {
            init: function (element, valueAccessor, allBindingsAccessor, data, context) //eslint-disable-line max-params
            {
                var typeName;
                (function saveFirstRowInitialStateAsJson() {
                    typeName = valueAccessor().config.type.name;
                    if (typeName !== undefined) {
                        data.getModel()[typeName + 'InitialState'] = ko.toJS(valueAccessor()()[0]);
                    }
                    else {
                        data.getModel()['firstRowInitialState'] = ko.toJS(valueAccessor()()[0]);
                    }
                })();

                var returnModelState = function () {
                    if (valueAccessor()().length === 1) {
                        if (JSON.stringify(ko.toJS(valueAccessor()()[0])) === JSON.stringify(data.getModel()[typeName + 'InitialState'])) {
                            return modelState.addFirstRow;
                        }
                    }
                    return modelState.add;
                };
                var newValueAccesssor = function () {
                    return function () {
                        var openArgs = {
                            table: valueAccessor(),
                            params: allBindingsAccessor().params || {},
                            modelState: returnModelState(),
                            data: data
                        };
                        extendDefaultArgs(allBindingsAccessor().popupArgs);
                        open(openArgs);
                    };
                };
                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, data, context);
            }
        };
        /**
            * @deprecated since version 3.0.5
        */
        /**
        * <b>ko.bindingHandlers.openRowToEdit</b> - custom bindings for editing an existing row in table modal by JQuery ui dialog.     
        * @member openRowToEdit
        * @function   
        * @param {object} element - dom element with data-bind
        * @param {function} valueAccessor - observableArray table
        * @param {object} allBindingsAccessor: popupArgs - object that contains the user settings and behavior for this dialog (As the structure of defaultArgs object),
        *                                      params - optional object that contains params to using when creating new item of observableArray table.
        * @param {object} data of selected row.
        * @param {object} bindingContext from ko.
        */
        ko.bindingHandlers.openRowToEdit = {
            init: function (element, valueAccessor, allBindingsAccessor, data, context) //eslint-disable-line
            {
                var newValueAccesssor = function () {
                    return function () {
                        var openArgs = {
                            table: valueAccessor(),
                            params: allBindingsAccessor().params || {},
                            modelState: modelState.update,
                            data: data
                        };
                        extendDefaultArgs(allBindingsAccessor().popupArgs);
                        open(openArgs);
                    };
                };
                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, data, context);
            }
        };

        /**
               * <b>ko.bindingHandlers.openRowToView</b> - custom bindings for view an existing row in table modal by JQuery ui dialog.     
               * @member openRowToView
               * @function   
               * @param {object} element - dom element with data-bind
               * @param {function} valueAccessor - observableArray table
               * @param {object} allBindingsAccessor: popupArgs - object that contains the user settings and behavior for this dialog (As the structure of defaultArgs object),
               *                                      params - optional object that contains params to using when creating new item of observableArray table.
               * @param {object} data of selected row.
               * @param {object} bindingContext from ko.
               */

        ko.bindingHandlers.openRowToView = {
            init: function (element, valueAccessor, allBindingsAccessor, data, context) //eslint-disable-line
            {
                var newValueAccesssor = function () {
                    return function () {
                        var openArgs = {
                            table: valueAccessor(),
                            params: allBindingsAccessor().params || {},
                            modelState: modelState.view,
                            data: data
                        };
                        extendDefaultArgs(allBindingsAccessor().popupArgs);
                        open(openArgs);
                    };
                };
                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, data, context);
            }
        };
        /**
            * @deprecated since version 3.0.5
        */
        /**
        * <b>ko.bindingHandlers.copy</b> - custom bindings for duplicating  an existing row, with the option to change the values of replicated row in the dialog.     
        * @member copy
        * @function   
        * @param {object} element - dom element with data-bind
        * @param {function} valueAccessor - observableArray table
        * @param {object} allBindingsAccessor: popupArgs - object that contains the user settings and behavior for this dialog (As the structure of defaultArgs object),
        *                                      params - optional object that contains params to using when creating new item of observableArray table.
        * @param {object} data of selected row.
        * @param {object} bindingContext from ko.
        */
        ko.bindingHandlers.copy = {
            init: function (element, valueAccessor, allBindingsAccessor, data, context) //eslint-disable-line
            {
                var newValueAccesssor = function () {
                    return function () {
                        var openArgs = {
                            table: valueAccessor(),
                            params: allBindingsAccessor().params || {},
                            modelState: modelState.copy,
                            data: data
                        };
                        extendDefaultArgs(allBindingsAccessor().popupArgs);
                        open(openArgs);
                    };
                };
                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, data, context);
            }
        };
        /**
            * @deprecated since version 3.0.5
        */
        /**
        * <b>ko.bindingHandlers.remove</b> - custom bindings for deleting an existing row from table modal.     
        * @member remove
        * @function   
        * @param {object} element - dom element with data-bind
        * @param {function} valueAccessor - observableArray table
        * @param {object} allBindingsAccessor: popupArgs - object that contains the user settings and behavior for this dialog (As the structure of defaultArgs object),
        *                                      params - optional object that contains params to using when creating new item of observableArray table.
        * @param {object} data of selected row.
        * @param {object} bindingContext from ko.
        */
        ko.bindingHandlers.remove = {
            init: function (element, valueAccessor, allBindingsAccessor, data, context) //eslint-disable-line
            {
                var newValueAccesssor = function () {
                    return function () {
                        var deleteArgs = {
                            table: valueAccessor(),
                            params: allBindingsAccessor().params || {},
                            modelState: modelState.remove,
                            data: data
                        };
                        extendDefaultArgs(allBindingsAccessor().popupArgs);
                        deleteRow(deleteArgs);
                    };
                };
                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, data, context);
            }
        };

        return {
            /**
            * @deprecated since version 3.0.5
            */
            /**create new object which contains user settings for dialog with defaults settings, when they are not specified.
            * @method extendDefaultArgs    
            * @param {object} userArgs - the specified settings for current dialog that should be extended
            * @throws will throw an error if userArgs is not an object / is undefined or empty.
            * and will throw when useArgs settings aren invalid (as userArgs.dialogArgs.height:'five').
            * @example userPopupArgs:{
            *               dialogArgs: {
            *                   height: 100,
            *                   width:  600
            *               }
            *               settings{ 
            *                   popupId:'myPopup'
            *               }
            *           }
            * tableModal.extendDefaultArgs(userPopupArgs); 
            * after this function expect to popArgs object to contain userPopupArgs settings + other default settings.       
            */
            extendDefaultArgs: extendDefaultArgs,
            /**
            * @deprecated since version 3.0.5
            */
            /**
            * function to remove a row from table modal.
            * should be used after verification that have popupArgs settings
            * @method deleteRow
            * @param {object} args - object that contain:
            *     table:observableArray table,
            *     params: optional object that contains params to using when creating new item,
            *     modelState: state from tableModalState object (remove),
            *     data: data of row to delete.                      
            * @example deleteArgs:{
            *               table: viewModel.contactsList,
            *               modelState: tableModel.tableModalState.remove,
            *               data: viewModel.contactsList()[1]
            *           }
            * tableModal.deleteRow(deleteArgs); 
            */
            deleteRow: deleteRow,
            /**
            * @deprecated since version 3.0.5
            */
            /**
            * function to open the dialog for add a new row or to edit / copy an existing row.
            * should be used after verification that have popupArgs settings
            * @method open
            * @param {object} args - object that contain:
            *     table:observableArray table,
            *     params: optional object that contains params to using when creating new item,
            *     modelState: state from tableModalState object (add, update, copy),
            *     data: viewModel in case of add mode or data of the trow in case of update /copy mode.                      
            * @example openArgs:{
            *               table: viewModel.contactsList,
            *               modelState: tableModel.tableModalState.update,
            *               data: viewModel.contactsList()[1]
            *           }
            * tableModal.open(openArgs); 
            */
            open: open,
            /**
            * @deprecated since version 3.0.5
            */
            /**
            * function to remove the dialog from HTML. this function called after close event.
            * should be used after verification that have popupArgs settings
            * @method closePopup
            */
            closePopup: removePopupFromHTML,
            /**
            * @deprecated since version 3.0.5
            */
            /** exposes the states of the table. use to send  the relevent state to open / deleteRow functions
            * @type Object 
            */
            tableModalState: modelState,
            /**
            * @deprecated since version 3.0.5
            */
            /**
           * function to add a new emty row to the List of rows. this function called by user.
           * should be used after verification that have popupArgs settings
           * @method addAdditionalRow
           */
            addAdditionalRow: additionalRow
        };
    });

