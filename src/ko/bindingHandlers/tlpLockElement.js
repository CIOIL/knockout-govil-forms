
define(['common/elements/attachmentMethods', 'common/infrastructureFacade/tfsMethods', 'common/external/uuidv4'],
function (attachmentMethods, tfsMethods, uuidv4) {

    var tlpLockElementUtils = (function () {

        //#region private functions
        function handleDescendantsEvent(index, element) {
            var eventName = $(element).attr('data-unLockTopic');
            if (eventName) {
                ko.postbox.publish(eventName);
            }
        }

        function handleDescendants(index, element) {
            $(element).removeAttr('disabled');
            if (attachmentMethods.isAttachment($(element))) {
                tfsMethods.attachment.setDisabledEnabled($(element), false);
            }
        }
        //#endregion

        //#region public functions
        function generateGUID() {
            return uuidv4();
        }

        function addTabindexAttr(element) {
            var elem = $(element);
            if (elem.is('a') && elem.attr('tfsdatatype') === 'attachment') {
                ko.applyBindingsToNode(element, {
                    attr: {
                        'tabindex': '-1'
                    }
                });
            }
        }

        function removeTabIndexAttr(element) {
            var elem = $(element);
            if (elem.is('a') && elem.attr('tfsdatatype') === 'attachment') {
                $(element).removeAttr('tabindex');
            }
        }
        function lock(element) {
            addTabindexAttr(element);
            if ($(element).children().length === 0) {
                $(element).attr('disabled', 'disabled');
            }
            else {
                $(element).attr('data-container', 'locked');//add attr container
                $(element).find(':input').each(function (index, child) {
                    $(child).attr('disabled', 'disabled');
                    if (attachmentMethods.isAttachment($(child))) {
                        tfsMethods.attachment.setDisabledEnabled($(child), true);
                    }
                });
            }
        }
        var magicFilter = function (element) {

            function findMyChildren(index, child) {
                var parent = $(child).parent().closest('[data-unLockTopic]');
                return parent.is($(element));
            }

            return function (selector) {
                return $(element).find(selector).filter(findMyChildren);
            };

        };

        function unlock(element, unlockMeAlways) {
            removeTabIndexAttr(element);
            if ($(element).children().length === 0) {
                var elementParent = $(element).parent().closest('[data-unLockTopic]');
                if ($(elementParent).attr('data-container') === 'locked' && unlockMeAlways) {
                    return;
                }
                $(element).removeAttr('disabled');

            }
            else {
                $(element).removeAttr('data-container');
                var filterElement = magicFilter(element);
                filterElement('[data-unLockTopic]').each(handleDescendantsEvent);
                filterElement('[disabled]:not([data-unLockTopic])').each(handleDescendants);
            }

        }

        function executeCallback(callBackFunction) {
            if (typeof (callBackFunction) === 'function') {
                callBackFunction();
            }
        }
        //#endregion

        return {
            generateGUID: generateGUID,
            lock: lock,
            unlock: unlock,
            executeCallback: executeCallback
        };
    })();

    //private 

    /**     
   * @memberof ko         
   * @function "ko.bindingHandlers.tlpLockElement"
   * @description custom binding to lock and unlock elements by condition.
   * Elements in the container that were locked before the container was locked- will remain locked after unlock. 
   * @param valueAccessor:{function or bool}  - the condition to lock the element
   * @param afterLockCallBack:{function}  - the name of callback function to call after lock (optional)
   * @param afterUnLockCallBack:{function}  - the name of callback function to call after unlock (optional)
   * @example 
   * on the element:  data-bind='tlpLockElement: isFormLocked, afterLockCallBack: ko.bindingHandlers.tlpLockElement.helper.handleAfterLock, afterUnLockCallBack: ko.bindingHandlers.tlpLockElement.helper.handleAfterUnLock'
   *  } 
   */
    ko.bindingHandlers.tlpLockElement = {
        update: function (element, valueAccessor, allBindings) {
            var condition = ko.unwrap(valueAccessor());
            var unlockMeAlways = typeof (allBindings.get('unlockMeAlways')) === 'undefined' ? true : ko.unwrap(allBindings.get('unlockMeAlways'));
            if (condition) {
                tlpLockElementUtils.lock(element);
                tlpLockElementUtils.executeCallback(allBindings().afterLockCallBack);
            }

            else {
                tlpLockElementUtils.unlock(element, unlockMeAlways);
                tlpLockElementUtils.executeCallback(allBindings().afterUnLockCallBack);
            }
        },

        init: function (element, valueAccessor, allBindings) {
            var eventName = tlpLockElementUtils.generateGUID();
            $(element).attr('data-unLockTopic', eventName);

            ko.postbox.subscribe(eventName, function () {
                ko.bindingHandlers.tlpLockElement.update(element, valueAccessor, allBindings);
            });
        }
    };


});