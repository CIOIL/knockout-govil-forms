define([], function () {
    return {
        'baseSeparator': ' ו',
        'unitSeparator': 'ו',
        'withAnd': true,
        'base': {
            '0': 'אפס',
            '1': 'אחד',
            '2': 'שניים',
            '3': 'שלושה',
            '4': 'ארבעה',
            '5': 'חמישה',
            '6': 'ששה',
            '7': 'שבעה',
            '8': 'שמונה',
            '9': 'תשעה',
            '10': 'עשרה',
            '11': 'אחד עשר',
            '12': 'שנים עשר',
            '13': 'שלושה עשר',
            '14': 'ארבעה עשר',
            '15': 'חמשה עשר',
            '16': 'ששה עשר',
            '17': 'שבעה עשר',
            '18': 'שמונה עשר',
            '19': 'תשעה עשר',
            '20': 'עשרים',
            '30': 'שלושים',
            '40': 'ארבעים',
            '50': 'חמישים',
            '60': 'ששים',
            '70': 'שבעים',
            '80': 'שמונים',
            '90': 'תשעים',
            '100': 'מאה',
            '200': 'מאתיים',
            '300': 'שלש מאות',
            '400': 'ארבע מאות',
            '500': 'חמש מאות',
            '600': 'שש מאות',
            '700': 'שבע מאות',
            '800': 'שמונה מאות',
            '900': 'תשע מאות',
            '2000': 'אלפיים',
            '3000': 'שלשת אלפים',
            '4000': 'ארבעת אלפים',
            '5000': 'חמשת אלפים',
            '6000': 'ששת אלפים',
            '7000': 'שבעת אלפים',
            '8000': 'שמונת אלפים',
            '9000': 'תשעת אלפים',
            '10000': 'עשרת אלפים',
            '100000': 'מאה אלף'
        },
        'units': [
            {
                'singular': 'מאה',
                'plural': 'מאות',
                'avoidPrefixException': [1],
                'useBaseInstead': true,
                'useBaseException': []
            },
            {
                'singular': 'אלף',
                'useBaseUnits': [2, 3, 4, 5, 6, 7, 8, 9, 10],
                'avoidPrefixException': [1]
            },
            {
                'singular': 'מיליון',
                'avoidPrefixException': [1],
                'replacePrefixException': { '2': 'שני' }
            },
            {
                'singular': 'מיליארד',
                'avoidPrefixException': [1],
                'replacePrefixException': { '2': 'שני' }
            },
            {
                'singular': 'טריליון',
                'avoidPrefixException': [1],
                'replacePrefixException': { '2': 'שני' }
            }
        ],
        'unitExceptions': {
        },
        'grammticGenderExceptions': {
            '1': 'אחת',
            '2': 'שתיים',
            '3': 'שלש',
            '4': 'ארבע',
            '5': 'חמש',
            '6': 'שש',
            '7': 'שבע',
            '8': 'שמונה',
            '9': 'תשע',
            '10': 'עשר',
            '11': 'אחת עשרה',
            '12': 'שתים עשרה',
            '13': 'שלש עשרה',
            '14': 'ארבע עשרה',
            '15': 'חמש עשרה',
            '16': 'שש עשרה',
            '17': 'שבע עשרה',
            '18': 'שמונה עשרה',
            '19': 'תשע עשרה'
        }
    };
});