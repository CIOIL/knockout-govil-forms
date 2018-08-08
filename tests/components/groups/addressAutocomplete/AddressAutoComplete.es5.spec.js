define(['common/components/groups/FormComponent', 'common/components/groups/addressAutoComplete/AddressAutoComplete'], function (FormComponent, Address) {
    //eslint-disable-line max-params

    describe('AddressAutocomplete', function () {

        var testAddress;

        it('should be defined', function () {
            expect(Address).toBeDefined();
        });

        it('defaultSettings should be declared on class', function () {
            expect(Address.defaultSettings).toBeDefined();
        });

        describe('new AddressAutocomplete', function () {

            it('verify proper inheritence', function () {
                testAddress = new Address();
                expect(testAddress instanceof Address).toBeTruthy();
                expect(testAddress instanceof FormComponent).toBeTruthy();
                expect(testAddress.extendModelProperty).toBeDefined();
                expect(testAddress.labels).toBeDefined();
                expect(testAddress.settings).toBeDefined();
                expect(testAddress.hasOwnProperty('isModelRequired')).toBeTruthy();
            });

            it('model should contain all peropertirs', function () {
                testAddress = new Address();
                var addressModel = testAddress.getModel();
                expect(addressModel.cityAutoComplete).toBeDefined();
                expect(addressModel.streetAutoComplete).toBeDefined();
                expect(addressModel.houseNum).toBeDefined();
                expect(addressModel.zipCode).toBeDefined();
                expect(addressModel.aptNum).toBeDefined();
            });
        });
    });
});