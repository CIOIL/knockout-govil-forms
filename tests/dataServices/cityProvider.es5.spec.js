define(['common/dataServices/cityProvider'], function (cityProvider) {
    describe('cityProvider', function () {
        it('cityList to be defined', function () {
            expect(cityProvider.cityList).toBeDefined();
        });
        it('bindCityListSettings to be defined', function () {
            expect(cityProvider.bindCityListSettings).toBeDefined();
        });
        it('value to be true at begining', function () {
            expect(ko.unwrap(cityProvider.bindCityListSettings.value)).toBeTruthy();
        });
        it('value to be false atfer callback', function () {
            cityProvider.bindCityListSettings.callback();
            expect(ko.unwrap(cityProvider.bindCityListSettings.value)).toBeFalsy();
        });
    });
});