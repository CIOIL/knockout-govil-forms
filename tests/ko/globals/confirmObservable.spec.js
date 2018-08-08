define(['common/ko/globals/confirmObservable',
        'common/viewModels/languageViewModel',
        'common/infrastructureFacade/tfsMethods',
        'common/external/jquery-ui'
],
function (tlpConfirm, languageViewModel, infsMethods) {//eslint-disable-line no-unused-vars
    var viewModel = (function () {
        var name1 = ko.confirmObservable('Noa', { question: 'are you sure?', buttons: { ok: 'yes' } });
        var name2 = ko.confirmObservable('Yaakov', { buttons: { yes: 'yes', cancel: null } });
        return {
            languageViewModel: languageViewModel,
            name1: name1,
            name2: name2
        };
    }());
    ko.cleanNode(document.body);
    ko.applyBindings(viewModel);

    describe('confirmObservable', function () {
        var subscription;
        beforeEach(function () {
            var fakeAgatAccess = function (language) {
                return language;
            };
            spyOn(infsMethods, 'setFormLanguage').and.callFake(fakeAgatAccess);
        });
       
        afterEach(function () {
            if (subscription && typeof subscription.dispose === 'function') {
                subscription.dispose();
            }
        });

        it('confirmObservable is declare on ko', function () {
            expect(ko.confirmObservable).toBeDefined();
        });

        it('with ok', function (done) {
            viewModel.name1('Avi');
            $('.ui-dialog-buttonpane').find('button').get(0).click();
            subscription = viewModel.name1.subscribe(function () {
                expect(viewModel.name1()).toBe('Avi');
                done();
            });


        });
        it('with cancel', function (done) {
            viewModel.name1('Ayala');
            $('.ui-dialog-buttonpane').find('button').get(1).click();
            subscription = viewModel.name1.subscribe(function () {
                expect(viewModel.name1()).toBe('Avi');
                done();
            });
        });
        describe('settings', function () {
            describe('buttons', function () {
                it(' with change', function (done) {
                    viewModel.languageViewModel.language('english');
                    viewModel.name1('Eli');
                    expect($($('.ui-dialog-buttonpane').find('button').get(0)).text()).toEqual('yes');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name1.subscribe(function () {
                        done();
                    });
                });
                it(' without change', function (done) {
                    viewModel.languageViewModel.language('hebrew');
                    viewModel.name1('Racheli');
                    expect($($('.ui-dialog-buttonpane').find('button').get(1)).text()).toEqual('ביטול');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name1.subscribe(function () {
                        done();
                    });
                });
                it(' not valid', function (done) {
                    viewModel.languageViewModel.language('hebrew');
                    viewModel.name2('Riki');
                    expect($($('.ui-dialog-buttonpane').find('button').get(0)).text()).toEqual('אישור');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name2.subscribe(function () {
                        done();
                    });
                });
                it(' null', function (done) {
                    viewModel.name2('Miri');
                    expect($($('.ui-dialog-buttonpane').find('button').get(1)).text()).toEqual('null');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name2.subscribe(function () {
                        done();
                    });
                });
            });
            describe('question', function () {
                it('question without change', function (done) {
                    viewModel.languageViewModel.language('english');
                    viewModel.name1('Sara');
                    expect($('.ui-dialog-content>div>h4').eq(0).text()).toEqual('are you sure?');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name1.subscribe(function () {
                        done();
                    });
                });
                it('question with change', function (done) {
                    viewModel.languageViewModel.language('hebrew');
                    viewModel.name2('Nomi');
                    expect($('.ui-dialog-content>div>h4').eq(0).text()).toEqual('האם אתה בטוח שברצונך לשנות?');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name2.subscribe(function () {
                        done();
                    });
                });
            });
            describe('according the language', function () {
                it('question', function (done) {
                    viewModel.languageViewModel.language('english');
                    viewModel.name2('Elchanan');
                    expect($('.ui-dialog-content>div>h4').eq(0).text()).toEqual('are you sure you want to change?');
                    $('.ui-dialog-buttonpane').find('button').get(1).click();
                    subscription = viewModel.name2.subscribe(function () {
                        done();
                    });
                });
            });
        });
    });

});
define('spec/tlpTrimSpec.js', function () { });
