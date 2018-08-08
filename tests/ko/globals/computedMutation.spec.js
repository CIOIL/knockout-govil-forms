define(['common/ko/globals/computedMutation'],
function () {

    var viewModel = {
        firstName: ko.observable(''),
        lastName: ko.observable(''),
        fullName: ko.observable('')
    };

    viewModel.isDani = ko.computed(function () {
        return viewModel.firstName() === 'Dani';
    });

    viewModel.updateFullName = function () {
        viewModel.fullName(viewModel.firstName() + ' ' + viewModel.lastName());
    };

    viewModel.subscribeToUpdateFullName = ko.computedMutation(
        function () {
            if (viewModel.isDani()) {
                viewModel.updateFullName();
            }
            else {
                viewModel.fullName('');
            }
            return 'some result';
        }
    );

    describe('computedMutation', function () {
        beforeEach(function () {
            viewModel.firstName('');
            viewModel.lastName('');
            viewModel.fullName('');
        });

        it('computedMutation is declare on ko', function () {
            expect(ko.computedMutation).toBeDefined();
        });

        it('on mutation apply function when condition is met', function () {
            spyOn(viewModel, 'updateFullName').and.callThrough();

            viewModel.firstName('Dani');
            viewModel.lastName('Cohen');

            expect(viewModel.updateFullName).toHaveBeenCalled();
            expect(viewModel.fullName()).toEqual('Dani Cohen');
        });

        it('on mutation apply function with improper condition', function () {
            spyOn(viewModel, 'updateFullName');

            viewModel.firstName('avi');

            expect(viewModel.updateFullName).not.toHaveBeenCalled();
            expect(viewModel.fullName()).toEqual('');
        });

    });

});