/** module that holds utility functions for lookup. 
 * providing information and giving access to elements auto-created by the infrastructure.
 * </br>
 * infrastructure lookup:
 * </br>
 * <ul>
 *  <li>select id="pickUp_Town" class="tfsInputCombo" name="Town" tfsbind="..." tfsselect="" tfsdatatype="LookUpWindow"></select><b>select element - </b> </li>
 *  <li><b>your input</b> input onkeyup="AgatLookupWindow.showLookUpWindowFromKey(event, this)" id="Town" class="tfsInputCombo lookup-input lookup-input-override" onkeydown="AgatLookupWindow.showLookUpWindowFromTabKey(event, this)" tfsdata="" tfsname="ישוב בכרטיסית" tfsshowdropdownbtn="false" placeholder="" tfslookupwindow="" data-role="none" tfsvalue="431"</li>
 *  <li><b>hidden arrow</b> input onclick="showLookUpWindow(this)" id="arrow_Town" class="lookup-arrow lookup-arrow-override" style="..." type="button" tfsshowdropdownbtn="false"</li>
 *  <li><b>arraw</b> button onclick="showLookUpWindow(this)" id="arrow_Town" class="lookup-arrow lookup-arrow-override" tfsshowdropdownbtn="false"</li>
 * </ul>
@module lookUpMethods  
*/

define(['common/core/exceptions',
        'common/elements/autocompleteMethods',
        'common/elements/agFormsLookupMethods',
        'common/core/generalAttributes'
], function (exceptions, autocompleteMethods, agFormsLookupMethods, generalAttributes) {//eslint-disable-line max-params
    
    const autocompleteMethodsAPI = {
        hasLookupValue: autocompleteMethods.hasAutocompleteValue,
        getLookupValue: autocompleteMethods.getAutocompleteValue,
        getArrowElement: autocompleteMethods.getArrowElement,
        getLabelElement: autocompleteMethods.getLabelElement,
        getWrapperElement: autocompleteMethods.getWrapperElement,
        getValidInput: autocompleteMethods.getValidInput,
        isLookUp: autocompleteMethods.isAutocomplete
    };
    const api = {
        govForm: autocompleteMethodsAPI,
        agForm: agFormsLookupMethods
    };

    return generalAttributes.isGovForm() ? api.govForm : api.agForm;

  
});
