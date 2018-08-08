define(['common/components/toggleLanguagesButton/toggleLanguagesButton', 'common/infrastructureFacade/tfsMethods', 'common/viewModels/languageViewModel'], function (ToggleLanguagesButton, tfsMethods, languageViewModel) {

    describe('toggleLanguagesButton', function () {

        it('to be defined', function () {
            expect(ToggleLanguagesButton).toBeDefined();
        });

        describe('createButton ', function () {

            var toggleLanguagesButton;

            beforeEach(function () {
                toggleLanguagesButton = ToggleLanguagesButton.createButton(['hebrew']);
            });

            describe('properties', function () {

                it('shuold be definde', function () {
                    expect(toggleLanguagesButton.availableLanguagesList).toBeDefined();
                    expect(toggleLanguagesButton.toggleLanguage).toBeDefined();
                    expect(toggleLanguagesButton.toggleLanguageDiv).toBeDefined();
                });
            });

            describe('"toggleLanguageDiv" function', function () {
                it('tfsMethods.toggleLanguageDiv should be called', function () {
                    spyOn(tfsMethods, 'toggleLanguageDiv');

                    toggleLanguagesButton.toggleLanguageDiv();
                    expect(tfsMethods.toggleLanguageDiv).toHaveBeenCalled();
                });
            });

            describe('"toggleLanguage" function', function () {
                it('languageViewModel.language should be called', function () {
                    spyOn(languageViewModel, 'language');
                    spyOn(tfsMethods, 'toggleLanguageDiv');

                    toggleLanguagesButton.toggleLanguage('english');
                    expect(languageViewModel.language).toHaveBeenCalled();
                });
            });

            describe('isMultiLanguages', function () {

                it('settings contains 1 language should return false', function () {
                    expect(toggleLanguagesButton.isMultiLanguages()).toBeFalsy();
                });

                it('settings contains 2 language should return true', function () {
                    toggleLanguagesButton = ToggleLanguagesButton.createButton(['hebrew', 'english']);
                    expect(toggleLanguagesButton.isMultiLanguages()).toBeTruthy();
                });
            });
        });
    });
});