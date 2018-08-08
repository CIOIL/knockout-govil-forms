define(function () {

    var buildRequiredParam = function (extenders, isModelRequired) {
        var requiredRule;
        if (typeof isModelRequired === 'function' || extenders.required.hasOwnProperty('onlyIf')) {
            var specificRequired = extenders.required.onlyIf || extenders.required;
            requiredRule = {
                onlyIf: ko.computed(function () {
                    return ko.unwrap(isModelRequired) && ko.unwrap(specificRequired);
                })
            };
        }
        else {
            requiredRule = isModelRequired && extenders.required;
        }
        return requiredRule;
    };

    var setRequiredExtender = function (extenders, isModelRequired) {
        //todo: support all required rules
        if (typeof isModelRequired !== 'undefined' && extenders.hasOwnProperty('required')) {
            extenders.required = buildRequiredParam(extenders, isModelRequired);
        }
        return extenders;
    };

    var isNotIgnored = function (rule, ignoreExtenders) {
        var notfound = -1;
        return ignoreExtenders.indexOf(rule) === notfound;
    };

    var filterExtenders = function (extenders, ignoreExtenders) {
        var relevantExtenders = {};
        for (var rule in extenders) {
            if (extenders.hasOwnProperty(rule) && isNotIgnored(rule, ignoreExtenders)) {
                relevantExtenders[rule] = extenders[rule];
            }
        }
        return relevantExtenders;
    };

    var extendersFactory = function (extenders, ignoreExtenders, isModelRequired) {
        var relevantExtenders = filterExtenders(extenders, ignoreExtenders);
        setRequiredExtender(relevantExtenders, isModelRequired);
        return relevantExtenders;
    };

    return extendersFactory;

});