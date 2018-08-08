define(['common/utilities/stringExtension', 'common/core/generalAttributes'],
    function (stringExtension, generalAttributes) {

        var scrollTop = function () {
            $(window).scrollTop(0);
        };

        var filters = {
            first: ':first',
            visible: ':visible',
            enabled: ':enabled',
            checked: ':checked',
            radio: ':radio',
            //a & div tags aren't include in ':enabled' selector. written here for back support 
            enabledVisibleElements: ':visible:enabled[tabIndex!="-1"],a:visible,div:visible',
            dataElements: '[data-tofocus],[tfsdata]:not(table),[tfsrowdata]'            
        };

        var selectors = {
            fields: 'input[tfsdata],input[tfsrowdata],textarea[tfsdata],textarea[tfsrowdata],select[tfsdata],select[tfsrowdata],[data-tofocus]',
            validationElements: '.validationElement',
            selectByName: '[name={0}]',
            minimizedOpenClose: '.minimized ',
            rowWrapper: '.row-wrapper',
            closedIconButton: 'i:not(.close-row)'
        };

        var govFormsSelectors = {
            fields: 'input,textarea,select,[data-tofocus]'
        };

        function getCheckedRadio(radioField) {
            var radioGroup = $(stringExtension.format(selectors.selectByName, radioField.attr('name')));
            return radioGroup.filter(filters.checked).get(0) || radioField;
        }

        function getFirstFocusableElement() {
            var allFields = $(generalAttributes.isGovForm() ? govFormsSelectors.fields : selectors.fields);
            $();
            var firstFocusableElement = allFields.filter(filters.enabledVisibleElements).first();
            if ($(firstFocusableElement).is(filters.radio)) {
                firstFocusableElement = getCheckedRadio(firstFocusableElement);
            }
            return firstFocusableElement;
        }

        function setFocus() {
            var elem = getFirstFocusableElement();
            if (elem.is('input') || elem.is('textarea')) {
                var oldVal = elem.val();
                elem.focus().val('').val(oldVal);
            } else {
                elem.focus();
            }
        }
        function expandOpencloseRow(elem, inMinimizedOpenClose) {
            if (elem.is(inMinimizedOpenClose)) {
                var rowsWrappers = elem.parents(selectors.rowWrapper);
                rowsWrappers.each(function (index, element) {
                    var openCloseButton = $(element).prev();
                    var iconButton = openCloseButton.find(selectors.closedIconButton);
                    iconButton.click();
                });

            }
        }
        function setValidationFocus() {
            const inMinimizedOpenClose = `${selectors.minimizedOpenClose} ${selectors.validationElements}`;
            const focusableElements = `${filters.visible}, ${inMinimizedOpenClose}`;
            var elem = $(selectors.validationElements).filter(focusableElements).first();
            elem = elem.filter(generalAttributes.isGovForm() ? govFormsSelectors.fields : filters.dataElements).get(0) || elem.find(generalAttributes.isGovForm() ? govFormsSelectors.fields : filters.dataElements).first();
            expandOpencloseRow($(elem), inMinimizedOpenClose);
            scrollTop();
            elem.focus();
        }

        //public API
        return {
            scrollTop: scrollTop,
            setFocus: setFocus,
            setValidationFocus: setValidationFocus
        };
    });