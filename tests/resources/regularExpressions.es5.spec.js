define(['common/resources/regularExpressions'], function (regularExpressions) {

    describe('regularExpressions', function () {

        it('all regexes defined', function () {
            expect(regularExpressions.hebrewName).toBeDefined();
            expect(regularExpressions.onlyFinalLetters).toBeDefined();
            expect(regularExpressions.apostropheAfterLetters).toBeDefined();
            expect(regularExpressions.finalLetters).toBeDefined();
            expect(regularExpressions.englishName).toBeDefined();
            expect(regularExpressions.apostrophe).toBeDefined();
            expect(regularExpressions.hebrew).toBeDefined();
            expect(regularExpressions.hebrewNumber).toBeDefined();
            expect(regularExpressions.hebrewExtended).toBeDefined();
            expect(regularExpressions.noHebrewLetters).toBeDefined();
            expect(regularExpressions.english).toBeDefined();
            expect(regularExpressions.englishNumber).toBeDefined();
            expect(regularExpressions.englishExtended).toBeDefined();
            expect(regularExpressions.englishHebrew).toBeDefined();
            expect(regularExpressions.street).toBeDefined();
            expect(regularExpressions.houseNumber).toBeDefined();
            expect(regularExpressions.startWithDigit).toBeDefined();
            expect(regularExpressions.abroadHomeNumber).toBeDefined();
            expect(regularExpressions.cp).toBeDefined();
            expect(regularExpressions.npo).toBeDefined();
            expect(regularExpressions.passport).toBeDefined();
            expect(regularExpressions.IPAddresses).toBeDefined();
            expect(regularExpressions.email).toBeDefined();
            expect(regularExpressions.url).toBeDefined();
            expect(regularExpressions.decimal).toBeDefined();
            expect(regularExpressions.onlyDecimal).toBeDefined();
            expect(regularExpressions.decimalWithParam).toBeDefined();
            expect(regularExpressions.date).toBeDefined();
            expect(regularExpressions.datePattern).toBeDefined();
            expect(regularExpressions.time).toBeDefined();
            expect(regularExpressions.integer).toBeDefined();
            expect(regularExpressions.signedNumber).toBeDefined();
            expect(regularExpressions.phoneOrMobile).toBeDefined();
            expect(regularExpressions.phoneNumber153).toBeDefined();
            expect(regularExpressions.internationalPhone).toBeDefined();
            expect(regularExpressions.mobile).toBeDefined();
            expect(regularExpressions.nonPrintableCharacters).toBeDefined();
            expect(regularExpressions.idNum).toBeDefined();
        });
    });
});
define('spec/exceptionsSpec.js', function () {});