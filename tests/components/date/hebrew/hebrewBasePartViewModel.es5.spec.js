define(['common/components/date/hebrew/hebrewBasePartViewModel', 'common/external/q'], function (HebrewBasePartViewModel, Q) {

    var BasePartViewModel = require('common/components/date/basePartViewModel');
    var exeptionMessages = require('common/resources/exeptionMessages');
    var tfsMethods = require('common/infrastructureFacade/tfsMethods');
    var stringExtension = require('common/utilities/stringExtension');

    describe('HebrewBasePartViewModel', function () {
        var list = [{ 'dataCode': 1, 'dataText': 'תשרי' }, { 'dataCode': 2, 'dataText': 'חשון' }, { 'dataCode': 3, 'dataText': 'כסלו' }];
        var fullfieldPromise = Q.fcall(function () {
            return 10;
        });
        var rejectedPromise = Q.fcall(function () {
            var error = new Error('Cant do it');
            error.url = 'fakeUrl';
            error.method = 'GET';
            throw error;
        });
        var hebrewBasePartViewModel;
        var settings = { title: 'תאריך פטירה עברי', request: fullfieldPromise };
        it('should be defined', function () {
            expect(HebrewBasePartViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(BasePartViewModel, 'call').and.callThrough();
            hebrewBasePartViewModel = new HebrewBasePartViewModel(settings);
        });
        it('should be innherited from BasePartViewModel class', function () {
            expect(Object.getPrototypeOf(hebrewBasePartViewModel) instanceof BasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is  HebrewBasePartViewModel class', function () {
            expect(Object.getPrototypeOf(hebrewBasePartViewModel).constructor).toBe(HebrewBasePartViewModel);
        });
        it('return an instance of HebrewBasePartViewModel class', function () {
            expect(hebrewBasePartViewModel instanceof HebrewBasePartViewModel).toBeTruthy();
        });

        it('model shuold be definde', function () {
            var model = hebrewBasePartViewModel.getModel();
            expect(model).toBeDefined();
            expect(model.data.dataCode).toBeDefined();
            expect(model.data.dataText).toBeDefined();
        });
        it('settings pass to BasePartViewModel', function () {
            expect(BasePartViewModel.call.calls.first().args[1]).toEqual(settings);
        });

        describe('model.data.dataCode schemaType', function () {
            it('should be defined', function () {
                var model = hebrewBasePartViewModel.getModel();
                expect(model.data.dataCode.schemaType).toBeDefined();
            });
            it('schemaType is number', function () {
                var model = hebrewBasePartViewModel.getModel();
                expect(model.data.dataCode.schemaType).toEqual('number');
            });
        });

        describe('logic', function () {
            describe('subscribe on model.dataCode update model.dataText', function () {
                beforeEach(function () {
                    hebrewBasePartViewModel.list(list);
                });
                it('valid dataCode', function (done) {
                    hebrewBasePartViewModel.data.dataCode(2);
                    fullfieldPromise.then(function () {
                        expect(hebrewBasePartViewModel.data.dataText()).toEqual('חשון');
                        done();
                    });
                });
                it('invalid dataCode', function (done) {
                    hebrewBasePartViewModel.data.dataCode(8);
                    fullfieldPromise.then(function () {
                        expect(hebrewBasePartViewModel.data.dataText()).toBe(undefined);
                        done();
                    });
                });
            });
            describe('handleRequest', function () {
                var _errorMessage = '';
                beforeEach(function () {

                    spyOn(tfsMethods.dialog, 'alert').and.callFake(function (errorMessage) {
                        expect(errorMessage).toEqual(_errorMessage);
                    });
                });

                it('fullfield request', function (done) {
                    spyOn(hebrewBasePartViewModel, 'handleRequestResult').and.callThrough();
                    hebrewBasePartViewModel.handleRequest(fullfieldPromise);
                    fullfieldPromise.then(function () {
                        expect(hebrewBasePartViewModel.handleRequestResult).toHaveBeenCalled();
                        done();
                    });
                });
                it('rejected request', function (done) {
                    hebrewBasePartViewModel.handleRequest(rejectedPromise);
                    rejectedPromise.fail(function () {
                        _errorMessage = stringExtension.format(exeptionMessages.serverCallFailed, 'fakeUrl');
                        done();
                    });
                });
                it('failing in handleRequestResult section', function (done) {
                    spyOn(hebrewBasePartViewModel, 'handleRequestResult').and.throwError(stringExtension.format(exeptionMessages.functionNotImplemented, 'handleRequestResult'));
                    hebrewBasePartViewModel.handleRequest(fullfieldPromise);
                    fullfieldPromise.then(function () {
                        done();
                    }).catch(function (error) {
                        _errorMessage = error.message;
                        done();
                    });
                });
            });
            describe('isFull', function () {
                it('valid value', function () {
                    hebrewBasePartViewModel.data.dataCode(2);
                    expect(HebrewBasePartViewModel.isFull(hebrewBasePartViewModel)).toBeTruthy();
                });
                it('invalid value', function () {
                    expect(HebrewBasePartViewModel.isFull(hebrewBasePartViewModel)).toBeFalsy();
                    expect(HebrewBasePartViewModel.isFull('fff')).toBeFalsy();
                });
            });
        });
    });
});