define([], function () {
    const getFormParams = function () {
        const formParams = typeof window.formParams !== 'undefined' ? window.formParams : {}; //eslint-disable-line no-undef
        return formParams;
    };
    return {
        getFormParams
    };
});