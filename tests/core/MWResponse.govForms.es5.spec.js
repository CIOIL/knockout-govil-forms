define(['common/core/MWResponse', 'common/components/dialog/dialog'], function (MWResponse, dialog) {
    describe('MWResponse', function () {
        describe('getMessageByLanguage', function () {

            it('when response is undefined throw error', function () {
                expect(function () {
                    MWResponse.getMessageByLanguage();
                }).toThrow();
            });
            it('when response.responseMessages is empty throw error', function () {
                expect(function () {
                    MWResponse.getMessageByLanguage({ responseMessages: '' });
                }).toThrow();
            });
            it('response object include responseMessages key with string value throw error', function () {
                expect(function () {
                    MWResponse.getMessageByLanguage({ responseMessages: 'error' });
                }).toThrow();
            });
            it('response object include responseMessages key with object value not throw', function () {
                expect(function () {
                    MWResponse.getMessageByLanguage({ responseMessages: { en: 'error' } });
                }).not.toThrow();
            });
        });
        describe('defaultBehavior', function () {
            var callback, fcallback;

            beforeEach(function () {
                spyOn(dialog, 'alert');
                callback = jasmine.createSpy();
                fcallback = jasmine.createSpy();
            });

            it('response.statusCode is 0 as string rase callbck', function () {
                MWResponse.defaultBehavior({ statusCode: '0', responseMessages: { en: 'error' } }, callback, fcallback);
                expect(callback).toHaveBeenCalled();
                expect(fcallback).not.toHaveBeenCalled();
                expect(dialog.alert).not.toHaveBeenCalled();
            });
            it('response.statusCode is 0 as number rase callbck', function () {
                MWResponse.defaultBehavior({ statusCode: 0, responseMessages: { en: 'error' } }, callback, fcallback);
                expect(callback).toHaveBeenCalled();
                expect(fcallback).not.toHaveBeenCalled();
                expect(dialog.alert).not.toHaveBeenCalled();
            });
            it('response.statusCode is undefined rase fcallbck and show message', function () {
                MWResponse.defaultBehavior({ responseMessages: { en: 'error' } }, callback, fcallback);
                expect(fcallback).toHaveBeenCalled();
                expect(callback).not.toHaveBeenCalled();
                expect(dialog.alert).toHaveBeenCalled();
            });
            it('response.statusCode differnt 0 rase fcallbck and show message', function () {
                MWResponse.defaultBehavior({ statusCode: 10, responseMessages: { en: 'error' } }, callback, fcallback);
                expect(fcallback).toHaveBeenCalled();
                expect(callback).not.toHaveBeenCalled();
                expect(dialog.alert).toHaveBeenCalled();
            });
        });
    });
});