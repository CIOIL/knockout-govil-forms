/// <reference path="../external/xml2json.js" />
define(['common/external/q',
    'common/external/xml2json',
    'common/resources/texts/indicators',
    'common/utilities/resourceFetcher',
    'common/infrastructureFacade/tfsMethods',
    'common/elements/lookUpMethods'
], function (Q, xml2json, texts, resourceFetcher, tfsMethods, lookUpMethods) {//eslint-disable-line

    var isXML = function (settings) {
        var dataType = settings.settings.dataType ? settings.settings.dataType : '';
        return dataType.toUpperCase() === 'XML' || settings.functionName === 'getListByWebServiceList';
    };

    var covertDataToJSON = function (data, xmlNodeName) {
        var xmlConvertor = new xml2json();
        var jsonObject = xmlConvertor.xml2json(data);
        if (jsonObject && jsonObject.root) {
            if (Array.isArray(jsonObject.root[xmlNodeName])) {
                return jsonObject.root[xmlNodeName];
            }
            return [jsonObject.root[xmlNodeName]];
        }
        return jsonObject;
    };

    var convertStringDataToJson = function (response) {
        response.forEach(function (data, index) {
            if (typeof (data) === 'string') {
                response[index] = JSON.parse(data);
            }
        });
        return response;
    };    

    var handleOptionsWindow = function (element, bindingsAccessor) {
        var bindOnArrow = ko.unwrap(bindingsAccessor.bindOnArrow);
        var bindOnce = ko.unwrap(bindingsAccessor.bindOnce);
        if (bindOnArrow && lookUpMethods.isLookUp(element)) {
            var arrow = lookUpMethods.getArrowElement(element);
            if (bindOnce) {
                bindingsAccessor.bindOnArrow = false;
                $(arrow).click(function () {
                    tfsMethods.showLookUpWindow(arrow);
                });
            }
            tfsMethods.showLookUpWindow(arrow);
        }
    };

    var defaultWSListResponseBehavior = function (requestPromise, settings, element) {
        var errorloadListFailed = resourceFetcher.get(texts.errors).loadListFailed;
        requestPromise.then(function (response) {
            if (isXML(settings)) {
                response = covertDataToJSON(response, settings.xmlNodeName);
            }
            if (Array.isArray(response) && typeof (response[0]) === 'string') {
                response = convertStringDataToJson(response);
            }
            settings.listAccessor(response);
            handleOptionsWindow(element, settings);
        })
        .fail(function () {
            tfsMethods.dialog.alert(errorloadListFailed);
        });
    };

    ko.postbox.subscribe('loadListCallbackEnded', function (settings) {
        var element = $('#' + settings.elementID);
        handleOptionsWindow(element, { bindOnArrow: settings.bindOnArrow, bindOnce: settings.bindOnce });
    });

    return {
        defaultWSListResponseBehavior: defaultWSListResponseBehavior,
        handleOptionsWindow: handleOptionsWindow
    };
});