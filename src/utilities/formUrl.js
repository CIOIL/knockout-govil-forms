define([], () => {

    /**
  * @function getQueryStringValue
  * @description return  Query String Value of url
  * @param {String} url of the url QueryString
  * @param {String} parameterName - contains the name of the QueryString  
  * @returns {String} url of the url QueryString
   */
    const getQueryStringValue = (url, parameterName) => {
        parameterName = parameterName.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('&' + parameterName + '=([^&#]*)');
        const paramValue = regex.exec(url);
        if ((!Array.isArray(paramValue) || paramValue.length < 1)) {
            return '';
        }
        return decodeURIComponent(paramValue[1].replace(/\+/g, ' '));
    };

    return {
        getQueryStringValue: getQueryStringValue
    };
});