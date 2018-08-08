define(['common/resources/hebrewComponents'], function (_components) {
   
    return {
        get: function () { return _components; },
        set: function (components) { _components = components; }
    };
    
});