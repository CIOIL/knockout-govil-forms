define(['common/core/UIProvider'], function (UIProvider) {
    describe('UIProvider', function () {
        it('resources is defined', function () {
            expect(UIProvider.resources).toBeDefined();
        });
        describe('customizeResources', function () {
            it('is defined', function () {
                expect(UIProvider.customizeResources).toBeDefined();
            });
            it('call customizeResources without pass object throw error', function () {
                expect(function () { UIProvider.customizeResources(); }).toThrowError('UIProvider.customizeResources must get object parameter');
            });
            it('call customizeResources and pass parameter with type different object throw error', function () {
                expect(function () { UIProvider.customizeResources(''); }).toThrowError('UIProvider.customizeResources must get object parameter');
            });
            it('call customizeResources with object should update UIProvider.resources', function () {
                UIProvider.customizeResources({ newKey: 'bla' });
                expect(UIProvider.resources.newKey).toEqual('bla');
                expect(UIProvider.resources.autocomplete).toBeDefined();
            });
        });
    });
});