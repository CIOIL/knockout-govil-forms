define([], function () {

    var severity = { error: 16, warning: 48, information: 64 };

    var validates = {
        hebrew: {
            onlyHebrewLetters: 'input {0} should contain only Hebrew letters',
            apostropheAfterLetters: 'Inappropriate usage of Apostrophe if field {0}',
            capitalLetters: 'In field {0} Do not enter final letters at  the end or at the beginning of the word'
        },
        englishHebrew: 'input {0} should contain only English & Hebrew letters',
        onlyEnglishLetters: 'The field {0} should contain English letters only',
        english: 'input {0} should contain only English letters',
        englishNumber: 'input {0} should contain only English letters & numbers',
        street: ' input {0} should contain only letters and numbers',
        homeNumber: 'input {0} should contain only Hebrew letters and numbers.',
        foreignPassport: 'input {0} should contain only English letters and numbers.',
        IPAddresses: 'input {0} should contain valid IP address in template 255.255.255.255',
        email: 'input {0} should contain valid mail address in template xxx@xxx.xxx',
        url: 'input {0} should contain website address ',
        decimal: 'input {0} should contain decimal number only',
        decimalWithParam: 'input {0} shoul contain decimal number with {1} digits before dot and {2} digits after dot',
        date: 'the date input in {0} is invalid, enter valid date',
        number: 'input {0} should contain an integer number',
        signedNumber: 'input {0} should contain an integer number',
        passport: 'input {0} contains invalid characters',
        idNum: 'invalid input {0}. enter a valid identity number including check digit',
        pastDate: 'input {0} should contain a date earlier than {1}',
        untilToday: 'input {0} should contain a date until {1}',
        futureDate: 'input {0} should contain a date later or equal to {1}',
        between2Dates: 'input {0} should contain a date between {1} and {2}',
        minValue: 'input {0} should contain number larger than {1}',
        maxValue: 'input {0} should contain number smaller than {1}',
        minLength: 'input ‫{0} value is too short, you should enter at least {1} characters',
        maxLength: 'input ‫{0} value is too long, you can enter ‫{1} characters',
        defaultMessage: 'input {0} value is not valid',
        areaCodeNotExist: 'Area code is not valid',
        phoneNumberInvalid: 'Number is invalid. enter only digits',
        phoneNumberTooShort: 'The number entered is too short',
        phoneNumberTooLong: 'The number entered is too long'
    };

    var errors = {
        biztalk: 'Error occured while sending form. Please contact support 1-800-200-560',
        uniqSubmit: 'This form was send the past',
        callServer: 'Error occured while call server. Please contact support 1-800-200-560',
        tablesAllowedRowNum: 'The maximum number of rows allowed in this table is {0}.',
        tablesAtListOneRow: 'The table must have at least one row',
        rowEmpty: 'The row is empty',
        rowIsNotEmpty: 'Row is not empty',
        UnSupportedForm: 'The form is not supported',
        loadListFailed: 'Failed on loading list from server'
    };

    var titles = {
        tablesError: 'table use error',
        generalError: 'Failed to fill form',
        sendTheForm: 'Form Send',
        error: 'error'
    };

    var dTable= {
        uniqeItems: 'Do not enter duplicate values in this table',
        minRows: 'The table must have at least {0} rows',
        maxRows: 'The table can be {0} rows'            
    };

    return {
        severity: severity,
        validates: validates,
        errors: errors,
        titles: titles,
        dTable: dTable
    };

});