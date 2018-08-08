/**
* @description  adapting currency amounts to thier literal representation while adapting the 
* information to different languages and regional differences.
* @module literalAmounts
*/
define(['common/utilities/reflection', 'common/localization/literalNumbers', 'common/localization/literalAmounts.he', 'common/localization/literalAmounts.en'],
    function (reflection, literalNumbers, he, en) {       //eslint-disable-line max-params

        var defaults = {
            lang: 'he'
        };

        var languages = {
            en: en,
            he: he
        };

        //TODO - expose this method in a more suitable module
        function splitAmount(amount, decimalprecision) {

            var amountAfterDecimalPoint,
                splitedAmount;

            splitedAmount = amount
                           .toFixed(decimalprecision)
                           .toString()
                           .split('.');


            amountAfterDecimalPoint = splitedAmount.length === 2 ? splitedAmount[1] : 0;

            return {
                primaryAmount: splitedAmount[0],
                amountAfterDecimalPoint: amountAfterDecimalPoint
            };

        }

        /**
         * Converts numeric amounts to their literal form. supports english and hebrew   
         * @method convertAmount    
         * @param {Number} amount The amount to convert
         * @param {Object} [options] An object representation of the options
         * options.lang - the language to wich the number should be translated.
         * possible values: 'he' - Hebrew (default) 
         *                  'en' - English
         * @returns {String} the amount in words (its literal representation) including the currency name
         * @example Example usage. 
         * literalAmounts.convertAmount(4323.12); //  ' ארבעת אלפים שלש מאות ועשרים ושלושה שקלים ושתים עשרה אגורות' 
         * literalAmounts.convertAmount(4323.12,{lang:'en'}); //   'four thousand three hundred and twenty-three dollars and twelve cents'
         */

        function convertAmount(amount, options) {

            function getLanguageDefinitions(options) {
                var languageType = options.lang || '';
                return languages[languageType] ? languages[languageType] : languages[defaults.lang];
            }

            options = reflection.extendSettingsWithDefaults(options || {}, defaults);
            var language = getLanguageDefinitions(options);


            function combineLiteralAmountWithCurrency(amount, currency) {

                if (!amount) {
                    return '';
                }

                if (currency.unitExceptions && currency.unitExceptions.hasOwnProperty(amount)) {
                    return currency.unitExceptions[amount];
                }

                return amount + ' ' + currency.plural;
            }

            function getFullAmount(primaryAmountWithCurrency, amountAfterDecimalPointWithCurrency) {
                var result = primaryAmountWithCurrency;

                if (amountAfterDecimalPointWithCurrency) {

                    if (result !== '') {
                        result += language.separator;
                    }

                    result += amountAfterDecimalPointWithCurrency;
                }

                return result;

            }

            if (isNaN(amount)) {
                return '';
            }           

            var splitedAmount = splitAmount(Number(amount), 2);

            var literalPrimaryAmount = literalNumbers.convertNumber(splitedAmount.primaryAmount, { lang: language.name, useGrammticGenderException: language.currency.useGrammticGenderException });

            var literalAmountAfterDecimalPoint = literalNumbers.convertNumber(splitedAmount.amountAfterDecimalPoint, { lang: language.name, useGrammticGenderException: language.lowValueCurrency.useGrammticGenderException });

            var primaryAmountWithCurrency = combineLiteralAmountWithCurrency(literalPrimaryAmount, language.currency);

            var amountAfterDecimalPointWithCurrency = combineLiteralAmountWithCurrency(literalAmountAfterDecimalPoint, language.lowValueCurrency);

            return getFullAmount(primaryAmountWithCurrency, amountAfterDecimalPointWithCurrency);

        }

        return {
            convertAmount: convertAmount
        };
    });