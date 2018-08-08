define(['common/utilities/successDialog', 'common/components/dialog/dialog', 'common/utilities/resourceFetcher', 'common/resources/texts/indicators', 'common/actions/saveAsPdf'], function (successDialog, dialog, resourceFetcher, indicators, pdfAction) {
    //eslint-disable-line max-params
    describe('successDialog', function () {

        describe('open', function () {

            var fakedPromiseResolver = function fakedPromiseResolver() {
                var d = $.Deferred();
                d.resolve();
                return d.promise();
            };

            var fakedPromiseRejector = function fakedPromiseRejector() {
                var d = $.Deferred();
                d.reject();
                return d.promise();
            };

            var fakedPromise = function fakedPromise() {
                var d = $.Deferred();
                return d.promise();
            };

            it('should be defined', function () {
                expect(successDialog.open).toBeDefined();
            });

            it('should open dialog.confirm with sent message', function () {
                spyOn(dialog, 'confirm').and.callFake(fakedPromise);
                var successMessage = 'success';
                successDialog.open(successMessage);
                expect(dialog.confirm).toHaveBeenCalledWith(jasmine.objectContaining({ message: successMessage }));
            });

            it('should open dialog.confirm with defaultMessage message if no message sent', function () {
                spyOn(dialog, 'confirm').and.callFake(fakedPromise);
                var defaultMessage = resourceFetcher.get(indicators.information).defaultSuccsess;
                successDialog.open();
                expect(dialog.confirm).toHaveBeenCalledWith(jasmine.objectContaining({ message: defaultMessage }));
            });

            it('should call saveAsPdf if confirm dialog', function () {
                spyOn(dialog, 'confirm').and.callFake(fakedPromiseResolver);
                spyOn(pdfAction, 'saveAsPdf');
                successDialog.open('success');
                expect(pdfAction.saveAsPdf).toHaveBeenCalled();
            });

            it('should not call saveAsPdf if confirm dialog close', function () {
                spyOn(dialog, 'confirm').and.callFake(fakedPromiseRejector);
                spyOn(pdfAction, 'saveAsPdf');
                successDialog.open('success');
                expect(pdfAction.saveAsPdf).not.toHaveBeenCalled();
            });
        });
    });
});