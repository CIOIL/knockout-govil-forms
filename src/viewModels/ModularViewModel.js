
define(['common/core/mappingManager', 'common/utilities/reflection'],
    function (mappingManager, reflection) {

        var makePublicModelProperties = function makePublicModelProperties(modularViewModel) {
            var model = modularViewModel.getModel();

            for (var key in model) {

                if (model.hasOwnProperty(key)) {
                    modularViewModel[key] = model[key];
                }
            }
        };

        var getDeepModel = function (prop) {
            return prop.getPureModel ? prop.getPureModel() : prop;
        };

        //#region ducumentation
        /**מחלקה בסיסית ליצירת מודל נתונים המאפשר חלוקה מודולרית בין מבנה הנתונים לפונקציונליות ולמידע העסקי. 
        *</br>
        * Base class for knockout viewModel in agForms.
        * Divides the view and the viewModel in the class
        * Should set the data of the class in the model object that contains only observable, observableArray and modular objects.
        * @class ModularViewModel       
        * @param {object} model - object that contain the model of the viewModel, contain observables, observableArraies and subViewModels
        * the constractor will make the propertyies of the model public
        * @param {object} mappingRules - object that contain set of rules for ko.mapping that special for this instance,
        * if you have a set of rules fits all instances, set them in a static variable on the constructor.  
        * @example  
        * Example of intance
        * var model = {           
        *       identityNumber : ko.observable(''),
        *       name : ko.observable(''),
        *   };
        * var userDetails= new baseViewModel.ModularViewModel(model); 
        *
        * Example of inherit
        * var Contact = function (mapping) {
        *   var self = this;
        *
        *   var model = {           
        *       identityNumber : ko.observable(''),
        *       name : ko.observable(''),
        *   };
        *   baseViewModel.ModularViewModel.call(self,model);
        *  
        *};
        *Contact.prototype = Object.create(baseViewModel.ModularViewModel.prototype);
        *Contact.prototype.constructor = Contact;
          */
        //#endregion
        var ModularViewModel = function (model) {
            var self = this;
            var _model;
            /**
           * @memberof ModularViewModel
           * returns pure model of a viewModel and all all of its subs (without unwraping).      
           * @returns {Object} model
           * @example          
           *  Example of usage
           * var model_B= {
           *   subContacts : ko.observableArray()
           * };
           * var subModel= new ModularViewModel(model);  
           *  subModel.names=  ko.observableArray()
           *  subModel.firstContact= ko.computed(....)
           *
           * var model_A= {
           *   subModel :subModel,
           * contacts : ko.observableArray()
           * };
           * var viewModel= new ModularViewModel(model);  
           *  viewModel.showAllContact= function()....
           *  viewModel.firstContact= ko.computed(....)
           *
           * viewModel.getModel();
           * //result
           * {
           *  contacts : []
           *  subModel:{ subContacts:[],
           *             names:[] } 
           * }
            */
            self.getModel = function () { return _model; };
            /**
           * @memberof ModularViewModel
           * recursivly returns pure model of a viewModel 
           * and all of its ModularViewModel subs pure model.      
           * @returns {Object} model
           * @example          
           *  Example of usage
           * var model_B= {
           *   subContacts : ko.observableArray()
           * };
           * var subModel= new ModularViewModel(model);  
           *  subModel.showAllContact= function()....
           *  subModel.firstContact= ko.computed(....)
           *
           * var model_A= {
           *   subModel :subModel,
           * contacts : ko.observableArray()
           * };
           * var viewModel= new ModularViewModel(model);  
           *  viewModel.showAllContact= function()....
           *  viewModel.firstContact= ko.computed(....)
           *
           * viewModel.getPureModel();
           * //result
           * {
           *  contacts : []
           *  subModel:{ subContacts:[] } 
           * }
            */
            self.getPureModel = function () {
                var pureModel = {};
                var modelCopy = reflection.extendSettingsWithDefaults({}, _model);
                for (var prop in modelCopy) {
                    if (modelCopy.hasOwnProperty(prop)) {
                        pureModel[prop] = getDeepModel(modelCopy[prop]);
                    }
                }
                return pureModel;
            };

            /** 
            *set the model property
            * @param {object} model - the model of the viewModel
            * @memberof ModularViewModel 
            * @example          
            *  Example of usage      
             var userDetails= new baseViewModel.ModularViewModel();   
             userDetails.setModel({name : ko.observable('')})
             function ( viewModel ){
                 var model = viewModel.getModel();
                 model.anotherProp=ko.observable('');
                viewModel.setModel(model);
            }(viewModel || new baseViewModel.ModularViewModel({})
            */
            self.setModel = function (model) {
                var extendModel = reflection.extend(model, _model);
                _model = extendModel;
                makePublicModelProperties(self);
            };

            self.setModel(model || {});
            var _mappingRules = {};
            /**
            *set the mappingRules property. 
            *if this viewModel is single instance update also the mapping manager.
            *<br/> the mappingRules contain rules for mapping data from json to the viewModel (when using ko.mapping.fromJS).
            * @memberof ModularViewModel 
            * @param {object} mappingRules - 
            * @param {boolean} isSingleInstance -
            * @example          
            *  Example of usage
            * var userDetailsViewModel=(function(){
            * var model= {
            *   contacts : ko.observableArray([new ContactViewModel()])
            * };
            * var userDetails= new ModularViewModel(model);   
            * var mappingRules ={
            *   contacts :function(item){
            *       return new ContactViewModel(item.data);
            *   }
            * }
            * userDetails.setMappingRules(mappingRules,true);
            * return userDetails;
            * })();
            *  */
            self.setMappingRules = function (mappingRules, isSingleInstance) {
                _mappingRules = mappingRules;
                if (isSingleInstance) {
                    mappingManager.update(mappingRules);
                }
            };
            /**
            *get mappingRules property. 
            *<br/> the mappingRules contain rules for mapping data from json to the viewModel (when using ko.mapping.fromJS).
            * @memberof ModularViewModel 
            * @returns {object} mappingRules
            * @example          
            *  Example of usage
            * var mappingRules ={
            *   contacts :function(item){
            *       var contact= new ContactViewModel();//ContactViewModel inherite from ModularViewModel
            *       return ko.mappingFromJs(item.data,contact.getMappingRules(), contact);
            *   }
            * }
            * userDetails.setMappingRules(mappingRules,true);
            * return userDetails;
            * })();
            */
            self.getMappingRules = function () {
                return _mappingRules;
            };
        };


        ModularViewModel.prototype.constructor = ModularViewModel;

        /**
        * check the model validation and show error massages, return the result of the validation
        * @memberof ModularViewModel
        * @param {object} validationExcludeRequire -
        * @returns {boolean} is model valid or not
        * @example
        *  Example of usage
        * if (!viewModel.validateModel()) {
        *  { tfsMethods.dialog.alert(errorMassage,errorSeverity);}

           */
        ModularViewModel.prototype.validateModel = function (validationExcludeRequire) {
            var validatedModel = ko.validatedObservable(this.getModel(), { deep: true, validationExcludeRequire: validationExcludeRequire });
            validatedModel.errors.forEach(function (observable) {
                if (observable.autoClearedWrongValue) {
                    observable.autoClearedWrongValue = false;
                    observable.notifySubscribers();
                }
            });
            if (validatedModel.errors && validatedModel.errors().length > 0) {
                validatedModel.errors.showAllMessages();
                return false;
            }
            return true;
        };

        /**
         * validatedObservable that contain the state of the model validation. ??
        * @memberof ModularViewModel
        * @returns {object} ko.validatedObservable
         */
        ModularViewModel.prototype.validatableModel = function () {
            return ko.validatedObservable(this.getModel(), { deep: true });
        };

        /**
        * @memberof ModularViewModel 
        * @returns {object} json of the model in json format.
        * @example          
        *  Example of usage   
        * var model= {name : ko.observable('')};
        * var userDetails= new baseViewModel.ModularViewModel(model);   
        * userDetails.toJSON();// Object {name: ""}
         */
        ModularViewModel.prototype.toJSON = function () {
            return ko.toJS(this.getPureModel());
        };

        return ModularViewModel;
    });
