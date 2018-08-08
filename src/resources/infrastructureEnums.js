define([], function () {
    return {
        actions: {
            displayattachment: 'displayAttachment',
            addattachment: 'addAttachment',
            submit: 'submit',
            printpreview: 'printPreview',
            print: 'print',
            printwithattachments: 'printWithAttachments',
            lock: 'lock',
            encryptform: 'encryptForm',
            decryptform: 'decryptForm',
            printpdf: 'printPDF',
            printpdfmainform: 'printPDFmainform'
        },
        dataTypes: {
            lookupwindow: 'LookUpWindow',
            date: 'date',
            attachment: 'attachment',
            userimage: 'userImage',
            signature: 'signature'
        },
        classes: {
            attachment: 'attachment',
            attachmentWrapper: 'attachment-wrapper',
            tfsCalendar: 'tfsCalendar'
        },
        data: {
            datafsize: 'data-fsize'
        },
        attr: {
            _title: '_title'
        }
    };
});