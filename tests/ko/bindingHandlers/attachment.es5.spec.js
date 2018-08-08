/*globals AgatAttachment*/
define(['common/ko/bindingHandlers/attachment', 'common/utilities/stringExtension', 'common/elements/attachmentMethods', 'common/infrastructureFacade/tfsMethods', 'common/utilities/resourceFetcher', 'common/resources/infrastructureEnums', 'common/viewModels/languageViewModel'], function (tlpAttachment, stringExtension, attachmentMethods, tfsMethods, resourceFetcher, infrastructureEnums, languageViewModel) {
    //eslint-disable-line 
    describe('attachment', function () {
        var Attachment;
        var attachment, coverInput, label, link, noa, AttachmentListViewModel, sameAttachmentsViewModel, disableAttachment, viewModel; //eslint-disable-line
        beforeAll(function () {
            window.AgatAttachment = undefined;
            window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['dataAttributes']);
            window.AgatAttachment.dataAttributes = jasmine.createSpyObj('AgatAttachment.dataAttributes', ['filename', 'fileSizeAttr']);
            window.AgatAttachment.dataAttributes.filename.elementAttribute = 'newfilename';
            window.AgatAttachment.dataAttributes.filename.dynamictable = 'newfilenames';
            window.AgatAttachment.dataAttributes.fileSizeAttr.dynamictable = 'fsizes';
            window.AgatAttachment.dataAttributes.fileSizeAttr.elementAttribute = 'fsize';
            Attachment = function Attachment(param) {
                return {
                    fileName: ko.observable(param)
                };
            };

            AttachmentListViewModel = function () {
                return {
                    attachments: ko.observableArray([new Attachment('demo.jpg'), new Attachment(''), new Attachment(null)])
                };
            }();

            sameAttachmentsViewModel = function () {
                return {
                    sameAttachmentsList: ko.observableArray([new Attachment('demo.jpg'), new Attachment('demo.jpg')]),
                    differentAttachmentsList: ko.observableArray([new Attachment('demo.jpg'), new Attachment('differentDemo.jpg'), new Attachment('')]),
                    attachment: new Attachment('demo.jpg')
                };
            }();

            disableAttachment = function () {
                return {
                    enabledAttachment: ko.observable('true'),
                    disabledAttachment: ko.observable('false'),
                    disableAttachmentFunction: function disableAttachmentFunction() {
                        return false;
                    },
                    undefinedFunction: function undefinedFunction() {
                        return undefined;
                    }
                };
            }();
            viewModel = {
                attachmentListViewModel: AttachmentListViewModel,
                sameAttachmentsViewModel: sameAttachmentsViewModel,
                disableAttachment: disableAttachment,
                languageViewModel: languageViewModel
            };
        });

        beforeEach(function () {
            spyOn(attachmentMethods, 'getAgatDataAttributes').and.callFake(function () {
                return {
                    fileSizeAttr: {
                        dynamictable: 'fsizes',
                        elementAttribute: 'fsize'
                    },
                    filename: {
                        dynamictable: 'newfilenames',
                        elementAttribute: 'newfilename'
                    }
                };
            });
            spyOn(tfsMethods, 'setFormLanguage').and.callFake(function () {
                return;
            });
            spyOn(tfsMethods.attachment, 'removeAttachmentByElem').and.callFake(function () {
                return;
            });
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('attachment.html');
            ko.cleanNode(document.body);
            $('#sameAttachmentsTable').data(window.AgatAttachment.dataAttributes.fileSizeAttr.dynamictable, new Array('123', '456'));
            $('#sameAttachmentsTable').data(window.AgatAttachment.dataAttributes.filename.dynamictable, new Array('', 'demo (1).jpg'));
            $('#differentAttachmentsTable').data(window.AgatAttachment.dataAttributes.filename.dynamictable, new Array('', '', ''));
            $('#attachmentWithAttribute').data(window.AgatAttachment.dataAttributes.filename.elementAttribute, 'demo (1).jpg');
            $('#attachmentWithAttribute').data(window.AgatAttachment.dataAttributes.fileSizeAttr.elementAttribute, '123');
            ko.applyBindings(viewModel);
            viewModel.languageViewModel.language('hebrew');
        });

        describe('tlpAttachment', function () {

            describe('attachment attributes - update function', function () {
                describe('Full attachment', function () {

                    beforeEach(function () {

                        viewModel.languageViewModel.language('hebrew');
                        attachment = $('#attachmentsTable input[tfsdatatype="attachment"]').eq(0);
                        coverInput = $(attachment).closest('.attachment-wrapper').find('.attachment');
                    });

                    it('tfsaction attribute equal to "displayAttachment"', function () {
                        expect(attachment.attr('tfsaction')).toEqual('displayAttachment');
                    });

                    describe('element attributes', function () {
                        it('tfsuploaded', function () {
                            expect(attachment.attr('tfsuploaded')).toEqual('true');
                        });
                        it('title', function () {
                            expect(attachment.attr('title')).toEqual('שם קובץ: demo.jpg');
                        });
                        it('placeholder', function () {
                            expect(attachment.attr('placeholder')).toEqual('שם קובץ: demo.jpg');
                        });
                    });

                    it('readonly attribute equal to readonly', function () {
                        expect(coverInput.attr('readonly')).toEqual('readonly');
                    });

                    it('title according to action', function () {
                        viewModel.languageViewModel.language('hebrew');
                        expect(coverInput.attr('title')).toEqual('שם קובץ: demo.jpg');
                        expect(coverInput.attr('_title')).toEqual('בחר קובץ');
                    });

                    it('title according to language', function () {
                        viewModel.languageViewModel.language('english');
                        expect(coverInput.attr('title')).toEqual('file name:demo.jpg');
                    });
                });

                describe('empty attachment', function () {

                    var attachment, coverInput;

                    beforeEach(function () {
                        viewModel.languageViewModel.language('hebrew');
                        attachment = $('#attachmentsTable input[tfsdatatype="attachment"]').eq(1); //(3);
                        coverInput = $(attachment).closest('.attachment-wrapper').find('.attachment');
                    });
                    describe('element attributes', function () {
                        it('tfsuploaded', function () {
                            expect(attachment.attr('tfsuploaded')).toEqual('false');
                        });
                        it('title', function () {

                            expect(attachment.attr('title')).toEqual('בחר קובץ');
                        });
                        it('placeholder', function () {
                            expect(attachment.attr('placeholder')).toEqual('בחר קובץ');
                        });
                    });

                    it('tfsaction attribute equal to "addAttachment"', function () {
                        expect(attachment.attr('tfsaction')).toEqual('addAttachment');
                    });

                    it('readonly attribute equal to undefined', function () {
                        expect(coverInput.attr('readonly')).toBeUndefined();
                    });

                    it('title according to action', function () {
                        expect(coverInput.attr('title')).toEqual('בחר קובץ');
                    });

                    it('title according to language', function () {

                        viewModel.languageViewModel.language('english');
                        expect(coverInput.attr('title')).toEqual('select file');
                    });
                });

                describe('null attachment', function () {

                    var attachment, coverInput;

                    beforeEach(function () {
                        viewModel.languageViewModel.language('hebrew');
                        attachment = $('#attachmentsTable input[tfsdatatype="attachment"]').eq(2); //(6);
                        coverInput = $(attachment).closest('.attachment-wrapper').find('.attachment');
                    });

                    it('tfsuploaded attribute equal to false', function () {
                        expect(attachment.attr('tfsuploaded')).toEqual('false');
                    });

                    it('tfsaction attribute equal to "addAttachment"', function () {
                        expect(attachment.attr('tfsaction')).toEqual('addAttachment');
                    });

                    it('readonly attribute equal to undefined', function () {
                        expect(coverInput.attr('readonly')).toBeUndefined();
                    });

                    it('title according to action', function () {
                        expect(coverInput.attr('title')).toEqual('בחר קובץ');
                    });

                    it('title according to language', function () {

                        viewModel.languageViewModel.language('english');
                        expect(coverInput.attr('title')).toEqual('select file');
                    });
                });
            });

            describe('same attachments attribute - init function', function () {

                describe('same attachments in table', function () {
                    it('backup of the unique namesd array on the table element', function () {
                        expect($('#sameAttachmentsTable').data('backUpNewfilename')).toEqual(['', 'demo (1).jpg']);
                    });
                    it('the unique name should be deleted from the original unique names array', function () {
                        expect($('#sameAttachmentsTable').data('newfilenames')).toEqual(['', '']);
                    });

                    describe('value accessor is updated with the unique value', function () {
                        it('first attachment', function () {
                            expect(viewModel.sameAttachmentsViewModel.sameAttachmentsList()[0].fileName()).toEqual('demo.jpg');
                        });

                        it('second attachment - chaining number to the attachment name', function () {
                            expect(viewModel.sameAttachmentsViewModel.sameAttachmentsList()[1].fileName()).toEqual('demo (1).jpg');
                        });
                    });
                });

                describe('size', function () {
                    it('backup of the sizes array on the table element', function () {
                        expect($('#sameAttachmentsTable').data('backUpFsize')).toEqual(['123', '456']);
                    });
                    it('the size should be deleted from the original sizes array', function () {
                        expect($('#sameAttachmentsTable').data('fsizes')).toEqual(['', '']);
                    });
                });

                describe('different attachments in table', function () {
                    it('first attachment', function () {
                        expect(viewModel.sameAttachmentsViewModel.differentAttachmentsList()[0].fileName()).toEqual('demo.jpg');
                    });

                    it('second attachment', function () {
                        expect(viewModel.sameAttachmentsViewModel.differentAttachmentsList()[1].fileName()).toEqual('differentDemo.jpg');
                    });

                    it('third attachment - was and stay empty', function () {
                        expect(viewModel.sameAttachmentsViewModel.differentAttachmentsList()[2].fileName()).toEqual('');
                    });
                });

                describe('same attachments in form', function () {
                    it(' backup of the unique namesd in the element', function () {
                        expect($('#attachmentWithAttribute').data('backUpNewfilename')).toEqual('demo (1).jpg');
                    });
                    it('add filename', function () {
                        expect($('#attachmentWithAttribute').data('newfilename')).toEqual('');
                    });
                    it('backup of the size in the element', function () {
                        expect($('#attachmentWithAttribute').data('backUpFsize')).toEqual('123');
                    });
                    it('add file size', function () {
                        expect($('#attachmentWithAttribute').data('fsize')).toEqual('');
                    });
                    it('value accessor is updated with the unique value', function () {
                        expect(viewModel.sameAttachmentsViewModel.attachment.fileName()).toEqual('demo (1).jpg');
                    });
                });

                describe('add data-fsize', function () {
                    it('in table', function () {
                        expect($('#sameAttachmentsTable').find('#attach').eq(0).attr('data-fsize')).toEqual('123');
                    });
                    it('not in table', function () {
                        expect($('#attachmentWithAttribute').eq(0).attr('data-fsize')).toEqual('123');
                    });
                });
            });

            describe('invalid value accessor - update function', function () {
                it('value as string', function () {
                    var attachmentBinding = { tlpAttachment: viewModel.sameAttachmentsViewModel.attachment.fileName(), value: viewModel.sameAttachmentsViewModel.attachment.fileName };
                    var notFound = -1;
                    try {
                        ko.applyBindingsToNode($('#invalidValueAccessor').get(0), attachmentBinding);
                    } catch (e) {
                        expect(e.message.indexOf('the parameter "valueAccessor" must be of ko.observable type') > notFound).toBeTruthy();
                    }
                });
            });

            describe('mobile', function () {
                var attachmentBinding;
                beforeEach(function () {
                    attachmentBinding = { tlpAttachment: viewModel.sameAttachmentsViewModel.attachment.fileName, value: viewModel.sameAttachmentsViewModel.attachment.fileName };
                    spyOn(tfsMethods, 'isMobile').and.callFake(function () {
                        return true;
                    });
                    spyOn(attachmentMethods, 'getExtensions').and.callFake(function (element) {
                        return $(element).attr('tfsextensions');
                    });
                    ko.applyBindingsToNode($('#attachmentForMobile').get(0), attachmentBinding);
                });
                it('tfsmaxfilesize', function () {
                    expect($('#attachmentForMobile').attr('tfsmaxfilesize')).toEqual('5120');
                });
                it('tfsextensions with tfsextensions on element', function () {
                    expect($('#attachmentForMobile').attr('tfsextensions')).toEqual('*.jpg');
                });
                it('tfsextensions without tfsextensions on element', function () {
                    ko.applyBindingsToNode($('#attachmentWithOutTfsextensions').get(0), attachmentBinding);
                    expect($('#attachmentWithOutTfsextensions').attr('tfsextensions')).toEqual(undefined);
                });
            });

            describe('accessibility attributes', function () {
                beforeEach(function () {
                    attachment = $('#attachmentWithAttribute').eq(0);
                    label = attachmentMethods.getLabelElement(attachment);
                    link = attachmentMethods.getLinkElement(attachment);
                });
                it('label should have id with suffix lbl', function () {
                    expect(label.id).toEqual(attachment.get(0).id + '_lbl');
                });
                it('a element should have attribute aria-labelledby with value of label.id', function () {
                    expect(link).toHaveAttr('aria-labelledby', label.id);
                });
                it('attribute data-tofocus equal to true', function () {
                    expect(link.attr('data-tofocus')).toEqual('true');
                });
            });
        });

        describe('tlpEnableAttachment', function () {

            beforeAll(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
                loadFixtures('attachment.html');
            });
            it('enable attachment by const', function () {
                var attachment = $('#enabledAttachmentByConst');
                var wrapperInput = attachment.closest('.' + infrastructureEnums.classes.attachmentWrapper);
                expect(attachment.attr('disabled')).toBeUndefined();
                expect(wrapperInput.attr('disabled')).toBeUndefined();
            });
            it('enable attachment by observable', function () {
                var attachment = $('#enabledAttachment');
                var wrapperInput = attachment.closest('.' + infrastructureEnums.classes.attachmentWrapper);
                expect(attachment.attr('disabled')).toBeUndefined();
                expect(wrapperInput.attr('disabled')).toBeUndefined();
            });
            it('disable attachment by observable', function () {
                var attachment = $('#disabledAttachment');
                var wrapperInput = attachment.closest('.' + infrastructureEnums.classes.attachmentWrapper);
                expect(attachment.attr('disabled')).toEqual('disabled');
                expect(wrapperInput.attr('disabled')).toEqual('disabled');
            });
            it('disable attachment by function that returns "false"', function () {
                var attachment = $('#disableAttachmentByFunction');
                var wrapperInput = attachment.closest('.' + infrastructureEnums.classes.attachmentWrapper);
                expect(attachment.attr('disabled')).toEqual('disabled');
                expect(wrapperInput.attr('disabled')).toEqual('disabled');
            });
            it('disable attachment by function that return undefined', function () {
                var attachment = $('#disableAttachmentByUndefined');
                var wrapperInput = attachment.closest('.' + infrastructureEnums.classes.attachmentWrapper);
                expect(wrapperInput.attr('disabled')).toEqual('disabled');
                expect(attachment.attr('disabled')).toEqual('disabled');
            });
        });
    });
});
define('spec/tlpAttachmentSpec.js', function () {});