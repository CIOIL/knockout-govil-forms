/*globals AgatAttachment*/
define(['common/elements/attachmentMethods'], function (attachmentMethods) {
    describe('attachment methods', function () {

        var undefinedElementTitle = 'the parameter "element" is undefined';
        var invalidTypeTitle = 'the parameter "element" must be of attachment type';
        var notFound = -1;
        var attachment, attachment1, regularInput, attachmentInTable, attachmentsTable;
        beforeAll(function () {
            window.AgatAttachment = undefined;
            window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['dataAttributes']);
            window.AgatAttachment.dataAttributes = jasmine.createSpyObj('AgatAttachment.dataAttributes', ['filename', 'fileSizeAttr']);
            window.AgatAttachment.dataAttributes.filename.elementAttribute = 'newfilename';
            window.AgatAttachment.dataAttributes.filename.dynamictable = 'newfilenames';
            window.AgatAttachment.dataAttributes.fileSizeAttr.dynamictable = 'fsizes';
            window.AgatAttachment.dataAttributes.fileSizeAttr.elementAttribute = 'fsize';
            jasmine.getFixtures().fixturesPath = 'base/Tests/elements/templates';
            loadFixtures('attachmentMethods.html');
            attachment = $('#attachment');
            attachment1 = $('#attachment1');
            regularInput = $('#regularInput');
            attachmentInTable = $('#attachmentInTable');
            attachmentsTable = $('#attachmentsTable');
        });

        describe('getWrapperElement function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getWrapperElement).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getWrapperElement(attachment).attr('class')).toBe('attachment-wrapper');
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getWrapperElement(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getWrapperElement(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('getCoverElement function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getCoverElement).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getCoverElement(attachment).attr('class')).toBe('attachment');
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getCoverElement(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getCoverElement(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('isAttachment function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.isAttachment).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.isAttachment(attachment)).toBeTruthy();
            });
            it('call with not a attachment element', function () {
                expect(attachmentMethods.isAttachment(regularInput)).toBeFalsy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.isAttachment(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
        });

        describe('isAttachmentInTable function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.isAttachmentInTable).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.isAttachmentInTable(attachment)).toBeFalsy();
            });
            it('call with valid attachment in table element', function () {
                expect(attachmentMethods.isAttachmentInTable(attachmentInTable)).toBeTruthy();
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.isAttachmentInTable(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.isAttachmentInTable(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
        });

        describe('getAttachmentIndexInTable function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getAttachmentIndexInTable).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getAttachmentIndexInTable(attachment)).toEqual(notFound);
            });
            it('call with valid attachment in table element', function () {
                expect(attachmentMethods.getAttachmentIndexInTable(attachmentInTable)).toBe(0);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getAttachmentIndexInTable(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getAttachmentIndexInTable(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
        });

        describe('getAttachmentsUniqueNames function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getAttachmentsUniqueNames).toBeDefined();
            });
            it('valid data', function () {
                attachmentsTable.data('newfilenames', ['attachment1', 'attachment2']);
                var uniqueNames = attachmentMethods.getAttachmentsUniqueNames(attachmentsTable, true);
                expect(uniqueNames).toEqual(['attachment1', 'attachment2']);
                attachmentsTable.removeData('newfilenames');
            });

            it('invalid data', function () {
                var uniqueNames = attachmentMethods.getAttachmentsUniqueNames(attachmentsTable, true);
                expect(uniqueNames).toEqual([]);
            });

            it('invalid data - not a table', function () {
                expect(function () {
                    attachmentMethods.getAttachmentsUniqueNames(attachment, true);
                }).toThrowError('the parameter "element" must be of table of attachments element type');
            });

            it('undefined element parameter - call with unexisting element', function () {
                var tableElement = $('#attachmentsTable1');
                expect(function () {
                    attachmentMethods.getAttachmentsUniqueNames(tableElement, true);
                }).toThrowError(undefinedElementTitle);
            });

            it('invalid "isTable" parameter', function () {
                attachmentsTable.data('newfilenames', ['attachment1', 'attachment2']);
                expect(function () {
                    attachmentMethods.getAttachmentsUniqueNames(attachmentsTable, 'vv');
                }).toThrowError(invalidTypeTitle);
                attachmentsTable.removeData('newfilenames');
            });

            it('valid data - attachment input', function () {
                attachment.data('newfilename', 'attachment1');
                var uniqueNames = attachmentMethods.getAttachmentsUniqueNames(attachment, false);
                expect(uniqueNames).toEqual('attachment1');
            });

            it('invalid "isTable" parameter - so isTable equals to false', function () {
                attachment.data('newfilename', 'attachment1');
                var uniqueNames = attachmentMethods.getAttachmentsUniqueNames(attachment, 'vv');
                expect(uniqueNames).toEqual('attachment1');
                $('#attachment').removeData('newfilename');
            });

            it('valid data - attachment input', function () {
                attachment.data('newfilename', 'attachment1');
                expect(function () {
                    attachmentMethods.getAttachmentsUniqueNames(attachmentsTable, false);
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('getFileSizeAttr function', function () {
            beforeEach(function () {
                attachment.data('fsize', '123');
                attachmentsTable.data('fsizes', ['123', '456', '789']);
            });
            it('to be defined', function () {
                expect(attachmentMethods.getFileSizeAttr).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getFileSizeAttr(attachment, false)).toBe('123');
            });
            it('call with valid attachment table', function () {
                expect(attachmentMethods.getFileSizeAttr(attachmentsTable, true)).toEqual(['123', '456', '789']);
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getFileSizeAttr(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(attachmentMethods.getFileSizeAttr(regularInput)).not.toBeDefined();
            });
        });

        describe('getClosestTable function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getClosestTable).toBeDefined();
            });
            it('call with valid attachment in table', function () {
                var tableOfAttachmentInTable = attachmentMethods.getClosestTable(attachmentInTable);
                expect(tableOfAttachmentInTable.attr('id')).toEqual('tableOfAttachmentInTable');
            });
            it('call with valid attachment not in table', function () {
                var tableOfAttachmentInTable = attachmentMethods.getClosestTable(attachment);
                expect(tableOfAttachmentInTable.attr('id')).not.toBeDefined();
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getClosestTable(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getClosestTable(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('getExtensions function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getExtensions).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getExtensions(attachment)).toBe('*.gif;*.bmp');
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getExtensions(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getExtensions(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('hasImgTFSAction function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.hasImgTFSAction).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.hasImgTFSAction(attachment)).toBeTruthy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.hasImgTFSAction(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.hasImgTFSAction(regularInput);
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('getImg function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getImg).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getImg(attachment).is('img')).toBeTruthy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getImg(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getImg(regularInput).is('img');
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('getLabelElement function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getLabelElement).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect($(attachmentMethods.getLabelElement(attachment)).is('label')).toBeTruthy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    $(attachmentMethods.getLabelElement(attachment1));
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    $(attachmentMethods.getLabelElement(regularInput)).is('label');
                }).toThrowError(invalidTypeTitle);
            });
        });

        describe('getLinkElement function', function () {
            it('to be defined', function () {
                expect(attachmentMethods.getLinkElement).toBeDefined();
            });
            it('call with valid attachment element', function () {
                expect(attachmentMethods.getLinkElement(attachment).is('a')).toBeTruthy();
            });
            it('call with undefined element', function () {
                expect(function () {
                    attachmentMethods.getLinkElement(attachment1);
                }).toThrowError(undefinedElementTitle);
            });
            it('call with not a attachment element', function () {
                expect(function () {
                    attachmentMethods.getLinkElement(regularInput).is('a');
                }).toThrowError(invalidTypeTitle);
            });
        });
    });
});
define('spec/attachmentMethodsSpec.js', function () {});