/// <reference path='../../../lib/jasmine-2.0.0/boot.js' />
/// <reference path='../../../lib/jasmine-2.0.0/console.js' />
/// <reference path='../../../lib/jasmine-2.0.0/jasmine.js' />
define(['common/core/mappingManager', 'common/resources/exeptionMessages', 'common/utilities/stringExtension'], function (mappingManager, exeptionMessages, stringExtension) {
    //eslint-disable-line max-params

    describe('mappingManager', function () {

        it('should be defined', function () {
            expect(mappingManager).toBeDefined();
        });

        describe('get', function () {

            it('should be defined', function () {
                expect(mappingManager.get).toEqual(jasmine.any(Function));
            });

            it('should return Object', function () {
                expect(mappingManager.get()).toEqual(jasmine.any(Object));
            });
        });
        describe('update', function () {

            it('should be defined', function () {
                expect(mappingManager.update).toEqual(jasmine.any(Function));
            });

            it('should update', function () {
                var mappingRules = {
                    contactList: {
                        update: function update() {}
                    },
                    ignore: [''],
                    child: {
                        create: function create() {}
                    }
                };

                mappingManager.update(mappingRules);
                expect(mappingManager.get().contactList).toEqual(mappingRules.contactList);
            });

            it('should not update exits rules', function () {
                var mappingRules = {
                    job: {
                        create: function create() {}
                    }
                };

                var anotherRule = {
                    job: {
                        create: function create() {}
                    }
                };
                mappingManager.update(mappingRules);
                expect(function () {
                    mappingManager.update(anotherRule);
                }).toThrowError();
            });

            it('should merge array', function () {
                var mappingRules = {
                    include: ['aaa']
                };

                var anotherRule = {
                    include: ['bbb']
                };
                mappingManager.update(mappingRules);
                mappingManager.update(anotherRule);
                expect(mappingManager.get().include).toEqual(['aaa', 'bbb']); //copy,observe
            });
        });
        describe('utils', function () {
            describe('create', function () {
                var data = {
                    rooms: 7,
                    doorColor: 'brown'
                };

                it('should be defined', function () {
                    expect(mappingManager.utils.create).toEqual(jasmine.any(Function));
                });
                it('data and type are mandatory', function () {
                    expect(function () {
                        mappingManager.utils.create();
                    }).toThrowError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'data', 'object'));
                });
                it('data and type are mandatory', function () {
                    var data = {};
                    expect(function () {
                        mappingManager.utils.create(data);
                    }).toThrowError(stringExtension.format(exeptionMessages.invalidElementTypeParam, 'type', 'constructor'));
                });

                it('should return new object that full with data', function () {
                    var House = function House() {
                        var self = this;
                        self.rooms = ko.observable();
                        self.doorColor = ko.observable();
                    };

                    var bigHouse = mappingManager.utils.create(data, House);
                    expect(bigHouse.rooms()).toEqual(data.rooms);
                    expect(bigHouse.doorColor()).toEqual(data.doorColor);
                });

                it('should use mappingRule property of the instance if exits', function () {
                    var House = function House() {
                        var self = this;
                        self.rooms = ko.observable();
                        self.doorColor = ko.observable('');
                        self.getMappingRules = function () {
                            return { ignore: ['doorColor'] };
                        };
                    };

                    var bigHouse = mappingManager.utils.create(data, House);
                    expect(bigHouse.doorColor()).toEqual('');
                });
            });
        });
    });
});