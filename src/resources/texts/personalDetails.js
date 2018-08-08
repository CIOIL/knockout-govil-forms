define(['common/resources/texts/language'], function (commonTexts) {

    return {
        hebrew: {
            passport: ' עליך להזין מספר דרכון עד 10 תווים – ספרות, אותיות באנגלית והסימנים -/\()',
            idNum: 'עליך להזין מספר זהות תקין בן 9 ספרות כולל ספרת ביקורת',
            soleTrader: 'עליך להזין מספר עוסק מורשה תקין בן 9 ספרות כולל ספרת ביקורת.',
            hebrewName: {
                letters: commonTexts.hebrew.hebrew,
                apostropheAfterLetters: commonTexts.hebrew.apostropheAfterLetters,
                finalLetters: commonTexts.hebrew.finalLetters
            },
            englishName: 'עליך להזין אותיות באנגלית',
            militaryIdNumber: 'עליך להזין מספר אישי צבאי בן 7 ספרות',
            cp: 'עליך להזין מספר ח.פ. תקין בן 9 ספרות המתחיל בספרה 5',
            npo: 'עליך להזין מספר עמותה תקין בן 9 ספרות המתחיל ב-580',
            israeliPassport: 'עליך להזין מספר דרכון ישראלי תקין בן 7 או 8 ספרות',
            foreignPassport: 'עליך להזין מספר דרכון בספרות ובאותיות לועזיות',
            carNumber: 'עליך להזין מספר רכב בן 5 עד 8 ספרות'
        },
        english: {
            passport: 'The field contains invalid characters',
            idNum: 'Please enter a valid, 9 digit ID number, including the check digit.',
            soleTrader: 'Please enter a valid, 9 digit Authorized Dealer number, including the check digit.',
            hebrewName: {
                letters: commonTexts.english.hebrew,
                apostropheAfterLetters: 'Inappropriate usage of apostrophe',
                finalLetters: 'Please enter terminal letters only at the end of the word'
            },
            englishName: 'please enter name in english letters',
            militaryIdNumber: 'Please enter your personal, 7 digit military number.',
            cp: 'Please enter a valid, 9 digit Private Company number, starting with 5.',
            npo: 'Please enter a valid, 9 digit Voluntary Association number, starting with 580.',
            israeliPassport: 'Please enter a valid, 7 or 8-digit ID number, including the check digit.',
            foreignPassport: 'Please enter a valid passport number using Latin characters (A-Z, a-z) and digits (0-9).',
            carNumber: 'Please enter characters 0-9 only'
        },
        arabic: {
            passport: 'يجب إدخال رقم جواز سفر يصل إلى 10 أحرف - أرقام، الحروف الإنجليزية والرموز - / \ ()',
            idNum: 'عليك وضع رقم الهويه من 9 ارقام',
            soleTrader: 'يجب ادخال رقم المشغل المرخص بشكل صحيح من 9 خانات يشمل الخانة الأولى',
            hebrewName: {
                letters: commonTexts.arabic.hebrew,
                apostropheAfterLetters: commonTexts.hebrew.apostropheAfterLetters,
                finalLetters: commonTexts.hebrew.finalLetters
            },
            englishName: '"يجب إدخال اسم باللغة الإنجليزية',
            militaryIdNumber: '"يجب إدخال رقم عسكري مكون من 7 أرقام،',
            cp: 'يجب ادخال رقم الشركة الشخصية بشكل صحيح من 9 خانات ويبدأ 5',
            npo: 'يجب ادخال رقم الجمعية من 9 خانات الذي يبدأ في 580',
            israeliPassport: 'يجب ادخال رقم جواز السفر الصحيح من 7 الى 8 خانات',
            foreignPassport: 'يجب إدخال رقم جواز السفر في الأرقام وفي الحروف الأجنبية',
            carNumber: '"يجب إدخال رقم السيارة بين 5 و 8 أرقام"'
        }
    };
});