define(function () {

    var dataType = {
        string: 'string'
        , date: 'date'
        , boolean: 'boolean'
        , number: 'number'
    };

    var controlType = {
        select: 'select'
       , input: 'input'
       , date: 'date'
    };
    var errors = {
        itemTypeIsNotBaseItemType: 'itemType have to inherit from BaseItemType'
    };

    return {
        controlType: controlType,
        dataType: dataType,
        errors: errors
    };
});