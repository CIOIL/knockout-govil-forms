define(['common/viewModels/ModularViewModel'],
    function (ModularViewModel) {
        class BaseItemType extends ModularViewModel {
            constructor(settings) {
                super(settings);
                this.model = { isRowOpen: ko.observable(false) };
                this.setModel(this.model);
            }
           
            openRow  () {
                this.model.isRowOpen(true);
            }

            closeRow () {
                this.model.isRowOpen(false);
            }        
        }
        return BaseItemType;
    });