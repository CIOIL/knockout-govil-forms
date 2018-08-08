define(['common/components/date/gregorian/gregorianBasePartViewModel', 'common/external/q'],
function (GregorianBasePartViewModel, Q) {

    var BasePartViewModel = require('common/components/date/basePartViewModel');


    describe('GregorianBasePartViewModel', function () {
        var list = [{ 'dataCode': 1, 'dataText': 'ינואר' }, { 'dataCode': 2, 'dataText': 'פברואר' }, { 'dataCode': 3, 'dataText': 'מרץ' }];

        var gregorianBasePartViewModel;
        var settings = { title: 'תאריך פטירה עברי', isRequired: true };
        it('should be defined', function () {
            expect(GregorianBasePartViewModel).toBeDefined();
        });

        beforeEach(function () {
            spyOn(BasePartViewModel, 'call').and.callThrough();
            gregorianBasePartViewModel = new GregorianBasePartViewModel(settings);
        });
        it('should be innherited from BasePartViewModel class', function () {
            expect(Object.getPrototypeOf(gregorianBasePartViewModel) instanceof BasePartViewModel).toBeTruthy();
        });
        it('prototype.constructor is GregorianBasePartViewModel class', function () {
            expect(Object.getPrototypeOf(gregorianBasePartViewModel).constructor).toBe(GregorianBasePartViewModel);
        });
        it('return an instance of GregorianBasePartViewModel class', function () {
            expect(gregorianBasePartViewModel instanceof GregorianBasePartViewModel).toBeTruthy();
        });

        it('model shuold be definde', function () {
            var model = gregorianBasePartViewModel.getModel();
            expect(model).toBeDefined();
            expect(model.data.dataCode).toBeDefined();
            expect(model.data.dataText).toBeDefined();

        });
        it('settings pass to BasePartViewModel', function () {
            expect(BasePartViewModel.call.calls.first().args[1]).toEqual(settings);
        });

        describe('model.data.dataCode schemaType', function () {
            it('should be defined', function () {
                var model = gregorianBasePartViewModel.getModel();
                expect(model.data.dataCode.schemaType).toBeDefined();
            });
            it('schemaType is number', function () {
                var model = gregorianBasePartViewModel.getModel();
                expect(model.data.dataCode.schemaType).toEqual('number');
            });

        });

        describe('deferred model.data', function () {
            it('dateRequest not sent, data should be populated immediately', function () {
                gregorianBasePartViewModel = new GregorianBasePartViewModel(settings);
                gregorianBasePartViewModel.list(list);
                gregorianBasePartViewModel.data.dataCode(1);
                expect(gregorianBasePartViewModel.data.dataText()).toEqual('ינואר');
            });
            it('dateRequest sent, data should wait for promise', function (done) {
                var dateRequest = Q.fcall(function () {
                    return 10;
                });
                gregorianBasePartViewModel = new GregorianBasePartViewModel({ dateRequest: dateRequest });
                gregorianBasePartViewModel.list(list);
                gregorianBasePartViewModel.data.dataCode(1);
                dateRequest.then(function () {
                    expect(gregorianBasePartViewModel.data.dataText()).toEqual('ינואר');
                    done();
                });
            });
        });
        describe('required extend', function () {
            it('Full value - valid ', function () {
                gregorianBasePartViewModel.data.dataCode(5);
                expect(gregorianBasePartViewModel.data.dataCode.isValid()).toBeTruthy();
            });
            it('Without value - invalid', function () {
                expect(gregorianBasePartViewModel.data.dataCode.isValid()).toBeFalsy();

            });
        });
        describe('subscribe on model.dataCode update model.dataText', function () {
            beforeEach(function () {
                gregorianBasePartViewModel.list(list);
            });
            it('valid dataCode', function () {
                gregorianBasePartViewModel.data.dataCode(2);
                expect(gregorianBasePartViewModel.data.dataText()).toEqual('פברואר');
            });
            it('invalid dataCode', function () {
                gregorianBasePartViewModel.data.dataCode(15);//eslint-disable-line no-magic-numbers
                expect(gregorianBasePartViewModel.data.dataText()).toBe(undefined);

            });
        });
        describe('functions', function () {

            describe('isFull', function () {
                it('valid value', function () {
                    gregorianBasePartViewModel.data.dataCode(2);
                    expect(GregorianBasePartViewModel.isFull(gregorianBasePartViewModel)).toBeTruthy();
                });
                it('invalid value - empty dataCode', function () {
                    expect(GregorianBasePartViewModel.isFull(gregorianBasePartViewModel)).toBeFalsy();
                });
                it('invalid value - not of GregorianBasePartViewModel type', function () {
                    expect(GregorianBasePartViewModel.isFull('fff')).toBeFalsy();
                });
            });
        });

    });

    //$(document).ready(function () {
    //    window.executeTests();
    //});

});
