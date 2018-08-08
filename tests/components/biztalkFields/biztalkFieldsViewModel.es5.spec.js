define(['common/components/biztalkFields/biztalkFieldsViewModel'], function (biztalkFieldsViewModel) {

    describe('BiztalkFields', function () {

        it('to be defined', function () {
            expect(biztalkFieldsViewModel).toBeDefined();
        });
        it('to be modular', function () {
            expect(biztalkFieldsViewModel.getModel).toBeDefined();
        });
        describe('init values', function () {

            it('bTSFormID', function () {
                expect(biztalkFieldsViewModel.bTSFormID).toEqual('FormTemplate@test.gov.il');
            });
            it('bTSFormDesc', function () {
                expect(biztalkFieldsViewModel.bTSFormDesc).toEqual('טופס דוגמא');
            });
            it('bTSProcessID', function () {
                expect(biztalkFieldsViewModel.bTSProcessID()).toEqual('');
            });
        });
    });
});define('spec/biztalkFieldsViewModel.js', function () {});