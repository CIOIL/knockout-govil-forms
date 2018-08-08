define(['common/ko/bindingHandlers/tlpLockElement', 'common/infrastructureFacade/tfsMethods'],
function (tlpLockElement, tfsMethods) {//eslint-disable-line no-unused-vars

    describe('tlpLockElement', function () {

        var notFound = -1;
        var viewModel = function () {
            var self = this;

            self.divToLock = ko.observable();
            self.inputElement = ko.observable();
            self.secondInputElement = ko.observable();
            self.textareaElement = ko.observable();
            self.lookupElement = ko.observable('modiin-ilit');
            self.buttonElement = ko.observable();
            self.option = ko.observableArray('');

            self.notOther = ko.computed(function () {
                return self.option.indexOf('other') === notFound;
            });
            self.isDisable = ko.computed(function () {
                return self.inputElement() === 'ttt';
            });
            self.isDisable1 = ko.computed(function () {
                return self.textareaElement() === 'xxx';
            });
            self.isDisable2 = ko.computed(function () {
                return self.secondInputElement() === 'yyy';
            });

            return self;
        }();
        ko.cleanNode(document.body);
        ko.applyBindings(viewModel);

        //function handleAfterLock() {
        //    $('#mySpan').text('my span');
        //}

        //function handleAfterUnLock() {
        //    $('#buttonElement').val('my button');
        //}

        var divToLock;

        beforeEach(function () {

            $('#mySpan').text('נעילת אלמנטים');
            viewModel.inputElement('ttt');
            viewModel.secondInputElement('yyy');
            viewModel.textareaElement('xxx');
            divToLock = $('#divToLock');
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpLockElement.html');
            spyOn(tfsMethods.attachment, 'setDisabledEnabled').and.callFake(function () {
                return;
            });
        });

        it('lock inputElement', function () {
            var inputElement = $('#inputElement');
            var inputElementBinding = { tlpLockElement: viewModel.isDisable };
            ko.applyBindingsToNode(inputElement.get(0), inputElementBinding);
            expect(inputElement.attr('disabled')).toEqual('disabled');
        });

        it('lock textareaElement', function () {
            var textareaElement = $('#textareaElement');

            var textareaElementBinding = { tlpLockElement: viewModel.isDisable };
            ko.applyBindingsToNode(textareaElement.get(0), textareaElementBinding);
            expect(textareaElement.attr('disabled')).toEqual('disabled');
        });

        it('lock lookupElement', function () {
            var lookupElementContainer = $('#lookupElementContainer');

            var lookupElementBinding = { tlpLockElement: viewModel.isDisable };
            ko.applyBindingsToNode(lookupElementContainer.get(0), lookupElementBinding);

            expect($('#lookupElement').attr('disabled')).toEqual('disabled');
            expect($('#arrow_lookupElement').attr('disabled')).toEqual('disabled');
        });
        it('lock attachmentElement', function () {

            var attachmentElementContainer = $('#attachmentElementContainer');

            var attachmentElementBinding = { tlpLockElement: viewModel.isDisable };
            ko.applyBindingsToNode(attachmentElementContainer.get(0), attachmentElementBinding);

            expect(tfsMethods.attachment.setDisabledEnabled).toHaveBeenCalled();

        });

        it('lock buttonElement also after another applybindings', function () {
            var buttonElement = $('#buttonElement');

            var buttonElementBinding = { tlpLockElement: viewModel.isDisable };
            ko.cleanNode(buttonElement);
            ko.applyBindingsToNode(buttonElement.get(0), buttonElementBinding);

            expect(buttonElement.attr('disabled')).toEqual('disabled');
            ko.cleanNode(buttonElement.get(0));
            ko.applyBindings(viewModel, buttonElement.get(0));

            expect(buttonElement.attr('disabled')).toEqual('disabled');
        });

        describe('lock div with elements', function () {
            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                loadFixtures('tlpLockElement.html');
                divToLock = $('#divToLock');
            });
            it('simple', function () {
                var divToLockBinding = { tlpLockElement: viewModel.isDisable };
                ko.applyBindingsToNode(divToLock.get(0), divToLockBinding);


                divToLock.children('input, textarea, select').each(function () {
                    expect($(this).attr('disabled')).toEqual('disabled');
                });
            });

            it('then unlock', function () {
                var divToLockBinding = { tlpLockElement: viewModel.isDisable };

                //lock div by changing the computed return value
                ko.applyBindingsToNode(divToLock.get(0), divToLockBinding);

                divToLock.children('input, textarea, select').each(function () {
                    expect($(this).attr('disabled')).toEqual('disabled');
                });

                //unlock div by changing the computed return value
                viewModel.inputElement('t');

                divToLock.children('input, textarea, select').each(function () {
                    expect($(this)).not.toHaveAttr('disabled', 'disabled');
                });
            });

            it('that part of them are locked, then unlock', function () {
                var inputElement = $('#inputElement');
                var buttonElement = $('#buttonElement');


                var inputToLockBinding = { tlpLockElement: viewModel.isDisable1 };
                var buttonToLockBinding = { tlpLockElement: viewModel.isDisable2 };
                ko.applyBindingsToNode(inputElement.get(0), inputToLockBinding);
                ko.applyBindingsToNode(buttonElement.get(0), buttonToLockBinding);

                //lock div
                var divToLockBinding = { tlpLockElement: viewModel.isDisable };
                ko.applyBindingsToNode(divToLock.get(0), divToLockBinding);

                divToLock.children('input, textarea, select').each(function () {
                    expect($(this).attr('disabled')).toEqual('disabled');
                });

                //unlock div
                viewModel.inputElement('t');
                divToLock.children('input, textarea, select').each(function () {
                    var currentElement = $(this);
                    var currentElementId = currentElement.attr('id');
                    if (currentElementId === 'inputElement' || currentElementId === 'buttonElement') {
                        expect(currentElement.attr('disabled')).toEqual('disabled');
                    }
                    else {
                        expect(currentElement).not.toHaveAttr('disabled', 'disabled');
                    }
                });
            });

            it('that part of them have tlpLockElement that returns false', function () {

                var inputElement = $('#inputElement');
                var textareaElement = $('#textareaElement');
                viewModel.textareaElement('x');
                viewModel.secondInputElement('y');

                var inputBinding = { tlpLockElement: viewModel.isDisable1 };
                var textareaBinding = { tlpLockElement: viewModel.isDisable2 };
                ko.applyBindingsToNode(inputElement.get(0), inputBinding);
                ko.applyBindingsToNode(textareaElement.get(0), textareaBinding);

                var divToLockBinding = { tlpLockElement: viewModel.isDisable };
                ko.applyBindingsToNode(divToLock.get(0), divToLockBinding);

                divToLock.children('input, textarea, select').each(function () {
                    expect($(this).attr('disabled')).toEqual('disabled');
                });
            });

        });

        describe('hirarchy locking', function () {

            var checkboxToLock;
            var innerInput;
            var divParent;

            describe('lock parent div and its children both checkbox and input', function () {

                beforeEach(function () {

                    checkboxToLock = $('#other');
                    innerInput = $('#fromOther');
                    divParent = $('#parent');
                    jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                    loadFixtures('tlpLockElement.html');

                    var divParentBindings = { tlpLockElement: true };
                    ko.applyBindingsToNode(divParent.get(0), divParentBindings);

                    viewModel.option.push('other');
                    var inputToLockBinding = { tlpLockElement: viewModel.notOther };

                    ko.applyBindingsToNode(innerInput.get(0), inputToLockBinding);
                });

                it('the div itself is not locked', function () {
                    expect(divParent).not.toHaveAttr('disabled', 'disabled');
                });

                it('the checkbox is locked', function () {
                    expect(checkboxToLock.attr('disabled')).toEqual('disabled');
                });

                it('the innerInput is locked even when its own tlpLockElement is false!', function () {
                    expect(innerInput.attr('disabled')).toEqual('disabled');
                });

            });

            describe('using the parameter: unlockMeAlways ', function () {

                beforeEach(function () {

                    checkboxToLock = $('#other');
                    innerInput = $('#fromOther');
                    divParent = $('#parent');
                    jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                    loadFixtures('tlpLockElement.html');

                    var divParentBindings2 = { tlpLockElement: true };
                    ko.applyBindingsToNode(divParent.get(0), divParentBindings2);

                    viewModel.option.push('other');
                    var inputToLockBinding2 = { tlpLockElement: viewModel.notOther, unlockMeAlways: false };

                    ko.applyBindingsToNode(innerInput.get(0), inputToLockBinding2);

                });

                it('the div itself is not locked', function () {
                    expect(divParent).not.toHaveAttr('disabled', 'disabled');
                });

                it('the checkbox is locked', function () {
                    expect(checkboxToLock.attr('disabled')).toEqual('disabled');
                });

                it('the innerInput is unlock even when its paren is locked!', function () {
                    expect(innerInput).not.toHaveAttr('disabled', 'disabled');
                });

            });
        });

    });

});
define('spec/tlpLockElement.spec.js', function () { });