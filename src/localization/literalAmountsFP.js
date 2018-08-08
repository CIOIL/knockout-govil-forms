/**
* demonstration to a more functional programming approach to the implementation of literalAmounts.js
* Created for demonstrational use only.
*/
 /* eslint-disable */
define(['common/utilities/reflection', 'common/localization/literalNumbers', 'common/localization/literalAmounts.he', 'common/localization/literalAmounts.en'],
    function (reflection, literalNumbers, he, en) {

        var defaults = {
            lang: 'he'
        };

        var languages = {
            en: en,
            he: he
        };

        /*
          In functional programming terms, identity, right and left functions are functors.
          For further details, see https://github.com/getify/Functional-Light-JS/blob/db373dcc984eb7e7b0fd1a6c980572565923f7df/ch8.md#a-word-functors
        */
        const identity = (x) => (
            {
                map: (f) => identity(f(x)),
                fold: (f) => f(x)
            }
        );

        const right = (x) => (
            {
                map: (f) => right(f(x)),
                fold: (f, g) => g(x),
                chain: (f) => f(x)
            }
        );

        const left = (x) => (
            {
                map: (f) => left(x),
                fold: (f, g) => f(x),
                chain: (f) => f(x)
            }
        );

        const fromNullable = (x) =>
            (x !== null && x !== undefined && x !== '') ? right(x) : left('');

        function splitAmount(amount, decimalprecision) {

            return identity(amount)
                .map(n => n.toFixed(decimalprecision))
                .map(n => n.toString())
                .map(s => s.split('.'))
                .fold(splitedAmount => ({
                    primaryAmount: splitedAmount[0],
                    amountAfterDecimalPoint: fromNullable(splitedAmount[1])
                        .fold(n => 0, n => n)
                }));
        }

        /**
         * Converts numeric amounts to their literal form. supports english and hebrew   
         * functionaly Equivalent to localization\convertAmount in literalAmounts.js
         */

        function convertAmount(amount, options) {

            function getLanguageDefinitions(options) {
                var languageType = options.lang || '';
                return languages[languageType] ? languages[languageType] : languages[defaults.lang];
            }

            options = reflection.extendSettingsWithDefaults(options || {}, defaults);
            var language = getLanguageDefinitions(options);


            function combineLiteralAmountWithCurrency(amount, currency) {
                return fromNullable(amount)
                    .map((amt) => currency.unitExceptions && currency.unitExceptions.hasOwnProperty(amt))
                    .chain((isUnitException) => isUnitException ?
                        left(currency.unitExceptions[amount]) :
                        right(amount))
                    .fold(amt => amt, amt => `${amt} ${currency.plural}`);
            }

            function getFullAmount(primaryAmountWithCurrency, amountAfterDecimalPointWithCurrency) {
                return fromNullable(amountAfterDecimalPointWithCurrency)
                    .map(() => primaryAmountWithCurrency ?
                        primaryAmountWithCurrency + language.separator : '')
                    .fold(() => primaryAmountWithCurrency, amount => amount + amountAfterDecimalPointWithCurrency);
            }

            if (isNaN(amount)) {
                return '';
            }

            return identity(splitAmount(Number(amount), 2))
                .map(splitedAmount => ({
                    literalPrimaryAmount: literalNumbers.convertNumber(splitedAmount.primaryAmount, { lang: language.name, useGrammticGenderException: language.currency.useGrammticGenderException }),
                    literalAmountAfterDecimalPoint: literalNumbers.convertNumber(splitedAmount.amountAfterDecimalPoint, { lang: language.name, useGrammticGenderException: language.lowValueCurrency.useGrammticGenderException })
                }))
                .map(splitedLiteralAmount => ({
                    primaryAmountWithCurrency: combineLiteralAmountWithCurrency(splitedLiteralAmount.literalPrimaryAmount, language.currency),
                    amountAfterDecimalPointWithCurrency: combineLiteralAmountWithCurrency(splitedLiteralAmount.literalAmountAfterDecimalPoint, language.lowValueCurrency)
                }))
                .fold(res => getFullAmount(res.primaryAmountWithCurrency, res.amountAfterDecimalPointWithCurrency));
        }
        /* eslint-enable */
        return {
            convertAmount: convertAmount
        };
    });