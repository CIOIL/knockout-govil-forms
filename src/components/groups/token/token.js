define(['common/components/groups/FormComponent',
    'common/viewModels/ModularViewModel',
    'common/dataServices/certificateDetails',
    'common/components/groups/token/resources',
    'common/components/formInformation/formInformationViewModel',
    'common/infrastructureFacade/tfsMethods',
    'common/core/applyBindingsCompletedPromise',
    'common/utilities/resourceFetcher',
    'common/utilities/typeParser',
    'common/ko/bindingHandlers/loader/loader',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/validate/extensionRules/language'],
    function (FormComponent, ModularViewModel, certificateDetails, resources, formInformation, tfsMethods, applyBindingsCompletedPromise, resourceFetcher, typeParser)//eslint-disable-line max-params
    {
        var defaultSettings = {
            model: {
                id: { extenders: { required: true } },
                name: { extenders: {} },
                expirationDate: { extenders: {} },
                date: { extenders: {} }
            },
            texts: resources.texts
        };
        /**
   * @class  Token
   * @description .....
   * <br /> Contains fields: <b>name</b>....
   * @property {City} name ....
   
   * @param {Object} [settings] -
   * @param {Boolean} settings.isActive - the state of the component, if the component is active: when loading the form the model data will not reload and the verifing will be required

   * @param {Object} settings.name -
   * @param {Object} settings.name.extenders- the validation rules for this field
   * @param {Any} settings.name.defaultValue - default value to initialize the field
   * @param {Array} settings.name.ignore - array of unwanted validation rules for this field ....
 
   * @param {Any} settings.isModelRequired - an indicator whether all the fields are required/ not required/ required under the same condition
   * @param {Object} settings.texts - labels for the components view
   * @example    
   * token: new Token.....({ model: { houseNum: { extenders: { required: false }, ignore: ['houseNumber'] }, zipCode: { extenders: { required: { onlyIf: isEmailEmpty } } } }, isModelRequired: isPrivateType })
   */

        class Token extends FormComponent {

            constructor(settings) {
                settings = settings || {};
                settings.model = settings.model || {};//resolved insfraction bug in FormComponent
                super(defaultSettings, settings);

                const self = this;

                const model = {
                    id: self.extendModelProperty(ko.observable(), 'id'),
                    name: ko.observable(''),
                    expirationDate: ko.observable(''),
                    date: ko.observable('')
                };
                let isLoadingCertificate = ko.observable(false);

                const parseDate = date => {
                    var parsingDate = typeParser.date(date, resources.format.date.format);
                    if (parsingDate) {
                        return parsingDate.toString(resources.format.date.generalDateFormat);
                    } else {
                        return '';
                    }
                };

                const updateModel = data => {
                    model.id(data.Certificate.ID);
                    model.name(data.Certificate.Name);
                    model.expirationDate(parseDate(data.Certificate.ExpirationDate));
                    model.date(formInformation.loadingDate());
                };
                const getErrorMassage = errorCode => {
                    const errorsTexts = resourceFetcher.get(resources.texts.errors);
                    return errorsTexts[errorCode];
                };
                const showErrorMassage = errorMassage => {
                    tfsMethods.dialog.alert(errorMassage);
                };
                const isIdentify = ko.computed(() => {
                    return !!model.id();
                });

                var isVisible = ko.computed(() => {
                    return isIdentify() || isLoadingCertificate();
                });
                const getAuthentication = () => {
                    isLoadingCertificate(true);
                    const certificatePromise = certificateDetails.getAuthenticationRequest({ environmentName: settings.environmentName, formId: settings.formId });
                    certificatePromise.then(response => {
                        if (response.HasError) {
                            throw response;
                        }
                        updateModel(response);
                    })
                    .fail((error) => {
                        showErrorMassage(getErrorMassage(error.ErrorID || resources.errorCodes.general));
                    })
                    .done(() => {
                        isLoadingCertificate(false);
                    });
                };

                const showButton = ko.computed(() => {
                    return !isIdentify() && !isLoadingCertificate();
                });
                const isNotIdentify = ko.computed(() => {
                    return !isIdentify();
                });


                self.labels = ko.multiLanguageObservable({ resource: resources.texts.labels, language: settings.language });
                self.title = ko.computed(() => isIdentify() ? self.labels().titleDetails : self.labels().title);
                self.getAuthentication = getAuthentication;
                self.isIdentify = isIdentify;
                self.isLoadingCertificate = isLoadingCertificate;
                self.isNotIdentify = isNotIdentify;
                self.showButton = showButton;
                self.isVisible = isVisible;
                self.setModel(model);
            }

        }

        Token.defaultSettings = defaultSettings;

        return Token;
    });