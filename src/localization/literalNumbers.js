/**
* @description collection of methods for adapting information to different languages and regional differences.
* @module literalNumbers
*/
define(['common/utilities/reflection', 'common/localization/literalNumbers.en', 'common/localization/literalNumbers.he'],
    function (reflection, en, he) {
        /* eslint-disable no-magic-numbers */

        var i18n = {
            en: en,
            he: he
        };

        //Only short scale is supported. For more details about short vs long scales
        // See https://en.wikipedia.org/wiki/Long_and_short_scales 
        var scale = [100];
        for (var i = 1; i <= 6; i++) {
            scale.push(Math.pow(10, i * 3));
        }

        var defaults = {
            noAnd: false,
            lang: 'he'
        };

        /**
         * Converts numbers to their literal form. supports english and hebrew   
         * @method convertNumber    
         * @param {Number} number The number to convert
         * @param {Object} [options] An object representation of the options
         * options.lang - the language to wich the number should be translated.
         * possible values: 'he' - Hebrew (default) 
         *                  'en' - English
         * @returns {String} the number in words (its literal representation)
         * @example Example usage. 
         * literalNumbers.convertNumber(4323); //  'ארבעת אלפים שלש מאות ועשרים ושלושה' 
         * literalNumbers.convertNumber(4323,{lang:'en'}); //   'four thousand three hundred and twenty-three'
         */
         
        function convertNumber(number, options) {          
            function getLanguageDefinitions(options) {
                var languageType = options.lang || '';
                return i18n[languageType] ? i18n[languageType] : i18n[defaults.lang];
            }

            options = options || {};
            options = reflection.extendSettingsWithDefaults(options, defaults);

            var language = getLanguageDefinitions(options);

            var baseCardinals = language.base;

            function convert(currentNumber, options) {

                function handleSmallerThan100(currentNumber, unit, baseCardinals) {
                    var dec = Math.floor(currentNumber / 10) * 10;
                    unit = currentNumber - dec;                 
                    if (unit) {
                        return baseCardinals[dec] + language.baseSeparator + convert(unit, options);
                    }
                    return baseCardinals[dec];
                }

                function tryGetBaseCardinal(number) {
                    if (options.useGrammticGenderException && language.grammticGenderExceptions && language.grammticGenderExceptions[number]) {
                        return language.grammticGenderExceptions[number];
                    }

                    if (language.unitExceptions[number]) {
                        return language.unitExceptions[number];
                    }

                    if (baseCardinals[number]) {
                        return baseCardinals[number];
                    }                    

                    return undefined;
                }

                currentNumber = Math.round(Number(currentNumber));
                var unit;

                var baseCardinal = tryGetBaseCardinal(currentNumber);

                if (baseCardinal) {
                    return baseCardinal;
                }
                
                if (currentNumber < 100) {
                    return handleSmallerThan100(currentNumber, unit, baseCardinals);
                }

                var result = [];

                function handleGreaterThan1000() {

                    function handleLeastSignificantNumbers(leastSignificantNumbers) {

                        if (leastSignificantNumbers) {
                            if (options.noAnd && !(language.andException && language.andException[10])
                              ) {
                                result.push(convert(leastSignificantNumbers, options));
                            } else {
                                result.push(language.unitSeparator + convert(leastSignificantNumbers, options));
                            }
                            //continue without the lease significant numbers
                            currentNumber -= leastSignificantNumbers;
                        }
                    }

                    function shouldUseUnitBase(unit, number) {
                        return number && ((unit.useBaseInstead && !unit.useBaseException.indexOf(number) > -1) ||
                                          (unit.useBaseUnits && unit.useBaseUnits.indexOf(number) > -1));
                    }

                    function calculateReminder(scaleIndex) {
                        var reminder = Math.floor(currentNumber / scale[scaleIndex]);
                        if (scaleIndex === 0) {
                            return reminder % 10;
                        } else {
                            return reminder % 1000;
                        }
                    }

                    function getUnitName(unit, reminder) {
                        if (typeof unit === 'string') {
                            return unit;
                        }
                        else {
                            return reminder > 1 && unit.plural && (!unit.avoidInNumberPlural) ? unit.plural : unit.singular;
                        }
                    }

                    function convertUnit(unit, unitNumber, currentScale) {                       

                        function getUnitLiteralNumber() {
                            var exception = language.unitExceptions[unitNumber];
                            return exception || convert(unitNumber, reflection.extendSettingsWithDefaults({
                                // Languages with and exceptions need to set `noAnd` to false
                                noAnd: !language.withAnd 
                            }, options));
                        }

                        function convertByUnitName(unit, unitNumber, result) {

                            var unitName = getUnitName(unit, unitNumber);

                            if (unit.avoidPrefixException && unit.avoidPrefixException.indexOf(unitNumber) > -1) {
                                result.push(unitName);
                            }
                            else if (unit.replacePrefixException && unit.replacePrefixException.hasOwnProperty(unitNumber)) {
                                result.push(unit.replacePrefixException[unitNumber] + ' ' + unitName);
                            }
                            else {                               
                                var unitLiteralNumber = getUnitLiteralNumber(unitNumber);
                                result.push(unitLiteralNumber + ' ' + unitName);
                            }
                        }

                        if (!unitNumber) {
                            return;
                        }

                        if (shouldUseUnitBase(unit, unitNumber)) {
                            result.push(baseCardinals[unitNumber * currentScale]);
                        }
                        else {
                            convertByUnitName(unit, unitNumber, result);
                        }
                    }

                    var leastSignificantNumbers = currentNumber % 100;

                    handleLeastSignificantNumbers(leastSignificantNumbers);

                    for (var i = 0, len = language.units.length; i < len; i++) {
                        var reminder = calculateReminder(i);
                        convertUnit(language.units[i], reminder, scale[i]);
                    }
                }

                handleGreaterThan1000();

                return result.reverse().join(' ');
            }
            // start the recursive conversion
            return convert(number, options);
        }
        /* eslint-enable no-magic-numbers */
        return {
            convertNumber: convertNumber,
            defaults: defaults
        };
    });