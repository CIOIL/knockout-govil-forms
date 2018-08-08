define(['common/components/loader/loader'], function (loader) {
    describe('loader - ', function () {
        beforeAll(function () {
            spyOn($.fn,'dialog');
        });
       
        describe('open method - ', function () {
            it('open a modal', function () {
                loader.open();
                expect($.fn.dialog).toHaveBeenCalled();
            });
            it('show the message', function () {
                loader.open('message');
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining({
                    title: 'message'
                }));
            });
            it('can get other settings', function () {
                loader.open('message', { resizable: true });
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining({
                    resizable: true
                }));
            });
        });
        describe('close method - ', function () {
            it('destroy the modal', function () {
                loader.close();
                expect($.fn.dialog).toHaveBeenCalledWith('destroy');
            });
        });
           
        
    });
});