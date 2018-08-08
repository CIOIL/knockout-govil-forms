
define(['common/utilities/reflection',
        'common/viewModels/ModularViewModel',
        'common/ko/bindingHandlers/tlpSelect'
], function (commonReflection, ModularViewModel) {

    /**
     * A class for date base part .
     * day,month and year parts of hebrew and gregorian dates should inherit this class
     * this class contains list, title and isRequired properties
     * @class BasePart
     * @extends ModularViewModel
     * @name BasePart
     *  @param {json} settings - object that contain the params.
   *  @param {boolean} [settings.isRequired=false] - parameter means if this part should be required
    * @param {string/computed/observable} [settings.title= empty string] - the title to display
 
 */
 
    var BasePart = function (settings) {
      
        settings = commonReflection.extendSettingsWithDefaults(settings, BasePart.defaultSettings);
        var self = this;
      
        self.list = ko.observableArray();
        self.title = ko.computed(function () {
            return ko.unwrap(settings.title);
        });
        self.isRequired = ko.computed(function () {
            return ko.unwrap(settings.isRequired);
        });
        ModularViewModel.call(self, {});

    };

    BasePart.prototype = Object.create(ModularViewModel.prototype);
    BasePart.prototype.constructor = BasePart;
    BasePart.defaultSettings = {
        isRequired: false ,
        title: '',
        version:1
    };
    return BasePart;
});

