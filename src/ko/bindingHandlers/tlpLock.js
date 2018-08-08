define(['common/resources/tfsAttributes',
        'common/elements/attachmentMethods',
        'common/elements/lookUpMethods',
        'common/infrastructureFacade/tfsMethods',
        'common/elements/dateMethods'
],
    function (tfsAttributes, attachmentMethods, lookUpMethods, tfsMethods, dateMethods) {//eslint-disable-line
        var elementsResources = {
            tfsDataType: 'tfsDataType',
            calanderType: 'date',
            simpleFieldKey: 'regularField',
            attachmentClass: 'attachment',
            tfsCalendarClass: '.tfsCalendar',
            selectClass: '.select',
            disabledAttr: 'disabled',
            dataDisabledAttr: 'data-disabled',
            lockClassName: 'lock',
            lockSelector: '.lock',
            neverLock: 'neverLock',
            neverLockSelector: '.neverLock'
        };

        var addDisabledAttr = function (element, isNotExistParentLock) {
            var externalDisabled = $(element).attr(elementsResources.disabledAttr);
            if (externalDisabled && isNotExistParentLock) {
                $(element).attr(elementsResources.dataDisabledAttr, externalDisabled);
            }
            $(element).attr(elementsResources.disabledAttr, 'disabled');
        };

        var removeDisabledAttr = function (element, isNotExistParentLock) {
            var externalDisabled = $(element).attr(elementsResources.dataDisabledAttr);
            if (externalDisabled && isNotExistParentLock) {
                $(element).attr(elementsResources.disabledAttr, externalDisabled);
                $(element).removeAttr(elementsResources.dataDisabledAttr);
            }
            else if (isNotExistParentLock) {
                $(element).removeAttr(elementsResources.disabledAttr);
            }
        };

        var isFirstElementLock = function (lockParentsNumber, isElementLocked) {
            return (lockParentsNumber === 1 && !isElementLocked) || (lockParentsNumber === 0 && isElementLocked);
        };

        var toggleAttachmentDisabled = function (element, noLockParents, needDisable) {
            if (attachmentMethods.isAttachment(element) && noLockParents) {
                tfsMethods.attachment.setDisabledEnabled($(element), needDisable);
            }
        };

        var isNeverLockElement = function (element) {
            return $(element).parents(elementsResources.neverLockSelector).length > 0 || $(element).hasClass(elementsResources.neverLock);
        };

        var toggleDisabledAttr = function (element, needLock) {
            if (isNeverLockElement(element)) {
                return;
            }
            var isNotExistLock;
            var lockParentsNumber = $(element).parents(elementsResources.lockSelector).length;
            var isElementLocked = $(element).hasClass(elementsResources.lockClassName);
            if (needLock) {
                isNotExistLock = isFirstElementLock(lockParentsNumber, isElementLocked);
                addDisabledAttr(element, isNotExistLock);
                toggleAttachmentDisabled(element, isNotExistLock, true);
               
            }
            else if (needLock === false) {
                isNotExistLock = lockParentsNumber === 0 && !isElementLocked;
                toggleAttachmentDisabled(element, isNotExistLock, false);
                
                removeDisabledAttr(element, isNotExistLock);
            }
        };

        var handleChildrenDisabledAttr = function (element, needLock) {
            $(element).find('*').not('div,label,a').each(function (index, elem) {
                toggleDisabledAttr(elem, needLock);
            });
        };

        var toggleLockClass = function (element, needLock) {
            if (needLock) {
                $(element).addClass(elementsResources.lockClassName);
            }
            else if (needLock === false) {
                $(element).removeClass(elementsResources.lockClassName);
            }
        };

        var handleLockBehavior = function (element, needLock) {
            toggleLockClass(element, needLock);
            toggleDisabledAttr(element, needLock);
            handleChildrenDisabledAttr(element, needLock);
        };

        var lockAttachment = function (element, needLock) {
            var wrapper = attachmentMethods.getWrapperElement(element);
            handleLockBehavior(wrapper, needLock);
        };

        var lockLookup = function (element, needLock) {
            var wrapper = lookUpMethods.getWrapperElement(element);
            handleLockBehavior(wrapper, needLock);
        };

        var lockCalander = function (element, needLock) {
            var dateButton = dateMethods.getButtonElement(element);
            handleLockBehavior(dateButton, needLock);
            handleLockBehavior(element, needLock);
        };

        var isExist = function isExist(element) {
            return ($(element) && $(element).length);
        };

        var idenifyTfsTypesFunctions = {
            lookup: lookUpMethods.isLookUp,
            attachment: attachmentMethods.isAttachment,
            calander: dateMethods.isDate
        };

        var lockElementsByTypeFunctions = {
            lookup: lockLookup,
            attachment: lockAttachment,
            calander: lockCalander,
            regularField: handleLockBehavior
        };

        var elementIdentifiedAsCurrentType = function (type, element) {
            var currentTypeIdentifyFunction = idenifyTfsTypesFunctions[type];
            return idenifyTfsTypesFunctions.hasOwnProperty(type) &&
                    currentTypeIdentifyFunction(element);
        };

        var getElementType = function (element) {
            if (isExist(element)) {
                for (var type in idenifyTfsTypesFunctions) {
                    if (elementIdentifiedAsCurrentType(type, element)) {
                        return type;
                    }
                }
                return elementsResources.simpleFieldKey;
            }
            else {
                throw new Error('element is not exist');
            }
        };
        /**
        * handle lock or unlock element behavior.      
        * @method lockByType
        * @param {object} element - the element need lock
        * @param {boolean} needLock - the condition: lock or unlock
        * @description get the type of element by idenifyTfsTypesFunctions object,
        * and lock or unlock it by the type. 
        * @returns {undefined}
        */
        var lockByType = function (element, needLock) {
            var elementType = getElementType(element);
            lockElementsByTypeFunctions[elementType](element, needLock);
        };
        /**     
         * @memberof ko         
         * @function "ko.bindingHandlers.tlpLock"
         * @description custom binding for enabled or disabled inputs.
         * @example 
         * lock: viewModel.isInputLock
       */
        ko.bindingHandlers.tlpLock = {
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                var valueUnwrapped = ko.unwrap(value);
                var isNeverLock = $(element).hasClass(elementsResources.neverLock);
                if (!isNeverLock) {
                    lockByType(element, valueUnwrapped);
                }
            }
        };
    });

