define([
], function () {

    var body = $('body');

    var isGovFormPdf = function () {
        return window.formParams ? window.formParams.process.serverMode : false;
    };

    var isPdf = function () {
        return body.is('.pdf') || isGovFormPdf();
    };

    var isServer = function () {
        return (typeof window.bExecutingOnServerSide !== 'undefined' && window.bExecutingOnServerSide === true) || isGovFormPdf();
    };

    var validModes = {
        client: 'client',
        server: 'server',
        pdf: 'pdf'
    };

    var mode = ko.observable(isServer() ? validModes.server : validModes.client);

    var initMode = function () {
        if (isPdf()) {
            mode(validModes.pdf);
        }
        else
            if (isServer()) {
                mode(validModes.server);
            }
            else {
                mode(validModes.client);
            }
    };

    return {
        isPdf:isPdf,
        isServer: isServer,
        initMode: initMode,
        mode: mode,
        validModes: validModes
    };
});