/** Object for controlling the toolbar button within the form
@module toolbarFacade  */
define(['common/infrastructureFacade/tfsMethods',
    'common/resources/tfsAttributes',
    'common/resources/selectors'
],
function (tfsMethods, tfsAttributes, selectors) {
    var SEPARATOR_CHAR = ';';

    //#region private functions
    function getGeneralAttribute() {
        return $(selectors.GeneralAttributes);
    }

    function changeViewButtonsInGeneralAttributes(type, buttonsArray) {
        var generalAttributes = getGeneralAttribute();
        var buttonsToAdd = $.map(buttonsArray, function (item) {
            return item.toLowerCase();
        });

        if (generalAttributes.attr(type)) {
            var existingButtons = generalAttributes.attr(type).toLowerCase().split(SEPARATOR_CHAR);
            var unitArrayButtons = existingButtons.concat(buttonsToAdd);
            unitArrayButtons = unitArrayButtons.filter(function (item, position) {
                return unitArrayButtons.indexOf(item) === position;
            });
            var joinedButtons = unitArrayButtons.join(SEPARATOR_CHAR);
            generalAttributes.attr(type, (joinedButtons ? joinedButtons + SEPARATOR_CHAR : '') );
        }
        else {
            generalAttributes.attr(type, buttonsToAdd.join(SEPARATOR_CHAR));
        }
    }

    function removeButtonFromDisableAndHide(type, buttonsToEnableArray) {
        var generalAttributes = getGeneralAttribute();
        buttonsToEnableArray = $.map(buttonsToEnableArray, function (item) {
            return item.toLowerCase();
        });

        if (generalAttributes.attr(type)) {
            var existingButtons = generalAttributes.attr(type).toLowerCase().split(SEPARATOR_CHAR);
            existingButtons = existingButtons.filter(function (item) {
                return buttonsToEnableArray.indexOf(item) === -1;//eslint-disable-line no-magic-numbers
            });
            generalAttributes.attr(type, existingButtons.join(SEPARATOR_CHAR));
        }
    }
    //#endregion

    //#region public functions
    var buttonsEnum = {
        'import': 'import',
        'export': 'export',
        submit: 'submit',
        save: 'save',
        print: 'print',
        printToPDF: 'printtopdf',
        attachment: 'attachment',
        addAttachment: 'addattachment',
        reset: 'reset',
        sign: 'sign',
        lock: 'lock',
        displaySign: 'displaysign',
        encrypt: 'encrypt'
    };

    function getExistingToolbarButtonsByType(type) {
        var generalAttributes = getGeneralAttribute();
        var attrValue = generalAttributes.attr(type);
        if (attrValue) {
            return generalAttributes.attr(type).toLowerCase().split(SEPARATOR_CHAR);
        }
        return [];
    }

    function hideToolbarButton(buttonsArrayToHide) {
        changeViewButtonsInGeneralAttributes(tfsAttributes.TFSHIDDENBUTTONS, buttonsArrayToHide);
        removeButtonFromDisableAndHide(tfsAttributes.TFSENABLEDBUTTONS, buttonsArrayToHide);
        removeButtonFromDisableAndHide(tfsAttributes.TFSDISABLEBUTTONS, buttonsArrayToHide);
        tfsMethods.toolbar.initToolbar();
    }

    
    function disableToolbarButton(buttonsArrayToDisable) {
        changeViewButtonsInGeneralAttributes(tfsAttributes.TFSDISABLEBUTTONS, buttonsArrayToDisable);
        removeButtonFromDisableAndHide(tfsAttributes.TFSENABLEDBUTTONS, buttonsArrayToDisable);
        removeButtonFromDisableAndHide(tfsAttributes.TFSHIDDENBUTTONS, buttonsArrayToDisable);
        tfsMethods.toolbar.initToolbar();
    }
    
    function enabledToolbarButton(buttonsArrayToEnable) {
        if (tfsMethods.isAGForms2Html()) {
            changeViewButtonsInGeneralAttributes(tfsAttributes.TFSENABLEDBUTTONS, buttonsArrayToEnable);
        }
        removeButtonFromDisableAndHide(tfsAttributes.TFSHIDDENBUTTONS, buttonsArrayToEnable);
        removeButtonFromDisableAndHide(tfsAttributes.TFSDISABLEBUTTONS, buttonsArrayToEnable);
        tfsMethods.toolbar.initToolbar();
    }

   
    function showToolbarButton(buttonsArrayToShow) {
        enabledToolbarButton(buttonsArrayToShow);
    }

    function removeMobileMaxtotalAttachmentsSize() {
        if (tfsMethods.isMobile()) {
            $(selectors.GeneralAttributes).removeAttr(tfsAttributes.TFSMAXTOTALATTACHMENTSSIZE);
        }
    }
   
    //#endregion 
    return {
        buttonsEnum: buttonsEnum,
        /**
        * get the current array of buttons by type       
        * @method getExistingToolbarButtonsByType
        * @param {string} type - the needed attribute name as'tfsEnabledButtons'  
        * @example Example usage of getExistingToolbarButtonsByType:
        * var currentEnableButtons = getExistingToolbarButtonsByType('tfsEnabledButtons')
        * the returned array: ['import', 'export']
        * @returns {array}
        */
        getExistingToolbarButtonsByType: getExistingToolbarButtonsByType,
        /**
       * hide buttons of the toolbar         
       * @method hideToolbarButton
       * @param {array} buttonsArrayToHide array of buttons to hide of type 'buttonsEnum'
       * @example Example usage of hideToolbarButton:
       * var buttonsArrayToHide = [toolbarFacade.buttonsEnum.import, toolbarFacade.buttonsEnum.export];
       * toolbarFacade.hideToolbarButton(buttonsArrayToHide)
       * @returns {undefined}
       */
        hideToolbarButton: hideToolbarButton,
        /**
        * show buttons of the toolbar       
        * @method showToolbarButton
        * @param {array} buttonsArrayToShow array of buttons to display of type 'buttonsEnum'
        * @example Example usage of showToolbarButton:
        * var buttonsArrayToShow = [toolbarFacade.buttonsEnum.import, toolbarFacade.buttonsEnum.export];
        * toolbarFacade.showToolbarButton(buttonsArrayToShow)
        * @returns {undefined}
        */
        showToolbarButton: showToolbarButton,
        /**
         * disable buttons of the toolbar      
         * @method disableToolbarButton
         * @param {array} buttonsArrayToDisable array of buttons to disable of type 'buttonsEnum'
         * @example Example usage of disableToolbarButton:
         * var buttonsArrayToDisable = [toolbarFacade.buttonsEnum.import, toolbarFacade.buttonsEnum.export];
         * toolbarFacade.disableToolbarButton(buttonsArrayToDisable)
         * @returns {undefined}
         */
        disableToolbarButton: disableToolbarButton,
        /**
         * enable buttons of the toolbar
         * @method disableToolbarButton
         * @param {array} buttonsArrayToEnable array of buttons to enable of type 'buttonsEnum'
         * @example Example usage of enabledToolbarButton:
         * var buttonsArrayToEnable = [toolbarFacade.buttonsEnum.import, toolbarFacade.buttonsEnum.export];
         * toolbarFacade.enabledToolbarButton(buttonsArrayToEnable)
         * @returns {undefined}
         */
        enabledToolbarButton: enabledToolbarButton,
        removeMobileMaxtotalAttachmentsSize: removeMobileMaxtotalAttachmentsSize
    };
});

