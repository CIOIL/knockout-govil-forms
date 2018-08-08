define(['common/resources/texts/basicValidation'], function (commonTexts) {

    return {
        hebrew: {
            hebrew: commonTexts.hebrew.hebrew,
            hebrewNumber: commonTexts.hebrew.hebrewWithNumbers,
            hebrewExtended: 'יש להזין אותיות בעברית וסימנים בלבד',
            freeHebrew: 'יש להזין אותיות בעברית, מספרים ותווים מיוחדים בלבד',
            noHebrewLetters: 'אין להזין אותיות בעברית',
            english: commonTexts.hebrew.english,
            englishNumber: 'יש להזין אותיות לועזיות וספרות בלבד',
            englishExtended: 'יש להזין אותיות לועזיות וסימנים בלבד',
            englishHebrew: 'יש להזין אותיות בעברית ואנגלית בלבד',
            englishHebrewNumber: 'יש להזין אותיות בעברית, אנגלית וספרות בלבד',
            apostropheAfterLetters: 'שימוש לא תקין בגרש',
            noApostrophe: 'אין להזין גרש',
            noFinalLetters: 'אין להזין אותיות סופיות',
            finalLetters: 'אין להזין אותיות סופיות בתחילת או באמצע מילה',
            startWithDigit: 'יש להזין ספרות תחילה',
            fileName: 'אין להזין את התווים / \ : * ? " < > |',
            freeText: 'אין אפשרות להזין את התווים (&,<,>)'
        },
        arabic: {
            hebrew: commonTexts.arabic.hebrew,
            hebrewNumber: commonTexts.hebrew.hebrewWithNumbers,
            hebrewExtended: 'يجب اضافه احرف بالعبريه واشارات فقط ',
            freeHebrew: 'יש להזין אותיות בעברית, מספרים ותווים מיוחדים בלבד',
            noHebrewLetters: 'אין להזין אותיות בעברית',
            english: commonTexts.hebrew.english,
            englishNumber: 'יש להזין אותיות לועזיות וספרות בלבד',
            englishExtended: 'יש להזין אותיות לועזיות וסימנים בלבד',
            englishHebrew: 'יש להזין אותיות בעברית ואנגלית בלבד',
            englishHebrewNumber: 'יש להזין אותיות בעברית, אנגלית וספרות בלבד',
            apostropheAfterLetters: 'שימוש לא תקין בגרש',
            noApostrophe: 'لا يمكن ادخال اقتباس (\')',
            noFinalLetters: 'لا يجب ادخال احرف نهائية في بداية او وسط الكلمة',
            finalLetters: 'لا يجب ادخال احرف نهائية في بداية او وسط الكلمة',
            startWithDigit: 'يجب إدخال الأرقام أولا',
            fileName: 'אין להזין את התווים / \ : * ? " < > |',
            freeText: 'אין אפשרות להזין את התווים (&,<,>)'
        },
        english: {
            hebrewNumber: commonTexts.english.hebrewWithNumbers,
            hebrewExtended: 'please enter Hebrew letters and symbols only',           
            freeHebrew: 'please enter Hebrew letters, digits and special symbols only',
            hebrew: commonTexts.english.hebrew,
            noHebrewLetters: 'Hebrew letters are not allowed',
            english: commonTexts.english.english,
            englishNumber: 'Please enter English letters and digits only',
            englishExtended: 'please enter English letters and symbols only',
            englishHebrew: 'Please enter English and Hebrew letters only',
            englishHebrewNumber:'',
            apostropheAfterLetters: 'Inappropriate usage of apostrophe',
            noFinalLetters: 'Terminal letters are not allowed',
            startWithDigit: 'please enter digit first',
            noApostrophe: 'Apostrophe not allowed in this field',
            finalLetters: 'Please enter terminal letters only at the end of the word',
            fileName: 'the following chacactesr are not allowed / \ : * ? " < > |',
            freeText: 'the following chacactesr are not allowed (&,<,>)'
        }
    };

});