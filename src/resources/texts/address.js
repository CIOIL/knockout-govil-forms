define(['common/resources/texts/basicValidation'], function (commonTexts) {

    return {
        hebrew: {
            street: ' עליך להזין אותיות בעברית',
            houseNumber: 'אין אפשרות להזין תו זה',
            IPAddress: 'עליך להזין ספרות ונקודות בלבד',
            email: 'עליך להזין כתובת אימייל תקנית באותיות לועזיות וללא רווחים, במבנה X@X.XX',
            url: 'עליך להזין תחילת כתובת במבנה WWW או HTTP',
            mailbox: 'עליך להזין תא דואר באורך 2 עד 5 ספרות',
            zipCode: 'עליך להזין מיקוד בן 7 ספרות',
            apartment: 'עליך להזין מספר דירה עד 4 ספרות בלבד',
            zeroDigits: 'מספר לא תקין',
            startWithZero: 'עליך להזין ספרות תחילה'
        },
        arabic: {
            street: 'أدخل الحروف باللغة العبرية',
            houseNumber: 'لا يمكن إدخال هذا الحرف',
            IPAddress: 'يجب إدخال أرقام وفترات فقط',
            email: 'يجب إدخال عنوان البريد الإلكتروني القياسي في الأحرف اللاتينية وبدون مسافات، في شكل X@X.XX',
            url: 'الرجاء ادخال بداية عنوان في مبنى WWW أو HTTP',
            mailbox: 'يجب إدخال علبة بريد من 2 إلى 5 أرقام',
            zipCode: 'يجب إدخال رمز بريدي مكون من 7 أرقام',
            apartment: 'يجب إدخال رقم شقة تصل إلى 4 أرقام فقط',
            zeroDigits: 'الرقم غير صالح',
            startWithZero: 'يجب إدخال خانات أولا'
        },
        english: {
            street: commonTexts.english.hebrewWithNumbers,
            houseNumber: 'You can not use this character.',
            IPAddress: 'Please use digits 0-9 and "." only',
            email: 'Please enter a valid email address using Latin characters (a-z) and without spaces in the following format: X@X.XX. Example: abc@def.gh',
            url: 'Please enter a valid website address ',
            mailbox: 'Please enter a 2-5 digit post office box number.',
            zipCode: 'Please enter a 7 digit zip code.',
            apartment: 'Please enter a 1-4 digit apartment number.',
            zeroDigits: 'The number you have entered is not valid.',
            startWithZero: 'The apartment/house number must start with a number'
        },
        tooltip: {
            hebrew: {
                zipCode: 'ניתן לעבור לאתר דואר ישראל לאיתור המיקוד',
                accessibilityNewWindowAlert: 'קישור זה ייפתח בחלון חדש'

            },
            english: {
                zipCode: 'Zip locator service is available at the Israel Postal Company site',
                accessibilityNewWindowAlert: 'opens in new window'
            }
        },
        labels: {
            hebrew: {
                zipCode: 'מיקוד ',
                locateZipCode: 'איתור מיקוד'
            },
            english: {
                locateZipCode: 'Locate zip code',
                zipCode: 'Zip code '
            }
        }
    };

});