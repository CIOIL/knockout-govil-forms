var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/localization/literalNumbers'], function (literalNumbers) {
    /* eslint-disable no-magic-numbers */
    describe('literal numbers', function () {
        describe('english literal numbers', function () {

            it('defined', function () {
                expect(typeof literalNumbers === 'undefined' ? 'undefined' : _typeof(literalNumbers)).toEqual('object');
                expect(_typeof(literalNumbers.convertNumber)).toEqual('function');
            });

            it('doesn\'t blow up weirdly with invalid input', function () {
                expect(literalNumbers.convertNumber('asdfasdfasdf', { lang: 'en' })).toEqual('');
                expect(literalNumbers.convertNumber('0.as', { lang: 'en' })).toEqual('');
                expect(literalNumbers.convertNumber('0.123', { lang: 'en' })).toEqual('zero');
                expect(literalNumbers.convertNumber('0.8', { lang: 'en' })).toEqual('one');
                expect(literalNumbers.convertNumber('2.8', { lang: 'en' })).toEqual('three');
                expect(literalNumbers.convertNumber('asdf.8', { lang: 'en' })).toEqual('');
                expect(literalNumbers.convertNumber('120391938123..', { lang: 'en' })).toEqual('');
                expect(literalNumbers.convertNumber('1000000000.123', { lang: 'en' })).toEqual('one billion');
                expect(literalNumbers.convertNumber('1/3', { lang: 'en' })).toEqual('');
                expect(literalNumbers.convertNumber(1 / 3, { lang: 'en' })).toEqual('zero');
                expect(literalNumbers.convertNumber('1/2', { lang: 'en' })).toEqual('');
                expect(literalNumbers.convertNumber('1.123/2', { lang: 'en' })).toEqual('');
            });

            it('correctly converts numbers < 10', function () {
                expect(literalNumbers.convertNumber(1000000000, { lang: 'en' })).toEqual('one billion');
                expect(literalNumbers.convertNumber(3, { lang: 'en' })).toEqual('three');
                expect(literalNumbers.convertNumber(8, { lang: 'en' })).toEqual('eight');
            });

            it('correctly converts numbers < 20', function () {
                expect(literalNumbers.convertNumber(13, { lang: 'en' })).toEqual('thirteen');
                expect(literalNumbers.convertNumber(19, { lang: 'en' })).toEqual('nineteen');
            });

            it('correctly converts numbers < 100', function () {
                expect(literalNumbers.convertNumber(20, { lang: 'en' })).toEqual('twenty');
                expect(literalNumbers.convertNumber(25, { lang: 'en' })).toEqual('twenty-five');
                expect(literalNumbers.convertNumber(88, { lang: 'en' })).toEqual('eighty-eight');
                expect(literalNumbers.convertNumber(73, { lang: 'en' })).toEqual('seventy-three');
            });

            it('correctly converts numbers < 1000', function () {
                expect(literalNumbers.convertNumber(200, { lang: 'en' })).toEqual('two hundred');
                expect(literalNumbers.convertNumber(242, { lang: 'en' })).toEqual('two hundred and forty-two');
                expect(literalNumbers.convertNumber(1234, { lang: 'en' })).toEqual('one thousand two hundred and thirty-four');
                expect(literalNumbers.convertNumber(4323, { lang: 'en' })).toEqual('four thousand three hundred and twenty-three');
            });

            it('correctly converts numbers > 1000', function () {
                expect(literalNumbers.convertNumber(4323000, { lang: 'en' })).toEqual('four million three hundred twenty-three thousand');
                expect(literalNumbers.convertNumber(4323055, { lang: 'en' })).toEqual('four million three hundred twenty-three thousand and fifty-five');
                expect(literalNumbers.convertNumber(1570025, { lang: 'en' })).toEqual('one million five hundred seventy thousand and twenty-five');
            });

            it('correctly converts numbers > 1 000 000 000', function () {
                expect(literalNumbers.convertNumber(1000000000, { lang: 'en' })).toEqual('one billion');
                expect(literalNumbers.convertNumber(2580000000, { lang: 'en' })).toEqual('two billion five hundred eighty million');
                expect(literalNumbers.convertNumber(1000000000000, { lang: 'en' })).toEqual('one trillion');
                expect(literalNumbers.convertNumber(3627000000000, { lang: 'en' })).toEqual('three trillion six hundred twenty-seven billion');
            });
        });

        describe('hebrew literal numbers', function () {

            it('defined', function () {
                expect(typeof literalNumbers === 'undefined' ? 'undefined' : _typeof(literalNumbers)).toEqual('object');
                expect(_typeof(literalNumbers.convertNumber)).toEqual('function');
            });

            it('doesn\'t blow up weirdly with invalid input', function () {
                expect(literalNumbers.convertNumber('asdfasdfasdf')).toEqual('');
                expect(literalNumbers.convertNumber('0.as')).toEqual('');
                expect(literalNumbers.convertNumber('0.123')).toEqual('אפס');
                expect(literalNumbers.convertNumber('0.8')).toEqual('אחד');
                expect(literalNumbers.convertNumber('2.8')).toEqual('שלושה');
                expect(literalNumbers.convertNumber('asdf.8')).toEqual('');
                expect(literalNumbers.convertNumber('120391938123..')).toEqual('');
                expect(literalNumbers.convertNumber('1000000000.123')).toEqual('מיליארד');
                expect(literalNumbers.convertNumber('1/3')).toEqual('');
                expect(literalNumbers.convertNumber(1 / 3)).toEqual('אפס');
                expect(literalNumbers.convertNumber('1/2')).toEqual('');
                expect(literalNumbers.convertNumber('1.123/2')).toEqual('');
            });

            it('correctly converts numbers < 10', function () {
                expect(literalNumbers.convertNumber(3)).toEqual('שלושה');
                expect(literalNumbers.convertNumber(8)).toEqual('שמונה');
            });

            it('correctly converts numbers < 20', function () {
                expect(literalNumbers.convertNumber(13)).toEqual('שלושה עשר');
                expect(literalNumbers.convertNumber(19)).toEqual('תשעה עשר');
            });

            it('correctly converts numbers < 100', function () {
                expect(literalNumbers.convertNumber(20)).toEqual('עשרים');
                expect(literalNumbers.convertNumber(25)).toEqual('עשרים וחמישה');
                expect(literalNumbers.convertNumber(88)).toEqual('שמונים ושמונה');
                expect(literalNumbers.convertNumber(73)).toEqual('שבעים ושלושה');
            });

            it('correctly converts numbers < 100 with grammatic gender exception', function () {
                expect(literalNumbers.convertNumber(10, { useGrammticGenderException: true })).toEqual('עשר');
                expect(literalNumbers.convertNumber(25, { useGrammticGenderException: true })).toEqual('עשרים וחמש');
                expect(literalNumbers.convertNumber(3, { useGrammticGenderException: true })).toEqual('שלש');
                expect(literalNumbers.convertNumber(16, { useGrammticGenderException: true })).toEqual('שש עשרה');
            });

            it('correctly converts numbers < 1000', function () {
                expect(literalNumbers.convertNumber(200)).toEqual('מאתיים');
                expect(literalNumbers.convertNumber(242)).toEqual('מאתיים וארבעים ושניים');
                expect(literalNumbers.convertNumber(1234)).toEqual('אלף מאתיים ושלושים וארבעה');
                expect(literalNumbers.convertNumber(4323)).toEqual('ארבעת אלפים שלש מאות ועשרים ושלושה');
            });

            it('correctly converts numbers > 1000', function () {
                expect(literalNumbers.convertNumber(103000)).toEqual('מאה ושלושה אלף');

                expect(literalNumbers.convertNumber(4323000)).toEqual('ארבעה מיליון שלש מאות ועשרים ושלושה אלף');
                expect(literalNumbers.convertNumber(2323055)).toEqual('שני מיליון שלש מאות ועשרים ושלושה אלף וחמישים וחמישה');
                expect(literalNumbers.convertNumber(1570025)).toEqual('מיליון חמש מאות ושבעים אלף ועשרים וחמישה');
            });

            it('correctly converts numbers > 1 000 000 ', function () {
                expect(literalNumbers.convertNumber(1000000000)).toEqual('מיליארד');
                expect(literalNumbers.convertNumber(2580000000)).toEqual('שני מיליארד חמש מאות ושמונים מיליון');
                expect(literalNumbers.convertNumber(1000000000000)).toEqual('טריליון');
                expect(literalNumbers.convertNumber(3627000000000)).toEqual('שלושה טריליון שש מאות ועשרים ושבעה מיליארד');
            });
        });
    });
    /* eslint-enable no-magic-numbers */
});
define('spec/literalNumbers.js', function () {});