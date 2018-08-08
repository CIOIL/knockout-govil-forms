define(['common/components/subTitle/subTitle',
    'common/utilities/resourceFetcher',
    'common/components/formInformation/formInformationViewModel'
], function (subTitle, resourceFetcher, formInformation) {

    describe('subTitle', function () {

        it('to be defined', function () {
            expect(subTitle).toBeDefined();
        });

        describe('properties', function () {

            it('shuold be definde', function () {
                expect(subTitle.formInformation).toBeDefined();
                expect(subTitle.labels).toBeDefined();
                expect(subTitle.setFormTitle).toBeDefined();
            });
        });

        describe('init ', function () {
            var referenceNum = '40000';
            var referenceNumSelector = '#ReferenceNumber';
            var titleSelector = '.title';

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/components/subTitle/templates';
                loadFixtures('subTitle.html');

                $(referenceNumSelector).text(referenceNum);

                ko.applyBindings(subTitle, $('.form-main-title')[0]);
            });

            afterEach(function () {
                ko.cleanNode($('.form-main-title')[0]);
            });

            it('referenceNumber', function () {
                expect($(referenceNumSelector).text()).toEqual(subTitle.formInformation.referenceNumber());
            });

            it('setFormTitle', function () {
                var settings = {
                    formNameResources: {
                        hebrew: { formName: 'כותרת טופס בעברית' },
                        english: { formName: 'English form details' }
                    }
                };

                subTitle.setFormTitle(settings);
                expect($(titleSelector).text()).toEqual(resourceFetcher.get(settings.formNameResources).formName);
                expect(subTitle.toggleLanguagesButton).toBeDefined();
            });

            it('should update availableLanguages in formInformation', function () {

                var formTitleSettings = {
                    avaliableLanguages: ['hebrew', 'english']
                };

                subTitle.setFormTitle(formTitleSettings);
                expect(formInformation.availableLanguages()).toEqual(['hebrew', 'english']);
            });

        });
    });
});