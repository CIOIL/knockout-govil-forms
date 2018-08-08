
define([],()=> {

    const hybridTableTypeExtender = (type, params) => {
        class HybridTableType extends type {

            constructor() {
                super(params);
                this.isOpenContent = ko.observable(true);
            }
        }
        return HybridTableType;

    };
    return hybridTableTypeExtender;

  
});