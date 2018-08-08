define(['common/components/groups/FormComponent',
        'common/components/groups/personalInformation/resources',
        'common/ko/validate/extensionRules/personalDetails',
        'common/ko/globals/multiLanguageObservable'
],
  function (FormComponent, resources) {//eslint-disable-line max-params

      var defaultSettings = {
          model: {
              idNum: { extenders: { idNumOrPassport: '1' } },
              firstName: { extenders: { hebrewName: true } },
              lastName: { extenders: { hebrewName: true } }
          },
          texts: resources.texts
      };

      /**
   * @class  PersonalInformation
   * @description Group of fields usually used as a unit to perform identification stage. 
   * <br /> Contains fields: <b>ID number</b>, <b>first name</b> and <b>last Name</b>. each comes with it's specific validation rule, unless otherwise requested. 
   * @property {string} idNum
   * @property {string} firstName
   * @property {string} lastName
   * @param {object} settings - 
   * @param {object} settings.idNum -
   * @param {object} settings.idNum.extenders- the validation rules for this field
   * @param {object} settings.idNum.defaultValue - default val to initialize the field
   * @example    
   * var personalInformation: new PersonalInformation({ idNum: { ignore:['required'] }, firstName: { defaultValue: 'משה', extenders: { required: false } } }),
   */
      var PersonalInformation = function (settings) {
          settings = settings || {};

          var self = this;

          FormComponent.call(self, defaultSettings, settings);

          var model = {
              idNum: self.extendModelProperty(ko.observable(), 'idNum'),
              lastName: self.extendModelProperty(ko.observable(), 'lastName'),
              firstName: self.extendModelProperty(ko.observable(), 'firstName')
          };

          self.setModel(model);

          self.labels = ko.multiLanguageObservable({ resource: self.settings.texts, language: self.settings.language });
      };

      PersonalInformation.prototype = Object.create(FormComponent.prototype);
      PersonalInformation.prototype.constructor = PersonalInformation;
      PersonalInformation.defaultSettings = defaultSettings;

      return PersonalInformation;
  });

