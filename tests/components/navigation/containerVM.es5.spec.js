define(['common/components/navigation/ContainerVM', 'common/components/navigation/containersViewModel', 'common/ko/utils/tlpReset'], function (Container, containersViewModel) {
    //eslint-disable-line no-unused-vars

    describe('containerVM', function () {
        var errorMessages = {
            cantDeclare: 'Cannot declare containerVM without name',
            containerNotFound: 'This container is not found',
            shouldReturnBool: 'The returned type must be boolean',
            containerNotEnabled: 'This container is not enabled',
            containersViewModel: 'containersViewModel not provided or not valid'
        };
        var containerOne;

        it('should be defined', function () {
            expect(Container).toBeDefined();
        });

        describe('create an instance', function () {

            it('fail if containersViewModel not sent', function () {
                expect(function () {
                    containerOne = new Container({});
                }).toThrowError(errorMessages.containersViewModel);
            });

            it('succeed', function () {
                containerOne = new Container({}, containersViewModel);
                expect(containerOne.isCurrentContainer).toBeDefined();
                expect(containerOne.labels).toBeDefined();
                //expect(containerOne.text).toBeDefined();
                expect(containerOne.longTitle).toBeDefined();
                expect(containerOne.showAlwaysNextButton).toBeDefined();
                expect(containerOne.isEnabled).toBeDefined();
                expect(containerOne.isDisabled).toBeDefined();
                expect(containerOne.init).toBeDefined();
                expect(containerOne.isStateNotValidated).toBeDefined();
                expect(containerOne.isStateInvalid).toBeDefined();
                expect(containerOne.isStateCompleted).toBeDefined();
                expect(containerOne.setDrawerState).toBeDefined();
                expect(containerOne.containersViewModel).toBeDefined();
                expect(containerOne.shouldBeValidated).toBeDefined();
                //expect(containerOne.continueWhenInvalid).toBeDefined();
                expect(containerOne.setValidationState).toBeDefined();
            });
            it('container core propeties pushed to ko.utils.tlpReset.ignore', function () {
                containerOne = new Container({}, containersViewModel);
                expect(ko.utils.tlpReset.ignore.length === Object.keys(containerOne.getModel()).length);
            });
        });
    });
});

define('spec/openCloseSpec.js', function () {});