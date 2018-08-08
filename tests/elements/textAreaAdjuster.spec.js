define(['common/elements/textAreaAdjuster'],

function (textAreaAdjuster) {

    describe('resize textareas functions', function () {
        $('<textarea id="ta1" style="height: 30px; visibility: hidden;"></textarea>').insertAfter('body');
        $('<textarea id="ta2" style="height: 30px; visibility: hidden;"></textarea>').insertAfter('body');
        var textArea = $('textarea');
        var textArea1 = $('#ta1');
        var textArea2 = $('#ta2');
        var scrollHeight1;
        var scrollHeight2;
        var defaultHeight1;
        var defaultHeight2;

        describe('resize according to scrollHeight', function () {

            beforeEach(function () {
                textArea.each(function () {
                    this.style.height = '30px';
                    this.style.visibility = 'hidden';
                });
                textArea.val('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');
                textArea.removeAttr('data-org-height');
                scrollHeight1 = textArea[0].scrollHeight + 'px';
                scrollHeight2 = textArea[1].scrollHeight + 'px';
                defaultHeight1 = textArea[0].style.height.replace('px', '');
                defaultHeight2 = textArea[1].style.height.replace('px', '');
            });

            it('resize all textarea elements if no selector is sent', function () {
                textAreaAdjuster.expandToFitContent();
                expect(textArea1).toHaveCss({ height: scrollHeight1 });
                expect(textArea2).toHaveCss({ height: scrollHeight2 });
                expect(textArea).toHaveAttr('data-org-height', defaultHeight1);
                expect(textArea).toHaveAttr('data-org-height', defaultHeight2);
            });

            it('resize specific element if selector is sent & valid', function () {
                textAreaAdjuster.expandToFitContent($('#ta1'));
                expect(textArea1).toHaveCss({ height: scrollHeight1 });
                expect(textArea2).not.toHaveCss({ height: scrollHeight2 });
                expect(textArea1).toHaveAttr('data-org-height', defaultHeight1);
                expect(textArea2).not.toHaveAttr('data-org-height', defaultHeight2);
            });
            it('do not resize any if selector is sent & not valid', function () {
                textAreaAdjuster.expandToFitContent($('#noElement'));
                expect(textArea1).not.toHaveCss({ height: scrollHeight1 });
                expect(textArea2).not.toHaveCss({ height: scrollHeight2 });
                expect(textArea1).not.toHaveAttr('data-org-height', defaultHeight1);
                expect(textArea2).not.toHaveAttr('data-org-height', defaultHeight2);
            });
        });

        describe('return textarea to default size', function () {
            beforeEach(function () {
                $(textArea).attr('data-org-height', '200px');
                textArea.each(function () {
                    this.style.height = '30px';
                });
            });
            it('return all textarea elements if no selector is sent', function () {
                textAreaAdjuster.returnToOriginalSize();
                expect(textArea1).toHaveCss({ height: '200px' });
                expect(textArea2).toHaveCss({ height: '200px' });
            });
            it('return specific element if selector is sent & valid', function () {
                textAreaAdjuster.returnToOriginalSize($('#ta1'));
                expect(textArea1).toHaveCss({ height: '200px' });
                expect(textArea2).not.toHaveCss({ height: '200px' });
            });
            it('do not return any if selector is sent & not valid', function () {
                textAreaAdjuster.returnToOriginalSize($('#noElement'));
                expect(textArea1).not.toHaveCss({ height: '200px' });
                expect(textArea2).not.toHaveCss({ height: '200px' });
            });
        });
    });

});
define('spec/textAreaAdjuster.js', function () { });
