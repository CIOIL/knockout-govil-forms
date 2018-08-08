define(['common/utilities/reflection', 'common/resources/template', 'common/core/exceptions'],
    function (reflection, templateResources, formExceptions) {

        let resources = templateResources;

        const customizeResources = function (newResources) {
            if (typeof newResources !== 'object') {
                throw formExceptions.throwFormError('UIProvider.customizeResources must get object parameter');
            }
            Object.assign(resources, newResources);
        };

        return {
            resources,
            customizeResources
        };

    }); 