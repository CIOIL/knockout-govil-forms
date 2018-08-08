define(['common/viewModels/baseFormViewModel', 'common/components/navigation/containersViewModel', 'common/components/navigation/ContainerVM', 'common/external/q', 'common/components/navigation/utils', 'common/accessibility/utilities/accessibilityMethods'], function (baseFormViewModel, containersViewModel, ContainerVM, Q, navigationUtils, accessibilityMethods) {
    //eslint-disable-line max-params

    describe('baseFormViewModel', function () {

        beforeAll(function () {
            var requestDetailsResources = {
                texts: {
                    hebrew: {
                        title: 'מגיש הבקשה',
                        longTitle: 'פרטי מגיש הבקשה'
                    }
                }
            };
            var model = {
                userFirstName: ko.observable('Moshe').extend({ required: true }),
                userLastName: ko.observable(''),
                idnum: ko.observable('')
            };
            var requestDetails = new ContainerVM(requestDetailsResources, containersViewModel);
            requestDetails.setModel(model);

            var addressDetailsResources = {
                texts: {
                    hebrew: {
                        title: 'כתובת',
                        longTitle: 'פרטי כתובת'
                    }
                }
            };
            var addressModel = {
                street: ko.observable('Hazait').extend({ required: true }),
                houseNumber: ko.observable('')
            };
            var addressDetails = new ContainerVM(addressDetailsResources, containersViewModel);
            addressDetails.setModel(addressModel);

            var commentsResources = {
                texts: {
                    hebrew: {
                        title: 'הערות',
                        longTitle: 'הערות'
                    }
                },
                isEnabled: false
            };
            var commentsModel = {
                comment: ko.observable('')
            };
            var comments = new ContainerVM(commentsResources, containersViewModel);
            comments.setModel(commentsModel);

            var contactsDetailsResources = {
                texts: {
                    hebrew: {
                        title: 'אנשי קשר',
                        longTitle: 'אנשי קשר'
                    }
                },
                isEnabled: true
            };
            var contactsDetailsModel = {
                name: ko.observable(''),
                lastName: ko.observable('')
            };
            var contactsDetails = new ContainerVM(contactsDetailsResources, containersViewModel);
            contactsDetails.setModel(contactsDetailsModel);

            var mainModel = {
                requestDetails: requestDetails,
                addressDetails: addressDetails,
                comments: comments,
                contactsDetails: contactsDetails
            };

            baseFormViewModel.setModel(mainModel);

            baseFormViewModel.containersViewModel.containersList.removeAll();

            baseFormViewModel.containersViewModel.loadContainers({
                requestDetails: requestDetails,
                addressDetails: addressDetails,
                comments: comments,
                contactsDetails: contactsDetails
            });
        });

        it('functions should be defined', function () {
            expect(baseFormViewModel).toBeDefined();
            expect(baseFormViewModel.loadViewModel).toBeDefined();
            expect(baseFormViewModel.saveViewModel).toBeDefined();
            expect(baseFormViewModel.validateForm).toBeDefined();
        });

        it('model properties should be defined', function () {
            expect(baseFormViewModel.containersViewModel).toBeDefined();
            expect(baseFormViewModel.formInformation).toBeDefined();
        });

        describe('validateForm function', function () {

            it('valid form', function (done) {

                var isValid;
                var defer = Q.defer();

                baseFormViewModel.validateForm(defer);

                defer.promise.then(function () {
                    isValid = true;
                    expect(isValid).toBeTruthy();
                    done();
                }).catch(function () {
                    isValid = false;
                    expect(isValid).toBeTruthy();
                    done();
                });
            });

            it('invalid form', function (done) {

                baseFormViewModel.containersViewModel.addressDetails.street('');

                spyOn(containersViewModel, 'navigate').and.callThrough();
                spyOn(navigationUtils, 'setValidationFocus');
                spyOn(accessibilityMethods, 'appendNotifyElement');

                var isValid;
                var defer = Q.defer();
                var currentContainer = baseFormViewModel.containersViewModel.requestDetails;
                var invalidContainer = baseFormViewModel.containersViewModel.addressDetails;
                var focusDelay = 600;

                baseFormViewModel.validateForm(defer);

                defer.promise.then(function () {
                    isValid = true;
                }).catch(function () {
                    isValid = false;
                });

                setTimeout(function () {
                    expect(isValid).toBeFalsy();
                    expect(containersViewModel.navigate).toHaveBeenCalledWith(currentContainer, invalidContainer);
                    expect(accessibilityMethods.appendNotifyElement).toHaveBeenCalled();

                    setTimeout(function () {
                        expect(navigationUtils.setValidationFocus).toHaveBeenCalled();
                        done();
                    }, focusDelay);
                    baseFormViewModel.containersViewModel.addressDetails.street('Hazait');
                }, 10);
            });
        });

        describe('saveViewModel function', function () {

            it('save data', function () {
                baseFormViewModel.saveViewModel();
                expect(baseFormViewModel.formInformation.dataModelSaver()).not.toEqual('');
            });

            it('save data without disabled containers', function () {
                baseFormViewModel.saveViewModel();
                expect(baseFormViewModel.formInformation.dataModelSaver()).not.toContain('comment');
            });

            it('save data without disabled containers and ignore params', function () {
                baseFormViewModel.saveViewModel({ ignore: ['lastName'] });
                expect(baseFormViewModel.formInformation.dataModelSaver()).not.toContain('lastName');
                expect(baseFormViewModel.formInformation.dataModelSaver()).not.toContain('comment');
            });

            it('save data with disabled containers', function () {
                baseFormViewModel.saveViewModel({ isSvaeDisabledContainers: true });
                expect(baseFormViewModel.formInformation.dataModelSaver()).toContain('comment');
            });
        });

        describe('loadViewModel function', function () {

            it('changing some data after saving the data. then load the saved data - expect to return the original data', function () {

                baseFormViewModel.saveViewModel();
                baseFormViewModel.containersViewModel.requestDetails.userFirstName('Dan');
                baseFormViewModel.loadViewModel(baseFormViewModel.formInformation.dataModelSaver());

                expect(baseFormViewModel.containersViewModel.requestDetails.userFirstName()).toEqual('Moshe');
            });
        });
    });
});