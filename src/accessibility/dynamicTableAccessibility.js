/**
@module dynamicTableAccessibility 
@description support Dom element accessibility in dynamic table
 

*/
define(['common/core/exceptions',
        'common/elements/attachmentMethods',
        'common/accessibility/utilities/accessibilityMethods',
        'common/utilities/resourceFetcher'
],
    function (formExceptions, attachmentMethods, accessibilityMethods, resourceFetcher) {//eslint-disable-line max-params
        var texts = {
            hebrew: {
                addRowNotify: 'נוספה שורה חדשה לטבלה',
                removeRowNotify: 'הוסרה שורה מהטבלה',
                row: 'שורה '
            },
            english: {
                addRowNotify: 'new row added to table',
                removeRowNotify: 'row removed from table',
                row: 'row '
            }
        };

        var errorMessage = {
            HTMLWrongStructure: 'HTML wrong structure.',
            NotFoundTable: 'Element is not in a table!'
        };

        var resources = {
            dataForSelector: 'label[data-for]',
            hiddenAlertClass: ' hiddenAccessibilityAlert'
        };

        var notifyTexts = resourceFetcher.get(texts);

        var bindLabelClickToInputFocus = function (label, element) {
            $(label).on('click', function () {
                if ($(element).attr('disabled')) {
                    return false;
                }
                else {
                    $(element)[0].focus();
                    if (attachmentMethods.isAttachment($(element))) {
                        $(element)[0].click();
                    }
                    return true;
                }
            });
        };

        var addingAccessibilityForAllDynamicTableFields = function (tableElement) {
            var labelsArray = $(tableElement).find(resources.dataForSelector);
            labelsArray.each(function () {
                var label = $(this);
                var elementID = label.attr('data-for');
                var element = label.closest('tr').find('#' + elementID);
                if (!element) {
                    formExceptions.throwFormError(errorMessage.HTMLWrongStructure);
                }
                accessibilityMethods.addingAriaLabelledBy(label, element);
                bindLabelClickToInputFocus(label, element);
            });

        };

        var addAccessibilityAttr = function (element) { //eslint-disable-line complexity
            var currentTr = $(element).closest('tr');
            if (!currentTr) {
                formExceptions.throwFormError(errorMessage.NotFoundTable);
            }
            var isHiddenField = $(element).attr('type') === 'hidden';
            if (isHiddenField) {
                return;
            }
            var label = currentTr.find('label[data-for=' + element.id + ']');
            if (!element || !label[0]) {
                formExceptions.throwFormError(errorMessage.HTMLWrongStructure);
            }

            accessibilityMethods.addingAriaLabelledBy(label, element);
            bindLabelClickToInputFocus(label, element);
            return label;//eslint-disable-line consistent-return
        };

        var triggerAddRowAlert = function () {
            accessibilityMethods.appendNotifyElement($('header'), notifyTexts.addRowNotify);
            $('.hiddenAccessibilityAlert').focus();
        };
        var triggerRemoveRowAlert = function () {
            accessibilityMethods.appendNotifyElement($('header'), notifyTexts.removeRowNotify);
            $('.hiddenAccessibilityAlert').focus();
        };

        ko.bindingHandlers.lastRowFocus = {
            update: function (element, valueAccessor) {
                ko.unwrap(valueAccessor());
                var lastRow = $(element).children('tr:last');
                accessibilityMethods.setFocus(lastRow);
            }
        };

        var setFocusAfterAdd = function (element) {
            var tableElement = $(element).closest('.dtable').find('tbody:first');
            var lastTr = $(tableElement).children('tr:last');
            accessibilityMethods.setFocus(lastTr);
        };

        var setFocusAfterRemove = function (element, index) {
            var rowIndex = index === 0 ? 0 : index - 1;
            var rowElement = $(element).children('tr')[rowIndex];
            accessibilityMethods.setFocus(rowElement, true);
        };

        ko.bindingHandlers.accessibilityRowTitle = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {//eslint-disable-line max-params 
                valueAccessor();
                ko.applyBindingsToNode(element, { attr: { 'aria-label': notifyTexts.row + (bindingContext.$index() + 1) + '' + allBindingsAccessor().tableName } });
            }
        };
        
        ko.bindingHandlers.accessibilityTable = {
            update: function (element, valueAccessor) {
                valueAccessor()();
                addingAccessibilityForAllDynamicTableFields(element);
            }

        };

        return {
            /**
          * @public
          * @function <b>addAccessibilityAttr</b>
          * @description adds 'aria-labelledby' attr to element,
          *  find its label by looking for in the clossest tr - a label/s which have "for" attr contains element's id.
          * @param {object} element jQuery input element
          * @returns {object} element jQuery - the founded label
          * @throws {FormError} wrong HTML structure.
          * @throws {FormError} Element is not in a table!
       
          */
            addAccessibilityAttr: addAccessibilityAttr,
            /**
            * @public
            * @function <b>triggerAddRowAlert</b>
            * @description add element with role=alert when adding new row to dynamic table for screen reader,
            * @param {object} element jQuery input element

            */
            triggerAddRowAlert: triggerAddRowAlert,
            /**
            * @public
            * @function <b>triggerRemoveRowAlert</b>
            * @description add element with role=alert when adding new row to dynamic table for screen reader,
            * @param {object} element jQuery input element

            */
            triggerRemoveRowAlert: triggerRemoveRowAlert,
            setFocusAfterRemove: setFocusAfterRemove,
            setFocusAfterAdd: setFocusAfterAdd
        };

    });