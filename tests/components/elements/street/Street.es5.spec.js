define(['common/components/elements/FormElement', 'common/components/elements/street/Street'], function (FormElement, Street) {
    //eslint-disable-line max-params

    describe('Street', function () {

        it('should be defined', function () {
            expect(Street).toBeDefined();
        });

        describe('new Street', function () {
            var cityCode = ko.observable('');
            var testStreet = new Street({ filter: cityCode });
            it('verify proper inheritence', function () {
                expect(testStreet instanceof Street).toBeTruthy();
                expect(testStreet instanceof FormElement).toBeTruthy();
            });
            it('filter should be defined', function () {
                expect(testStreet.bindStreetListSettings.settings.filter).toBeDefined();
            });
            it('filter property should return -1 when filter in the settings is empty', function () {
                cityCode('30');
                expect(testStreet.bindStreetListSettings.settings.filter()).toBe('30');
                cityCode(undefined);
                expect(testStreet.bindStreetListSettings.settings.filter()).toBe('-1');
            });
        });
    });
});