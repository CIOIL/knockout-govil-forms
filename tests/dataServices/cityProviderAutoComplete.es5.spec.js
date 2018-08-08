define(['common/dataServices/cityProviderAutoComplete'], function (cityProviderAutoComplete) {
    describe('cityProviderAutoComplete', function () {
        it('cityList to be defined', function () {
            expect(cityProviderAutoComplete.cityList).toBeDefined();
        });
    });
});