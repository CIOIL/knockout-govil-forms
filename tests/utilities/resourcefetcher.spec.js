define(['common/resources/exeptionMessages',
         'common/utilities/stringExtension',
         'common/utilities/resourceFetcher',
         'common/core/generalAttributes'],
    function (exeptionMessages, stringExtension, resourceFetcher, generalAttributesManager) { //eslint-disable-line max-params

        describe('resourceFetcher', function () {

            var resources = {
                hebrew: {
                    messages: {
                        isYounger: 'על {0} להיות קטן מ {1} שנים'
                    },
                    labels: {
                        day: 'יום',
                        month: 'חודש'
                    }
                },
                english: {
                    messages: {
                        isYounger: 'the {0} be less than {1} years'
                    },
                    labels: {
                        day: 'day'
                    }
                }
            };

            describe('get', function () {
                it('should exist', function () {
                    expect(resourceFetcher.get).toBeDefined();
                });

                describe('language', function () {

                    it('use  parameter - english', function () {
                        expect(resourceFetcher.get(resources, 'hebrew')).toEqual(resources.hebrew);
                    });

                    it('use  parameter - hebrew', function () {
                        expect(resourceFetcher.get(resources, 'hebrew')).toEqual(resources.hebrew);
                    });

                    it('use  general attribute if no  parameter - english ', function () {
                        spyOn(generalAttributesManager, 'get').and.returnValue('english');
                        expect(resourceFetcher.get(resources)).toEqual(resources.english);
                    });

                    it('use  general attribute if no  parameter - hebrew', function () {
                        spyOn(generalAttributesManager, 'get').and.returnValue('hebrew');
                        expect(resourceFetcher.get(resources)).toEqual(resources.hebrew);
                    });

                    it('use hebrew as default if no parameter and no  language in general attributes ', function () {
                        spyOn(generalAttributesManager, 'get').and.returnValue('');
                        expect(resourceFetcher.get(resources)).toEqual(resources.hebrew);
                    });

                    it('use english as default if not support languages', function () {
                        expect(resourceFetcher.get(resources, 'romanian')).toEqual(resources.english);
                    });
                });

                describe('exceptions', function () {

                    var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'resourceFetcher.get');

                    it('throw if no parameters', function () {
                        expect(function () {
                            resourceFetcher.get();
                        }).toThrowError(invalidParamMessage);
                    });

                    it('throw if the resources param is not an object', function () {
                        expect(function () {
                            resourceFetcher.get('some text');
                        }).toThrowError(invalidParamMessage);
                    });

                    it('throw if resource was not found', function () {
                        var resources = {
                            english:
                            {
                                messages: {
                                    isYounger: 'the {0} be less than {1} years'
                                },
                                labels: {
                                    day: 'day'
                                }
                            }
                        };
                        expect(function () {
                            resourceFetcher.get(resources, 'hebrew');
                        }).toThrowError(invalidParamMessage);
                    });

                });

            });
        });

    });
define('spec/resourceFetcher.spec.js', function () { });
