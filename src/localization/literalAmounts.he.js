define([], function () {
    return {
        name: 'he',
        currency: {
            plural: 'שקלים',
            unitExceptions: {
                'אפס': '',
                'אחד': 'שקל אחד',
                'שניים': 'שני שקלים'
            }
        },
        lowValueCurrency: {
            useGrammticGenderException: true,
            plural: 'אגורות',
            unitExceptions: {
                'אפס': '',
                'אחת': 'אגורה אחת'
            }
        },
        separator: ' ו'
    };
});