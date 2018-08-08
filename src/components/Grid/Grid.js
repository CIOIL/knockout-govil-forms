define(function () {
    var BaseGrid = require('common/components/Grid/BaseGrid'),
        Filtering = require('common/components/Grid/Filtering'),
        Paging = require('common/components/Grid/Paging'),
        Sorting = require('common/components/Grid/Sorting'),
        formInformation = require('common/components/formInformation/formInformationViewModel');

    var Grid = function (settings) {

        var self = this;

        BaseGrid.call(self, settings);

       
        var extendedModel = function () {
            var model = self.getModel();
            model.filtering = new Filtering({ data: model.data, columns: self.visibleColumns });
            model.sorting = new Sorting({ data: model.filtering.data, columns: settings.columns });
            model.paging = new Paging({ data: model.sorting.data, pageCountDisplay: 5, pageSize: 10 });
            return model;
        }();

        self.setModel(extendedModel);
        
        var noData = ko.pureComputed(function () {
            return extendedModel.paging.data().length === 0;
        });

        var dataForDisplay = ko.pureComputed(function () {
            if (formInformation.printMode()) {
                return extendedModel.sorting.data();
            }
            else {
                return extendedModel.paging.data();
            }
        });

        self.dataForDisplay = dataForDisplay;
        self.noData = noData;
        
    };

    Grid.prototype = Object.create(BaseGrid.prototype);
    Grid.prototype.constructor = Grid;

    return Grid;
});
