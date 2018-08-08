/** A module that provides functions for viewing / downloading file
  @module fileViewer 
*/
define(['common/utilities/userBrowser',
        'common/core/exceptions',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/utilities/typeVerifier'
],
    function (userBrowser,exceptions,exceptionMessages,stringExtension,typeVerifier) {//eslint-disable-line  max-params
        const createBlob = (content, type) => {
            return new Blob([content], { type: type });
        };
        const createObjectURL = (blob) => {       
            return URL.createObjectURL(blob);
        };
        const downloadByLinkElement = (fileName, objectURL ) => {
            var link = $(`<a href=${objectURL} download=${fileName} ></a>`);
            $('body').append(link);
            link.on('click', function () {
                $(this).remove();
            });
            link.get(0).click();
        };

        const downloadFileByBlob = (fileName, content, type='') => {
            if(!typeVerifier.string(fileName)|| !content){
                exceptions.throwFormError(stringExtension.format(exceptionMessages.funcInvalidParams, 'downloadFileByBlob'));
            }
            var blob = createBlob(content, type);
            if (userBrowser.isIE()) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                var objectURL = createObjectURL(blob);
                downloadByLinkElement(fileName, objectURL);
            }
        };
        return {
            /** * this method download a file using blob  
               * (concat the url with the queryString)
               * @param {string} fileName - file Name to download
               * @param {object} content - the file content to download can be arrayBuffer, blob
               * @param {string} [type=''] - the blob type
               * @example Example usage of downloadFileByBlob:
               * fileViewer.downloadFileByBlob('fileName.pdf',new ArrayBuffer())
               * @returns void */
            downloadFileByBlob
        };
    });