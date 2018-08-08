/**
* @description inherit EntityBase module and enhance it with computed filter field return url for tlpbind
 * @module LookUp
  * @param {object} setting
  * @param {ko.observable} [setting.key=''] 
  * @param {ko.observable} [setting.value=''] 
  * @param {ko.observable} [setting.filter] 
  * @param {object} setting.bindingProperties
  * @param {string} setting.bindingProperties.url
  * @param {string} setting.bindingProperties.nodelist
  * @param {object} setting.bindingProperties.queryString
  * @param {string} setting.bindingProperties.queryString.tableName
  * @example  
  * Model-    street: new lookUpEntity.LookUp({
                  filter: city.dataCode,
                  bindingProperties: {
                    text: "dataText",
                    value: "dataCode",
                    url: "https://xxx",
                    queryString: {
                        tableName: 'tableName',
                        addEmptyValue: false,
                        filter: ''
                    },
                 nodelist: "/root/tableName",
                 ondemand: "true"
        }
                })
 * DOM-      in th LookUpWindow element:
 *           data-bind="tlpLookUp:{ value: address.street,tlpBind: address.street.bind}
 */

define(['common/entities/entityBase',
         'common/utilities/conversion',
         'common/core/exceptions',
         'common/resources/exeptionMessages',
         'common/utilities/stringExtension',
         'common/utilities/typeVerifier',
         'common/utilities/reflection'],
 function (entityBase, conversion, exceptions, exceptionMessages, stringExtension, typeVerifier, reflection) {//eslint-disable-line max-params

     var defaultSettings = {
         key: '',
         value: '',
         bindingProperties: {
             text: 'dataText',
             value: 'dataCode',
             ondemand: 'true',
             queryString: {
                 addEmptyValue: false
             }

         }
     };

     //extend between two objects in more than one hierarchy too.
     // maintaining computed variables

     //var deepExtend = function deepExtend(destination, source) {
     //    for (var property in source) {
     //        if (source[property] && source[property].constructor &&
     //         source[property].constructor === Object) {
     //            destination[property] = destination[property] || {};
     //            deepExtend(destination[property], source[property]);
     //        } else if (!destination[property]) {
     //            destination[property] = source[property];
     //        }
     //    }
     //    return destination;
     //};
     var validateParam = function (param) {
         if (!typeVerifier.string(param.value)) {
             exceptions.throwFormError(stringExtension.format(exceptionMessages.invalidParam, 'bindingProperties.' + param.name));
         }
     };

     var validateBindingProperties = function (bindingProperties) {
         validateParam({ value: bindingProperties.url, name: 'url' });
         validateParam({ value: bindingProperties.nodelist, name: 'nodelist' });
         validateParam({ value: bindingProperties.queryString.tableName, name: 'queryString.tableName' });
     };


     var LookUp = function (setting) {

         setting = reflection.extend(setting, defaultSettings);
         validateBindingProperties(setting.bindingProperties);
         var self = this;
        
         this.filter = ko.computed(function () {
             var notFound = -1;
             return !setting.filter ? undefined : typeof ko.unwrap(setting.filter) === 'undefined' || ko.unwrap(setting.filter) === '' ? notFound : ko.unwrap(setting.filter);
         });
         /**
         *@method bind
         *@description computed on the computed filter field
         *@returns {String} url for tlpbind
         */
         this.bind = ko.computed(function () {
             var queryString = { filter: self.filter() };
             return conversion.comboSettingsToTfsBind(setting.bindingProperties, queryString);
         });

         this.filter.subscribe(function () {
             self.dataCode('');
             self.dataText('');
         });

         entityBase.ObservableEntityBase.call(self, setting);
     };

     LookUp.prototype = Object.create(entityBase.ObservableEntityBase.prototype);
     LookUp.prototype.constructor = LookUp;

     return {

         LookUp: LookUp
     };
 });