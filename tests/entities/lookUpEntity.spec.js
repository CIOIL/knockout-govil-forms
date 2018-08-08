define([
    'common/resources/bindingProperties'
    , 'common/entities/entityBase'
     , 'common/entities/lookUpEntity'
      , 'common/core/exceptions'
        , 'common/resources/exeptionMessages'
       , 'common/utilities/stringExtension'
],
function (bindingProperties,//eslint-disable-line max-params
    entityBase,
    lookUpEntity,
    exceptions,
    exceptionMessages,
    stringExtension) {

    describe('bindingProperties', function () {
        it('bindingProperties to be defined', function () {
            expect(bindingProperties).toBeDefined();
        });
    });

    describe('entityBase', function () {
        it('entityBase to be defined', function () {
            expect(entityBase.EntityBase).toBeDefined();
        });
    });

    describe('lookUpEntity', function () {
        it('lookUpEntity to be defined', function () {
            expect(lookUpEntity.LookUp).toBeDefined();
        });
    });

    var city = new entityBase.ObservableEntityBase({ key: '3000', value: 'ירושלים' });
    var street = new lookUpEntity.LookUp({
        filter: city.dataCode,
        bindingProperties: bindingProperties.street
    });
    var defaultBind = 'url:https://xxx?filter=&tableName=tableName&addEmptyValue=false;nodelist:node;text:dataText;value:dataCode;ondemand:true';

    var filteredBind = 'url:https://xxx?filter=3000&tableName=tableName&addEmptyValue=false;nodelist:node;text:dataText;value:dataCode;ondemand:true';

    describe('filter parameter:', function () {
        //var street = new lookUpEntity.LookUp({
        //    filter: city.dataCode,
        //    bindingProperties: bindingProperties.street
        //});
        it('filter should be return value of computed', function () {
            expect(ko.isObservable(street.filter)).toEqual(true);
        });
    });
    describe('bindingProperties parameter:', function () {
        it('url parameter is mandatory', function () {
            expect(function () {
                new lookUpEntity.LookUp({
                    filter: city.dataCode,
                    bindingProperties: {
                        queryString: {
                            tableName: 'tableName'
                        },
                        nodelist: 'node'
                    }
                });
            }).toThrowError(stringExtension.format(exceptionMessages.invalidParam, 'bindingProperties.url'));
        });

        it('nodelist parameter is mandatory', function () {
            expect(function () {
                new lookUpEntity.LookUp({
                    filter: city.dataCode,
                    bindingProperties: {
                        url: 'https://xxx',
                        queryString: {
                            tableName: 'tableName'
                        }

                    }
                });
            }).toThrowError(stringExtension.format(exceptionMessages.invalidParam, 'bindingProperties.nodelist'));
        });

        it('queryString.tableName parameter is mandatory', function () {
            expect(function () {
                new lookUpEntity.LookUp({
                    filter: city.dataCode,
                    bindingProperties: {
                        url: 'https://xxx',
                        queryString: {

                        },
                        nodelist: 'node'
                    }
                });
            }).toThrowError(stringExtension.format(exceptionMessages.invalidParam, 'bindingProperties.queryString.tableName'));
        });
    });

    describe('the bind function', function () {

        it('bind with default values', function () {
            street = new lookUpEntity.LookUp({
                bindingProperties: {
                    url: 'https://xxx',
                    queryString: {
                        tableName: 'tableName'
                    },
                    nodelist: 'node'
                }
            });
            expect(street.bind()).toEqual(defaultBind);
        });
        it('bind with filter value', function () {
            street = new lookUpEntity.LookUp({
                filter: city.dataCode,
                bindingProperties: {
                    url: 'https://xxx',
                    queryString: {
                        tableName: 'tableName'
                    },
                    nodelist: 'node'
                }
            });
            expect(street.bind()).toEqual(filteredBind);
        });
        it('bind with empty filter returns no date', function () {
            var noDataUrl = 'url:https://xxx?filter=-1&tableName=tableName&addEmptyValue=false;nodelist:node;text:dataText;value:dataCode;ondemand:true';
            city.dataCode(undefined);
            street = new lookUpEntity.LookUp({
                filter: city.dataCode,
                bindingProperties: {
                    url: 'https://xxx',
                    queryString: {
                        tableName: 'tableName'
                    },
                    nodelist: 'node'
                }
            });
            expect(street.bind()).toEqual(noDataUrl);
        });
    });


});
define('spec/lookUpEntity.js', function () { });