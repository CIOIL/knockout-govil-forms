/** Module for handling save form as PDF in govForms mode
 * makes a request and download the response  
  @module saveAsPdf 
*/
define(['common/core/generalAttributes'
    , 'common/utilities/resourceFetcher'
    , 'common/events/userEventHandler'
    , 'common/components/loader/loader'
    , 'common/resources/eventNames'
    , 'common/resources/endpointsUrl'
    , 'common/external/q'
    , 'common/networking/binaryAjax'
    , 'common/components/formInformation/formInformationViewModel'
    , 'common/components/dialog/dialog'
    , 'common/actions/validate'
    , 'common/utilities/typeVerifier'
    , 'common/utilities/fileViewer'
    , 'common/core/MWResponse'
    , 'common/utilities/dateMethods'
    , 'common/core/exceptions'
    , 'common/resources/exeptionMessages'
    , 'common/utilities/stringExtension'
    , 'common/components/fileUpload/filesManager'
],
    function (formConfiguration, resourceFetcher, userEventHandler,  loader, eventNames, endpointsUrl, Q, binaryAjax, formInformation, dialog, validateAction, typeVerifier, fileViewer, MWResponse, dateMethods, exceptions, exeptionMessages, stringExtension, filesManager) { //eslint-disable-line max-params
        const resources = {
            reasonableErrorLength: 2000,
            dialog: {
                hebrew: {
                    pdfCreationText: 'אנא המתן להשלמת הפקת PDF',
                    error: 'חלה תקלה במהלך הפקת הPDF'
                },
                english: {
                    pdfCreationText: 'Please wait for PDF creation',
                    error: 'חלה תקלה במהלך הפקת הPDF'
                },
                arabic: {
                    pdfCreationText: 'يرجى الانتظار لإنشاء بدف',
                    error: 'חלה תקלה במהלך הפקת הPDF'
                }
            }
        };

        const generatePdfFileName = () => {
            return `${formConfiguration.get('formid')}_${dateMethods.getTimeStamp()}.pdf`;
        };
        const downloadFile = function (response) {
            var fileName = generatePdfFileName();
            fileViewer.downloadFileByBlob(fileName, response);
        };
        const isErrorRequest = (response) => {
            return response.byteLength <= resources.reasonableErrorLength;
        };
        const handleError = (response) => {
            var enc = new TextDecoder();//eslint-disable-line no-undef
            var responseString = enc.decode(response);
            if (typeVerifier.json(responseString)) {
                MWResponse.showMessage(JSON.parse(responseString));
            } else {
                throw new Error('response is invalid');
            }
        };
        const prepareAjaxSettings = () => {
            const formParams = formInformation.formParams;
            const formData = JSON.parse(formInformation.dataModelSaver());

            return {
                url: endpointsUrl.saveAsPdf,
                method: 'POST',
                data: JSON.stringify({
                    convertToBase64: false,
                    formId: formConfiguration.get('formid'),
                    formVersion: formConfiguration.get('formVersion'),
                    requestID: formParams.process.requestID,
                    formData: formData,
                    attachments: filesManager.attachedFilesIds()
                })
                , headers: { 'Content-Type': 'application/json' }
            };
        };
        const pdfSuccessCallback = () => {

            var request = binaryAjax.request(prepareAjaxSettings());
            request.then(function (response) {
                if (!typeVerifier.arrayBuffer(response)) {
                    exceptions.throwFormError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'response', 'ArrayBuffer'));
                }
                if (isErrorRequest(response)) {
                    handleError(response);
                } else {
                    downloadFile(response);
                }
                loader.close();

            }).fail(function () {
                loader.close();
                dialog.alert({ message: resourceFetcher.get(resources.dialog).error });
            });

            return false;
        };
        const pdfRequest = (publishedData) => {
            loader.open(resourceFetcher.get(resources.dialog).pdfCreationText);

            userEventHandler.invoke({
                event: 'pdfRequest',
                callback: () => {
                    pdfSuccessCallback();
                },
                afterEvent: false,
                publishedData: publishedData
            });
        };       

        const saveAsPdf = function (publishedData = {}) {
            const validationDefer = Q.defer();
            publishedData.context = eventNames.saveAsPdf;
            validateAction.validateForm(validationDefer, publishedData);
            validationDefer.promise.then(function () {
                userEventHandler.invoke({
                    event: 'print',
                    callback: () => {
                        pdfRequest(publishedData);
                    },
                    afterEvent: true,
                    publishedData: publishedData
                });
            });

        };

        return {
            /**
            * Full process saving form as pdf : validation form  -> request -> download
            * @method saveAsPdf
            * @param {json} [publishedData={}] - data which sent to user events
            * @example Example usage of saveAsPdf:
            * saveAsPdf.saveAsPdf({a:1})
            * @returns void.
            */
            saveAsPdf,
            /**
            *  request for getting the PDF -> download 
            * @method pdfRequest
            * @example Example usage of pdfRequest:
            * saveAsPdf.pdfRequest(false)
            * @returns false.
            */
            pdfRequest
        };
    });