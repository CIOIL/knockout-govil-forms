define(['common/ko/bindingHandlers/initialization'], function (initialization) {
    //eslint-disable-line no-unused-vars

    var myViewModel = {
        generalModel: ko.observable('general')
    };
    ko.cleanNode(document.body);
    ko.applyBindings(myViewModel);

    function setupInput() {
        var input = '<input type="text" id="valMessage" tfsdata/>';
        $('body').append(input);
    }
    function setupSpan() {
        var span = '<span id="txtMessage" tfsdata></span>';
        $('body').append(span);
    }
    function removeInput() {
        $('#valMessage').remove();
    }
    function removeSpan() {
        $('#txtMessage').remove();
    }

    describe('viewToViewModelBinding', function () {

        it('dont update text and value', function () {
            expect(myViewModel.generalModel()).toEqual('general');
        });

        describe('tlpInitialText should update the binded observable with the text of element', function () {
            beforeEach(function () {

                setupSpan();
                $('#txtMessage').text('txt');

                var txtMessage = $('#txtMessage');
                var txtMessageTlp = { tlpInitialText: myViewModel.generalModel };

                ko.applyBindingsToNode(txtMessage.get(0), txtMessageTlp);
            });

            it('should be defined', function () {
                expect(ko.bindingHandlers.tlpInitialText).toBeDefined();
            });
            it('should update text', function () {
                expect(myViewModel.generalModel()).toEqual('txt');
            });
            afterEach(function () {
                ko.cleanNode($('#txtMessage').get(0));
                removeSpan();
            });
        });

        describe('tlpInitialValue should update the binded observable with the values of element', function () {
            beforeEach(function () {

                setupInput();
                $('#valMessage').val('val');

                var valMessage = $('#valMessage');
                var valMessageTlp = { tlpInitialValue: myViewModel.generalModel };

                ko.applyBindingsToNode(valMessage.get(0), valMessageTlp);
            });
            it('should be defined', function () {
                expect(ko.bindingHandlers.tlpInitialValue).toBeDefined();
            });
            it('should update value', function () {
                expect(myViewModel.generalModel()).toEqual('val');
            });
            afterEach(function () {
                ko.cleanNode($('#valMessage').get(0));
                removeInput();
            });
        });
    });
});
define('spec/initializationSpec.js', function () {});