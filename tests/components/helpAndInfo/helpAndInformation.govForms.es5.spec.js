define(['common/components/helpAndInfo/helpAndInformation'], function (helpAndInformation) {
    var helpAndInfo;
    beforeEach(function () {
        ko.components.unregister('instructions');
    });
    describe('helpAndInformation', function () {
        describe('validate params', function () {
            it('init helpAndInformation without params wont fail', function () {
                expect(function () {
                    helpAndInformation.initHelpAndInformationMenue({});
                }).not.toThrow();
            });
            it('init helpAndInformation with correct params', function () {
                helpAndInfo = helpAndInformation.initHelpAndInformationMenue({ officeInformation: { name: 'a' }, additionalInformation: { name: 'a' }, instructions: { name: 'a' } });
                expect(helpAndInfo.officeInformation).toEqual({ name: 'a' });
                expect(helpAndInfo.instructions).toEqual({ name: 'a' });
                expect(helpAndInfo.additionalInformation).toEqual({ name: 'a' });
            });
            it('init helpAndInformation with empty officeInformation object fail', function () {
                expect(function () {
                    helpAndInformation.initHelpAndInformationMenue({ officeInformation: {} });
                }).toThrow();
            });
            it('init helpAndInformation with empty additionalInformation object fail', function () {
                expect(function () {
                    helpAndInformation.initHelpAndInformationMenue({ additionalInformation: {} });
                }).toThrow();
            });
            it('init helpAndInformation with empty instructions object fail', function () {
                expect(function () {
                    helpAndInformation.initHelpAndInformationMenue({ instructions: {} });
                }).toThrow();
            });
        });

        it('use default instructions if not pass', function () {
            helpAndInfo = helpAndInformation.initHelpAndInformationMenue({});
            expect(helpAndInfo.instructions).toEqual({ name: 'instructions' });
        });

        it('toogle helpAndInfo menue', function () {
            helpAndInfo = helpAndInformation.initHelpAndInformationMenue({});
            expect(helpAndInfo.isInformationMenueOpen()).toEqual(false);
            helpAndInfo.toggleInformationMenue(true);
            expect(helpAndInfo.isInformationMenueOpen()).toEqual(true);
        });
    });
});