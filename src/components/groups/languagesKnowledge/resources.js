define(['common/entities/entityBase'], function (entityBase) {

    return {
        texts: {
            hebrew: {
                selectedLanguage: 'בחר שפה',
                language: 'שפה',
                speaking: 'דיבור',
                reading: 'קריאה',
                writing: 'כתיבה',
                choose: 'בחר',
                levelLanguageList: [new entityBase.EntityBase({ value: 'טוב מאוד', key: '1' }),
                      new entityBase.EntityBase({ value: 'בינוני', key: '2' }),
                      new entityBase.EntityBase({ value: 'חלש', key: '3' }),
                      new entityBase.EntityBase({ value: 'שפת אם', key: '4' })]
            },
            english: {
                selectedLanguage: 'choose language',
                language: 'language',
                speaking: 'speaking',
                reading: 'reading',
                writing: 'writing',
                choose: 'Choose',
                levelLanguageList: [new entityBase.EntityBase({ value: 'very good', key: '1' }),
                      new entityBase.EntityBase({ value: 'middle', key: '2' }),
                      new entityBase.EntityBase({ value: 'slight', key: '3' }),
                      new entityBase.EntityBase({ value: 'native language', key: '4' })]
            }
        }
    };
});