define(['common/resources/texts/basicValidation'], function (basicValidation) {

    return {
        hebrew: {
            integer: basicValidation.hebrew.integer,
            signedNumber: basicValidation.hebrew.number,
            decimal: 'עליך להזין ערך עשרוני',
            decimalWithParam: 'עליך להזין עד {0} ספרות לפני הנקודה ועד {1} ספרות אחרי הנקודה',
            number: basicValidation.hebrew.number,
            min: 'עליך להזין מספר הגדול או שווה ל {0}',
            max: 'עליך להזין מספר הקטן או שווה ל {0}',
            greaterThan: 'עליך להזין מספר גדול מ {0}',
            lessThan: 'עליך להזין מספר קטן מ {0}'
        },
        arabic: {
            integer: basicValidation.arabic.integer,
            signedNumber: basicValidation.arabic.number,
            decimal: 'يجب إدخال قيمة عشرية',
            decimalWithParam: 'يجب إدخال ما يصل إلى {0} أرقام قبل النقطة و {1} من المنازل العشرية',
            number: basicValidation.arabic.number,
            min: 'أدخل رقما أكبر من أو يساوي {0}',
            max: 'أدخل رقما أقل من أو يساوي {0}',
            greaterThan: 'أدخل رقما أكبر من {0}',
            lessThan: 'أدخل رقما أقل من {0}'
        },
        english: {
            integer: basicValidation.english.integer,
            signedNumber: basicValidation.english.number,
            decimal: 'You must enter a decimal value.',
            decimalWithParam: 'Please anter a decimal number with {0} digits before decimal point and {1} digits after it',
            number: basicValidation.english.number,
            min: 'Please enter a value greater than {0}',
            max: 'Please enter a value less than or equal to {0}',
            greaterThan: 'Please enter a value greater than {0}',
            lessThan: 'Please enter a value less than {0}'
        }
    };
});