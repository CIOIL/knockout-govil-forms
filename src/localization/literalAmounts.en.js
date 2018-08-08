define([], function () {
    return {
        name: 'en',
        currency: {
            plural: 'dollars',
            unitExceptions: {
                'zero': '',
                'one': 'one dollar'
            }
        },
        lowValueCurrency: {
            plural: 'cents',
            unitExceptions: {
                'zero': '',
                'one': 'one cent'
            }
        },
        separator: ' and '
    };
});