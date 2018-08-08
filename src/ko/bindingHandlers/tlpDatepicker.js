define(['common/viewModels/languageViewModel',
    'common/components/formInformation/formInformationViewModel',
    'common/core/UIProvider',
    'common/utilities/resourceFetcher',
    'common/ko/bindingHandlers/foreachUniqueID'
],
    function (languageViewModel, formInformation, UIProvider, resourceFetcher, dynamicFields) {//eslint-disable-line max-params

        const defaultSettings = {
            dateFormat: 'dd/mm/yy',
            showOn: 'button',
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            yearRange: '-97:+3'
        };
        const texts = {
            hebrew: {
                selectDate: 'בחר תאריך מתאריכון'
            },
            english: {
                selectDate: 'select date'
            }
        };
        const resources = {
            ariaLabelAttr: 'aria-label',
            buttonClass: '.ui-datepicker-trigger',
            customButtonID: 'datepicker_button',
            dirAttr: 'dir',
            customWidgetClass: 'tlp-datepicker',
            widgetSelector: 'widget'
        };

        const bindElementToDatePicker = function (element, options) {
            $(element).datepicker(options);
        };

        const handleButtonCSS = function (element) {
            const buttonElement = $(element).parent().find(resources.buttonClass);
            buttonElement.addClass(UIProvider.resources.datepicker.customButtonClass);
            buttonElement.attr('id', `${UIProvider.resources.datepicker.customButtonID}_${element.id}`);
            ko.applyBindingsToNode(buttonElement[0], { attr: { 'aria-label': resourceFetcher.get(texts).selectDate } });
            buttonElement.text('');
            if ($(element).is(':disabled')) {
                buttonElement.attr('disabled', true);
            }
        };

        const handelWidgetCSS = function (element) {
            handleButtonCSS(element);
            $(element).attr(resources.dirAttr, 'ltr');
            $(element).datepicker(resources.widgetSelector).addClass(UIProvider.resources.datepicker.customWidgetClass);
        };

        const generateUniqueIdInDynamic = (element) => {
            const parentElem = $(element).parents('[data-bind*="foreachUniqueID"]');
            if (parentElem[0]) {
                dynamicFields.generateUniqueID(element, parentElem);
            }
        };

        const initDatepickerElement = (element, settings) => {
            const localizationSettings = $.datepicker.regional[settings.local || languageViewModel.getShortName() || 'he'];
            const options = Object.assign({}, localizationSettings, defaultSettings, settings);
            generateUniqueIdInDynamic(element);
            bindElementToDatePicker(element, options);
            handelWidgetCSS(element);
            ko.postbox.subscribe('formLanguageChanged', (data) => {
                $(element).datepicker('option', $.datepicker.regional[data.newLanguage.shortName]);
                $(element).datepicker('option', 'dateFormat', options.dateFormat);
                handleButtonCSS(element);
            });
        };

        ko.bindingHandlers.tlpDatepicker = {
            init: function (element, valueAccessor) {
                if (formInformation.serverMode()) {
                    return;
                }
                const settings = ko.utils.unwrapObservable(valueAccessor());
                initDatepickerElement(element, settings);
            }
        };

    });