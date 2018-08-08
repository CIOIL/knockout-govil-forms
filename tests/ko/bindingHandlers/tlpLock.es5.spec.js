define(['common/resources/tfsAttributes', 'common/elements/attachmentMethods', 'common/elements/lookUpMethods', 'common/elements/dateMethods', 'common/ko/fn/config', 'common/events/userEventHandler', 'common/elements/dynamicTable', 'common/ko/bindingHandlers/tlpLock'], function (tfsAttributes, attachmentMethods, lookUpMethods, dateMethods, config, userEventHandler, dynamicTable) {
    //eslint-disable-line

    describe('tlpLock', function () {
        var utils = {};
        utils.isLock = function (element) {
            return $(element).attr('disabled') === 'disabled';
        };
        utils.isUnlock = function (element) {
            return $(element).attr('disabled') === undefined;
        };
        utils.isLookupLocked = function (element) {
            var arrowElement = lookUpMethods.getArrowElement(element);
            var selectElement = lookUpMethods.getSelectElement(element);
            if (utils.isLock(arrowElement) && utils.isLock(selectElement) && utils.isLock(element)) {
                return true;
            }
            return false;
        };

        utils.isAttachmentLocked = function (element) {
            var wrapperElement = attachmentMethods.getWrapperElement(element);
            if (utils.isLock(wrapperElement) && utils.isLock(element)) {
                return true;
            }
            return false;
        };
        utils.isDateLocked = function (element) {
            var dateButton = dateMethods.getButtonElement(element);
            if (utils.isLock(dateButton) && utils.isLock(element)) {
                return true;
            }
            return false;
        };

        var Person = function Person() {
            var self = this;
            self.firstName = ko.observable('');
            self.lastName = ko.observable('');
        };

        var getViewModel = function getViewModel() {
            var needLockThirdContainer = ko.observable();
            var needLockSecondContainer = ko.observable();
            var needLockFirstContainer = ko.observable();
            var needLockElement = ko.observable();
            var contacts = ko.observableArray([new Person()]).config({ type: Person });

            return {
                needLockThirdContainer: needLockThirdContainer,
                needLockSecondContainer: needLockSecondContainer,
                needLockFirstContainer: needLockFirstContainer,
                needLockElement: needLockElement,
                contacts: contacts
            };
        };

        var divToLock;
        var divOwnLock;
        var divWithoutOwnLock;
        var viewModel;
        beforeEach(function () {
            ko.cleanNode(document.body);
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('lock.html');
            viewModel = getViewModel();
            ko.applyBindings(viewModel);
        });
        describe('lock on fields -  all types.', function () {
            beforeEach(function () {
                window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['setDisabledEnabled']);
                viewModel.needLockElement(true);
            });
            it('lock inputElement.', function () {
                var inputElement = $('#inputElementWithOwnLock');
                expect(utils.isLock(inputElement)).toEqual(true);
            });

            it('lock selectElement.', function () {
                var selectElement = $('#selectElement');
                expect(utils.isLock(selectElement)).toEqual(true);
            });

            it('lock textareaElement.', function () {
                var textareaElement = $('#textareaElement');
                expect(utils.isLock(textareaElement)).toEqual(true);
            });

            it('lock lookupElement.', function () {
                var lookupElement = $('#City');
                expect(utils.isLookupLocked(lookupElement)).toEqual(true);
            });

            it('lock attachmentElement.', function () {
                var attachmentElement = $('#attachmentElement');
                expect(utils.isAttachmentLocked(attachmentElement)).toEqual(true);
            });

            it('lock dateElement.', function () {
                var dateElement = $('#dateElement');
                expect(utils.isDateLocked(dateElement)).toEqual(true);
            });

            it('lock buttonElement.', function () {
                var buttonElement = $('#buttonElement');
                expect(utils.isLock(buttonElement)).toEqual(true);
            });
        });
        describe('lock inner container.', function () {
            beforeEach(function () {
                viewModel.needLockSecondContainer(true);
            });
            it('lock inner div effect all its child.', function () {
                divToLock = $('#containerDivToLock');
                divToLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).toEqual(true);
                });
            });

            it('unlock inner div effect all its child.', function () {
                viewModel.needLockSecondContainer(false);
                divToLock = $('#containerDivToLock');
                divToLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).not.toEqual(true);
                });
            });

            describe('lock div when children have own lock.', function () {

                it('children lock condition is true', function () {
                    viewModel.needLockElement(true);
                    divToLock = $('#containerDivToLock');
                    divToLock.find('input, textarea, select').each(function () {
                        expect(utils.isLock(this)).toEqual(true);
                    });
                });
                it('children lock condition is false', function () {
                    viewModel.needLockElement(false);
                    divToLock = $('#containerDivToLock');
                    divToLock.find('input, textarea, select').each(function () {
                        expect(utils.isLock(this)).toEqual(true);
                    });
                });
            });
            describe('ulock div when children have own lock.', function () {
                it('children lock condition is false', function () {
                    viewModel.needLockSecondContainer(false);
                    divToLock = $('#containerDivToLock');
                    divToLock.find('input, textarea, select').each(function () {
                        expect(utils.isLock(this)).not.toEqual(true);
                    });
                });
                it('children lock condition is true', function () {
                    viewModel.needLockElement(true);
                    viewModel.needLockSecondContainer(false);
                    divToLock = $('#containerDivToLock');
                    divToLock.find('input, textarea, select').each(function () {
                        expect(utils.isLock(this)).toEqual(true);
                    });
                });
            });
        });
        describe('lock inner container with parent lock', function () {
            it('lock parent div- all children with own lock and without own lock - will be disabled', function () {
                viewModel.needLockThirdContainer(true);
                divOwnLock = $('#containerDivToLock');
                divWithoutOwnLock = $('#containerDiv');
                divOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).toEqual(true);
                });
                divWithoutOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).toEqual(true);
                });
            });

            it('unlock parent div, child div lock condition is false', function () {
                viewModel.needLockThirdContainer(true);
                viewModel.needLockThirdContainer(false);
                divOwnLock = $('#containerDivToLock');
                divWithoutOwnLock = $('#containerDiv');
                divOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).not.toEqual(true);
                });
                divWithoutOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).not.toEqual(true);
                });
            });

            it('unlock parent div, child div lock condition is true', function () {
                viewModel.needLockThirdContainer(true);
                viewModel.needLockSecondContainer(true);
                viewModel.needLockThirdContainer(false);
                divOwnLock = $('#containerDivToLock');
                divWithoutOwnLock = $('#containerDiv');
                divOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).toEqual(true);
                });
                divWithoutOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).not.toEqual(true);
                });
            });
            it('unlock child div, all element witll stay lock', function () {
                viewModel.needLockThirdContainer(true);
                viewModel.needLockSecondContainer(false);
                divOwnLock = $('#containerDivToLock');
                divOwnLock.find('input, textarea, select').each(function () {
                    expect(utils.isLock(this)).toEqual(true);
                });
            });
        });
        describe('lock element with dynamic table', function () {
            it('lock parent div- add dynamic table row', function (done) {
                $('#addRowMax').click();
                setTimeout(function () {
                    viewModel.needLockThirdContainer(true);
                    expect(viewModel.contacts().length).toBe(2);
                    $('#contacts').find('input, textarea, select').each(function () {
                        expect(utils.isLock(this)).toEqual(true);
                    });
                    done();
                }, 500); //eslint-disable-line
            });
        });
        describe('lock behavior with neverLock class on elements', function () {

            describe('lock element parent neverLock class - elements not lock', function () {
                beforeEach(function () {
                    window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['setDisabledEnabled']);
                    $('#containerDivToLock').addClass('neverLock');
                    viewModel.needLockElement(true);
                });
                it('lock inputElement with parent neverLock.', function () {
                    var inputElement = $('#inputElement');
                    expect(utils.isLock(inputElement)).toEqual(false);
                });

                it('lock selectElement with parent neverLock.', function () {
                    var selectElement = $('#selectElement');
                    expect(utils.isLock(selectElement)).toEqual(false);
                });

                it('lock textareaElement with parent neverLock.', function () {
                    var textareaElement = $('#textareaElement');
                    expect(utils.isLock(textareaElement)).toEqual(false);
                });

                it('lock lookupElement with parent neverLock.', function () {
                    var lookupElement = $('#City');
                    expect(utils.isLookupLocked(lookupElement)).toEqual(false);
                });

                it('lock attachmentElement with parent neverLock.', function () {
                    var attachmentElement = $('#attachmentElement');
                    expect(utils.isAttachmentLocked(attachmentElement)).toEqual(false);
                });

                it('lock dateElement with parent neverLock.', function () {
                    var dateElement = $('#dateElement');
                    expect(utils.isDateLocked(dateElement)).toEqual(false);
                });

                it('lock buttonElement with parent neverLock.', function () {
                    var buttonElement = $('#buttonElement');
                    expect(utils.isLock(buttonElement)).toEqual(false);
                });
            });
            describe('lock container when children has neverLock class - children wont lock', function () {
                beforeEach(function () {
                    window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['setDisabledEnabled']);
                });
                it('lock container when inputElement with neverLock.', function () {
                    var inputElement = $('#inputElement');
                    inputElement.addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isLock(inputElement)).toEqual(false);
                });

                it('lock container when selectElement with neverLock.', function () {
                    var selectElement = $('#selectElement');
                    selectElement.addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isLock(selectElement)).toEqual(false);
                });

                it('lock container when textareaElement with neverLock.', function () {
                    var textareaElement = $('#textareaElement');
                    textareaElement.addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isLock(textareaElement)).toEqual(false);
                });

                it('lock container when lookupElement with neverLock.', function () {
                    var lookupElement = $('#City');
                    $('.citySelect').addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isLookupLocked(lookupElement)).toEqual(false);
                });

                it('lock container when attachmentElement with neverLock.', function () {
                    var attachmentElement = $('#attachmentElement');
                    attachmentElement.addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isAttachmentLocked(attachmentElement)).toEqual(false);
                });

                it('lock container when dateElement with neverLock.', function () {
                    var dateElement = $('#dateElement');
                    $('.date').addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isDateLocked(dateElement)).toEqual(false);
                });

                it('lock container when buttonElement with neverLock.', function () {
                    var buttonElement = $('#buttonElement');
                    buttonElement.addClass('neverLock');
                    viewModel.needLockThirdContainer(true);
                    expect(utils.isLock(buttonElement)).toEqual(false);
                });
            });
        });
    });
});
define('spec/tlpLock.spec.js', function () {});