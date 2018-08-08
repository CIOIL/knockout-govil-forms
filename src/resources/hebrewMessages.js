define(['common/components/support/supportViewModel'
], function (supportViewModel) {
    var messages;
    var severity = { error: 16, warning: 48, information: 64 };
    var validates = {
        hebrewName: {
            letters: 'יש להזין אותיות בעברית בלבד',
            apostropheAfterLetters: 'שימוש לא תקין בגרש',
            finalLetters: 'אין להזין אותיות סופיות בתחילת או באמצע מילה'
        },
        required: 'חובה להזין ערך בשדה זה',
        hebrew: 'יש להזין אותיות בעברית בלבד',
        englishHebrew: 'עליך להזין בשדה {0} אותיות בעברית ואנגלית בלבד',
        onlyEnglishLetters: 'בשדה {0} יש להזין אותיות באנגלית בלבד',
        english: 'עליך להזין ערך באנגלית',
        englishNumber: 'עליך להזין בשדה {0} אותיות באנגלית וספרות בלבד',
        street: ' בשדה {0} עליך להזין אותיות בעברית ומספרים',
        homeNumber: 'בשדה {0} עליך להזין מספר בית בספרות ובאותיות עבריות.',
        foreignPassport: 'בשדה {0} עליך להזין מספר דרכון בספרות ובאותיות לועזיות.',
        IPAddresses: 'בשדה {0} עליך להזין כתובת IP בייצוג של כארבעה מספרים עשרוניים עם נקודות בינהם.',
        email: 'עליך להזין כתובת תקנית באותיות לועזיות וללא רווחים',
        url: 'בשדה {0} עליך להזין כתובת אתר אינטרנט תקנית באותיות לועזיות וללא רווחים',
        decimal: 'בשדה {0} עליך להזין מספר דצימלי בלבד',
        decimalWithParam: 'יש להזין עד {0} ספרות לפני הנקודה ועד {1} ספרות אחרי הנקודה',
        date: 'התאריך שהזנת בשדה {0} שגוי, נא להזין תאריך נכון',
        number: 'יש להזין ערך מספרי בלבד',
        signedNumber: 'יש להזין ערך מספרי שלם בלבד',
        passport: ' הזנת ערך שגוי. עליך להזין {0} עד 10 תווים – ספרות, אותיות באנגלית והסימנים .-/\()',
        idNum: 'הזנת ערך שגוי. עליך להזין {0} תקין כולל ספרת ביקורת',
        pastDate: 'יש להזין תאריך מוקדם מ {0}',
        untilDate: 'בשדה {0} עליך להזין תאריך עד {1}',
        futureDate: 'יש להזין תאריך מאוחר או שווה ל {0}',
        betweenDates: 'תאריך בשדה {0} לפני תאריך בשדה {1}',
        between2Dates: 'בשדה {0} יש להזין ערך בטווח שבין {1} ל{2}',
        minValue: 'בשדה {0} יש להזין מספר הגדול או שווה ל {1}',
        maxValue: 'בשדה {0} יש להזין מספר הקטן או שווה ל {1}',
        minLength: 'הערך בשדה ‫{0} קצר מידיי יש להזין לפחות ‫{1} תווים',
        maxLength: 'הערך בשדה ‫{0} ארוך מידיי ניתן להזין עד ‫{1} תווים',
        defaultMessage: 'הערך בשדה {0} לא תקין',
        phone: {
            areaCodeNotExist: 'קידומת אינה מופיעה ברשימת קידומות',
            phoneNumber153: 'המספר אינו תקין, עליך להזין מספר פקס באורך 7 עד 9 ספרות',
            phoneNumber: 'המספר אינו תקין, יש להזין 7 ספרות בלבד לא כולל קדומת',
            internationalPhone: 'המספר אינו תקין, יש להזין בין 9 ל - 15 ספרות בלבד'
        },
        areaCodeNotExist: 'קידומת אינה מופיעה ברשימת קידומות',
        phoneNumberInvalid: 'המספר אינו תקין, יש להזין ספרות בלבד',
        phoneNumberTooShort: 'המספר שהוזן קצר מידי',
        phoneNumberTooLong: 'המספר שהוזן ארוך מידי',
        formDates: {
            invalidMonth: 'בשדה {0} יש להזין ערך מספרי בין 1 ל-12',
            invalidDay: 'בשדה {0} יש להזין ערך מספרי בין 1 ל-31',
            invalidDate: 'התאריך שהוזן אינו קיים'
        }
    };
    var titles = {
        tablesError: 'שגיאה בשימוש בטבלה',
        generalError: 'שגיאה במילוי הטופס',
        sendTheForm: 'שליחת טופס',
        error: 'שגיאה'
    };

    var dTable = {
        uniqeItems: 'אין להזין ערכים כפולים בטבלה זו',
        minRows: 'בטבלה זו חייבות להיות לפחות {0} שורות',
        maxRows: 'בטבלה זו יכולות להיות עד {0} שורות'
    };
    messages = {
        severity: severity,
        validates: validates,
        titles: titles,
        dTable: dTable
    };
    supportViewModel.getSupportInformationPromise.then(function () {
        var texts = {
            errors: {
                biztalk: `${supportViewModel.mail()} ${supportViewModel.phone()} חלה תקלה בתהליך קליטת הטופס. לתמיכה צור קשר בציון מספר הסימוכין בטל`,
                uniqSubmit: ' טופס עם סימוכין זה נשלח בעבר',
                callServer: `${supportViewModel.phone()} חלה תקלה בגישה לשרת. לתמיכה צור קשר בציון מספר הסימוכין בטלפון`,
                tablesAllowedRowNum: 'בטבלה זו מותרות {0} שורות בלבד',
                tablesAtListOneRow: 'בטבלה זו חייבות להיות לפחות {0} שורות',
                rowEmpty: 'השורה ריקה',
                rowIsNotEmpty: 'השורה איננה ריקה',
                UnSupportedForm: 'טופס לא נתמך',
                loadListFailed: 'טעינת רשימה מהשרת נכשלה'
            }
        };
        Object.assign(messages, texts);

    });

    return messages;

});