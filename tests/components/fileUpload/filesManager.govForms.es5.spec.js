define(['common/components/fileUpload/filesManager', 'common/components/fileUpload/FileViewModel', 'common/external/q', 'common/networking/ajax', 'common/core/generalAttributes'], function (filesManager, File, Q, ajax, generalAttributes) {
    //eslint-disable-line max-params
    describe('filesManager', function () {
        var fileA = new File(),
            fileB = new File(),
            d = Q.defer();
        var mockResolver = function mockResolver() {
            d.resolve({ statusCode: 0, fileID: '1234' });
            return d.promise;
        };
        beforeEach(function () {
            fileA = new File();
            fileB = new File();
            spyOn(fileA, 'isRemoveActive').and.callFake(function () {
                return true;
            });
            filesManager.attachedFilesInForm.removeAll();
        });

        describe('attachedFilesInForm', function () {
            beforeEach(function () {
                d = Q.defer();
                spyOn(ajax, 'request').and.callFake(mockResolver);
            });
            it('should be defined- observableArray that hold all completed upload files', function () {
                expect(filesManager.attachedFilesInForm).toBeDefined();
            });
            it('should hold all completed uploaded files', function (done) {
                fileA.uploadFile();
                fileB.uploadFile();
                d.promise.done(function () {
                    expect(filesManager.attachedFilesInForm().length).toEqual(2);
                    fileA.removeFile();
                    expect(filesManager.attachedFilesInForm().length).toEqual(1);
                    done();
                });
            });
        });

        describe('attachedFilesIds', function () {
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(mockResolver);
            });
            it('should be defined- array of attachedFilesInForm ids', function () {
                expect(filesManager.attachedFilesIds).toBeDefined();
            });
            it('should return array of ids', function (done) {
                fileA.uploadFile();
                fileB.uploadFile();
                d.promise.done(function () {
                    expect(filesManager.attachedFilesIds()).toEqual(['1234', '1234']);
                    done();
                });
            });
        });

        describe('registerCompletedFile', function () {
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(mockResolver);
            });
            it('should be defined', function () {
                expect(filesManager.registerCompletedFile).toBeDefined();
            });
            it('should add new file to attachedFilesInForm array', function () {
                filesManager.registerCompletedFile(fileA);
                expect(filesManager.attachedFilesInForm().length).toEqual(1);
            });
        });

        describe('removeFile', function () {
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(mockResolver);
            });
            it('should be defined', function () {
                expect(filesManager.removeFile).toBeDefined();
            });
            it('should remove file from attachedFilesInForm array', function () {
                fileA.uploadFile();
                filesManager.removeFile(fileA);
                expect(filesManager.attachedFilesInForm.length).toEqual(0);
            });
        });

        describe('addFile', function () {
            it('should be defined', function () {
                expect(filesManager.addFile).toBeDefined();
            });
        });

        describe('defaultSizeLimit', function () {
            it('should be defined', function () {
                var defaultSizeLimit = 60;
                expect(filesManager.defaultSizeLimit).toEqual(defaultSizeLimit);
            });
        });

        describe('totalAttachmentsSize', function () {
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(mockResolver);
            });
            it('should be defined', function () {
                expect(filesManager.totalAttachmentsSize).toBeDefined();
            });
            it('should hold sum of all files sizes', function (done) {
                var size = 1000,
                    totalSize = 2000;
                fileA.size(size);
                fileB.size(size);
                fileA.uploadFile();
                fileB.uploadFile();
                setTimeout(function () {
                    expect(filesManager.totalAttachmentsSize()).toEqual(totalSize);
                    fileA.removeFile();
                    expect(filesManager.totalAttachmentsSize()).toEqual(size);
                    done();
                }, 1);
            });
        });

        describe('attchmentsSizeStatus', function () {
            it('should be defined', function () {
                expect(filesManager.attchmentsSizeStatus).toBeDefined();
            });
        });

        describe('allUploadsCompleted', function () {
            beforeEach(function () {
                spyOn(ajax, 'request').and.callFake(mockResolver);
            });
            it('should be defined', function () {
                expect(filesManager.allUploadsCompleted).toBeDefined();
            });
            it('should hold upload process for all files', function (done) {
                fileA.uploadFile();
                fileB.uploadFile();
                setTimeout(function () {
                    filesManager.allUploadsCompleted().then(function () {
                        expect(fileA.uploadProgress.isFulfilled()).toBeTruthy();
                        expect(fileB.uploadProgress.isFulfilled()).toBeTruthy();
                        done();
                    });
                    done();
                }, 1);
            });
        });

        describe('getMaxAllowedSize', function () {
            it('should be defined', function () {
                expect(filesManager.getMaxAllowedSize).toBeDefined();
            });

            it('should return defaultSizeLimit if generalAttributes does not contains attachments', function () {
                spyOn(generalAttributes, 'get').and.returnValue('');
                expect(filesManager.getMaxAllowedSize()).toEqual(filesManager.defaultSizeLimit);
            });
            it('should return defaultSizeLimit if generalAttributes does not contains attchmentsMaxSize', function () {
                generalAttributes.store('attachments', {});
                expect(filesManager.getMaxAllowedSize()).toEqual(filesManager.defaultSizeLimit);
            });

            it('should return attchmentsMaxSize from generalAttributes', function () {
                generalAttributes.store('attachments', { 'attchmentsMaxSize': 10 });
                expect(filesManager.getMaxAllowedSize()).toEqual(10);
            });
        });

        describe('isMultiFiles', function () {
            it('should be defined', function () {
                expect(filesManager.isMultiFiles).toBeDefined();
            });

            it('should return false if generalAttributes does not contains attachments', function () {
                spyOn(generalAttributes, 'get').and.returnValue('');
                expect(filesManager.isMultiFiles()).toBeFalsy();
            });
            it('should return false if generalAttributes does not contains isMultiAttachments', function () {
                generalAttributes.store('attachments', {});
                expect(filesManager.isMultiFiles()).toBeFalsy();
            });

            it('should return false when isMultiAttachments = false', function () {
                generalAttributes.store('attachments', { 'isMultiAttachments': false });
                expect(filesManager.isMultiFiles()).toBeFalsy();
            });

            it('should return true when isMultiAttachments = true', function () {
                generalAttributes.store('attachments', { 'isMultiAttachments': true });
                expect(filesManager.isMultiFiles()).toBeTruthy();
            });
        });
    });
});