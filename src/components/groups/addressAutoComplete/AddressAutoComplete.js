define(['common/components/groups/FormComponent',
    'common/components/groups/addressAutoComplete/resources',
    'common/components/elements/cityAutoComplete/CityAutoComplete',
    'common/components/elements/streetAutoComplete/StreetAutoComplete',
    'common/ko/validate/extensionRules/address',
    'common/ko/bindingHandlers/tlpAttributes',
    'common/ko/bindingHandlers/accessibility',
    'common/ko/globals/multiLanguageObservable'
],
    function (FormComponent, resources, CityAutoComplete, StreetAutoComplete) {//eslint-disable-line max-params

        var defaultSettings = {
            model: {
                cityAutoComplete: CityAutoComplete.defaultSettings,
                streetAutoComplete: StreetAutoComplete.defaultSettings,
                houseNum: { extenders: { houseNumber: true } },
                zipCode: { extenders: { zipCode: true } },
                aptNum: { extenders: { apartment: true } }
            },
            texts: resources.texts
        };

        /**
      * @class  AddressAutocomplete
      * @description Group of fields usually used as a unit to perform mail address. 
      * <br /> Contains fields: <b>city</b>, <b>street</b>,<b>houseNum</b>,<b>aptNum</b>, and <b>zipCode</b>. each comes with it's specific validation rule, unless otherwise requested. 
      * @property {City} city
      * @property {Street} street
      * @property {AlphaNumeric} houseNum
      * @property {AlphaNumeric} aptNum
      * @property {Number} zipCode
      * @param {Object} [settings] - 
      * @param {Object} settings.city -
      * @param {Object} settings.city.extenders- the validation rules for this field
      * @param {Any} settings.city.defaultValue - default value to initialize the field
      * @param {Array} settings.city.ignore - array of unwanted validation rules for this field 
      * @param {Object} settings.street -
      * @param {Object} settings.street.extenders- the validation rules for this field
      * @param {Any} settings.street.defaultValue - default value to initialize the field
      * @param {Array} settings.street.ignore - array of unwanted validation rules for this field
      * @param {Object} settings.houseNum -
      * @param {Object} settings.houseNum.extenders- the validation rules for this field
      * @param {Object} settings.houseNum.defaultValue - default value to initialize the field
      * @param {Array} settings.houseNum.ignore - array of unwanted validation rules for this field
      * @param {Object} settings.zipCode -
      * @param {Object} settings.zipCode.extenders- the validation rules for this field
      * @param {any} settings.zipCode.defaultValue - default value to initialize the field
      * @param {Any} settings.zipCode.ignore - array of unwanted validation rules for this field
      * @param {Object} settings.aptNum -
      * @param {Object} settings.aptNum.extenders- the validation rules for this field
      * @param {Any} settings.aptNum.defaultValue - default value to initialize the field
      * @param {Array} settings.aptNum.ignore - array of unwanted validation rules for this field
      * @param {Any} settings.isModelRequired - an indicator whether all the fields are required/ not required/ required under the same condition
      * @param {Object} settings.texts - labels for the components view
      * @example    
      * address: new Autocomplete({ model: { houseNum: { extenders: { required: false }, ignore: ['houseNumber'] }, zipCode: { extenders: { required: { onlyIf: isEmailEmpty } } } }, isModelRequired: isPrivateType })
      */


        class AddressAutocomplete extends FormComponent {

            constructor(settings) {
                super(defaultSettings, settings);
                const modelSettings = this.settings.model;
                const cityAutoComplete = new CityAutoComplete(modelSettings.cityAutoComplete);
                modelSettings.streetAutoComplete.filter = cityAutoComplete.value.dataCode;
                const streetAutoComplete = new StreetAutoComplete(modelSettings.streetAutoComplete);

                this.model = {
                    cityAutoComplete: cityAutoComplete,
                    streetAutoComplete: streetAutoComplete,
                    houseNum: this.extendModelProperty(ko.observable(), 'houseNum'),
                    zipCode: this.extendModelProperty(ko.observable(), 'zipCode'),
                    aptNum: this.extendModelProperty(ko.observable(), 'aptNum')
                };


                this.setModel(this.model);

                this.labels = ko.multiLanguageObservable({ resource: this.settings.texts, language: this.settings.language });
                this.model.zipCode.elementName = ko.computed(() => this.labels().zipCode);
            }
            static get defaultSettings() {
                return defaultSettings;
            }
        }

        return AddressAutocomplete;
    });

