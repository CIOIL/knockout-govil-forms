define(['common/core/exceptions', 'common/configuration/globalGeneralAttributes'], function (exceptions, generalAttributes) {
    //eslint-disable-line no-unused-vars

    describe('formExceptions', function () {

        beforeEach(function () {
            generalAttributes.tfsAppMode = 'release';
        });

        it('throwFormError should be defined as function', function () {
            expect($.type(exceptions.throwFormError) === 'function').toBeTruthy();
        });

        it('FormError should be defined as function', function () {
            expect($.type(exceptions.FormError) === 'function').toBeTruthy();
        });

        it('throwFormError should return an Error object', function () {
            expect(function () {
                exceptions.throwFormError('invalid data');
            }).toThrowError(exceptions.FormError);
        });

        it('throwFormError should return an Error object with the specified message', function () {
            expect(function () {
                exceptions.throwFormError('invalid data');
            }).toThrowError('invalid data');
        });

        it('FormError should be instance of the native Error object', function () {

            var myError = new exceptions.FormError('invalid data');

            expect(myError instanceof Error).toBeTruthy();
        });

        it('FormError should have stack', function () {

            var myError = new exceptions.FormError('invalid data');

            expect(myError.hasOwnProperty('stack')).toBeTruthy();
        });

        describe('alert error only during development', function () {

            var message = 'invalid data';

            beforeEach(function () {
                spyOn(window, 'alert');
            });

            it(' in debug mode', function () {
                expect(function () {
                    exceptions.throwFormError(message, 'debug');
                }).toThrow();
                expect(alert).toHaveBeenCalledWith(message);
            });

            it(' in debug mode - not sensitive to mode case', function () {
                expect(function () {
                    exceptions.throwFormError(message, 'Debug');
                }).toThrow();
                expect(alert).toHaveBeenCalledWith(message);
            });

            it(' in debug mode from global general attributes', function () {

                generalAttributes.tfsAppMode = 'debug';
                expect(function () {
                    exceptions.throwFormError(message, 'development');
                }).toThrow();

                expect(alert).toHaveBeenCalledWith(message);
            });

            it(' not in debug mode when global general attributes is release', function () {

                expect(function () {
                    exceptions.throwFormError(message, 'development');
                }).toThrow();

                expect(alert.calls.any()).toEqual(false);
            });

            it(' not in debug mode', function () {

                expect(function () {
                    exceptions.throwFormError(message, 'release');
                }).toThrow();

                expect(alert.calls.any()).toEqual(false);
            });

            it(' default behaviour - no mode is sent', function () {

                expect(function () {
                    exceptions.throwFormError(message);
                }).toThrow();

                expect(alert.calls.any()).toEqual(false);
            });
        });
    });

    describe('ApplicativeError', function () {

        var applicativeErrorMessage = 'No data for the entered ID number';

        it('to be defined', function () {
            expect(exceptions.ApplicativeError).toBeDefined();
        });

        it('ApplicativeError should be instance of the native Error object', function () {
            var error = new exceptions.ApplicativeError(applicativeErrorMessage);
            expect(error instanceof Error).toBeTruthy();
        });

        it('ApplicativeError should have stack', function () {

            var error = new exceptions.ApplicativeError('invalid data');

            expect(error.hasOwnProperty('stack')).toBeTruthy();
        });

        describe('init message', function () {
            var applicativeError = new exceptions.ApplicativeError(applicativeErrorMessage);
            it('message', function () {
                expect(applicativeError.message).toBe(applicativeErrorMessage);
            });
        });
    });
});
define('spec/exceptionsSpec.js', function () {});