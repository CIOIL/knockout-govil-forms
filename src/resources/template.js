/** 
@module template 
*/
define([
    'common/ko/bindingHandlers/multipleSelect/texts',
    'common/ko/globals/multiLanguageObservable'
], function (autocompleteTexts) {
    const labels = ko.multiLanguageObservable({ resource: autocompleteTexts });

    const autocomplete = {
        arrowTemplate: `<button title=${labels().arrowTitle} value=${labels().arrowTitle} class="autocomplete-arrow noPrint"  type="button"><i class="ic-autocomplete-arrow"></i></button>`,
        arrow: '.autocomplete-arrow',
        autocompleteClass: 'autocomplete-field'
    };

    const datepicker = {
        customButtonID: 'datepicker_button',
        customButtonClass: 'datepicker-button noPrint inline-icon-field',
        customWidgetClass: 'tlp-datepicker'
    };
    return {
        autocomplete,
        datepicker
    };

});