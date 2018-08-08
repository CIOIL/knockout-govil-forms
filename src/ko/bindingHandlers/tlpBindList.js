/// <reference path="../../elements/lookUpMethods.js" />
define(['common/core/exceptions',
        'common/utilities/loadWSList',
        'common/utilities/tlpBindList',
        'common/components/formInformation/formInformationViewModel',
        'common/elements/lookUpMethods',
        'common/ko/bindingHandlers/loader/loader',
        'common/ko/globals/multiLanguageObservable'
],
    function (exceptions, loadWSList, tlpBindListUtilities, formInformation, lookUpMethods) { //eslint-disable-line max-params
        /**     
         * @memberof ko         
         * @function "ko.bindingHandlers.tlpBindList"
         * @description custom bindings handle load list behvior. 
         * get the needed function name in loadWSList module, call request and view the loader icon and the notice message until the request end.
         * get bindingsAccessor as object in next structure:
         * @param {object}  settings
         * @example 
         * loadListSettings = {
            settings: { ( //the settings of loadWSList function
                tableName: 'subjects_ContactUs'
            },
            functionName: 'getList', //the needed function in loadWSList
            value: model.startLoadListprocess, //the valueAccesor
            callback: loadListCallback, //callbcak function that will call when request end.
            loaderAccessor: model.isListLoading //valueAccessor of the span message
        };
         *<select id="subjectList" placeholder="בחר נושא"
             data-bind="tlpBindList:loadListSettings,value: selectedSubject.dataCode, options: allSubjectsList,optionsText:'dataText',optionsValue:'dataCode',optionsCaption:'בחר'"></select>
         */

        var texts = {
            hebrew: {
                loadingMessage: 'טוען נתונים...'
            },
            arabic: {
                loadingMessage: 'جار تحميل البيانات ...'
            },
            english: {
                loadingMessage: 'loading data...'
            }
        };

        var loaderMessages = ko.multiLanguageObservable({ resource: texts });

        var bindListOnArrow = function (element, valueAccessor, allBindings) {
            var selectedElement;
            if (lookUpMethods.isLookUp(element)) {
                selectedElement = lookUpMethods.getArrowElement(element);
                $(selectedElement).prop('onclick', null).off('click');
            }
            else {
                selectedElement = element;
            }
            $(selectedElement).click(function() {
                ko.bindingHandlers.bindList.update(element, valueAccessor, allBindings);
            });
        };

        var addingLoadingMessageSpan = function (element) {
            var parentElement = $(element).parent();
            $('<span class=\'loadingMessage hide noPrint\'></span>').insertAfter(parentElement);
            var loadingMessageElement = $(parentElement).next('.loadingMessage');
            ko.applyBindingsToNode(loadingMessageElement[0], {text: loaderMessages().loadingMessage });
        };

        ko.bindingHandlers.tlpBindList = {
            init: function (element, valueAccessor, allBindings) {//eslint-disable-line
                addingLoadingMessageSpan(element);
                var bindingsAccessor = ko.unwrap(valueAccessor());
                var bindOnArrow = ko.unwrap(bindingsAccessor.bindOnArrow);
                if (bindOnArrow) {
                    bindListOnArrow(element, valueAccessor, allBindings);
                }
                else {
                    ko.applyBindingsToNode(element, { bindList: bindingsAccessor });
                }  
            }
        };

        ko.bindingHandlers.bindList = {
            update: function (element, valueAccessor, allBindings) {
                var bindingsAccessor = ko.unwrap(valueAccessor());
                var bindOnArrow = ko.unwrap(bindingsAccessor.bindOnArrow);
                valueAccessor = ko.unwrap(bindingsAccessor.value);
                if (!bindOnArrow && !valueAccessor) {
                    return;
                }
                var functionName = bindingsAccessor.functionName;
                if (!functionName || typeof (loadWSList[functionName]) !== 'function') {
                    exceptions.throwFormError('the requested function is not exist');
                }
                var request = loadWSList[functionName](bindingsAccessor.settings);
                var parentElement = $(element).parent();
                var loadingMessageElement = $(parentElement).next('.loadingMessage');
                $(loadingMessageElement[0]).removeClass('hide');
                ko.bindingHandlers.visibleLoader.update(element, true, allBindings);
                request.done(function () {
                    $(loadingMessageElement[0]).addClass('hide');
                    ko.bindingHandlers.visibleLoader.update(element, false, allBindings);
                    if (bindingsAccessor.listAccessor) {
                        tlpBindListUtilities.defaultWSListResponseBehavior(request, bindingsAccessor, element);
                    }
                    if (bindingsAccessor.callback) {
                        bindingsAccessor.callback(request);
                    }
                    return true;
                });
            }
        };
    });
