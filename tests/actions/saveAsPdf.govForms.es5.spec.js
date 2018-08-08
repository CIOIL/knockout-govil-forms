define(['common/actions/saveAsPdf', 'common/actions/validate', 'common/networking/binaryAjax', 'common/viewModels/languageViewModel', 'common/components/dialog/dialog', 'common/components/formInformation/formInformationViewModel', 'common/utilities/fileViewer', 'common/utilities/dateMethods', 'common/events/userEventHandler'], function (saveAsPdf, validate, binaryAjax, languageViewModel, dialog, formInformationViewModel, fileViewer, dateMethods, userEventHandler) {
    //eslint-disable-line max-params
    describe('saveAsPdf', function () {
        var beforePdfRequestSubscriber, validateSubscriber;
        var delay = 500;
        var reasonableErrorLength = 2000;
        var str2arrayBuffer = function str2arrayBuffer(str) {
            var buf = new ArrayBuffer(str.length); //eslint-disable-line no-undef
            var bufView = new Uint8Array(buf); //eslint-disable-line no-undef
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        };

        var promiseState = 'resolve';

        var fakedSuccessResponse = new ArrayBuffer(reasonableErrorLength + 1); //eslint-disable-line no-undef
        var fakedSuccessResponseWithError = str2arrayBuffer(JSON.stringify({ 'statusCode': 2000, responseMessages: { he: 'he', en: 'en', ar: 'ar' } }));
        var fakedSuccessResponseButNotArrayBuffer = 'Uv3GB34Vf55';
        var fakedFailureResponse = 'error';

        var fakedPromiseResolver = function fakedPromiseResolver() {
            var d = $.Deferred();
            d.resolve(promiseState === 'resolveWithError' ? fakedSuccessResponseWithError : promiseState === 'resolve' ? fakedSuccessResponse : fakedSuccessResponseButNotArrayBuffer);
            return d.promise();
        };
        var fakedPromiseRejector = function fakedPromiseRejector() {
            var d = $.Deferred();
            d.reject(fakedFailureResponse);
            return d.promise();
        };
        var mutablePromise = function mutablePromise() {
            return promiseState.includes('resolve') ? fakedPromiseResolver() : fakedPromiseRejector();
        };
        beforeEach(function () {
            spyOn(saveAsPdf, 'pdfRequest').and.callThrough();
            spyOn(binaryAjax, 'request').and.callFake(mutablePromise);
            spyOn(dialog, 'confirm').and.callFake(mutablePromise);
            spyOn(dateMethods, 'getTimeStamp').and.returnValue('12345');
            spyOn(fileViewer, 'downloadFileByBlob');
            spyOn(dialog, 'alert');
            spyOn(userEventHandler, 'invoke').and.callThrough();

            formInformationViewModel.dataModelSaver('{}');
            if (beforePdfRequestSubscriber) {
                beforePdfRequestSubscriber.dispose();
            }
            if (validateSubscriber) {
                validateSubscriber.dispose();
            }
        });

        describe('saveAsPdf method', function () {
            it('verfy existence', function () {
                expect(saveAsPdf.saveAsPdf).toBeDefined();
            });

            describe('user event handlers', function () {

                it('should invoke validation event with context saveAsPdf', function (done) {
                    validateSubscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                        expect(data.publishedData.context).toEqual('saveAsPdf');
                        done();
                    });
                    saveAsPdf.saveAsPdf();
                });

                it('resolve validation should allow saveAsPdf', function (done) {
                    validateSubscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                        data.deferred.resolve();
                    });
                    setTimeout(function () {
                        expect(userEventHandler.invoke).toHaveBeenCalledWith(jasmine.objectContaining({ event: 'pdfRequest' }));
                        done();
                    }, delay);
                    saveAsPdf.saveAsPdf();
                });

                xit('reject validation should abort saveAsPdf', function (done) {
                    validateSubscriber = ko.postbox.subscribe('userBeforeValidateForm', function (data) {
                        data.deferred.reject();
                    });
                    setTimeout(function () {
                        expect(notifications.show).not.toHaveBeenCalled();
                        done();
                    }, delay);
                    saveAsPdf.saveAsPdf();
                });
            });
        });

        describe('pdfRequest method', function () {
            it('without params', function () {
                expect(function () {
                    saveAsPdf.pdfRequest();
                }).not.toThrowError();
            });
            it('fire userBeforePdfRequest event', function () {
                beforePdfRequestSubscriber = ko.postbox.subscribe('userBeforePdfRequest', function (data) {
                    data.deferred.resolve();
                });
                saveAsPdf.pdfRequest();
                expect(userEventHandler.invoke).toHaveBeenCalledWith(jasmine.objectContaining({ event: 'pdfRequest' }));
            });
            it('userBeforePdfRequest subscriber get data', function (done) {
                beforePdfRequestSubscriber = ko.postbox.subscribe('userBeforePdfRequest', function (data) {
                    setTimeout(function () {
                        expect(data.publishedData.a).toEqual(1);
                        expect(data.publishedData.b).toEqual(2);
                        done();
                    }, delay);
                });
                saveAsPdf.pdfRequest({ a: 1, b: 2 });
            });
            it('resolve userBeforePdfRequest should allow pdf request', function (done) {
                beforePdfRequestSubscriber = ko.postbox.subscribe('userBeforePdfRequest', function (data) {
                    data.deferred.resolve();
                });
                setTimeout(function () {
                    expect(binaryAjax.request).toHaveBeenCalled();
                    done();
                }, delay);
                saveAsPdf.saveAsPdf();
            });
        });
        describe('pdfSuccessCallback method', function () {

            it('when request resolved - file is download ', function (done) {
                promiseState = 'resolve';
                setTimeout(function () {
                    expect(fileViewer.downloadFileByBlob).toHaveBeenCalled();
                    done();
                }, delay);
                saveAsPdf.pdfRequest();
            });
            it('when request rejected - file doesn\'t download and message appear', function (done) {
                promiseState = 'reject';
                setTimeout(function () {
                    expect(fileViewer.downloadFileByBlob).not.toHaveBeenCalled();
                    expect(dialog.alert).toHaveBeenCalled();
                    done();
                }, delay);
                saveAsPdf.pdfRequest();
            });
            xit('when request resolved with error - file doesn\'t download and message appear', function (done) {
                promiseState = 'resolveWithError';
                setTimeout(function () {
                    expect(fileViewer.downloadFileByBlob).not.toHaveBeenCalled();
                    expect(dialog.alert).toHaveBeenCalledWith({ message: 'he' });
                    done();
                }, delay);
                saveAsPdf.pdfRequest();
            });
            it('when request resolved with response doesn\'t ArrayBuffer - file doesn\'t download and throw', function (done) {
                promiseState = 'resolveWithNotArrayBuffer';
                setTimeout(function () {
                    expect(function () {
                        saveAsPdf.pdfReques();
                    }).toThrowError();
                    expect(fileViewer.downloadFileByBlob).not.toHaveBeenCalled();
                    done();
                }, delay);
                saveAsPdf.pdfRequest();
            });

            it('download file name contains formid and timestamp', function (done) {
                promiseState = 'resolve';
                setTimeout(function () {
                    expect(fileViewer.downloadFileByBlob).toHaveBeenCalledWith('noAGFormTemplate@test.gov.il_12345.pdf', jasmine.anything());
                    done();
                }, delay);
                saveAsPdf.pdfRequest();
            });
        });
    });
});