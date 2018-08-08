define(['common/components/dialog/dialog',
    'common/external/q',
     'common/core/formMode',
    'common/viewModels/languageViewModel'
], function (dialog, Q, formMode, languageViewModel) {//eslint-disable-line max-params

    const defaultSettings = {
        modal: true,
        title: '',
        message: '',
        autoOpen: true,
        width: 300,
        resizable: false,
        closeText: ''
    };
    //for prevent fail in another tests
    const orginalDialogMethod = $.fn.dialog;
    describe('Open', function () {
        beforeAll(function () {
            languageViewModel.language('hebrew');
            $.fn.dialog = jasmine.createSpy();
        });
        afterAll(function () {//eslint-disable-line no-undef
            $.fn.dialog.isSpy = false;
            $.fn.dialog = orginalDialogMethod;
        });
        afterEach(function () {
            $.fn.dialog.calls.reset();
        });
        it('should be a function', function () {
            expect(dialog.open).toBeDefined();
            expect(typeof dialog.open).toBe('function');
        });

        it('dialog should be opened ', function () {
            dialog.open();
            expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

        });
        it('dialog by selector should open the selected element', function () {
            const selectorObject = $('#dialogSelector');
            dialog.open({ selector: '#dialogSelector' });
            expect($.fn.dialog.calls.mostRecent()).toEqual(jasmine.objectContaining({ object: selectorObject }));
        });
        describe('with settings', function () {
            it('undefined should open empty dialog', function () {
                dialog.open(undefined);
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

            });
            it('numeric should open empty dialog', function () {
                dialog.open(1);
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

            });
            it('contains empty selector should open messageDialog', function () {
                dialog.open({ selector: '' });
                const dialogSelector = $('#messageDialog');
                expect($.fn.dialog.calls.mostRecent()).toEqual(jasmine.objectContaining({ object: dialogSelector }));
            });
        });

        it('dialog should not contain buttons ', function () {
            dialog.open();
            expect($.fn.dialog.calls.mostRecent().args[0].buttons.length).toBe(0);
        });

        it('dialog - content should match the sender message', function () {
            const message = 'message';
            dialog.open({ message: message });
            expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining({ message: message }));
        });


    });
    describe('Alert', function () {
        beforeAll(function () {
            languageViewModel.language('hebrew');
            $.fn.dialog = jasmine.createSpy();
        });
        afterAll(function () {//eslint-disable-line no-undef
            $.fn.dialog.isSpy = false;
            $.fn.dialog = orginalDialogMethod;

        });
        afterEach(function () {
            $.fn.dialog.calls.reset();
        });
        it('should be a function', function () {
            expect(dialog.alert).toBeDefined();
            expect(typeof dialog.alert).toBe('function');
        });

        it(' should be opened ', function () {
            dialog.alert();
            expect($.fn.dialog).toHaveBeenCalled();
        });
        it('open by selector should open the selected element', function () {
            const selectorObject = $('#dialogSelector');
            dialog.alert({ selector: '#dialogSelector' });
            expect($.fn.dialog.calls.mostRecent()).toEqual(jasmine.objectContaining({ object: selectorObject }));
        });
        describe('with settings', function () {
            it('undefined should open empty alert', function () {
                dialog.alert(undefined);
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

            });
            it('numeric should open empty dialog', function () {
                dialog.alert(1);
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

            });
            it('contains empty selector should open messageDialog', function () {
                dialog.alert({ selector: '' });
                const dialogSelector = $('#messageDialog');
                expect($.fn.dialog.calls.mostRecent()).toEqual(jasmine.objectContaining({ object: dialogSelector }));
            });
            it('contains buttonTexts should change the button text', function () {
                var defer = Q.defer();
                dialog.confirm({ buttonTexts: { hebrew: { ok: 'כן' } } });
                expect(dialog.dialogTypes(defer).confirm.buttons[0].text).toEqual('כן');

            });
        });

        it('dialog should contain a single button ', function () {
            dialog.alert();
            expect($.fn.dialog.calls.mostRecent().args[0].buttons.length).toBe(1);
        });

        it('dialog - content should match the sender message', function () {
            const message = 'message';
            dialog.alert({ message: message });
            expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining({ message: message }));
        });
        it('dialog - close function should be called and promise resolved by ok click ', function () {
            const defer = Q.defer();
            defer.resolve = jasmine.createSpy();
            const buttons = dialog.dialogTypes(defer).alert.buttons;
            buttons[0].click();
            expect($.fn.dialog).toHaveBeenCalledWith('close');
            expect(defer.resolve).toHaveBeenCalled();
        });

    });
    describe('Confirm', function () {

        beforeAll(function () {
            languageViewModel.language('hebrew');
            $.fn.dialog = jasmine.createSpy();
        });
        afterAll(function () {//eslint-disable-line no-undef
            $.fn.dialog.isSpy = false;
            $.fn.dialog = orginalDialogMethod;

        });
        afterEach(function () {
            $.fn.dialog.calls.reset();
        });
        it('should be a function', function () {
            expect(dialog.confirm).toBeDefined();
            expect(typeof dialog.confirm).toBe('function');
        });

        it('dialog should be opened ', function () {
            dialog.confirm();
            expect($.fn.dialog).toHaveBeenCalled();
        });

        it('dialog by selector should open the selected element', function () {
            const selectorObject = $('#dialogSelector');
            dialog.confirm({ selector: '#dialogSelector' });
            expect($.fn.dialog.calls.all()).toEqual([jasmine.objectContaining({ object: selectorObject })]);
        });
        describe('with settings', function () {
            it('undefined should open empty alert', function () {
                dialog.confirm(undefined);
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

            });
            it('numeric should open empty dialog', function () {
                dialog.confirm(1);
                expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining(defaultSettings));

            });
            it('contains empty selector should open messageDialog', function () {
                dialog.confirm({ selector: '' });
                const dialogSelector = $('#messageDialog');
                expect($.fn.dialog.calls.all()).toEqual([jasmine.objectContaining({ object: dialogSelector })]);
            });
            it('contains buttonTexts should change the buttons texts', function () {
                var defer = Q.defer();
                dialog.confirm({ buttonTexts: { hebrew: { ok: 'כן', cancel: 'לא' } } });
                expect(dialog.dialogTypes(defer).confirm.buttons[0].text).toEqual('כן');
                expect(dialog.dialogTypes(defer).confirm.buttons[1].text).toEqual('לא');

            });

        });


        it('dialog should contain 2 buttons ', function () {
            dialog.confirm();
            expect($.fn.dialog.calls.mostRecent().args[0].buttons.length).toBe(2);
        });

        it('dialog - content should match the sender message', function () {
            const message = 'message';
            dialog.confirm({ message: message });
            expect($.fn.dialog).toHaveBeenCalledWith(jasmine.objectContaining({ message: message }));
        });
        it('dialog - buttons texts should be default texts', function () {
            const defer = Q.defer();
            dialog.confirm();
            expect(dialog.dialogTypes(defer).confirm.buttons[0].text).toEqual('אישור');
            expect(dialog.dialogTypes(defer).confirm.buttons[1].text).toEqual('ביטול');
        });
        it('dialog - ok button - dialog have been called and promise resolved', function () {
            const defer = Q.defer();
            dialog.dialogTypes(defer).confirm.buttons[0].click();
            expect($.fn.dialog).toHaveBeenCalledWith('close');
            expect(Q.isFulfilled(defer.promise)).toBe(true);
        });
        it('dialog - cancel button - dialog have been called and promise resolved', function () {
            const defer = Q.defer();
            defer.reject = jasmine.createSpy();
            const buttons = dialog.dialogTypes(defer).confirm.buttons;
            buttons[1].click();
            expect($.fn.dialog).toHaveBeenCalledWith('close');
            expect(defer.reject).toHaveBeenCalled();
        });

    });

    describe('dependency on form mode', function () {
        beforeAll(function () {
            $.fn.dialog = jasmine.createSpy();
        });
      
        it('in pdf mode - dialog is NOT opened', function () {
            spyOn(formMode, 'isPdf').and.returnValue(true);
            dialog.confirm();
            expect($.fn.dialog).not.toHaveBeenCalled();
        });
        it('in client mode - dialog is opened', function () {
            spyOn(formMode, 'isPdf').and.returnValue(false);
            dialog.confirm();
            expect($.fn.dialog).toHaveBeenCalled();
        });
        afterAll(function () {//eslint-disable-line no-undef
            $.fn.dialog.isSpy = false;
            $.fn.dialog = orginalDialogMethod;

        });
    });
});