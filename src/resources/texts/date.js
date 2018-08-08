define([], function () {

    return {

        errors: {
            hebrew: {
                dateInPattern: 'עליך להזין תאריך תקין בפורמט DD/MM/YYYY',
                date: 'התאריך שהזנת אינו קיים',
                pastDate: 'עליך להזין תאריך מוקדם מ{0}',
                futureDate: 'עליך להזין תאריך מאוחר מ{0}',
                untilDate: 'עליך להזין תאריך עד {0}',
                sinceDate: 'עליך להזין תאריך מ{0}',
                between2Dates: ' עליך להזין ערך בטווח שבין {0} ל{1}',
                isOlder: 'על {0} להיות גדול מ {1} שנים',
                isYounger: 'על {0} להיות קטן מ {1} שנים',
                time: 'עליך להזין שעה תקינה',
                dateInRange: 'עליך להזין תאריך בין טווח השנים 1900-2100'
            },
            arabic: {
                dateInPattern: 'يجب ادخال تاريخ صحيح بنمط DD/MM/YYYY',
                date: 'التاريخ الذي ادخلتموه غير صحيح',
                pastDate: 'يجب إدخال تاريخ سابق من {0}',
                futureDate: 'الرجاء إدخال تاريخ لاحق من {0}',
                untilDate: 'يجب عليك ادخال تاريخ حتى تاريخ {0}',
                sinceDate: 'يجب عليك ادخال تاريخ من ال{0} وصاعدا',
                between2Dates: 'يجب إدخال قيمة بين {0} و {1}',
                isOlder: '{0} يجب أن يكون أكبر من {1} سنة',
                isYounger: '{0} يجب أن يكون أقل من {1} سنة',
                time: 'يجب إدخال الساعة بشكل صحيح',
                dateInRange: 'الرجاء ادخال تاريخ بين السنوات 2100-1900'
            },
            english: {
                dateInPattern: 'Please enter a valid date in the following format: DD/MM/YY',
                date:'Date does not exist',
                pastDate: 'Please enter a date earlier than {0}',
                futureDate: 'Please enter a date later than {0}',
                untilDate: 'You must enter a date until {0}',
                sinceDate: 'You must enter a date from {0}',
                between2Dates: 'Please enter a date between {0} and {1}',
                isOlder: 'The {0} should be greater than {1} years',
                isYounger: 'The {0} should be no more than {1} years',
                time: 'You must enter a valid time',
                dateInRange: 'Please enter a valid date between 1900 and 2100'
            }
        },
        labels: {
            hebrew: {
                date: 'תאריך',
                day: 'יום',
                month: 'חודש',
                year: 'שנה',
                today: 'היום'
            },
            english: {
                date: 'Date',
                day: 'Day',
                month: 'Month',
                year: 'Year',
                today: 'Today'
            }
        },
        tooltip: {
            hebrew: {
                date: 'עליך להזין תאריך בפורמט DD/MM/YYYY',
                time: 'עליך להזין שעה בפורמט HH:mm'
            },
            english: {
                date: 'Please enter a valid date',
                time: 'Please enter a valid date'
            }
        }
    };

});