define(['common/components/fileUpload/FileViewModel'
    , 'common/external/q'
    , 'common/networking/ajax'
    , 'common/components/fileUpload/filesManager'
    , 'common/components/dialog/dialog'
    , 'common/components/formInformation/formInformationViewModel'
    , 'common/resources/endpointsUrl'
    , 'common/resources/texts/indicators'
    , 'common/utilities/resourceFetcher'

],
    function (File, Q, ajax, filesManager, dialog, formInformation, endpointsUrl, indicatorsTexts, resourceFetcher) {//eslint-disable-line max-params
        describe('', function () {
            let myFile, size = 754125;
            let d = Q.defer();
            const mockResolver = function () {
                d.resolve({ statusCode: 0, fileID: 'id1234' });
                return d.promise;
            };

            it('tobe defined', function () {
                expect(File).toBeDefined();
                expect(typeof File).toEqual('function');
            });

            describe('properties exist on instance', function () {

                beforeEach(function () {
                    myFile = new File();
                    myFile.name('myFile.txt');
                    myFile.size(size);
                });

                it('properties should be defined in the model', function () {
                    expect(myFile.getModel().name).toBeDefined();
                    expect(myFile.getModel().type).toBeDefined();
                    expect(myFile.getModel().size).toBeDefined();
                    expect(myFile.getModel().id).toBeDefined();
                });

                it('state', function () {
                    expect(myFile.state).toBeDefined();
                    expect(myFile.state()).toEqual('notSet');
                });
                it('isNotSet', function () {
                    expect(myFile.isNotSet).toBeDefined();
                    myFile.state('notSet');
                    expect(myFile.isNotSet()).toBeTruthy();
                });
                it('isCompleted', function () {
                    expect(myFile.isCompleted).toBeDefined();
                    myFile.id('someID');
                    expect(myFile.isCompleted()).toBeTruthy();
                });
                it('isFailed', function () {
                    expect(myFile.isFailed).toBeDefined();
                    myFile.state('failed');
                    expect(myFile.isFailed()).toBeTruthy();
                });
                it('isPending', function () {
                    expect(myFile.isPending).toBeDefined();
                    myFile.state('pending');
                    expect(myFile.isPending()).toBeTruthy();
                });
                it('progress', function () {
                    expect(myFile.progress).toBeDefined();
                    expect(myFile.progress()).toEqual(0);
                });
            });

            describe('uploadFile', function () {
                beforeEach(function () {
                    d = Q.defer();
                });

                it('should be defined', function () {
                    expect(myFile.uploadFile).toBeDefined();
                });

                it('should set state to pending', function () {
                    spyOn(ajax, 'request').and.callFake(mockResolver);
                    myFile.uploadFile();
                    expect(myFile.state()).toEqual('pending');
                });
                it('progress is updated', function (done) {
                    spyOn(ajax, 'request').and.callFake(mockResolver);
                    spyOn(Math, 'floor').and.callThrough();
                    myFile.uploadFile();
                    setTimeout(function () {
                        expect(Math.floor).toHaveBeenCalled();
                        done();
                    }, 1);

                });
                it('in the end - progress updated to 100', function (done) {
                    spyOn(ajax, 'request').and.callFake(mockResolver);
                    myFile.uploadFile();
                    setTimeout(function () {
                        expect(myFile.progress()).toEqual(100);//eslint-disable-line no-magic-numbers
                        done();
                    }, 1);

                });
                
                it('should perform request with ', function () {
                    spyOn(ajax, 'request').and.callFake(mockResolver);
                    myFile.uploadFile();
                    const data = new FormData();
                    data.append('file', {});
                    data.append('fileUpload', {});
                    expect(ajax.request).toHaveBeenCalledWith({
                        xhr: jasmine.any(Function),
                        data: data,
                        url: endpointsUrl.file,
                        method: 'POST',
                        contentType: false,
                        processData: false,
                        dataType: 'json'
                    });
                });
                it('should add file to UplaodFiles list', function () {
                    spyOn(ajax, 'request').and.callFake(mockResolver);
                    spyOn(filesManager, 'addFile');
                    myFile.uploadFile();
                    expect(filesManager.addFile).toHaveBeenCalledWith(myFile);
                });

                describe('success request', function () {
                    beforeEach(function () {
                        myFile = new File();
                        spyOn(ajax, 'request').and.callFake(mockResolver);
                    });
                    it('should populate file id', function (done) {
                        myFile.uploadFile();
                        d.promise.done(() => {
                            expect(myFile.id()).toEqual('id1234');
                            done();
                        });
                    });
                    it('should update state to completed', function (done) {
                        myFile.uploadFile();
                        d.promise.then(() => {
                            expect(myFile.state()).toEqual('completed');
                            done();
                        });
                    });
                    it('should register file to fileList', function (done) {
                        spyOn(filesManager, 'registerCompletedFile');
                        myFile.uploadFile();
                        d.promise.then(() => {
                            expect(filesManager.registerCompletedFile).toHaveBeenCalledWith(myFile);
                            done();
                        });                        
                    });

                });

                describe('failed request', function () {
                    beforeEach(function () {  
                        spyOn(dialog, 'alert');
                        spyOn(ajax, 'request').and.callFake(() => {
                            d.resolve({ statusCode: 200, responseMessages: { he: 'שגיאה' } });
                            return d.promise;
                        });
                    });
                    it('should alert error message', function (done) {
                        myFile.uploadFile();
                        d.promise.done(() => {
                            expect(dialog.alert).toHaveBeenCalledWith({ message: 'שגיאה' });
                            done();
                        });
                    });

                    it('should reset file', function (done) {
                        myFile.uploadFile();
                        d.promise.done(() => {
                            expect(myFile.name()).toBeUndefined();
                            expect(myFile.size()).toBeUndefined();
                            expect(myFile.type()).toBeUndefined();
                            expect(myFile.fileContent).toBeUndefined();
                            expect(myFile.state()).toEqual('notSet');
                            done();
                        });
                    });
                });

                describe('exception on request', function () {                    
                    beforeEach(function () {                        
                        spyOn(dialog, 'alert');
                        d = Q.defer();
                        spyOn(ajax, 'request').and.callFake(() => {
                            d.reject('reject');
                            return d.promise;
                        });
                    });
                    it('should alert default error message', function (done) {                        
                        myFile.uploadFile();
                        setTimeout(function () {
                            expect(dialog.alert).toHaveBeenCalledWith({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });
                            done();
                        }, 10);
                    });

                    it('should reset file', function (done) {
                        myFile.uploadFile();
                        setTimeout(function () {
                            expect(myFile.name()).toBeUndefined();
                            expect(myFile.size()).toBeUndefined();
                            expect(myFile.type()).toBeUndefined();
                            expect(myFile.fileContent).toBeUndefined();
                            expect(myFile.state()).toEqual('notSet');
                            done();
                        }, 10);
                    });
                });

            });
            describe('removeFile', function () {
                beforeEach(function () {
                    d = Q.defer();
                    myFile = new File();
                    myFile.name('myFile.txt');
                    myFile.size(size);
                    myFile.state('completed');
                });

                it('should be defined', function () {
                    expect(myFile.removeFile).toBeDefined();
                });

                it('should not reset file if remove is not active', function () {
                    spyOn(myFile, 'isRemoveActive').and.callFake(() => false);
                    myFile.removeFile(this);
                    expect(myFile.name()).toBeDefined();
                });

                it('on success should reset file', function () {
                    spyOn(myFile, 'isRemoveActive').and.callFake(() => true);
                    myFile.removeFile(this);
                    expect(myFile.name()).toBeUndefined();
                    expect(myFile.size()).toBeUndefined();
                    expect(myFile.type()).toBeUndefined();
                    expect(myFile.fileContent).toBeUndefined();
                    expect(myFile.state()).toEqual('notSet');
                });
                it('on success should remove file from filesManagerList', function () {
                    spyOn(myFile, 'isRemoveActive').and.callFake(() => true);
                    spyOn(filesManager, 'removeFile');
                    myFile.removeFile(this);
                    expect(filesManager.removeFile).toHaveBeenCalledWith(myFile);
                });
            });
            describe('displayFile', function () {
                it('', function () {
                    spyOn(window, 'open').and.callFake(() => true);
                    myFile.displayFile(this);
                    expect(window.open).toHaveBeenCalledWith(`${endpointsUrl.file}/${myFile.id()}/${formInformation.formParams.process.formUniqueID}/FilePreview`);
                });
            });

        });

    });