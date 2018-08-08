define(['common/ko/bindingHandlers/textArea'], function () {

        var viewModel;

        var ROW_VS_PX = 20.66666666666667;

        describe('adjustTextArea', function () {

                beforeEach(function () {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                        loadFixtures('textArea.html');
                        viewModel = {
                                comments: ko.observable('....'),
                                otherComments: ko.observable('..........')
                        };
                        ko.cleanNode($('body')[0]);
                        ko.applyBindings(viewModel);
                });

                it('span has created', function () {
                        expect($('span.pseudoTextArea')).toBeDefined();
                });

                it('span has same text value', function () {
                        var textArea = $('#comments');
                        var span = textArea.next();

                        expect(span.text()).toEqual(textArea.val());
                });

                it('span is binding to the textArea value', function () {
                        var span = $('#comments').next();

                        viewModel.comments('');

                        expect(span.text()).toEqual('');
                });

                it('check \'min-height\' calculation', function () {

                        var textArea = $('#comments');
                        var span = textArea.next();

                        var rows = textArea.attr('rows');
                        var height = parseInt(rows, 10) * ROW_VS_PX;

                        expect(parseFloat(span.css('min-height'), 10).toFixed(4)).toEqual(height.toFixed(4));
                });

                it('span height stretched by its content', function () {

                        var span = $('#comments').next();

                        viewModel.comments('row1 \n row2 \n row3 \n row4');
                        var height = 3 * ROW_VS_PX;

                        //add to height because of rounding differents that can be
                        expect(parseFloat(span.css('height'), 10)).toBeGreaterThan(height + 1);
                });

                it('check \'min-height\' calculation - textArea do not have \'rows\' definition', function () {

                        var span = $('#otherComments').next();

                        var height = 2 * ROW_VS_PX;

                        expect(parseFloat(span.css('min-height'), 10).toFixed(2)).toEqual(height.toFixed(2));
                });
        });

        describe('autoResizeTextarea', function () {

                beforeEach(function () {
                        jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                        loadFixtures('textArea.html');
                        viewModel = {
                                comments: ko.observable('....'),
                                otherComments: ko.observable('..........')
                        };
                        ko.cleanNode($('body')[0]);
                        ko.applyBindings(viewModel);
                });

                it('hidden div has created', function () {
                        expect($('div#commentsDiv')).toBeDefined();
                });

                //it('check min-height of the div according to textarea with rows and without rows', () => {
                //    const textAreaWithRows = $('#comments');
                //    const commentsDiv = $('#commentsDiv');
                //    const otherCommentsDiv = $('#otherCommentsDiv');

                //    const withRowsHeight = parseInt(textAreaWithRows.attr('rows'), 10) * ROW_VS_PX;
                //    const withoutRowsHeight = 2 * ROW_VS_PX;

                //    expect(parseFloat(commentsDiv.css('min-height'), 10).toFixed(2)).toEqual(withRowsHeight.toFixed(2));
                //    expect(parseFloat(otherCommentsDiv.css('min-height'), 10).toFixed(2)).toEqual(withoutRowsHeight.toFixed(2));
                //});

                //it('textarea height stretched by its content from the bindingHandlers update', () => {
                //    const textarea = $('#comments');
                //    viewModel.comments('row1 \n row2 \n row3 \n row4');
                //    var height = 5 * ROW_VS_PX;

                //    expect(parseFloat(textarea.css('height'), 10).toFixed(2)).toEqual(height.toFixed(2));
                //});

                //it('textarea height stretched by its content from the DOM', () => {
                //    const textarea = $('#comments');
                //    textarea.val('row1 \n row2 \n row3 \n row4');
                //    textarea.trigger('input');
                //    var height = 5 * ROW_VS_PX;

                //    expect(parseFloat(textarea.css('height'), 10).toFixed(2)).toEqual(height.toFixed(2));
                //});
        });
});
define('spec/textArea.js', function () {});