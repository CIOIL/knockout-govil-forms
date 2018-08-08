define(function () {
    var bytesToSize = function (bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0){
            return '0 ' + sizes[0];
        }
        var logConverter = 1024;
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(logConverter)), 10);
        return Math.round(bytes / Math.pow(logConverter, i), 2) + ' ' + sizes[i];
    };

    var getExtension = function (fileName) {
        if (fileName) {
            return fileName.split('.').pop().toLowerCase();
        }
        return '';
    };

    return {
        bytesToSize: bytesToSize,
        getExtension: getExtension
    };

});