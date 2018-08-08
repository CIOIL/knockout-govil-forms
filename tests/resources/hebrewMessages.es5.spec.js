define(['common/resources/hebrewMessages'], function (hebrewMessages) {

    describe('contains ', function () {

        it('severity', function () {
            expect(hebrewMessages.severity).toBeDefined();
        });

        it('validates', function () {
            expect(hebrewMessages.validates).toBeDefined();
        });

        it('titles', function () {
            expect(hebrewMessages.titles).toBeDefined();
        });

        it('dTable', function () {
            expect(hebrewMessages.dTable).toBeDefined();
        });

        it('errors', function () {
            expect(hebrewMessages.errors).toBeDefined();
        });
    });
});