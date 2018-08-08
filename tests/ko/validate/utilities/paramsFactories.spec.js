define(['common/ko/validate/utilities/paramsFactories',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/ko/globals/multiLanguageObservable'],

function (createParamsFactories, exeptionMessages, stringExtension) {//eslint-disable-line max-params

    var messages = ko.multiLanguageObservable({ resource: { hebrew: { messageA: 'messageA' }, english: { messageA: 'messageA' } } });
    var factories;
    describe('validate', function () {
        describe('createParamsFactories', function () {

            it('verify existence', function () {
                expect(createParamsFactories).toBeDefined();
                expect(typeof createParamsFactories).toEqual('function');
            });

            it('create factories without proper parameter fails', function () {
                var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'createParamsFactories');
                expect(function () {
                    createParamsFactories();
                }).toThrowError(invalidParamMessage);
                expect(function () {
                    createParamsFactories({ message: 'error' });
                }).toThrowError(invalidParamMessage);
            });

            it('create factories succeed with proper parameter', function () {
                expect(function () {
                    createParamsFactories(messages);
                }).not.toThrow();
            });

            describe('validationMessageFactory', function () {
                beforeAll(function () {
                    factories = createParamsFactories(messages);
                });
                it('verify existence', function () {
                    expect(factories.validationMessageFactory).toBeDefined();
                });

                it('if params contains message returns params.message', function () {
                    expect(factories.validationMessageFactory('', { message: 'aah' })).toEqual('aah');
                });

                it('if params does not contain message and validationRule is empty return undefined', function () {
                    expect(factories.validationMessageFactory('', {})).toBeUndefined();
                });

                it('if params does not contain message returns message[validationRule]', function () {
                    var message = factories.validationMessageFactory('messageA', {});
                    expect(typeof message).toEqual('function');
                    expect(message()).toEqual('messageA');
                });

            });
            describe('validationParamsFactory', function () {
                beforeAll(function () {
                    factories = createParamsFactories(messages);
                });
                it('verify existence', function () {
                    expect(factories.validationParamsFactory).toBeDefined();
                });

                it('if params contains message returns params.message', function () {
                    var params = factories.validationParamsFactory({}, true, 'testRule');
                    expect(params).toEqual(true);
                });

                it('if params contains message returns params.message', function () {
                    var params = factories.validationParamsFactory({ message: 'aah' }, true, 'testRule');
                    expect(params).toEqual({ message: 'aah', params: true, onlyIf: undefined, ruleName: 'testRule' });
                    params = factories.validationParamsFactory({ message: 'aah', onlyIf: false }, true, 'testRule');
                    expect(params).toEqual({ message: 'aah', params: true, onlyIf: false, ruleName: 'testRule' });
                });

                it('if params contains message returns params.message', function () {
                    var params = factories.validationParamsFactory({}, true, 'messageA');
                    expect(typeof params.message).toEqual('function');
                    expect(params.message()).toEqual('messageA');
                    expect(params.params).toEqual(true);
                    expect(params.ruleName).toEqual('messageA');
                });

                it('set ruleName with ruleName if sent, with "validationRule" if not sent', function () {
                    var params = factories.validationParamsFactory({ruleName:'test'}, true, 'messageA');
                    expect(params.ruleName).toEqual('test');
                    params = factories.validationParamsFactory({ }, true, 'messageA');
                    expect(params.ruleName).toEqual('messageA');
                });

            });

        });
    });
});