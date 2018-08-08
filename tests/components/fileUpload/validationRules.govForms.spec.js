define([
    'common/core/generalAttributes',
    'common/components/fileUpload/filesManager',
    'common/utilities/stringExtension',
    'common/components/fileUpload/validationRules',
    'common/resources/texts/attachment',
    'common/components/fileUpload/utilities',
    'common/ko/validate/extensionRules/attachment',
    'common/ko/globals/multiLanguageObservable'],

    function (generalAttributes,filesManager, stringExtension, validationRules) {//eslint-disable-line max-params

        describe('validate', function () {
            const nameRules = validationRules.name;
            const sizeRules = validationRules.size;
            describe('extensionRules', function () {
                describe('file type', function () {

                    it('to be defined', function () {
                        expect(nameRules).toBeDefined();
                        expect(nameRules.fileType.validator).toBeDefined();
                        expect(nameRules.fileType.message).toBeDefined();
                    });

                    it('value undefined, null or empty should return true', function () {
                        expect(nameRules.fileType.validator()).toBeTruthy();
                        expect(nameRules.fileType.validator(null)).toBeTruthy();
                        expect(nameRules.fileType.validator('')).toBeTruthy();
                    });
                    it('invalid inline extension should throw', function () {
                        expect(() => { nameRules.fileType.validator('pomegranateLeaf.jpg', ['exe']); }).toThrowError('this extension is not allowed according to the white list of extensions');
                    });
                    it('restriction should be taken from inline if sent', function () {
                        expect(nameRules.fileType.validator('pomegranateLeaf.jpg', ['jpg', 'xls'])).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.xls', ['jpg', 'xls'])).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.png', ['jpg', 'xls'])).toBeFalsy();
                    });
                    it('restriction should be taken from formConfiguration', function () {
                        generalAttributes.store('attachments', { attachmentsValidTypes: ['docx'] });
                        expect(nameRules.fileType.validator('pomegranateLeaf.docx')).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.xls')).toBeFalsy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.png')).toBeFalsy();
                    });
                    it('restriction should be taken from white list', function () {
                        generalAttributes.store('attachments', { attachmentsValidTypes: [] });
                        expect(nameRules.fileType.validator('pomegranateLeaf.docx')).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.xls')).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.png')).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.sln')).toBeFalsy();
                    });
                    it('extesion should not be case sensitive', function () {
                        expect(nameRules.fileType.validator('pomegranateLeaf.docx')).toBeTruthy();
                        expect(nameRules.fileType.validator('pomegranateLeaf.DOCX')).toBeTruthy();
                    });
                });

                describe('file name', function () {
                    it('to be defined', function () {
                        expect(nameRules.fileName).toBeDefined();
                        expect(nameRules.fileName.validator).toBeDefined();
                        expect(nameRules.fileName.message).toBeDefined();
                    });

                    it('value undefined, null or empty should return true', function () {
                        expect(nameRules.fileName.validator()).toBeTruthy();
                        expect(nameRules.fileName.validator(null)).toBeTruthy();
                        expect(nameRules.fileName.validator('')).toBeTruthy();
                    });

                    it('restriction should be taken from inline if sent', function () {
                        expect(nameRules.fileName.validator('pomegranateLeaf.jpg', /^([^0-9]*)$/)).toBeTruthy();
                        expect(nameRules.fileName.validator('pomegranateLeaf92.xls', /^([^0-9]*)$/)).toBeFalsy();
                    });
                    it('restriction should be taken from formConfiguration', function () {
                        generalAttributes.store('attachments', { attachmentNamePattern: /^([^א-ת]*)$/ });
                        expect(nameRules.fileName.validator('dddd.docx')).toBeTruthy();
                        expect(nameRules.fileName.validator('34ddd.xsl')).toBeTruthy();
                        expect(nameRules.fileName.validator('עברית.png')).toBeFalsy();
                    });
                    it('restriction should be taken from resources', function () {
                        generalAttributes.store('attachments', {});
                        expect(nameRules.fileName.validator('dddd.docx')).toBeTruthy();
                        expect(nameRules.fileName.validator('34ddd.xsl')).toBeTruthy();
                        expect(nameRules.fileName.validator('עברית.png')).toBeTruthy();
                        expect(nameRules.fileName.validator('pomegranate?Leaf.png')).toBeFalsy();
                    });
                });
                describe('file size', function () {
                    /*eslint-disable no-magic-numbers*/

                    it('to be defined', function () {
                        expect(sizeRules.fileSize).toBeDefined();
                        expect(sizeRules.fileSize.validator).toBeDefined();
                        expect(sizeRules.fileSize.message).toBeDefined();
                    });

                    it('value undefined, null or empty should return true', function () {
                        expect(sizeRules.fileSize.validator()).toBeTruthy();
                        expect(sizeRules.fileSize.validator(null)).toBeTruthy();
                        expect(sizeRules.fileSize.validator('')).toBeTruthy();
                    });

                    it('restriction should be taken from inline if sent', function () {
                        expect(sizeRules.fileSize.validator(2252.8, 3)).toBeTruthy();
                        expect(sizeRules.fileSize.validator(3072, 3)).toBeTruthy();
                        expect(sizeRules.fileSize.validator('2048', 3)).toBeTruthy();
                        expect(sizeRules.fileSize.validator(3145729, 3)).toBeFalsy();
                    });

                    it('should return true if inline restriction not sent', function () {
                        expect(sizeRules.fileSize.validator(5120)).toBeTruthy();
                    });

                    describe('message', () => {
                        it('should return specific message if specific limit sent', () => {
                            expect(sizeRules.fileSize.message(3)).toEqual('קובץ זה חורג מגודל הקובץ המותר עבורו עד 3 MB');
                        });
                    });
                });

                describe('empty file', function () {

                    it('to be defined', function () {
                        expect(sizeRules.emptyFile).toBeDefined();
                        expect(sizeRules.emptyFile.validator).toBeDefined();
                        expect(sizeRules.emptyFile.message).toBeDefined();
                    });

                    it('value undefined, null, empty or 0 should return false', function () {
                        expect(sizeRules.emptyFile.validator()).toBeFalsy();
                        expect(sizeRules.emptyFile.validator(null)).toBeFalsy();
                        expect(sizeRules.emptyFile.validator('')).toBeFalsy();
                        expect(sizeRules.emptyFile.validator(0)).toBeFalsy();
                    });

                    it('all others value should return true', function () {
                        expect(sizeRules.emptyFile.validator(1)).toBeTruthy();
                        expect(sizeRules.emptyFile.validator('1')).toBeTruthy();
                    });
                });
            });
        });
    });