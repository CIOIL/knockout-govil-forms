define(['common/ko/extenders/tlpTrim'],
function (tlpTrim) {//eslint-disable-line no-unused-vars

    describe('tlpTrim extender', function () {
        ko.cleanNode(document.body);
        var number7 = 7777777, number5 = 555;

        var viewModel = (function () {
            var userName = ko.observable('avic').extend({ tlpTrim: 'trimRight' });
            var firstName = ko.observable('Avi').extend({ tlpTrim: 'trimRight' });
            var lastName = ko.observable('Cohen').extend({ tlpTrim: 'trimLeft' });
            var email = ko.observable('email').extend({ tlpTrim: 'trimLeft' });
            var phone = ko.observable().extend({ tlpTrim: 'trimLeft' });
            var fax = ko.observable(number7).extend({ tlpTrim: 'trimRight' });
            var petName = ko.observable('avic').extend({ tlpTrim: null });
            var doctorsName = ko.observable('Avi').extend({ tlpTrim: null });
            var nameChanged = ko.observable(false);


            return {
                petName: petName,
                doctorsName: doctorsName,
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                fax: fax,
                nameChanged: nameChanged
            };
        }());

        viewModel.firstName.subscribe(function () {
            viewModel.nameChanged(true);
        });

        viewModel.lastName.subscribe(function () {
            viewModel.nameChanged(true);
        });

        describe('trim', function () {

            beforeEach(function () {
                viewModel.petName('avic');
                viewModel.doctorsName('email');
            });

            it('should trim spaces at the beginning of the string', function () {
                viewModel.petName('   Cohen');
                expect(viewModel.petName()).toEqual('Cohen');
            });

            it('should trim spaces at the end of the string', function () {
                viewModel.petName('Cohen   ');
                expect(viewModel.petName()).toEqual('Cohen');
            });

            it('should not trim spaces at the middle of the string', function () {
                viewModel.petName('C o h e n');
                expect(viewModel.petName()).toEqual('C o h e n');
            });

            it('should remove spaces only from the beginning and the end', function () {
                viewModel.petName('   D a n i   ');
                expect(viewModel.petName()).toEqual('D a n i');
            });

            it('should default to trim on both sides', function () {
                viewModel.doctorsName('   aa@bb.cc   ');
                expect(viewModel.doctorsName()).toEqual('aa@bb.cc');
            });


        });

        describe('right trim', function () {

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/extenders/templates';
                loadFixtures('tlpTrim.html');
                ko.applyBindings(viewModel, document.getElementById('firstName'));
                $('#firstName').val('');
                viewModel.firstName('Avi');
            });

            it('should trim spaces at the end of the string', function () {
                viewModel.firstName('Avi   ');
                expect(viewModel.firstName()).toEqual('Avi');
            });

            it('should trim tabs at the end of the string', function () {
                viewModel.firstName('Avi        ');
                expect(viewModel.firstName()).toEqual('Avi');
            });

            it('should not trim spaces at the beginning of the string', function () {
                viewModel.firstName('   Avi');
                expect(viewModel.firstName()).toEqual('   Avi');
            });

            it('should not trim spaces at the middle of the string', function () {
                viewModel.firstName('A v i');
                expect(viewModel.firstName()).toEqual('A v i');
            });

            it('should notify view upon trim without', function () {
                viewModel.firstName('Avi   ');
                expect($('#firstName').val()).toEqual('Avi');
            });

            it('should notify view upon trim with change', function () {
                viewModel.firstName('   D a n i   ');
                expect($('#firstName').val()).toEqual('   D a n i');
            });


            it('should notify view upon trim with additional leading spaces', function () {
                viewModel.firstName('   Avi   ');
                expect($('#firstName').val()).toEqual('   Avi');
            });


            it('should trim only spaces at the end of the string', function () {
                viewModel.firstName('   D a n i   ');
                expect(viewModel.firstName()).toEqual('   D a n i');
            });

        });

        describe('left trim', function () {

            beforeEach(function () {
                viewModel.lastName('Cohen');
            });

            it('should trim spaces at the beginning of the string', function () {
                viewModel.lastName('   Cohen');
                expect(viewModel.lastName()).toEqual('Cohen');
            });

            it('should trim tabs at the beginning of the string', function () {
                viewModel.lastName('        Cohen');
                expect(viewModel.lastName()).toEqual('Cohen');
            });

            it('should not trim spaces at the end of the string', function () {
                viewModel.lastName('Cohen   ');
                expect(viewModel.lastName()).toEqual('Cohen   ');
            });

            it('should not trim spaces at the middle of the string', function () {
                viewModel.lastName('C o h e n');
                expect(viewModel.lastName()).toEqual('C o h e n');
            });

            it('should trim only spaces at the beginning of the string', function () {
                viewModel.lastName('   D a n i   ');
                expect(viewModel.lastName()).toEqual('D a n i   ');
            });

        });

        describe('none string types', function () {
            it('should not throw errors for initially undefined values', function () {
                expect(viewModel.phone()).toEqual(undefined);
            });

            it('should not throw errors for initially numeric values', function () {
                expect(viewModel.fax()).toEqual(number7);
            });

            it('should not affect changes to undefined', function () {
                viewModel.userName(undefined);
                expect(viewModel.userName()).toEqual(undefined);
            });

            it('should not affect changes to null', function () {
                viewModel.userName(null);
                expect(viewModel.userName()).toEqual(null);
            });

            it('should not affect changes to number', function () {
                viewModel.userName(number5);
                expect(viewModel.userName()).toEqual(number5);
            });

            it('should not throw errors to booleans', function () {
                viewModel.userName(true);
                expect(viewModel.userName()).toEqual(true);
            });

        });

        describe('notify subscribers', function () {

            viewModel.firstName.subscribe(function () {
                viewModel.nameChanged(true);
            });

            beforeEach(function () {
                viewModel.nameChanged(false);
            });

            it('should not notify subscribers when the value was just retreived', function () {
                viewModel.firstName();
                expect(viewModel.nameChanged()).toBeFalsy();
            });

            it('should not notify subscribers when the value was not changed', function () {//spec deactivated due to changes to support clearAfterValidation
                var originalValue = viewModel.firstName();
                viewModel.firstName(originalValue);
                expect(viewModel.nameChanged()).toBeFalsy();
            });


            it('should notify subscribers when the value was trimmed', function () {
                viewModel.firstName('Avi   ');
                expect(viewModel.nameChanged()).toBeTruthy();
            });

            it('should notify subscribers when the value was not trimmed', function () {
                viewModel.firstName('A v i');
                expect(viewModel.nameChanged()).toBeTruthy();
            });

        });
    });

});
define('spec/tlpTrimSpec.js', function () { });
