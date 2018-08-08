define(['common/viewModels/ModularViewModel',
    'common/components/fileUpload/FileViewModel',
    'common/components/formInformation/formInformationViewModel',
    'common/resources/govFormsPages',
    'common/utilities/functionalPatterns'
],
    (ModularViewModel, File, formInformation, govFormsPagesEnum, functionalPatterns) => {//eslint-disable-line max-params

        const populateFileInfo = (file, fileAccessor) => {
            fileAccessor.name(file.name);
            fileAccessor.size(file.size);
            fileAccessor.type(file.type);
            fileAccessor.fileContent = file;
        };

        var createViewModel = functionalPatterns.once(function createViewModel() {

            const model = {
                attachedFiles: ko.observableArray()
            };

            var attachFilesViewModel = new ModularViewModel(model);


            attachFilesViewModel.uploadSelectedFiles = (selectedFiles) => {
                [].forEach.call(selectedFiles, (selectedFile) => {
                    var file = new File();//map data via ctor or function
                    populateFileInfo(selectedFile, file);
                    attachFilesViewModel.attachedFiles.push(file);
                    file.uploadFile();
                });
            };

            return attachFilesViewModel;
        });
        return createViewModel;
    });