/** module that is responsible for adding dynamic table custom binding and related methods
@module dynamic table */
define(['common/utilities/stringExtension',
        'common/events/userEventHandler',
        'common/infrastructureFacade/tfsMethods',
        'common/core/exceptions',
        'common/resources/selectors',
        'common/resources/messageSeverity',
        'common/utilities/resourceFetcher',
        'common/accessibility/dynamicTableAccessibility',
        'common/core/mappingManager',
        'common/resources/exeptionMessages',
        'common/utilities/table',
        'common/ko/utils/isObservableArray',
        'common/ko/bindingHandlers/accessibility',
        'common/ko/utils/tlpReset'
],
    function (stringExtension, userEventHandler, tfsMethods, exceptions, commonSelectors, messageSeverity, resourceFetcher, dynamicTableAccessibility,//eslint-disable-line max-params
        mappingManager, exeptionMessages,TableFactory) {

        var dynamicTableConfiguration = {
            maxRowsDefult: 300,
            minRowsDefult: 1,
            addTableRow: 'AddTableRow',
            removeTableRow: 'RemoveTableRow',
            errorType: 'There must be a type on configuration of table',
            noConfigError: 'configuration for table is missing'
        };

        var texts = {
            messages: {
                english: {
                    maxRows: 'The maximum number of rows allowed in this table is {0}.',
                    atLeastOneRow: 'The table must have at least one row',
                    atLeastMultipleRows: 'The table must have at least {0} rows'
                },
                hebrew: {
                    maxRows: 'בטבלה זו מותרות {0} שורות בלבד',
                    atLeastOneRow: 'בטבלה זו חייבת להיות שורה אחת לפחות',
                    atLeastMultipleRows: 'בטבלה זו חייבות להיות לפחות {0} שורות'
                },
                arabic: {
                    maxRows: 'في هذا الجدول، يسمح فقط {0} الصفوف',
                    atLeastOneRow: 'يجب أن يحتوي هذا الجدول على صف واحد على الأقل',
                    atLeastMultipleRows: 'يجب أن يحتوي هذا الجدول على {0} صف'
                }
            },
            titles: {
                english: {
                    usageError: 'Table Usage Error'
                },
                hebrew: {
                    usageError: 'שגיאה בשימוש בטבלה'
                },
                arabic: {
                    usageError: 'خطأ باستخدام الجدول'
                }
            }
        };

        /**
         * Dynamic table events
         */
        var events = {
            userBeforeAddTableRow: 'userBeforeAddTableRow',
            userBeforeRemoveTableRow: 'userBeforeRemoveTableRow',
            userAfterAddTableRow: 'userAfterAddTableRow',
            userAfterRemoveTableRow: 'userAfterRemoveTableRow'
        };

        var showMessages = function (text, isShow) {
            if (isShow) {
                tfsMethods.dialog.alert(text, resourceFetcher.get(texts.titles).usageError, messageSeverity.information);
            }
        };

        var deleteDinamicTableRows = function (index, sender) {
            $(sender).children('tr:gt(0)').remove();
        };

        var findKnockoutTables = function (containerSelector) {
            return $(containerSelector).find(commonSelectors.dynamicTables).children('tbody[data-bind]');
        };


        var clear = function (containerSelector) {
            containerSelector = containerSelector || 'html';
            var tables = findKnockoutTables(containerSelector);
            tables.each(deleteDinamicTableRows);
            return tables.length;
        };

        var getPropertyfromConfig = function (table, prop) {//eslint-disable-line consistent-return
            if (table.config) {
                return table.config[prop];
            }
        };
      
        var createMappingRules = function mapping(array, params) {
            var checkParameters = function (array) {
                if (!(ko.utils.isObservableArray(array))) {
                    exceptions.throwFormError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'array', 'observableArray'));
                }
                if (typeof array.config === 'undefined') {
                    exceptions.throwFormError(dynamicTableConfiguration.noConfigError);
                }
                return true;
            };
            checkParameters(array);
            var type = array.config.type;
            type = TableFactory.getItemByType(array, type);
            if (typeof type !== 'function') {
                exceptions.throwFormError(dynamicTableConfiguration.errorType);
            }
            params = params || array.config.params;
            return {
                create: function (item) {
                    var createItem = mappingManager.utils.create(item.data, type, params);
                    TableFactory.updateItemAfterImport(array, createItem);
                    return createItem;
                }
            };
        };
                
        
        /**
         * <b>ko.bindingHandlers.addRow</b> - custom bindings for add new row on table     
         * @member addRow
         * @function   
         * @param {object} element - dom element with data-bind
         * @param {function} valueAccessor - observableArray table
         * @param {object} allBindingsAccessor: args - options for event used (optional) (params, maxRows, isShowMessages)
         * @param {object} viewModel.
         * @param {object} bindingContext from ko.
         */
        ko.bindingHandlers.addRow = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) //eslint-disable-line 
            {
                var table = valueAccessor();

                var isShowMessages = allBindingsAccessor().showMessages !== false ? true : false;

                var args = allBindingsAccessor().args || {};

                var getParams = function () {
                    var paramsFormConfig = getPropertyfromConfig(table, 'params');
                    var paramsFromBindings = allBindingsAccessor().params;
                    if (typeof paramsFormConfig !== 'undefined') {
                        return paramsFormConfig;
                    }
                    if (typeof paramsFromBindings !== 'undefined') {
                        return paramsFromBindings;
                    }
                    return {};
                };

                var getMaxRows = function () {
                    var maxRowsFormConfig = getPropertyfromConfig(table, 'maxRows');
                    var maxRowsFromBindings = allBindingsAccessor().maxRows;
                    if (typeof maxRowsFormConfig !== 'undefined') {
                        return maxRowsFormConfig;
                    }
                    if (typeof maxRowsFromBindings !== 'undefined') {
                        return maxRowsFromBindings;
                    }
                    return dynamicTableConfiguration.maxRowsDefult;
                };


                var params = getParams();

                var item = getPropertyfromConfig(table, 'type');
                if (!item) {
                    throw new exceptions.throwFormError(dynamicTableConfiguration.errorType);
                }

                var addNewRow = function addNewRow(table, item, params) {

                    var maxRows = ko.unwrap(getMaxRows());

                    if (table().length < maxRows) {
                        item = TableFactory.getItemByType(table, item);
                        table.push(new item(params));
                        dynamicTableAccessibility.setFocusAfterAdd(element);
                    }
                    else {
                        showMessages(stringExtension.format(resourceFetcher.get(texts.messages).maxRows, maxRows), isShowMessages);
                    }
                };

                var eventSettings = {
                    event: dynamicTableConfiguration.addTableRow,
                    callback: addNewRow.bind(null, table, item, params),
                    afterEvent: true,
                    publishedData: { table: table, args: args }
                };

                var invokeAddRowEvent = function invokeAddRowEvent() {
                    userEventHandler.invoke(eventSettings);
                };

                var newValueAccesssor = function () {
                    return invokeAddRowEvent;
                };

                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, viewModel, bindingContext);
            }
        };


        /**
         * <b>ko.bindingHandlers.removeRow</b> - custom bindings for remove row on table
         * @member removeRow
         * @function 
         * @param {object} element - dom element with data-bind
         * @param {function} valueAccessor - observableArray table
         * @param {object} allBindingsAccessor: args - options for event used (optional) (minRows, isShowMessages)
         * @param {object} viewModel.
         * @param {object} bindingContext from ko.
         */
        ko.bindingHandlers.removeRow = {
            init: function (element, valueAccessor, allBindingsAccessor, row, bindingContext) //eslint-disable-line 
            {
                var newValueAccesssor = function () {
                    var args = allBindingsAccessor().args || {},
                        isShowMessages = allBindingsAccessor().showMessages !== false ? true : false,
                        table = valueAccessor(),
                        minRows;
                    var getMinRows = function () {
                        var minRowsFromConfig = getPropertyfromConfig(table, 'minRows');
                        return typeof minRowsFromConfig !== 'undefined' ? minRowsFromConfig : typeof allBindingsAccessor().minRows !== 'undefined' ? allBindingsAccessor().minRows : dynamicTableConfiguration.minRowsDefult;
                    };
                    var targetElement;
                    minRows = getMinRows();

                    // minRows = allBindingsAccessor().minRows || dynamicTableConfiguration.minRowsDefult;
                    var getMinRowsMessage = function () {
                        if (minRows > 1) {
                            return stringExtension.format(resourceFetcher.get(texts.messages).atLeastMultipleRows, minRows);
                        }
                        else {
                            return resourceFetcher.get(texts.messages).atLeastOneRow;
                        }
                    };

                    var removeRow = function removeRow() {
                        if (table().length > minRows) {
                            table.remove(row);
                            ko.utils.tlpReset.resetByRemoveRow(row);
                            dynamicTableAccessibility.setFocusAfterRemove(targetElement, bindingContext.$index());
                        }
                        else {
                            showMessages(getMinRowsMessage(), isShowMessages);
                        }
                    };

                    var eventSettings = {
                        event: dynamicTableConfiguration.removeTableRow,
                        callback: removeRow,
                        afterEvent: true,
                        publishedData: { table: table, args: args }
                    };

                    return function (valueAccesssorObj, targetEvent = {}) {
                        targetElement =  $(targetEvent.target).closest('tbody');
                        userEventHandler.invoke(eventSettings);
                    };
                };
                ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, row, bindingContext);
            }
        };


        return {
            /** exposes the names of the events that are triggered by adding and removing rows to dynamic table
             * @type Object */
            events: events,
            /**
            * function to reset dynamic table. Removes all the rows except of the first one from each 
            * of the selected table except .
            * should be used after save form or export, otherwise the foreach binding will multiply 
            * the number of rows.     
            * @method clear
            * @param {string} containerSelector - a selector for a container that limits the scope in which tables are cleared.
            * if not specified all the table in the dociment will be cleared.               *             
            * @returns {number}  -the number of cleared tables */
            clear: clear,
            /** exposes the texts used in the displayed messages 
             * @type Object */
            texts: texts,
            /**
                    * function to create basic mapping rulse for dynamic table.   
                    * @method createMappingRules
                    * @param {obvsarbleArray} array -  the array of the dynamic table, each row must be of same type.
                    * @returns {object}  -object with create function, implements ko.mapping structure*/
            createMappingRules: createMappingRules
        };
    });