define(['common/resources/texts/basicValidation',
    'common/resources/texts/general',
    'common/utilities/stringExtension',
    'common/ko/validate/utilities/paramsFactories',
    'common/core/exceptions',
    'common/resources/exeptionMessages',
    'common/ko/validate/koValidationMethods',
    'common/ko/validate/extensionRules/array',
    'common/ko/globals/multiLanguageObservable'
], function (basicValidationResource, resource, stringExtension, createFactories, formExceptions, exceptionToThrow) {//eslint-disable-line max-params

    var messages = ko.multiLanguageObservable({ resource: basicValidationResource });
    var labels = ko.multiLanguageObservable({ resource: resource.labels });

    var factories = createFactories(messages);
    var validationParamsFactory = factories.validationParamsFactory;

    ko.validation.rules.requiredCbx = {
        validator: function (val) {
            return val;
        },
        message: function () {
            return messages().required;
        },
        ruleName: 'required',
        isRequiredRule: true
    };

    ko.validation.rules.equalIgnoreCase = {
        validator: function (val, params) { //eslint-disable-line complexity
            if (!val) {
                return true;
            }
            params = params && typeof params === 'object' ? params : { params: params };
            var compareTo = ko.unwrap(params.params || params.compareTo);
            if (!compareTo) {
                return false;
            }
            return val.toLowerCase() === compareTo.toString().toLowerCase();
        },
        message: function (params) { //eslint-disable-line complexity
            params = params && typeof params === 'object' ? params : { params: params };
            var compareTo = ko.unwrap(params.params || params.compareTo) || '';
            return params.message || stringExtension.format(messages().equal, params.compareToName || compareTo);
        }
    };

    /* @memberof ko         
    * @function "ko.validation.rules.notEqual"
    * @description rule to validate if value not equal to another value
    * @example  
    * var sampleVal = ko.observable().extend({ notEqual: 5 });
    * sampleVal(6);
    */
    ko.validation.rules.notEqual = {
        validator: function (val, params) { //eslint-disable-line complexity
            if (!val) {
                return true;
            }
            params = params.params || params;

            if (typeof (params) === 'object' && !params.compareTo) {
                formExceptions.throwFormError(stringExtension.format(exceptionToThrow.funcInvalidParams, 'notEqual'));
            }

            const compareTo = params.compareTo || params;
            if (!ko.unwrap(compareTo)) {
                return true;
            }
            return val.toString() !== ko.unwrap(compareTo).toString();
        },
        message: function (params) { //eslint-disable-line complexity
            params = params.params || params;
            const compareToName = ko.unwrap(params.compareToName) || labels().compareToName;
            return ko.unwrap(params.message) || stringExtension.format(messages().notEqual, compareToName);
        }
    };

    /* @memberof ko         
    * @function "ko.extenders.requiredRadio"
    * @description extender to wrap validation 'required' for radio type inputs, mainly to perform suitable message
    * @example  
    * var sampleVal = ko.observable().extend({ requiredRadio: true });
    */
    ko.extenders.requiredRadio = function (target, params) {
        params = typeof params !== 'undefined' ? params : {};
        target.extend({
            required: validationParamsFactory(params, params && typeof params === 'object' ? true : params, 'requiredRadio')
        });
        return target;
    };

    /* @memberof ko         
    * @function "ko.extenders.length"
    * @description extender to validate length of input 
    * @example  
    * var sampleVal = ko.observable().extend({ length: 5 });
    * sampleVal('ABCDE');
    */
    ko.extenders.length = function (target, params) { //eslint-disable-line complexity
        params = params && typeof params === 'object' ? params : { params: params };
        params.ruleName = 'length';
        params.message = params.message || function (params) {
            params = params.params || params;
            return stringExtension.format(messages().length, ko.unwrap(params));
        };
        target.extend({
            maxLength: validationParamsFactory(params, params.params || params, ''),
            minLength: validationParamsFactory(params, params.params || params, '')
        });
    };

    /* @memberof ko         
    * @function "ko.extenders.atLeastOneChecked"
    * @description extender to validate at least one in a groups of checkboxes is checked 
    * @example  
    * var sampleVal = ko.observableArray().extend({ atLeastOneChecked: true });
    * sampleVal.push('ABCDE');
    */
    ko.extenders.atLeastOneChecked = function (target, params) { //eslint-disable-line complexity
        params = params && typeof params === 'object' ? params : { params: params };
        if (ko.isObservableArray(target)) {
            params.message = params.message || function () { return messages().atLeastOneRequired; };
            target.extend({
                minItems: validationParamsFactory(params, params.minItems || 1, 'required')
            });
        }
    };

    ko.validation.registerExtenders();
});
