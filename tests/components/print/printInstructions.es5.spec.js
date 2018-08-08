define(['common/components/print/printInstructions', 'common/infrastructureFacade/tfsMethods', 'common/viewModels/languageViewModel'], function (printInstructions, infsMethods, languageViewModel) {

    describe('printInstructions', function () {

        var fakeAgatAccess = function fakeAgatAccess(language) {
            return language;
        };

        beforeEach(function () {
            spyOn(infsMethods, 'setFormLanguage').and.callFake(fakeAgatAccess);
        });

        it('to be defined', function () {
            expect(printInstructions).toBeDefined();
        });

        describe('isEnglishInstructions', function () {
            it('shuold return true when languageViewModel.language is english', function () {
                languageViewModel.language('english');
                expect(printInstructions.isEnglishInstructions).toBeTruthy();
            });

            it('shuold return true when default is english', function () {
                languageViewModel.language('spanish');
                expect(printInstructions.isEnglishInstructions).toBeTruthy();
            });
        });

        describe('isHebrewInstructions', function () {
            it('shuold return true when languageViewModel.language is hebrew', function () {
                languageViewModel.language('hebrew');
                expect(printInstructions.isHebrewInstructions).toBeTruthy();
            });

            it('shuold return true when default is hebrew', function () {
                languageViewModel.language('arabic');
                expect(printInstructions.isHebrewInstructions).toBeTruthy();
            });
        });
    });
});