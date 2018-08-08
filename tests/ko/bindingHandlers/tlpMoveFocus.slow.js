define([
    'common/ko/bindingHandlers/tlpMoveFocus'
],
function (tlpMoveFocus) {//eslint-disable-line no-unused-vars
    describe('tlpMoveFocus', function () {

        var viewModel = {
            first: ko.observable('ttt'),
            second: ko.observable()
        };

        beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpMoveFocus.html');
        });

        describe('when nextObject is sent', function () {
            describe('focused elements', function () {
                it('move focus from first input to the second', function () {
                    var firstInput = $('#firstInput');
                    var secondInput = $('#secondInput');

                    spyOn(secondInput[0], 'focus');
                    var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: 3, nextObject: '#secondInput' };
                    ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                    expect(secondInput[0].focus).toHaveBeenCalled();
                });
                it('move focus from first input to the select', function () {
                    var firstInput = $('#firstInput');
                    var forthInput = $('#forthInput');

                    spyOn(forthInput[0], 'focus');
                    var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: 3, nextObject: '#forthInput' };
                    ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                    expect(forthInput[0].focus).toHaveBeenCalled();
                });
                it('move focus from first input to the textarea', function () {
                    var firstInput = $('#firstInput');
                    var thirdInput = $('#thirdInput');

                    spyOn(thirdInput[0], 'focus');
                    var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: 3, nextObject: '#thirdInput' };
                    ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                    expect(thirdInput[0].focus).toHaveBeenCalled();
                });
                it('not move focus from first input to second, when characters is empty', function () {
                    var firstInput = $('#firstInput');
                    var secondInput = $('#secondInput');

                    spyOn(secondInput[0], 'focus');
                    var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: '' };
                    ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                    expect(secondInput[0].focus).not.toHaveBeenCalled();
                });
            });
            describe('not focused element', function () {
                it('not move focus from first input to hidden', function () {
                    var firstInput = $('#firstInput');
                    var hiddenInput = $('#hiddenInput');

                    spyOn(hiddenInput[0], 'focus');
                    var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: 3, nextObject: '#hiddenInput' };
                    ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                    expect(hiddenInput[0].focus).not.toHaveBeenCalled();
                });

                it('not move focus from first input to disabled', function () {
                    var firstInput = $('#firstInput');
                    var disabledInput = $('#disabledInput');

                    spyOn(disabledInput[0], 'focus');
                    var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: 3, nextObject: '#disabledInput' };
                    ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                    expect(disabledInput[0].focus).not.toHaveBeenCalled();
                    expect(disabledInput.is(':focus')).toBeFalsy();
                });
            });
        });
        describe('when nextObject is not sent', function () {
            it('not move focus from first input to second', function () {
                var firstInput = $('#firstInput');
                var secondInput = $('#fiveInput');

                spyOn(secondInput[0], 'focus');
                var firstInputBinding = { value: viewModel.first, tlpMoveFocus: viewModel.first, characters: '3' };
                ko.applyBindingsToNode(firstInput.get(0), firstInputBinding);

                expect(secondInput[0].focus).not.toHaveBeenCalled();
            });
        });

    });

});
define('spec/tlpMoveFocusSpec.js', function () { });