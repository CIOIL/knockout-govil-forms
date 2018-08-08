define(['common/components/fileUpload/FileViewModel'
    , 'common/components/dialog/dialog'
    , 'common/components/fileUpload/bindingHandlers'
],
    function (File, dialog) {

        var viewModel = void 0,
            inputFile = void 0;

        describe('file upload binding handlers', function () {

            beforeEach(function () {
                viewModel = {
                    myFile: new File()
                };
                spyOn(dialog, 'alert');
                spyOn(viewModel.myFile, 'uploadFile').and.callFake(() => { return; });
                spyOn(viewModel.myFile, 'displayFile');
                jasmine.getFixtures().fixturesPath = 'base/Tests/components/fileUpload/templates';
                loadFixtures('fileUpload.html');
                ko.cleanNode(document.body);
                ko.applyBindings(viewModel);
                inputFile = $('input');

            });

            describe('fileValue init', function () {
                it('should be defined', function () {
                    expect(ko.bindingHandlers.fileValue.init).toBeDefined();
                });

                it('should apply click event', function () {
                    expect($._data(inputFile.get(0), 'events').click).toBeDefined();
                });

                it('should apply change event', function () {
                    expect($._data(inputFile.get(0), 'events').change).toBeDefined();
                });

                describe('event change', function () {

                    describe('valid input', function () {
                        beforeEach(function () {
                            spyOn($.fn, 'get').and.callFake(() => { return { files: [{ name: 'myFile.jpg', size: 263856, type: 'image/jpeg' }] }; });
                        });
                        it('should be mapped to valueAccessor', function () {
                            const size = 263856;
                            inputFile.trigger('change');
                            expect(viewModel.myFile.name()).toEqual('myFile.jpg');
                            expect(viewModel.myFile.size()).toEqual(size);
                            expect(viewModel.myFile.type()).toEqual('image/jpeg');
                            expect(viewModel.myFile.fileContent).toBeDefined();
                        });
                        it('should be invoke uploadFile', function () {
                            inputFile.trigger('change');
                            expect(viewModel.myFile.uploadFile).toHaveBeenCalled();
                        });
                    });
                    describe('invalid input', function () {
                        beforeEach(function () {
                            spyOn($.fn, 'get').and.callFake(() => { return { files: [{ name: 'myFile.sln', size: 263856, type: 'image/jpeg' }] }; });
                        });
                        it('should alert validation message', function () {
                            inputFile.trigger('change');
                            expect(dialog.alert).toHaveBeenCalledWith({ message: 'סוג הקובץ לא מורשה' });
                        });                        
                        it('should not map to valueAccessor', function () {
                            inputFile.trigger('change');
                            expect(viewModel.myFile.name()).toEqual('');
                            expect(viewModel.myFile.size()).toBeUndefined();
                            expect(viewModel.myFile.type()).toBeUndefined();
                            // expect(viewModel.myFile.content).toBeDefined();
                        });
                        it('should not invoke uploadFile', function () {
                            inputFile.trigger('change');
                            expect(viewModel.myFile.uploadFile).not.toHaveBeenCalled();
                        });
                    });
                    //TODO: create spec to validationRules, and move this
                    describe('empty file size', function () {
                        it('should alert validation message', function () {
                            spyOn($.fn, 'get').and.callFake(() => { return { files: [{ name: 'myFile.jpg', size: 0, type: 'image/jpeg' }] }; });
                            inputFile.trigger('change');
                            expect(dialog.alert).toHaveBeenCalledWith({ message: 'הקובץ שהוסף אינו תקין' });
                        });
                    });

                    describe('file empty', function () {
                        beforeEach(function () {
                            spyOn($.fn, 'get').and.callFake(() => { return { files: [] }; });
                        });

                        it('should not map to valueAccessor', function () {
                            inputFile.trigger('change');
                            expect(viewModel.myFile.name()).toEqual('');
                            expect(viewModel.myFile.size()).toBeUndefined();
                            expect(viewModel.myFile.type()).toBeUndefined();
                            // expect(viewModel.myFile.content).toBeDefined();
                        });
                        it('should not invoke uploadFile', function () {
                            inputFile.trigger('change');
                            expect(viewModel.myFile.uploadFile).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('event click', function () {
                    it('when file is uploaded should navigate to displayFile', function () {
                        viewModel.myFile.id('some-id');
                        inputFile.trigger('click');
                        expect(viewModel.myFile.displayFile).toHaveBeenCalled();
                    });
                });
            });

            describe('fileValue update', function () {
                it('should be defined', function () {
                    expect(ko.bindingHandlers.fileValue.update).toBeDefined();
                });
                it('should clear DOM element if file had been deleted', function () {
                    const size=222222;
                    spyOn($.fn, 'val');
                    viewModel.myFile.name('myFile.jpg');
                    viewModel.myFile.size(size);
                    viewModel.myFile.type('image/jpeg');
                    viewModel.myFile.name('');
                    viewModel.myFile.size('');
                    expect(inputFile.val).toHaveBeenCalledWith('');
                });
            });
        });
    });