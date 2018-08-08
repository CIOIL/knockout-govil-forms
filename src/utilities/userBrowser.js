define([], function () {
    const isIOS = function () {
        return !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
    };
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    const isIE = function () {
        return window.navigator && window.navigator.msSaveOrOpenBlob;
    };
    return {
        isIOS,
        isMobile,
        isIE
    };
});