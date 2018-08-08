/** 

 * @module scaMethods
 * @description module that holds functions to extract data from SCA fields
 */

define(function () {

    var notFound = -1;

    function extract(value, delimiter, beforeOrAfter) {
        var index = (beforeOrAfter === 'afterDelimiter' && value.indexOf(delimiter) !== notFound) ? 1 : 0;
        return value.split(delimiter)[index];
    }

    function extractIdentificationNumber(identificationNumber) {

        if (typeof identificationNumber === 'undefined') {
            return '';
        }
        identificationNumber = extract(identificationNumber, '@');
        identificationNumber = extract(identificationNumber, '-', 'afterDelimiter');
        return identificationNumber;
    }

    function extractCompanyNumber(companyNumber) {
        if (typeof companyNumber === 'undefined') {
            return companyNumber;
        }
        if (companyNumber.toLowerCase().indexOf('o=') === notFound) {
            return companyNumber;
        }
        companyNumber = extract(companyNumber.toLowerCase(), 'o=', 'afterDelimiter');
        companyNumber = extract(companyNumber, ',');
        companyNumber = extract(companyNumber, '-', 'afterDelimiter');
        return companyNumber;
    }

    function extractCompanyName(companyName) {

        if (typeof companyName === 'undefined') {
            return '';
        }
        if (companyName.toLowerCase().indexOf('ou=') === notFound) {
            return '';
        }
        companyName = extract(companyName.toLowerCase(), 'ou=', 'afterDelimiter');
        companyName = extract(companyName, ',');
        return companyName;
    }

    /*eslint-disable */
    function getIdNumberFromSignature(scaSubject) {

        if (scaSubject.indexOf('ID_') !== notFound) {
            return scaSubject.substring(scaSubject.indexOf('ID_') + 3, scaSubject.indexOf('ID_') + 12);
        }
        if (scaSubject.indexOf('P_') !== notFound) {
            return scaSubject.substring(scaSubject.indexOf('P_') + 2, scaSubject.indexOf('P_') + 11);
        }
        if (scaSubject.indexOf('TR_') !== notFound) {
            return scaSubject.substring(scaSubject.indexOf('TR_') + 3, scaSubject.indexOf('TR_') + 12);
        }
        if (scaSubject.indexOf('SERIALNUMBER=') !== notFound) {
            return scaSubject.substring(scaSubject.indexOf('SERIALNUMBER=') + 16, scaSubject.indexOf('SERIALNUMBER=') + 25);
        }

        return '';

    }
    /*eslint-enable*/

    return {
        /** 

         * @function <b>extractIdentificationNumber</b>
         * extracts identification number
         * @param {string} identificationNumber - string that contains idNumber among other chars
         * @returns {string} the extracted identificationNumber
         */
        extractIdentificationNumber: extractIdentificationNumber,
        /** 
       * @function <b>extractCompanyNumber</b>
       * extracts company number
       * @param {string} companyNumber - string that contains company number among other chars
       * @returns {string}  the extracted company number
       */
        extractCompanyNumber: extractCompanyNumber,
        /** 
           * @function <b>extractCompanyName</b>
       * extracts company name
       * @param {string} companyName - string that contains company name among other chars
       * @returns {string}  the extracted companyName
       */
        extractCompanyName: extractCompanyName,
        getIdNumberFromSignature: getIdNumberFromSignature
    };
});