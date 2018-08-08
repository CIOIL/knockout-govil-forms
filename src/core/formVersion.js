define(function (require) {

    //TODO : create Form Part (html + knockout) that will replace the old formMethods.showIncaompatiblePluginVersion
    var numericExtensions = require('common/utilities/numericExtensions'),
        commonRegularExpressions = require('common/resources/regularExpressions'),
        formExceptions = require('common/core/exceptions'),
        infrastructureGlobals = require('common/core/infrastructureGlobals');


    var messages = {
        invalidVersionNumber: 'invalid version number'
    };

    var isValidVersion = function (version) {
        return commonRegularExpressions.versionNumber.test(version);
    };

    var compareVersionCategories = function (version1NumbersArray, version2NumbersArray) {
        var len = Math.min(version1NumbersArray.length, version2NumbersArray.length);
        var result = 0;
        for (var i = 0; i < len && result === 0; i++) {
            result = numericExtensions.compare(version1NumbersArray[i], version2NumbersArray[i]);
        }
        return result;
    };

    var compareVersions = function (version1, version2) { //eslint-disable-line complexity

        if ($.type(version1) !== 'string' || $.type(version2) !== 'string') {
            formExceptions.throwFormError(messages.invalidVersionNumber);
        }

        if (!isValidVersion(version1) || !isValidVersion(version2)) {
            formExceptions.throwFormError(messages.invalidVersionNumber);
        }

        var version1NumbersArray = version1.split('.');
        var version2NumbersArray = version2.split('.');

        var categoryComparisonResult = compareVersionCategories(version1NumbersArray, version2NumbersArray);

        if (categoryComparisonResult !== 0) {
            return categoryComparisonResult;
        }

        return numericExtensions.compare(version1NumbersArray.length, version2NumbersArray.length);

    };    

    function checkIncompatiblePluginVersion(tfspluginversion) {
        var notCompared = -1;
        if (compareVersions(infrastructureGlobals.currentPlugInVersion, tfspluginversion) === notCompared) {
            return true;
        }
        return false;
    }

    var isPdf = function () {
        return $('body').hasClass('pdf');
    };

    return {
        compareVersions: compareVersions,
        checkIncompatiblePluginVersion: checkIncompatiblePluginVersion,
        isValidVersion: isValidVersion,
        isPdf: isPdf
    };
});
