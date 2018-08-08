define(['common/components/TableModal/tableModal'], function (tableModal) {

    describe('Table Modal', function () {

        it('api exports all functions', function () {
            expect(tableModal.extendDefaultArgs).toBeDefined();
            expect(tableModal.deleteRow).toBeDefined();
            expect(tableModal.open).toBeDefined();
            expect(tableModal.closePopup).toBeDefined();
            expect(tableModal.tableModalState).toBeDefined();
            expect(tableModal.addAdditionalRow).toBeDefined();
        });
    });
});