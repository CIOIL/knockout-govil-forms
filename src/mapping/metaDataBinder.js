/**
 * @module metaDataBinder
 * @description metaDataBinder is a module whose role is to add metadata information to all the properties of the model, The information contains a list of elements which bound to the observable property,
 * the metadata information additional during applyBindings in the bindingHandlers.
 */

define(['common/ko/bindingHandlers/tlpLookUp'], function () {

    var originalValueInit = ko.bindingHandlers.value.init;
    var originalTextInit = ko.bindingHandlers.text.init;
    var originalCheckedInit = ko.bindingHandlers.checked.init;
    var originalforeachInit = ko.bindingHandlers.foreach.init;

    var radioNames = [];

    var addBoundElementProperty = function (obj, propertyValue) {
        Object.defineProperty(obj, 'boundElementsTag', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: propertyValue
        });
    };

    var setBoundElement = function (element, observableID) {
        var isAttachment = function (element) {
            return element.attributes.tfsdatatype && element.attributes.tfsdatatype.textContent === 'attachment';
        };
        var isCheckBox = function (element) {
            return element.type && element.type.toLowerCase() === 'checkbox';
        };

        if (isAttachment(element)) {
            return 'attachment:' + observableID;
        }
        if (isCheckBox(element)) {
            return 'checkbox:' + observableID;
        }
        return observableID;
    };

    var initBindingHandlers = function (element, valueAccessor, observableID) {//eslint-disable-line complexity
        observableID = observableID || element.id;
        if (typeof valueAccessor() === 'function') {
            //Save the IDs of the DOM element on the bound observable 
            if (!valueAccessor().boundElementsTag) {
                addBoundElementProperty(valueAccessor(), []);
            }
            if (observableID && (element.attributes.tfsdata || element.attributes.tfsrowdata || element.attributes.tfsnestedtable)) {
                valueAccessor().boundElementsTag.push(setBoundElement(element, observableID));
            }
        }
    };

    if (ko.bindingHandlers.tlpLookUp) {
        var originalTlpLookUpInit = ko.bindingHandlers.tlpLookUp.init;
        ko.bindingHandlers.tlpLookUp.init = function (element, valueAccessor, allBindingsAccessor, data, context) {//eslint-disable-line 
            var lookupValueAccessor = ko.unwrap(valueAccessor()).value;
            var observableID = element.id;
            if (!lookupValueAccessor.boundElementsTag) {
                addBoundElementProperty(lookupValueAccessor, []);
            }
            if (observableID && (element.attributes.tfsdata || element.attributes.tfsrowdata || element.attributes.tfsnestedtable)) {
                lookupValueAccessor.boundElementsTag.push(setBoundElement(element, 'select:' + observableID));
            }
            originalTlpLookUpInit(element, valueAccessor, allBindingsAccessor, data, context);
        };
    }

    ko.bindingHandlers.value.init = function (element, valueAccessor, allBindingsAccessor, data, context) {//eslint-disable-line max-params   
        var isCombo = function (element) {
            return element.attributes.tfslookupwindow;
        };

        if (!isCombo(element)) {
            initBindingHandlers(element, valueAccessor);
        }
        originalValueInit(element, valueAccessor, allBindingsAccessor, data, context);
    };

    ko.bindingHandlers.text.init = function (element, valueAccessor, allBindingsAccessor, data, context) {//eslint-disable-line max-params
        initBindingHandlers(element, valueAccessor);
        originalTextInit(element, valueAccessor, allBindingsAccessor, data, context);
    };

    ko.bindingHandlers.checked.init = function (element, valueAccessor, allBindingsAccessor, data, context) {//eslint-disable-line max-params
        var observableID = element.id;
        var isNewRadio = function (element) {
            return (element.type === 'radio' && radioNames.indexOf(element.name) === -1);//eslint-disable-line no-magic-numbers
        };

        if (isNewRadio(element)) {
            radioNames.push(element.name);
            observableID = element.name;
            initBindingHandlers(element, valueAccessor, observableID);
        }

        if (element.type !== 'radio') {
            initBindingHandlers(element, valueAccessor, observableID);
        }

        originalCheckedInit(element, valueAccessor, allBindingsAccessor, data, context);
    };

    ko.bindingHandlers.foreach.init = function (element, valueAccessor, allBindingsAccessor, data, context) {//eslint-disable-line max-params
        initBindingHandlers(element.parentNode, valueAccessor);
        return originalforeachInit(element, valueAccessor, allBindingsAccessor, data, context);
    };

});

