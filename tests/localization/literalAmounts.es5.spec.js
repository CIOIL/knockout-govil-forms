var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/localization/literalAmounts'], function (literalAmounts) {
    /* eslint-disable no-magic-numbers */
    describe('literal numbers', function () {
        describe('english literal numbers', function () {

            it('defined', function () {
                expect(typeof literalAmounts === 'undefined' ? 'undefined' : _typeof(literalAmounts)).toEqual('object');
                expect(_typeof(literalAmounts.convertAmount)).toEqual('function');
            });

            it('doesn\'t blow up weirdly with invalid input', function () {
                expect(literalAmounts.convertAmount('asdfasdfasdf', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('0.as', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('asdf.8', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('120391938123..', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('1/3', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('1/2', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('1.123/2', { lang: 'en' })).toEqual('');
            });

            it('correctly converts < 1', function () {
                expect(literalAmounts.convertAmount(0.12, { lang: 'en' })).toEqual('twelve cents');
                expect(literalAmounts.convertAmount(0.123, { lang: 'en' })).toEqual('twelve cents');
            });

            it('correctly converts 1', function () {
                expect(literalAmounts.convertAmount(1, { lang: 'en' })).toEqual('one dollar');
            });

            it('correctly converts 1 with decimal point', function () {
                expect(literalAmounts.convertAmount(1.03, { lang: 'en' })).toEqual('one dollar and three cents');
            });

            it('correctly converts 1 after the decimal point', function () {
                expect(literalAmounts.convertAmount(25.01, { lang: 'en' })).toEqual('twenty-five dollars and one cent');
            });

            it('correctly converts numbers < 10', function () {
                expect(literalAmounts.convertAmount(3.19, { lang: 'en' })).toEqual('three dollars and nineteen cents');
                expect(literalAmounts.convertAmount(8, { lang: 'en' })).toEqual('eight dollars');
            });

            it('correctly converts decimal numbers < 20', function () {
                expect(literalAmounts.convertAmount(3.19, { lang: 'en' })).toEqual('three dollars and nineteen cents');
            });

            it('correctly converts decimal numbers < 10', function () {
                expect(literalAmounts.convertAmount(3.9, { lang: 'en' })).toEqual('three dollars and ninety cents');
            });

            it('correctly converts decimal numbers < 100', function () {
                expect(literalAmounts.convertAmount(25.88, { lang: 'en' })).toEqual('twenty-five dollars and eighty-eight cents');
            });

            it('correctly converts numbers < 20', function () {
                expect(literalAmounts.convertAmount(13, { lang: 'en' })).toEqual('thirteen dollars');
                expect(literalAmounts.convertAmount(19, { lang: 'en' })).toEqual('nineteen dollars');
            });

            it('correctly converts numbers < 100', function () {
                expect(literalAmounts.convertAmount(20, { lang: 'en' })).toEqual('twenty dollars');
                expect(literalAmounts.convertAmount(25, { lang: 'en' })).toEqual('twenty-five dollars');
                expect(literalAmounts.convertAmount(88, { lang: 'en' })).toEqual('eighty-eight dollars');
                expect(literalAmounts.convertAmount(73, { lang: 'en' })).toEqual('seventy-three dollars');
            });

            it('correctly converts strings < 100', function () {
                expect(literalAmounts.convertAmount('20', { lang: 'en' })).toEqual('twenty dollars');
                expect(literalAmounts.convertAmount('0.123', { lang: 'en' })).toEqual('twelve cents');
            });

            it('correctly converts numbers < 1000', function () {
                expect(literalAmounts.convertAmount(200, { lang: 'en' })).toEqual('two hundred dollars');
                expect(literalAmounts.convertAmount(242, { lang: 'en' })).toEqual('two hundred and forty-two dollars');
                expect(literalAmounts.convertAmount(1234, { lang: 'en' })).toEqual('one thousand two hundred and thirty-four dollars');
                expect(literalAmounts.convertAmount(4323, { lang: 'en' })).toEqual('four thousand three hundred and twenty-three dollars');
            });

            it('correctly converts numbers > 1000', function () {
                expect(literalAmounts.convertAmount(1000000000, { lang: 'en' })).toEqual('one billion dollars');

                expect(literalAmounts.convertAmount(4323000, { lang: 'en' })).toEqual('four million three hundred twenty-three thousand dollars');
                expect(literalAmounts.convertAmount(4323055, { lang: 'en' })).toEqual('four million three hundred twenty-three thousand and fifty-five dollars');
                expect(literalAmounts.convertAmount(1570025, { lang: 'en' })).toEqual('one million five hundred seventy thousand and twenty-five dollars');
            });

            it('correctly converts numbers > 1 000 000 000', function () {
                expect(literalAmounts.convertAmount(1000000000, { lang: 'en' })).toEqual('one billion dollars');
                expect(literalAmounts.convertAmount(2580000000, { lang: 'en' })).toEqual('two billion five hundred eighty million dollars');
                expect(literalAmounts.convertAmount(1000000000000, { lang: 'en' })).toEqual('one trillion dollars');
                expect(literalAmounts.convertAmount(3627000000000, { lang: 'en' })).toEqual('three trillion six hundred twenty-seven billion dollars');
            });
        });

        describe('hebrew literal numbers', function () {

            it('defined', function () {
                expect(typeof literalAmounts === 'undefined' ? 'undefined' : _typeof(literalAmounts)).toEqual('object');
                expect(_typeof(literalAmounts.convertAmount)).toEqual('function');
            });

            it('doesn\'t blow up weirdly with invalid input', function () {
                expect(literalAmounts.convertAmount('asdfasdfasdf', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('0.as', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('asdf.8', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('120391938123..', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('1/3', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('1/2', { lang: 'en' })).toEqual('');
                expect(literalAmounts.convertAmount('1.123/2', { lang: 'en' })).toEqual('');
            });

            it('correctly converts < 1', function () {
                expect(literalAmounts.convertAmount(0.12)).toEqual('שתים עשרה אגורות');
            });

            it('correctly converts 1', function () {
                expect(literalAmounts.convertAmount(1)).toEqual('שקל אחד');
            });

            it('correctly converts 1 with decimal point', function () {
                expect(literalAmounts.convertAmount(1.12)).toEqual('שקל אחד ושתים עשרה אגורות');
            });

            it('correctly converts 1 after the decimal point', function () {
                expect(literalAmounts.convertAmount(25.01)).toEqual('עשרים וחמישה שקלים ואגורה אחת');
            });

            it('correctly converts 0 after the decimal point', function () {
                expect(literalAmounts.convertAmount(25.00)).toEqual('עשרים וחמישה שקלים');
            });

            it('correctly converts 2', function () {
                expect(literalAmounts.convertAmount(2)).toEqual('שני שקלים');
            });

            it('correctly converts 2 with decimal point', function () {
                expect(literalAmounts.convertAmount(2.23)).toEqual('שני שקלים ועשרים ושלש אגורות');
            });

            it('correctly converts numbers < 10', function () {
                expect(literalAmounts.convertAmount(3)).toEqual('שלושה שקלים');
                expect(literalAmounts.convertAmount(8)).toEqual('שמונה שקלים');
            });

            it('correctly converts decimal numbers < 10', function () {
                expect(literalAmounts.convertAmount(3.19)).toEqual('שלושה שקלים ותשע עשרה אגורות');
                expect(literalAmounts.convertAmount(8.13)).toEqual('שמונה שקלים ושלש עשרה אגורות');
            });

            it('correctly converts numbers < 20', function () {
                expect(literalAmounts.convertAmount(13)).toEqual('שלושה עשר שקלים');
                expect(literalAmounts.convertAmount(19)).toEqual('תשעה עשר שקלים');
            });

            it('correctly converts numbers < 100', function () {
                expect(literalAmounts.convertAmount(20)).toEqual('עשרים שקלים');
                expect(literalAmounts.convertAmount(88)).toEqual('שמונים ושמונה שקלים');
            });

            it('correctly converts numbers < 1000', function () {
                expect(literalAmounts.convertAmount(200)).toEqual('מאתיים שקלים');
                expect(literalAmounts.convertAmount(242)).toEqual('מאתיים וארבעים ושניים שקלים');
                expect(literalAmounts.convertAmount(1234)).toEqual('אלף מאתיים ושלושים וארבעה שקלים');
                expect(literalAmounts.convertAmount(4323)).toEqual('ארבעת אלפים שלש מאות ועשרים ושלושה שקלים');
            });

            it('correctly converts numbers > 1000', function () {
                expect(literalAmounts.convertAmount(103000)).toEqual('מאה ושלושה אלף שקלים');

                expect(literalAmounts.convertAmount(4323000)).toEqual('ארבעה מיליון שלש מאות ועשרים ושלושה אלף שקלים');
                expect(literalAmounts.convertAmount(2323055)).toEqual('שני מיליון שלש מאות ועשרים ושלושה אלף וחמישים וחמישה שקלים');
                expect(literalAmounts.convertAmount(1570025)).toEqual('מיליון חמש מאות ושבעים אלף ועשרים וחמישה שקלים');
            });

            it('correctly converts numbers > 1 000 000 ', function () {
                expect(literalAmounts.convertAmount(1000000000)).toEqual('מיליארד שקלים');
                expect(literalAmounts.convertAmount(2580000000)).toEqual('שני מיליארד חמש מאות ושמונים מיליון שקלים');
                expect(literalAmounts.convertAmount(1000000000000)).toEqual('טריליון שקלים');
                expect(literalAmounts.convertAmount(3627000000000)).toEqual('שלושה טריליון שש מאות ועשרים ושבעה מיליארד שקלים');
            });
        });

        describe('use the default language when the requested language is not supported', function () {

            it('correctly converts < 1', function () {
                expect(literalAmounts.convertAmount(0.12, { lang: 'xx' })).toEqual('שתים עשרה אגורות');
            });

            it('correctly converts 1', function () {
                expect(literalAmounts.convertAmount(1, { lang: 'xx' })).toEqual('שקל אחד');
            });

            it('correctly converts 1 with decimal point', function () {
                expect(literalAmounts.convertAmount(1.12, { lang: 'xx' })).toEqual('שקל אחד ושתים עשרה אגורות');
            });

            it('correctly converts 1 after the decimal point', function () {
                expect(literalAmounts.convertAmount(25.01, { lang: 'xx' })).toEqual('עשרים וחמישה שקלים ואגורה אחת');
            });
        });
    });
    /* eslint-enable no-magic-numbers */
});
define('spec/literalAmounts.js', function () {});