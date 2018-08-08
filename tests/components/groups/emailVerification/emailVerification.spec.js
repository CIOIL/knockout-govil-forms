define(['common/components/groups/FormComponent',
    'common/components/groups/emailVerification/emailVerification',
    'common/components/groups/emailVerification/resources',
    'common/utilities/stringExtension',
    'common/utilities/resourceFetcher',
    'common/infrastructureFacade/tfsMethods'],

function (FormComponent, EmailVerification, resources, stringExtension, resourceFetcher, tfsMethods) {//eslint-disable-line max-params

    describe('EmailVerification', function () {
        var emailVerification;
        var settings;
        var getRule = function (rules, ruleName) {
            return ko.utils.arrayFilter(rules, function (item) {
                return item.ruleName === ruleName || item.rule === ruleName;
            });
        };

        it('should be defined', function () {
            expect(EmailVerification).toBeDefined();
        });

        describe('create an instance', function () {

            it('component inheritance from FormComponent should be defined', function () {
                emailVerification = new EmailVerification({});

                expect(emailVerification instanceof EmailVerification).toBeTruthy();
                expect(emailVerification instanceof FormComponent).toBeTruthy();
            });

            it('check model defined and rules exist', function () {
                emailVerification = new EmailVerification({});

                expect(emailVerification.email).toBeDefined();
                expect(emailVerification.reEmail).toBeDefined();
                expect(emailVerification.email.rules).toBeDefined();
                expect(emailVerification.reEmail.defaultValue).toBeDefined();
                expect(getRule(emailVerification.email.rules(), 'email')).not.toBeNull();
                expect(getRule(emailVerification.reEmail.rules(), 'equal')).not.toBeNull();
            });
           
        });

        describe('paste event', function () {
            var reEmail;
            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = '/base/Tests/components/groups/emailVerification/templates';
                loadFixtures('emailVerification.html');

                settings = {
                    reEmail: {
                        extenders: { required: false },
                        defaultValue: 'qa@cio.gov.il'
                    }
                };
                emailVerification = new EmailVerification(settings);
                ko.applyBindings(emailVerification, $('#EmailContainer')[0]);
                reEmail = $('#ReEmail');
                spyOn(tfsMethods.dialog, 'alert');
            });

            afterEach(function () {
                ko.cleanNode(document.getElementById('jasmine-fixtures'));
            });


            it('should paste nothing and default value should remain', function () {
                reEmail.trigger('paste');
                expect(emailVerification.reEmail()).toEqual('qa@cio.gov.il');
            });

            it('should paste nothing and remain empty when there is no default value', function () {
                emailVerification = new EmailVerification({});
                reEmail.trigger('paste');
                expect(emailVerification.reEmail()).toEqual('');
            });

            it('call dialog alert', function () {
                reEmail.trigger('paste');
                expect(tfsMethods.dialog.alert).toHaveBeenCalled();
            });

            it('show error message', function () {
                reEmail.trigger('paste');
                var message = stringExtension.format(resourceFetcher.get(resources.errorMessages).manualTyping, emailVerification.labels().reEmail);
                expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(message);
            });
        });

        describe('check equality', function () {

            it('reEmail should be invalid when not eqaul to email', function () {
                emailVerification = new EmailVerification({});
                emailVerification.email('qa@gov.il');
                emailVerification.reEmail('qa1@gov.il');                
                expect(emailVerification.reEmail.isValid()).toBeFalsy();
            });

            it('reEmail should be valid when eqaul to email', function () {
                emailVerification = new EmailVerification({});
                emailVerification.email('qa@gov.il');
                emailVerification.reEmail('qa@gov.il');
                expect(emailVerification.reEmail.isValid()).toBeTruthy();
            });

            it('reEmail should be valid when eqaul to email - not same case', function () {
                emailVerification = new EmailVerification({});
                emailVerification.email('qa@gov.il');
                emailVerification.reEmail('QA@gov.il');
                expect(emailVerification.reEmail.isValid()).toBeTruthy();
            });
        });
    });

});