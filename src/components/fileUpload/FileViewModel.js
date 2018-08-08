define(['common/viewModels/ModularViewModel'
    , 'common/components/fileUpload/filesManager'
    , 'common/components/fileUpload/validationRules'
    , 'common/networking/ajax'
    , 'common/external/q'
    , 'common/components/fileUpload/utilities'
    , 'common/components/formInformation/formInformationViewModel'
    , 'common/core/MWResponse'
    , 'common/components/dialog/dialog'
    , 'common/core/generalAttributes'
    , 'common/resources/endpointsUrl'
    , 'common/resources/texts/indicators'
    , 'common/utilities/resourceFetcher'
    , 'common/ko/validate/extensionRules/attachment'
    , 'common/components/fileUpload/bindingHandlers'
    , 'common/ko/globals/multiLanguageObservable'
    , 'common/ko/utils/tlpReset'
    , 'common/ko/fn/defineType'

],
    function (ModularViewModel, filesManager, validationRules, ajax, Q, utilities, formInformation, MWResponse, dialog, generalAttributes, endpointsUrl, indicatorsTexts, resourceFetcher) {//eslint-disable-line max-params

        const defaultSettings = {
            isRequired: false,
            fileName: {},
            fileType: {},
            fileSize: {},
            emptyFile: {}
        };

        const _states = {
            pending: 'pending',
            completed: 'completed',
            failed: 'failed',
            notSet: 'notSet'
        };

        const _progress = {
            start: 0,
            towardsTheEnd: 91,
            end: 100
        };


        class File extends ModularViewModel {

            constructor(settings) {
                const _settings = Object.assign({}, defaultSettings, settings);
                super();
                const _model = {
                    name: ko.observable().extend({ required: _settings.isRequired }),
                    size: ko.observable().defineType('number').extend({ required: _settings.isRequired }),
                    type: ko.observable(),
                    id: ko.observable(),
                    state:ko.observable(_states.notSet)
                };

                this.setModel(_model);

                this.customRules = { name: [], size: [] };
                this.isCompleted = ko.computed(() => !!this.id());
                this.isCompleted.subscribe((newVal) => {
                    if(newVal){
                        filesManager.registerCompletedFile(this);
                        return;
                    }
                    filesManager.removeFile(this);
                });
                this.isFailed = ko.computed(() => this.state() === _states.failed);
                this.isPending = ko.computed(() => this.state() === _states.pending);
                this.isNotSet = ko.computed(() => this.state() === _states.notSet);
                this.fileContent;
                this.reason = ko.computed(() => this.name.error());
                this.progress = ko.observable(_progress.start);
                this.displaySize = ko.computed(() => {
                    if (this.isCompleted()) {
                        return utilities.bytesToSize(this.size());
                    }
                    return '';
                });

                this.isRemoveActive = ko.computed(() => this.isCompleted() && !formInformation.isFormSent());

                const _getFormData = () => {
                    var data = new FormData();
                    data.append('file', this.fileContent);
                    data.append('filePayload', JSON.stringify({
                        requestID: formInformation.formParams.process.requestID,
                        processID: formInformation.formParams.process.processID || null,
                        method: 'Post'
                    }));
                    return data;
                };
                const _xhr = () =>{
                    const progress = this.progress;
                    const xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = (e)=> {
                        if (e.lengthComputable) {
                            const p = Math.floor((e.loaded / e.total) * _progress.end);
                            if (p < _progress.towardsTheEnd) {
                                progress(p);
                            }
                        }
                    };
                    xhr.upload.onloadstart = function () {
                        progress(_progress.start);
                    };
                    return xhr;
                };

                const uploadFileCallback = (response) => {
                    _model.id(response.fileID);
                    this.state(_states.completed);
                };

                const resetAttachment = (silentReset = true) => {
                    ko.utils.tlpReset.resetModel(this.getModel(), [], silentReset);
                    this.fileContent = undefined;
                    this.state(_states.notSet);
                };

                this.reset = () => {
                    resetAttachment();
                };

                this.uploadFile = function () {

                    this.state(_states.pending);
                    var data = _getFormData();
                    filesManager.addFile(this);

                    var _uploadFileRequest = ajax.request({
                        xhr:_xhr,
                        data: data,
                        url: endpointsUrl.file,
                        method: 'POST',
                        contentType: false,
                        processData: false,
                        dataType: 'json'
                    });
                    _uploadFileRequest.then((response) => {
                        this.progress(_progress.end);
                        MWResponse.defaultBehavior(response, uploadFileCallback, resetAttachment);
                    }).fail(() => {
                        dialog.alert({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });
                        resetAttachment();
                    });

                    this.uploadRequest = _uploadFileRequest;
                };

                this.removeFile = function () {
                    if (!this.isRemoveActive()) {
                        return;
                    }

                    resetAttachment(false);
                    filesManager.removeFile(this);
                };

                this.displayFile = function () {
                    window.open(`${endpointsUrl.file}/${this.id()}/${formInformation.formParams.process.formUniqueID}/FilePreview`);
                };

                this.registerRule = function ({ nameRules, sizeRules }) {
                    if (nameRules) {
                        this.customRules.name.push(nameRules);
                    }
                    if (sizeRules) {
                        this.customRules.size.push(sizeRules);
                    }
                };

                this.config = {
                    fileName: _settings.fileName,
                    fileType: _settings.fileType,
                    fileSize: _settings.fileSize,
                    emptyFile: _settings.emptyFile
                };
            }

            get states() {
                return _states;
            }

            get labels() {
                return _labels;
            }
        }

        return File;
    });