define([], function () {  
   
    var IsToolBarOn = IsToolBarOn || false;//eslint-disable-line no-use-before-define
    var isToolbarOn = function () { return !!IsToolBarOn; };
    var CurrentPlugInVersion = CurrentPlugInVersion || '';//eslint-disable-line no-use-before-define
    var language = 'hebrew';

    return {
        isToolBarOn: isToolbarOn,
        currentPlugInVersion: CurrentPlugInVersion,
        language: language
    };

});