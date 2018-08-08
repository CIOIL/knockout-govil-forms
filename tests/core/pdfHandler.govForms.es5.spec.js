var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/core/pdfHandler', 'common/core/formMode', 'common/core/generalAttributes'], function (pdfHandler, formMode, generalAttributes) {

    describe('invoke', function () {

        beforeEach(function () {
            spyOn(ko.postbox, 'publish');
        });
        it('should be function', function () {
            expect(pdfHandler.invoke).toBeDefined();
            expect(_typeof(pdfHandler.invoke)).toEqual('function');
        });
        it('without params', function () {
            expect(function () {
                pdfHandler.invoke();
            }).not.toThrowError();
        });
        it('does not affect agForms', function () {
            spyOn(generalAttributes, 'isGovForm').and.returnValue(false);
            formMode.mode('pdf');
            pdfHandler.invoke();
            expect(ko.postbox.publish).not.toHaveBeenCalled();
        });
        it('does not affect client mode', function () {
            spyOn(generalAttributes, 'isGovForm').and.returnValue(true);
            formMode.mode('client');
            pdfHandler.invoke();
            expect(ko.postbox.publish).not.toHaveBeenCalled();
        });
        describe('fireUserBeforePrint method', function () {
            it('fire userBeforePrint event ', function () {
                spyOn(generalAttributes, 'isGovForm').and.returnValue(true);
                formMode.mode('pdf');
                pdfHandler.invoke();
                expect(ko.postbox.publish).toHaveBeenCalledWith('userBeforePrint', jasmine.anything());
            });
            it('send saveAsPdf context to userBeforePrint event', function () {
                spyOn(generalAttributes, 'isGovForm').and.returnValue(true);
                formMode.mode('pdf');
                pdfHandler.invoke();
                expect(ko.postbox.publish).toHaveBeenCalledWith(jasmine.anything(), { deferred: jasmine.anything(), context: 'saveAsPdf' });
            });
        });
        describe('replaceStyles method', function () {
            var addFakeStyle = function addFakeStyle() {
                var link = $('<link id="fakeStyle" media="print">');
                $('body').append(link);
            };
            var removeFakeStyle = function removeFakeStyle() {
                $('link[id="fakeStyle"]').remove();
            };
            beforeAll(function () {
                addFakeStyle();
            });
            afterAll(function () {
                //eslint-disable-line no-undef
                removeFakeStyle();
            });
            it('remove media print from styles ', function () {
                expect($('link[id="fakeStyle"]').attr('media')).toEqual('print');
                pdfHandler.invoke();
                expect($('link[id="fakeStyle"]').attr('media')).toBeUndefined();
            });
        });
    });
});