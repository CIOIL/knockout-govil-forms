define(['common/utilities/stringExtension'],
    function (stringExtension) {

        var accessibilityResources = {
            roleAttr: 'role',
            rodioGroupRole: 'radiogroup',
            labelledbyAttr: 'aria-labelledby',
            hiddenAlertClass: ' hiddenAccessibilityAlert noPrint'
        };
        var accessibilitySelectors = {
            alertSpan: '.hiddenAccessibilityAlert'
        };

        var getUniqe = function getUniqe() {
            var base36 = 36;
            return Math.random().toString(base36).slice(2);
        };

        var addingAriaLabelledBy = function (labelElement, containerElement) {
            var labeLID = $(labelElement).attr('id');
            var labeledByValue = typeof (labeLID) === 'string' ? labeLID : getUniqe();
            $(containerElement).attr(accessibilityResources.labelledbyAttr, labeledByValue);
            $(labelElement).attr('id', labeledByValue);
        };

        var appendNotifyElement = function (element, text) {
            $(accessibilitySelectors.alertSpan).remove();
            var notifyElement = document.createElement('SPAN');
            notifyElement.className = accessibilityResources.hiddenAlertClass;
            notifyElement.innerText = text;
            notifyElement.tabIndex = 0;
            $(element).append($(notifyElement));
            $(notifyElement).attr('role', 'alert');
        };

        var selectors = {
            fields: 'input[tfsdata],input[tfsrowdata],textarea[tfsdata],textarea[tfsrowdata],select[tfsdata],select[tfsrowdata],[data-tofocus]',
            selectByName: '[name={0}]'
        };

        var filters = {
            first: ':first',
            visible: ':visible',
            enabled: ':enabled',
            checked: ':checked',
            radio: ':radio',
            dataElements: '[data-tofocus],[tfsdata]:not(table),[tfsrowdata]'
        };

        function getCheckedRadio(radioField) {
            var radioGroup = $(stringExtension.format(selectors.selectByName, radioField.attr('name')));
            return radioGroup.filter(filters.checked).get(0) || radioField;
        }

        function getFirstFocusableElement(containerElement) {
            var allFields = $(containerElement).find(selectors.fields);
            var firstFocusableElement = allFields.filter(filters.enabled + filters.visible).first();
            if ($(firstFocusableElement).is(filters.radio)) {
                firstFocusableElement = getCheckedRadio(firstFocusableElement);
            }
            return firstFocusableElement;
        }

        function getLastFocusableElement(containerElement) {
            var allFields = $(containerElement).find(selectors.fields);
            var lastFocusableElement = allFields.filter(filters.enabled + filters.visible).last();
            if ($(lastFocusableElement).is(filters.radio)) {
                lastFocusableElement = getCheckedRadio(lastFocusableElement);
            }
            return lastFocusableElement;
        }

        function setFocus(containerElement, needLastFocusableElement) {
            var elem = needLastFocusableElement ? getLastFocusableElement(containerElement) : getFirstFocusableElement(containerElement);
            if (elem) {
                elem.focus();
            }
        }
        return {
            getUniqe: getUniqe,
            addingAriaLabelledBy: addingAriaLabelledBy,
            setFocus: setFocus,
            appendNotifyElement: appendNotifyElement
        };
    });