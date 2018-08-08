define(function () {
    var ModularViewModel = require('common/viewModels/ModularViewModel');
    var stringExtension = require('common/utilities/stringExtension');
    var commonReflection = require('common/utilities/reflection');
    require('common/ko/globals/multiLanguageObservable');
    require('common/ko/fn/defaultValue');

    var texts = {
        hebrew: {
            pagingInformation: 'מציג {0}-{1} מתוך {2}',
            nextPage: 'לעמוד הבא >',
            previousPage: '< לעמוד הקודם'
        },
        english: {
            pagingInformation: 'Display {0}-{1} of {2}',
            nextPage: 'next page >',
            previousPage: '< previous page'
        }
    };


    var textsResource = ko.multiLanguageObservable({ resource: texts });

    var Paging = function (settings) {
        var self = this;
        var defaultSettings = {
            pageIndex: 0,
            pageSize: 10,
            pageCountDisplay: 5
        };
        settings = commonReflection.extendSettingsWithDefaults(settings, defaultSettings);
        var model = {
            pageIndex: ko.observable(settings.pageIndex).defaultValue(settings.pageIndex)
        };
        var pageSize = ko.observable(settings.pageSize).defaultValue(settings.pageSize);
        var pageCountDisplay = ko.observable(settings.pageCountDisplay).defaultValue(settings.pageCountDisplay);

        ModularViewModel.call(self, model);

        var sourceData = settings.data;

        var data = ko.pureComputed(function () {
            var startIndex = model.pageIndex() * pageSize();
            var endIndex = startIndex + pageSize();
            return sourceData().slice(startIndex, endIndex);
        });

        var pageCount = ko.pureComputed(function () {
            if (typeof sourceData() === 'undefined' || sourceData().length === 0) {
                return 0;
            }
            else {
                var pageCount = Math.ceil(sourceData().length / pageSize());
                return pageCount;
            }
        });

        pageCount.subscribe(function () {
            model.pageIndex(0);
        });

        var getRowIndex = function (index) {
            var startIndex = model.pageIndex() * pageSize();
            return startIndex + index() + 1;
        };

        var addDefaultRange = function (range, indexs) {
            if (model.pageIndex() + 1 + range < pageCountDisplay()) {
                indexs.endIndex = pageCountDisplay();
                indexs.startIndex = 0;
            }
            else {
                indexs.endIndex = model.pageIndex() + 1 + range;
                indexs.startIndex = indexs.endIndex - pageCountDisplay();
            }
        };

        var fillPageCountArray = function (indexs) {
            var array = [];
            for (var i = indexs.startIndex; i < indexs.endIndex; i++) {
                array.push(i);
            }
            return array;
        };

        var hasRangePagesToEnd = function (range) {
            return model.pageIndex() + 1 + range < pageCount();
        };

        var hasAdditionalPages = function () {
            return pageCount() > pageCountDisplay();
        };

        var pageCountDisplayArray = ko.pureComputed(function () {
            var indexs = { startIndex: 0, endIndex: 0 };
            if (hasAdditionalPages()) {
                var range = Math.floor(pageCountDisplay() / 2);
                if (hasRangePagesToEnd(range)) {
                    addDefaultRange(range, indexs);
                }
                else {
                    indexs.endIndex = pageCount();
                    indexs.startIndex = pageCount() - pageCountDisplay();
                }
            }
            else {
                indexs.startIndex = 0;
                indexs.endIndex = pageCount();
            }
            return fillPageCountArray(indexs);
        });

        var isLast = ko.pureComputed(function () {
            return (model.pageIndex() + 1 >= pageCount());
        });

        var isFirst = ko.pureComputed(function () {
            return model.pageIndex() === 0;
        });

        var navigateToNext = function () {
            if (!isLast()) {
                model.pageIndex(model.pageIndex() + 1);
            }
            $('#rowIndex').focus();
        };

        var navigateToPrevious = function () {
            if (!isFirst()) {
                model.pageIndex(model.pageIndex() - 1);
            }
            $('#rowIndex').focus();
        };

        var pageIndexChanged = function (index) {
            model.pageIndex(index);
            $('#rowIndex').focus();
        };

        var pageInformation = ko.pureComputed(function () {
            var firstIndexInCurrentPage = model.pageIndex() * pageSize();
            var lastIndexInCurrentPage = isLast() ? sourceData().length : firstIndexInCurrentPage + pageSize();
            if (sourceData().length > 0) {
                firstIndexInCurrentPage = firstIndexInCurrentPage + 1;
            }
            return (stringExtension.format(textsResource().pagingInformation, firstIndexInCurrentPage, lastIndexInCurrentPage, sourceData().length));
        });

        var isCurrentIndex = function (index) {
            var pageIndex = ko.unwrap(model.pageIndex);
            return (index === pageIndex);
        };

        var navigateToFirstPage = function () {
            if (!isFirst()) {
                model.pageIndex(0);
            }
            $('#rowIndex').focus();
        };
        var navigateToLastPage = function () {
            if (!isLast()) {
                model.pageIndex(pageCount() - 1);
            }
            $('#rowIndex').focus();
        };

        var hasMorePages = ko.pureComputed(function () {
            return pageCount() - 1 > pageCountDisplayArray()[pageCountDisplayArray().length - 1];
        });
        self.getRowIndex = getRowIndex;
        self.pageCount = pageCount;
        self.data = data;
        self.isLast = isLast;
        self.isFirst = isFirst;
        self.navigateToNext = navigateToNext;
        self.navigateToPrevious = navigateToPrevious;
        self.pageIndexChanged = pageIndexChanged;
        self.pageInformation = pageInformation;
        self.isCurrentIndex = isCurrentIndex;
        self.pageCountDisplayArray = pageCountDisplayArray;
        self.navigateToFirstPage = navigateToFirstPage;
        self.navigateToLastPage = navigateToLastPage;
        self.hasMorePages = hasMorePages;
        self.textsResource = textsResource;
    };

    Paging.prototype = Object.create(ModularViewModel.prototype);
    Paging.prototype.constructor = Paging;

    return Paging;
});
