define(function () {
    var ModularViewModel = require('common/viewModels/ModularViewModel');
    require('common/ko/globals/multiLanguageObservable');


    var texts = {
        hebrew: {
            searchItem: 'חפש פריט',
            search: 'חפש'

        },
        english: {
            searchItem: 'search item',
            search: 'search'
        }
    };


    var textsResource = ko.multiLanguageObservable({ resource: texts });
    var Filtering = function (settings) {
        var self = this;

        var model = {
            filteredValue: ko.observable('').extend({ tlpTrim: null })
        };

        ModularViewModel.call(self, model);

        var sourceData = settings.data;

        var notFound = -1;
        var data = ko.pureComputed(function () {
            var filter = model.filteredValue();
            if (filter) {
                var filteredData = ko.utils.arrayFilter(sourceData(), function (item) {
                    var result = ko.utils.arrayFirst(settings.columns(), function (column) {
                        if (ko.unwrap(item[column.dataField]) !== null) {
                            var value = ko.unwrap(item[column.dataField]).toString().toLowerCase();
                            filter = filter.toLowerCase();
                            return value.indexOf(filter) > notFound;
                        }
                        return null;
                    });
                    return result !== null;
                });
                return filteredData;
            }
            return sourceData();
        });
        self.data = data;
        self.textsResource = textsResource;

    };

    Filtering.prototype = Object.create(ModularViewModel.prototype);
    Filtering.prototype.constructor = Filtering;

    return Filtering;
});
