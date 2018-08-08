define(['common/viewModels/languageViewModel',
    'common/infrastructureFacade/tfsMethods',
    'common/resources/texts/basicValidation',
    'common/ko/validate/koValidationMethods',
    'common/ko/globals/multiLanguageObservable'],

    function (languageViewModel, tfsMethods, basicValidationTexts) {

        describe('validate', function () {
            describe('ko validation methods', function () {
                var testObs;
                beforeEach(function () {
                    //koValidation.init();
                    testObs = ko.observable();
                    spyOn(tfsMethods, 'setFormLanguage');
                });

                it('not in use rules to be deleted', function () {
                    expect(ko.validation.rules['phoneUS']).toBeUndefined();
                });

                it('messages to be replaced without param', function () {
                    testObs.extend({ required: true });
                    languageViewModel.language('hebrew');
                    expect(testObs.error()).toEqual(basicValidationTexts['hebrew'].required);
                    testObs('ss');
                    expect(testObs.error()).toBeNull();
                });

                it('messages to be replaced with param', function () {
                    testObs.extend({ maxLength: 4 });
                    testObs('abcde');
                    languageViewModel.language('hebrew');
                    expect(testObs.error()).toEqual('עליך להזין עד 4 תווים');
                    testObs('abc');
                    expect(testObs.error()).toBeNull();
                    testObs.extend({ min: 0 });
                    testObs(-4); //eslint-disable-line  no-magic-numbers
                    languageViewModel.language('hebrew');
                    expect(testObs.error()).toEqual('עליך להזין מספר הגדול או שווה ל 0');

                });

                it('shouldClearOnFailure flag added on rules', function () {
                    expect(ko.validation.rules['number'].shouldClearOnFailure).toBeDefined();
                    expect(ko.validation.rules['maxLength'].shouldClearOnFailure).toBeFalsy();
                    expect(ko.validation.rules['minLength'].shouldClearOnFailure).toBeFalsy();
                });

                it('ruleName property added', function () {
                    testObs.extend({
                        pattern: {
                            params: '[a-z]',
                            ruleName: 'letters'
                        }
                    });
                    expect(testObs.rules()[0].ruleName).toEqual('letters');
                });


            });

        });
    });

