define([
    'common/entities/otherEntity'
],
function (otherOptionEntity) {
    const dataCode = -11;

    describe('other option', function () {
        it('to be defined', function () {
            expect(otherOptionEntity).toBeDefined();
        });
        it('dataCode equal -11', function () {
            expect(otherOptionEntity.dataCode()).toEqual(dataCode);
        });
        it('dataText equal אחר', function () {
            expect(otherOptionEntity.dataText()).toEqual('אחר');
        });
    });
});
