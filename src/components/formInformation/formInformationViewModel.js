/**המודול מכיל נתונים ומידע כללי על הטופס (הקיימים בכל הטפסים).    
 *<br/>Sub ViewModel that include properties of Gov form.
 * @module formInformationViewModel 
     */

define([
    'common/core/exceptions',
    'common/viewModels/ModularViewModel',
    'common/viewModels/languageViewModel',
    'common/external/q',
    'common/utilities/stringExtension',
    'common/infrastructureFacade/tfsMethods',
    'common/dataServices/currentTime',
    'common/core/generalAttributes',
    'common/components/formInformation/texts',
    'common/core/formMode',
    'common/infrastructureFacade/toolbarFacade',
    'common/components/feedback/feedbackViewModel',
    'common/components/print/printInstructions',
    'common/utilities/resourceFetcher',
    'common/resources/texts/indicators',
    'common/core/readyToRequestPromise',
    'common/utilities/typeParser',
    'common/utilities/reflection',
    'common/core/govFormsInformation',
    'common/resources/govFormsPages',
    'common/components/fileUpload/filesManager',
    'common/ko/fn/defaultValue',
    'common/external/date',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/bindingHandlers/initialization',
    'common/core/mobileFixElements'

], function ( formExceptions, ModularViewModel, languageViewModel, Q, stringExtension, tfsMethods, currentTime, generalAttributes,//eslint-disable-line max-params 
    texts, formMode, toolbarFacade, feedbackViewModel, printInstructions, resourceFetcher, indicators, readyToRequestPromise, typeParser, reflection, govFormsInformation, govFormsPagesEnum, filesManager) {//eslint-disable-line max-params 

    //#region resources
    var resources = {
        events: {
            sendingForm: 'SendingForm',
            pdf: 'PrintPDF',
            print: 'Print',
            server: 'Server'
        },
        firstLoadingDateFormat: 'd/M/yyyy',//this format is setted by the configFile
        generalDateFormat: 'dd/MM/yyyy',
        invalidFormatException: 'the response {0} is not valid according to the format {1}',
        labels: ko.multiLanguageObservable({ resource: texts })
    };

    //#endregion
    var mappingRules = {
        isMobile: {
            update: function () {
                return tfsMethods.isMobile();
            }
        }
    };
    /**
      *@name model
  * @property {ko.observable(boolean)} isFormSent -  if the form has been sent in current stageStatus (updated by sendingForm  event).
  * @property {ko.observable(string)} referenceNumber -  reference number of the form from procces manager.
  * @property {ko.observable(string)} stageStatus - stage status of the form proccess .
  * @property {ko.observable(string)} loadingDate -contains the loading date of the form, updated in each loading (also after save)but not after the submit. updated by 'updateToCurrentDate' function
  * @property {ko.observable(string)} firstLoadingDate -contains the first loading date of the form. it is fulled from PM tasks file when the form is downloding.
  * @property {ko.observable(boolean)} isMobile - if the form is opened in mobile.
  * @property {ko.computed} deviceType - return 'Mobile' if the form is opend in mobile and  'PC' if the form opend in PC
  * @property {ko.observable(string)} language - language name.   
  *@property {ko.observable(string)} supportPhone phone of Support 
  *@property {ko.observable(string)} supportTime Time of Support
*/

    var model = {
        isFormSent: ko.observable(false).defaultValue(false).subscribeTo(resources.events.sendingForm),
        referenceNumber: ko.observable(''),
        stageStatus: ko.observable(''),
        loadingDate: ko.observable(''),
        firstLoadingDate: ko.observable(''),
        isMobile: ko.observable(mappingRules.isMobile.update()),
        language: languageViewModel.language
    };
    var currentVisiblePage = ko.observable(govFormsPagesEnum.tabs);
    var printMode = ko.observable(false);

    //#region viewModel
    var dataModelSaver = ko.observable('');
    var currentDateRequest;

    var isFirstLoad = function () {
        return dataModelSaver() === '';
    };

    var pdfMode = ko.computed(function () {
        return formMode.mode() === formMode.validModes.pdf;
    });

    pdfMode.subscribe(function (newValue) {
        printMode(newValue);
    });

    var serverMode = ko.observable(formMode.mode() === formMode.validModes.server);

    var year = ko.computed(function () {
        if (model.loadingDate()) {
            return typeParser.date(model.loadingDate(), resources.generalDateFormat).getFullYear();
        }
        return '';
    });

    toolbarFacade.removeMobileMaxtotalAttachmentsSize();


    var deviceType = ko.computed(function () {
        return model.isMobile() ? 'Mobile' : 'PC';
    });
    //#endregion
    var feedback = feedbackViewModel.createViewModel(serverMode);
    //When the form saved as PDF, the stageStatus is changed to 'PrintPDF', this code get back the orginal stageStatus,
    //so, to check if the form in pdf mode check 'pdfMode' property.
    //NOTE:In localHost the stageStatus not changed,
    model.stageStatus.subscribe(function (oldValue) {
        this.backup = oldValue;
    }, model.stageStatus, 'beforeChange');

    model.stageStatus.subscribe(function (newValue) {
        if (newValue === resources.events.pdf) {
            this(this.backup);
        }
    }, model.stageStatus);

    var isUpdateDate = ko.observable(true).subscribeTo('isUpdateDate', true);

    /**
   *@method updateToCurrentDate
   *@description update 'loadingDate' to current date.
   * take the date from firstLoadingDate or from the server or from local time.
   * if no need to update the date (example: after send form), need publish event - isUpdateDate with boolean value
   * @param {String} [serverName = server name from generalAttributes] server name for ajax requests.
   * @returns {promise} currentDateRequest promise with response of date in format of currentTime.resources.format or error.
   */
    //eslint-disable-valid-jsdoc

    var updateToCurrentDate = function (serverName) {
        currentDateRequest = readyToRequestPromise.then(function () {
            if (isUpdateDate() === true) {
                var parsedDatePromise = currentTime.getDateInGeneralFormatPromise(serverName);
                return parsedDatePromise.then(function (response) {
                    model.loadingDate(response);
                    return response;
                })
                    .fail(function (error) {
                        model.loadingDate(new Date().toString(resources.generalDateFormat));
                        throw error;
                    });
            }
            return Q();
        });
    };

    updateToCurrentDate();

    /**
    * @function updateHeaderResources
    * @description extend resources with params
    * @param {Object} headerResources - object of multiple language object 
    * @example  
    * var headerResources = {
    *       hebrew: { officeName: 'משרד העליה והקליטה', division: '' },
    *       english: { officeName: 'The Ministry of Aliyah and Integration', division: '' }
    *  };
    */
    var updateHeaderResources = function (headerResources) {
        var extendHeaderResources = reflection.extendSettingsWithDefaults(headerResources, resources.labels.resource());
        resources.labels.resource(extendHeaderResources);
    };

    var formInformationViewModel = new ModularViewModel(model);
    if (generalAttributes.isGovForm()) {
        formInformationViewModel.formParams = govFormsInformation.getFormParams();
        model.stageStatus(formInformationViewModel.formParams.process.stageStatus);
        const refernceNum = formInformationViewModel.formParams.process.referenceNumber ? formInformationViewModel.formParams.process.referenceNumber.toString() : '';
        formInformationViewModel.referenceNumber(refernceNum);
    }
    formInformationViewModel.setMappingRules(mappingRules, true);
    /**
   *@name dataModelSaver 
   *@description contain the json of viewModel data.
   *@type ko.observable(string)
   */
    formInformationViewModel.dataModelSaver = dataModelSaver;
    /**
     *@name currentDateRequest 
     *@description a promise contains the loadingDate call.
     *@type promise
     */
    formInformationViewModel.currentDateRequest = currentDateRequest;
    formInformationViewModel.updateFormLanguage = languageViewModel.updateLanguage;
    /**
      *@name currentVisiblePage  
      *@description observable that holdes the current open container 
      *@type string
      */
    formInformationViewModel.currentVisiblePage = currentVisiblePage;
    /**
   *@name isFirstLoad  
   *@description if the first loading of the form (the form is not after saving or sending).
   *@type boolean
   */
    formInformationViewModel.isFirstLoad = isFirstLoad;
    /**
   *@name pdfMode  
   *@description if the form in pdfMode (updated on the onload of the form).
   *@type boolean
   */
    formInformationViewModel.pdfMode = pdfMode;
    /**
  *@name serverMode  
  *@description if the form is opened from the server as in pdf and json schema creator.
  *@type ko.observable(boolean)
  */
    formInformationViewModel.serverMode = serverMode;
    /**
   *@name year  
   *@description the year from loadingDate.
   *@type {ko.computed}
   */
    formInformationViewModel.year = year;
    /**
   *@name deviceType  
   *@description return 'Mobile' if the form is opend in mobile and  'PC' if the form opend in PC
   *@type ko.observable(string)
   */
    formInformationViewModel.deviceType = deviceType;
    /**
  *@name dataModelSaver 
  *@description contain the json of viewModel data.
  *@type ko.observable(string)
  */
    formInformationViewModel.updateToCurrentDate = updateToCurrentDate;
    /**
   *@name feedback  
   *@description data for feedBack button.
   *@type object
   */
    formInformationViewModel.feedback = feedback;
    /**
 *@name resources :Object
 * @description resources for formInformationViewModel
 * @readOnly
 * @property {object} resources.events -events of agForm
 * @property {string} resources.events.sendingForm
 * @property {string} resources.events.pdf
 * @property {string} resources.events.print
 * @property {string} resources.firstLoadingDateFormat - the date format that came from server(setted by the config file) 
 * @property {string} resources.generalDateFormat - the date format of date fields
 * @property {string} resources.invalidFormatException      
 * @property {string} resources.labels -labels that describes the field (support languages)      
   */
    formInformationViewModel.resources = resources;

    formInformationViewModel.printInstructions = printInstructions;
    formInformationViewModel.printMode = printMode;
    formInformationViewModel.updateHeaderResources = updateHeaderResources;
    formInformationViewModel.formVersion = generalAttributes.get('formversion');
    formInformationViewModel.filesManager = filesManager;
    formInformationViewModel.availableLanguages = ko.observableArray();
    formInformationViewModel.isMultiLanguage = ko.computed(() => {
        return ko.unwrap(formInformationViewModel.availableLanguages) && ko.unwrap(formInformationViewModel.availableLanguages).length > 1;
    });
    return formInformationViewModel;

});
