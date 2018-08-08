define(['common/components/toolbar/toolbarVM', 'common/components/helpAndInfo/helpAndInformation', 'common/components/saveForm/saveFormVM', 'common/actions/submit', 'common/actions/print', 'common/actions/validate', 'common/external/q', 'common/components/navigation/containersViewModel', 'common/utilities/userBrowser', 'common/components/formInformation/formInformationViewModel', 'common/resources/govFormsPages'], function (toolbarVM, helpAndInfo, saveFormVM, submitAction, printAction, validateAction, Q, containersViewModel, userBrowser) {
    //eslint-disable-line max-params

    var helpAndInformation = helpAndInfo.initHelpAndInformationMenue({});
    var toolbar = void 0;

    describe('params', function () {
        it('initToolbarVM without toggleInformationMenue fail', function () {
            expect(function () {
                toolbar = toolbarVM.initToolbarVM();
            }).toThrow();
        });
    });

    describe('buttons visibility ', function () {
        describe('submit', function () {
            it('enable by default', function () {
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                expect(toolbar.isSubmitEnable()).toEqual(true);
            });
            it('enable by computed', function () {
                var submitEnable = ko.observable(true);
                var settings = { submit: ko.computed(function () {
                        return submitEnable();
                    }) };
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                submitEnable(false);
                expect(toolbar.isSubmitEnable()).toEqual(false);
            });
        });
        describe('print', function () {
            it('enable by default', function () {
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                expect(toolbar.isPrintEnable()).toEqual(true);
            });
            it('enable by computed', function () {
                var printEnable = ko.observable(true);
                var settings = { print: ko.computed(function () {
                        return printEnable();
                    }) };
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                printEnable(false);
                expect(toolbar.isPrintEnable()).toEqual(false);
            });
        });
        describe('validate', function () {
            it('enable by default', function () {
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                expect(toolbar.isValidateEnable()).toEqual(true);
            });
            it('enable by computed', function () {
                var validateEnable = ko.observable(true);
                var settings = { validate: ko.computed(function () {
                        return validateEnable();
                    }) };
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                validateEnable(false);
                expect(toolbar.isValidateEnable()).toEqual(false);
            });
        });
        describe('save', function () {
            it('enable by default', function () {
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                expect(toolbar.isSaveEnable()).toEqual(true);
            });
            it('enable by computed', function () {
                var saveEnable = ko.observable(true);
                var settings = { save: ko.computed(function () {
                        return saveEnable();
                    }) };
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                saveEnable(false);
                expect(toolbar.isSaveEnable()).toEqual(false);
            });
        });
        describe('saveAsPDF', function () {
            it('enable by default', function () {
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                expect(toolbar.isSaveAsPdfEnable()).toEqual(true);
            });
            it('enable by computed', function () {
                var saveAsPDFEnable = ko.observable(true);
                var settings = { saveAsPdf: ko.computed(function () {
                        return saveAsPDFEnable();
                    }) };
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                saveAsPDFEnable(false);
                expect(toolbar.isSaveAsPdfEnable()).toEqual(false);
            });
            it('disable in mobile', function () {
                spyOn(userBrowser, 'isMobile').and.returnValue(true);
                var saveAsPDFEnable = ko.observable(true);
                var settings = { saveAsPdf: ko.computed(function () {
                        return saveAsPDFEnable();
                    }) };
                toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                expect(toolbar.isSaveAsPdfEnable()).toEqual(false);
            });
        });
        describe('drawers and tabs', function () {
            describe('isTabsMode is true', function () {
                it('drawers enable by default', function () {
                    containersViewModel.isTabsMode(true);
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                    expect(toolbar.isDrawersEnable()).toEqual(true);
                });
                it('tabs disabled by default', function () {
                    containersViewModel.isTabsMode(true);
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                    expect(toolbar.isTabsEnable()).toEqual(false);
                });
                it('drawers enable by computed', function () {
                    containersViewModel.isTabsMode(true);
                    var changeViewEnable = ko.observable(true);
                    var settings = { changeView: ko.computed(function () {
                            return changeViewEnable();
                        }) };
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                    changeViewEnable(false);
                    expect(toolbar.isDrawersEnable()).toEqual(false);
                });
                it('tabs enable by computed', function () {
                    containersViewModel.isTabsMode(true);
                    var changeViewEnable = ko.observable(true);
                    var settings = { changeView: ko.computed(function () {
                            return changeViewEnable();
                        }) };
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                    expect(toolbar.isTabsEnable()).toEqual(false);
                });
            });
            describe('isTabsMode is false', function () {
                it('drawers disabled by default', function () {
                    containersViewModel.isTabsMode(false);
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                    expect(toolbar.isDrawersEnable()).toEqual(false);
                });
                it('tabs enable by default', function () {
                    containersViewModel.isTabsMode(false);
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
                    expect(toolbar.isTabsEnable()).toEqual(true);
                });
                it('drawers enable by computed', function () {
                    containersViewModel.isTabsMode(false);
                    var changeViewEnable = ko.observable(true);
                    var settings = { changeView: ko.computed(function () {
                            return changeViewEnable();
                        }) };
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                    expect(toolbar.isDrawersEnable()).toEqual(false);
                });
                it('tabs enable by computed', function () {
                    containersViewModel.isTabsMode(false);
                    var changeViewEnable = ko.observable(true);
                    var settings = { changeView: ko.computed(function () {
                            return changeViewEnable();
                        }) };
                    toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue, toolbarButtons: settings });
                    changeViewEnable(false);
                    expect(toolbar.isTabsEnable()).toEqual(false);
                });
            });
        });
    });

    describe('actions', function () {
        beforeEach(function () {
            toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
        });

        it('startSaveProcess', function () {
            spyOn(saveFormVM, 'openSaveModal');
            toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
            toolbar.startSaveProcess();
            expect(saveFormVM.openSaveModal).toHaveBeenCalled();
        });

        it('submitForm', function () {
            spyOn(submitAction, 'submitForm');
            toolbar.submitForm();
            expect(submitAction.submitForm).toHaveBeenCalled();
        });

        it('printForm', function () {
            spyOn(printAction, 'printForm');
            toolbar.printForm();
            expect(printAction.printForm).toHaveBeenCalled();
        });

        it('validateForm', function () {
            spyOn(validateAction, 'validateForm');
            toolbar.validateForm();
            expect(validateAction.validateForm).toHaveBeenCalled();
        });

        it('openFullView', function () {
            toolbar.openFullView();
            expect(containersViewModel.isTabsMode()).toEqual(false);
        });

        it('openTabsView', function () {
            toolbar.openTabsView();
            expect(containersViewModel.isTabsMode()).toEqual(true);
        });

        it('Help Menue is close', function () {
            spyOn(helpAndInformation, 'toggleInformationMenue');
            toolbar = toolbarVM.initToolbarVM({ toggleInformationMenue: helpAndInformation.toggleInformationMenue });
            toolbar.toggleInformationMenue();
            expect(helpAndInformation.toggleInformationMenue).toHaveBeenCalled();
        });
    });
});