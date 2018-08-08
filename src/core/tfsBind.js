define(function (require) {

    var commonReflection = require('common/utilities/reflection'),
        tfsAttributes = require('common/resources/tfsAttributes'),
        convertUtilities = require('common/utilities/conversion');

    var selectors = { containingRow: 'table[tfsdata]>tbody>tr'};

    //#region Documentation    
    /** * this method bind the tfsBind setting (concate the url with the queryString)
        * @param {object} queryString - object with the queryString setting
        * @param {object} binding - object with the bind setting
        * @returns {string}  - tfsBind string **/
    //#endregion
    var formatTfsBind = function (binding, queryString) {
        var urlBind = '', setting;

        if (binding.queryString !== undefined) {
            queryString = commonReflection.extendSettingsWithDefaults(queryString, binding.queryString);
        }

        if (binding.url !== undefined) {
            urlBind = binding.url + '?' + convertUtilities.jsonToQueryString(queryString);
        }
        setting = commonReflection.extendSettingsWithDefaults({ url: urlBind }, binding);
        delete setting.queryString;

        return convertUtilities.jsonToBinding(setting);
    };

    //#region Documentation
    /** * this method bind the tfsBind setting with filter (for lookUp depends fields)
        * @param {string} filter - selector to the filter field (must be lookUp) 
        * @param {object} binding - object with the bind setting
        * @param {object} sender -optional- for dynamic tables- the select sender to find the row
        * @returns {string} -string for tfsBind  
        note: to use this function from dynamic tables the form have to use the 'tfsAttributeEventHadlder'**/
    //#endregion
    var tfsBindWithLookUpFilter = function (filter, binding, sender) { //eslint-disable-line complexity
        var bindResponse;

        if (sender !== undefined) {//for dynamic tables
            if (sender.myParent !== undefined) {
                //the toolbar call this function twice or more each time, so in the other times take the filter from the memory/
                filter = sender.myParent;
            }
            else {
                //find the filter field in the same row
                filter = $(sender).closest(selectors.containingRow).find(filter);
                if (filter.length > 0) {
                    //save the field in the memory in the property 'myParent' for the next calling
                    sender.myParent = filter;
                }
            }
        }

        if ($(filter).attr(tfsAttributes.TFSVALUE) && $(filter).attr(tfsAttributes.TFSVALUE) !== '') {

            var queryString = { filter: $(filter).attr(tfsAttributes.TFSVALUE) };
            bindResponse = formatTfsBind(binding, queryString);
            return bindResponse;
        }
        return '';
    };

    return {
        tfsBindWithLookUpFilter: tfsBindWithLookUpFilter,
        formatTfsBind: formatTfsBind
    };
});