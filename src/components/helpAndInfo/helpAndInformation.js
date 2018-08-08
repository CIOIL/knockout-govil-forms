define(['common/components/formInformation/formInformationViewModel',
        'common/components/support/supportViewModel', 
        'common/components/helpAndInfo/texts',
        'common/core/exceptions',
        'common/ko/globals/multiLanguageObservable'
],
function (formInformation, support, texts, formExceptions) {//eslint-disable-line max-params
    const labels = ko.multiLanguageObservable({ resource: texts });

    const initHelpAndInformationMenue = function ( {officeInformation, additionalInformation, instructions}) {
        const isInformationMenueOpen = ko.observable(false);
        const defaultInstructions = {name: 'instructions'};
        const exceptionMessages = {
            componentStructure: 'content nust be object with name property'
        };
        
        const validateComponentStructure = function(componentObjects){
            componentObjects.forEach((component)=> {
                if(component && !component.name){
                    formExceptions.throwFormError(exceptionMessages.itemTextIsRequired);
                }
            });
        };

        const registerDefaultInstructionsComponenet = function(){
            if (instructions){
                return;
            }
            ko.components.register(defaultInstructions.name, {template: { element: 'baseInstructions' },viewModel: function () { this.labels = labels; }});
            instructions = defaultInstructions;
        };

        validateComponentStructure([officeInformation, additionalInformation, instructions]);
        registerDefaultInstructionsComponenet();

        const toggleInformationMenue = function (newVal) {
            if (newVal !== undefined){
                isInformationMenueOpen(newVal);
                return;
            }
            const currentVal = ko.unwrap(isInformationMenueOpen);
            isInformationMenueOpen(!currentVal);
        };
        return {
            isInformationMenueOpen,
            support,
            formInformation,
            toggleInformationMenue,
            labels,
            additionalInformation,
            instructions,
            officeInformation
        };
    };
    return {
        initHelpAndInformationMenue,
        labels
    };
});
