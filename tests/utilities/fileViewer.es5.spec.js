define(['common/utilities/fileViewer', 'common/utilities/userBrowser'], function (fileViewer, userBrowser) {
    describe('downloadFileByBlob', function () {
        var fileName = 'fileName.pdf';
        beforeEach(function () {
            spyOn($.fn, 'append');
            spyOn($.fn, 'get').and.returnValue($('<a></a>'));
        });
        describe('params', function () {
            it('undefined', function () {
                expect(function () {
                    fileViewer.downloadFileByBlob();
                }).toThrowError();
            });
            it('fileName should be string', function () {
                expect(function () {
                    fileViewer.downloadFileByBlob(1);
                }).toThrowError();
            });
            it('content parameter is mandatory', function () {
                expect(function () {
                    fileViewer.downloadFileByBlob(fileName);
                }).toThrowError();
            });
            it('type parameter is optional', function () {
                expect(function () {
                    fileViewer.downloadFileByBlob(fileName, {});
                }).not.toThrowError();
            });
        });
        describe('logic', function () {
            it('IE - open blob', function () {
                spyOn(userBrowser, 'isIE').and.returnValue(true);
                window.navigator.msSaveOrOpenBlob = jasmine.createSpy();
                fileViewer.downloadFileByBlob(fileName, new window.ArrayBuffer());
                expect(window.navigator.msSaveOrOpenBlob).toHaveBeenCalledWith(jasmine.anything(), fileName);
            });
            it('Other browsers - download by link element', function () {
                spyOn(userBrowser, 'isIE').and.returnValue(false);
                fileViewer.downloadFileByBlob(fileName, new window.ArrayBuffer());
                expect($.fn.append).toHaveBeenCalled();
            });
        });
    });
});