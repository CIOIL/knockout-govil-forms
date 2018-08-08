define([
    'common/core/errorHandling'
    , 'common/core/exceptions'
    , 'common/infrastructureFacade/tfsMethods'
    , 'common/utilities/resourceFetcher'
    , 'common/resources/texts/indicators'
    , 'common/utilities/stringExtension'
    , 'common/components/support/supportViewModel'
],
function (errorHandling, exceptions, tfsMethods, resourceFetcher, texts, stringExtension, support) {//eslint-disable-line max-params 

    var applicativeErrorMessage = 'No data for the entered ID number';

    describe('handleCallServerError', function () {

        it('handleCallServerError should be defined as function', function () {
            expect($.type(errorHandling.handleCallServerError) === 'function').toBeTruthy();
        });

        describe('display message according to error type', function () {

            var unexpectedErrorMessage = 'An unexpected error occurred';

            beforeEach(function () {
                spyOn(tfsMethods.dialog, 'alert');
            });

            it('original message displayed for applicative error', function () {
                var applicativeError = new exceptions.ApplicativeError(applicativeErrorMessage);
                errorHandling.handleCallServerError(applicativeError);
                expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(applicativeErrorMessage);
            });

            it('call server error message displayed for unexpected error', function () {
                var errorsTexts = resourceFetcher.get(texts.errors);
                var callServerErrorMessage =  stringExtension.format(errorsTexts.callServerError, [support.phone()]);
                errorHandling.handleCallServerError(new Error(unexpectedErrorMessage));
                expect(tfsMethods.dialog.alert).toHaveBeenCalledWith(callServerErrorMessage);
            });

        });

    });


});
