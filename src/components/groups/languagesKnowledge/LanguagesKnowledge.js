define(['common/components/groups/FormComponent',
        'common/utilities/reflection',
        'common/viewModels/ModularViewModel',
       'common/entities/entityBase',
       'common/components/groups/languagesKnowledge/resources',
       'common/ko/validate/extensionRules/general',
       'common/ko/globals/multiLanguageObservable',
       'common/ko/bindingHandlers/tlpLock'
],
function (FormComponent, reflection, ModularViewModel, entityBase, resources) {//eslint-disable-line max-params

    const basicPropertySettings = {
        extenders: {},
        defaultValue: ''
    };

    const defaultSettings = {
        model: {
            selectedLanguage: reflection.extendSettingsWithDefaults(basicPropertySettings),
            language: reflection.extendSettingsWithDefaults({ extenders: { required: false } }, basicPropertySettings),
            speaking: reflection.extendSettingsWithDefaults(basicPropertySettings),
            reading: reflection.extendSettingsWithDefaults(basicPropertySettings),
            writing: reflection.extendSettingsWithDefaults(basicPropertySettings)
        },
        texts: resources.texts
    };

    /**
 * @class  LanguagesKnowledge
 * @description Group of fields usually used as a unit to perform Knowledge Languages. 
 *  Contains fields: <b>selectedLanguage</b>, <b>language</b>,<b>speaking</b>, <b>readi\ng</b> and <b>writing</b>. each comes with it's specific validation rule, unless otherwise requested. 
 * @property {object} selectedLanguage
 * @property {string} language
 * @property {object} speaking
 * @property {object} reading
 * @property {object} writing
 * @param {object} [settings] - 
 * @param {object} settings.selectedLanguage -
 * @param {object} settings.selectedLanguage.dataText.extenders- the validation rules for this field
 * @param {object} settings.selectedLanguage.dataText.defaultValue - default value to initialize the field
 * @param {object} settings.language -
 * @param {object} settings.language.extenders- the validation rules for this field
 * @param {string} settings.language.defaultValue - default value to initialize the field
 * @param {array} settings.language.ignore - array of unwanted validation rules for this field
 * @param {object} settings.speaking -
 * @param {object} settings.speaking.extenders- the validation rules for this field
 * @param {object} settings.speaking.defaultValue - default value to initialize the field
 * @param {object} settings.reading -
 * @param {object} settings.reading.extenders- the validation rules for this field
 * @param {object} settings.reading.defaultValue - default value to initialize the field
 * @param {object} settings.writing -
 * @param {object} settings.writing.extenders- the validation rules for this field
 * @param {object} settings.writing.defaultValue - default value to initialize the field
 * @param {(boolean|function)} settings.isPresetLanguage - Indicator if you want a preset language
 * @param {object} settings.texts.languageName - label for the language field view

 * @example
 * isPresetLanguage-
 * var LanguagesKnowledgeSettings = {
 * model: {
 *     language: { extenders: { required: true }, defaultValue: 'אנגלית' },
 *     reading: { extenders: { required: false} }
 * },
 * isPresetLanguage:true,
 * texts: {
 *     hebrew: {
 *         Language: 'שפה',
 *         languageName: 'אנגלית'
 *     }
 * }
 * } 
 * isDynamicLanguage
 * var LanguagesKnowledgeSettings = {
 * model: {
 *     selectedLanguage: { },
 *     reading: { extenders: { required: false} }
 * },
 * texts: {
 *     hebrew: {
 *         Language: 'בחר שפה',
 *         Speaking: 'דיבור',
 *         Writing: 'כתיבה',
 *         Reading: 'קריאה',
 *     }
 * }
 * }  
 * LanguagesKnowledge: new LanguagesKnowledge(LanguagesKnowledgeSettings)
 */
    class LanguagesKnowledge extends FormComponent {

        constructor(settings) {

            super(defaultSettings, settings);

            const modelSettings = this.settings.model;

            const selectedLanguage = new entityBase.ObservableEntityBase({ value: '' });

            this.isPresetLanguage = ko.computed(() => (ko.unwrap(this.settings.isPresetLanguage)));
            this.isDynamicLanguage = ko.computed(() =>!this.isPresetLanguage());

            this.isRatingRequired = ko.computed(() =>(selectedLanguage.dataText() !== '' || this.isPresetLanguage()));
            this.isRatingNotRequired = ko.computed(() =>(!this.isRatingRequired()));

            this.isSelectedLanguageRequired = ko.computed(() =>(ko.unwrap(modelSettings.selectedLanguage.extenders.required) && this.isDynamicLanguage()));
            this.isSpeakingRequired = ko.computed(() =>(ko.unwrap(modelSettings.speaking.extenders.required) && this.isRatingRequired()));
            this.isReadingRequired = ko.computed(() =>(ko.unwrap(modelSettings.reading.extenders.required) && this.isRatingRequired()));
            this.isWritingRequired = ko.computed(() =>(ko.unwrap(modelSettings.writing.extenders.required) && this.isRatingRequired()));

            modelSettings.selectedLanguage.extenders.required = { onlyIf: this.isSelectedLanguageRequired };
            modelSettings.speaking.extenders.required = { onlyIf: this.isSpeakingRequired };
            modelSettings.reading.extenders.required = { onlyIf: this.isReadingRequired };
            modelSettings.writing.extenders.required = { onlyIf: this.isWritingRequired };

            this.model = {
                selectedLanguage: selectedLanguage,
                language: this.extendModelProperty(ko.observable(modelSettings.languageName), 'language'),
                speaking: new entityBase.ObservableEntityBase({ value: '' }),
                reading: new entityBase.ObservableEntityBase({ value: '' }),
                writing: new entityBase.ObservableEntityBase({ value: '' })
            };

            this.extendModelProperty(this.model.selectedLanguage.dataText, 'selectedLanguage');
            this.extendModelProperty(this.model.speaking.dataCode, 'speaking');
            this.extendModelProperty(this.model.reading.dataCode, 'reading');
            this.extendModelProperty(this.model.writing.dataCode, 'writing');

            this.model.selectedLanguage.dataText.subscribe(() => {
                ko.utils.tlpReset.resetModel(this.model.speaking);
                ko.utils.tlpReset.resetModel(this.model.reading);
                ko.utils.tlpReset.resetModel(this.model.writing);
            });

            this.bindLanguageListSettings = {
                settings: {
                    url: 'GetComboValuesWS.asmx/getXMLDocForCombo?tableName=Languiges&addEmptyValue=false',
                    environmentName: 'production',
                    method: 'POST'
                },
                functionName: 'getListByWebServiceList',
                listAccessor: ko.observableArray(),
                xmlNodeName: 'Languiges',
                value: this.isDynamicLanguage
            };

            this.setModel(this.model);

            this.labels = ko.multiLanguageObservable({ resource: this.settings.texts, language: this.settings.formLanguage });
        }

        static get defaultSettings() {
            return defaultSettings;
        }

    }

    return LanguagesKnowledge;
});