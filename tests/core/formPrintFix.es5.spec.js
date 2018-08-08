/// <reference path="formPrintFix.spec.js" />
define(['common/core/formPrintFix', 'common/elements/textAreaAdjuster', 'common/infrastructureFacade/tfsMethods'], function (formPrintFix, textAreaAdjuster, tfsMethods) {
    describe('formPrintFix', function () {
        beforeEach(function () {
            spyOn(tfsMethods, 'fixElements').and.callFake(function () {
                return;
            });
            spyOn(tfsMethods, 'rollBackChanges').and.callFake(function () {
                return;
            });
            jasmine.getFixtures().fixturesPath = 'base/Tests/core/templates';
            loadFixtures('formPrintFix.html');
        });

        it('changeToPrintMode', function (done) {
            spyOn(textAreaAdjuster, 'expandToFitContent');
            formPrintFix.changeToPrintMode();
            var timeStamp = 1000;
            setTimeout(function () {
                expect(textAreaAdjuster.expandToFitContent).toHaveBeenCalled();
                done();
            }, timeStamp);
        });

        it('returnToScreenMode', function () {
            spyOn(textAreaAdjuster, 'returnToOriginalSize');
            formPrintFix.returnToScreenMode();
            expect(textAreaAdjuster.returnToOriginalSize).toHaveBeenCalled();
        });
    });
});
define('spec/formPrintFix.js', function () {});