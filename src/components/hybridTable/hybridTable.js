/** 
* @module hybridtable
* @description module that is responsible for adding hybrid table custom binding and related methods
*/
define(['common/elements/dynamicTable',
        'common/components/hybridTable/hybridTableTypeExtender',
        'common/core/exceptions',
        'common/components/hybridTable/resources',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/bindingHandlers/tlpLock',
        'common/utilities/arrayExtensions'
], (dynamicTable, hybridTableTypeExtender,exceptions, labels) => {//eslint-disable-line max-params
      
    const texts  = ko.multiLanguageObservable({ resource: labels.texts, language: labels.language });
    
    const resources = {
        properties:{
            showElementsIds:'showElementsIds',
            showInOrder:'showInOrder',
            hybridTableType:'hybrid'
        },
        classes:{
            unvisible: 'unshown-element',
            spanLook: 'span-field',
            viewElement: 'shown-element',
            row: 'row'
        },
        events:{
            validateForm:'validateForm'
        },
        selectors:{
            allIds: '*[id]',
            div: 'div',
            elementWrapper: 'div[class^="col-"]',
            invisibleTab: '.invisibleTab'
        },
        errors:{
            tableAccessor: 'table name is missing',
            hybridTablrSettings: 'hybrid table settings must be object',
            showElementsIds:'parameter showElementsIds is null or empty'
        }
    }; 
      
    const addCssBinding = (element,openContentAccessor,isOpenContentAll,className)=> {//eslint-disable-line max-params
        ko.applyBindingsToNode(element, { hybridTableDisplay: openContentAccessor, isOpenContentAll: isOpenContentAll, className: className });
    };
   
    const showElementsInOrder = (element,openContentAccessor,isOpenContentAll,table) => {//eslint-disable-line max-params
        const showElementsIds = table.config[table,resources.properties.showElementsIds];
     
        $(element).children(resources.selectors.div).each((index, elem) =>{
            ko.applyBindingsToNode(elem, { addRemoveClass: openContentAccessor, className: resources.classes.row });
        });
       
        $(element).find(resources.selectors.allIds).each((index, elem) =>{
            let className = resources.classes.unvisible;
            if (showElementsIds.includes(elem.id)) {
                addCssBinding(elem,openContentAccessor,isOpenContentAll,resources.classes.spanLook);
                className = resources.classes.viewElement;
            } 
            const elementWrapper = $(elem).closest(resources.selectors.elementWrapper);
            if(elementWrapper[0] !== 'undefined' && typeof elementWrapper[0] !== 'undefined'){
                addCssBinding(elementWrapper[0],openContentAccessor,isOpenContentAll,className);
            }
        });
    };

    ko.bindingHandlers.bindText = {
        update: (element, valueAccessor) =>{
            const text = valueAccessor();
            ko.applyBindingsToNode(element, { text:  texts()[text],value:  texts()[text] });
        }
    };

    ko.bindingHandlers.addRemoveClass = {
        update: (element, valueAccessor, allBindingsAccessor) => {
            const bindingsAccessor = allBindingsAccessor();
            const className = bindingsAccessor.className;
            
            const unwrapOpenContentAccessor = ko.utils.unwrapObservable(valueAccessor());
            if(unwrapOpenContentAccessor){
                $(element).addClass(className);
            }
            else{
                $(element).removeClass(className);
            }
        }
    };
      
    /**  
        * <b>ko.bindingHandlers.collapseExpandRow</b> - custom binding collapse/expand all rows 
        * @memberof ko         
        * @function "ko.bindingHandlers.collapseExpandAll"
        * @description custom binding that handles click on collapse/expand button. when clicking on expand button all table rows are open, 
            when clicking on collapse button all table rows are closed. 
        * @param {ko.observable} valueAccessor: isOpenContent, a property of hybrid table observableArray.
        * @param {ko.observable} table: id of observableArray that holds table data.
        * @see example of usage in form
        * https://forms.gov.il/globaldata/getsequence/getHtmlForm.aspx?formType=componentsdemo@test.gov.il
        */
    ko.bindingHandlers.collapseExpandAll = {
        init: (element, valueAccessor, allBindingsAccessor) => {
            const openContentAccessor = valueAccessor();
            const table = allBindingsAccessor().table;
            if (typeof table === 'undefined') {
                exceptions.throwFormError(resources.errors.tableAccessor);
            }
            
            const isOpenContentAll = table.isOpenContent;

            const collapseExpandAll = () => {
                isOpenContentAll(openContentAccessor);
            };
        
            ko.applyBindingsToNode(element, { click: collapseExpandAll});
        }
    };

    /** 
        * <b>ko.bindingHandlers.collapseExpandRow</b> - custom binding collapse/expand row   
        * @memberof ko         
        * @function "ko.bindingHandlers.collapseExpandRow"
        * @description custom binding that handles click on collapse/expand button for specific row. when clicking on expand button row is open, when clicking on collapse button row is closed.
            when the row is collapsed will appear display mode with the fileds that configured to be display ,looking like a span.
        * @param {ko.observable} valueAccessor: isOpenContent, a property of row hybrid table.
        * @param {ko.observable} table: id of observableArray that holds table data.
        * @see example of usage in form
        * https://forms.gov.il/globaldata/getsequence/getHtmlForm.aspx?formType=componentsdemo@test.gov.il
        */
    ko.bindingHandlers.collapseExpandRow = {
        init: (element, valueAccessor, allBindingsAccessor, viewModel) =>{ //eslint-disable-line max-params
            const openContentAccessor = valueAccessor();
            const table = allBindingsAccessor().table;
            if (typeof table === 'undefined') {
                exceptions.throwFormError(resources.errors.tableAccessor);
            }
                        
            const isOpenContentAll = table.isOpenContent;
            const showInOrder = table.config[table,resources.properties.showInOrder];

            if(showInOrder){
                showElementsInOrder(element,openContentAccessor,isOpenContentAll,table);
            }
            else{
                addCssBinding(element,openContentAccessor,isOpenContentAll,resources.classes.unvisible);
            }

            ko.postbox.subscribe(resources.events.validateForm, () => {
                if ($(element).parents(resources.selectors.invisibleTab).length === 0) {
                    if (viewModel.validateModel() === false) {
                        openContentAccessor(true);
                    }
                }
            });
        }
    };

    ko.bindingHandlers.hybridTableDisplay = {
        update: (element, valueAccessor, allBindingsAccessor) => {
            const bindingsAccessor = allBindingsAccessor();
            const openContentAccessor = valueAccessor();
            const className = bindingsAccessor.className;
            const isOpenContentAll = bindingsAccessor.isOpenContentAll;

            isOpenContentAll.subscribe((newValue) =>{
                openContentAccessor(newValue);
            });

            const unwrapOpenContentAccessor = ko.utils.unwrapObservable(openContentAccessor());
            const cssSettingsAccessor = () => {
                const css = {};
                css[className] = !unwrapOpenContentAccessor;
                return css;
            };
            ko.applyBindingsToNode(element, { tlpLock: !unwrapOpenContentAccessor });
            ko.bindingHandlers.css.update(element, cssSettingsAccessor, allBindingsAccessor);
        }
    };

        /* <b>ko.extenders.hybridTable</b> - extender for adding hybrid table configuration   
        * @memberof ko         
        * @function "ko.extenders.hybridTable"
        * @description extends obsevaleArray of dynmic table, adds observable : isOpenContent on observablArray for indication if all rows in table are open / close.
            adds hybrid table configuration to observableArray config- 
            showElementsIds : array of Id's that will be display in collapsed mode,
            showInOrder : gets true or false, if the fields in collapsed mode will show in the order thar thay appear in expand mode.
            openContenAfterImport: if the rows will be open or clse after import.
        * @param {object} settings: contains all configuration for hybrid table are not default.
        * @example .extend({ hybridTable: { showElementsIds: [] } }), either: .extend({ hybridTable: { showInOrder: false } })
        * @see example of usage in form
        * https://forms.gov.il/globaldata/getsequence/getHtmlForm.aspx?formType=componentsdemo@test.gov.il
        */
    ko.extenders.hybridTable = (target, settings = {}) =>{
        let { showElementsIds = [], openContent = true,openContenAfterImport = false,showInOrder = true } = settings;
        if(typeof settings !== 'object'){
            exceptions.throwFormError(resources.errors.hybridTablrSettings);
        }        
        if(showInOrder && showElementsIds.length === 0){
            exceptions.throwFormError(resources.errors.showElementsIds);
        }

        target.isOpenContent = ko.observable(openContent).extend({ notify: 'always' });
        const defaultSettings = {showElementsIds,openContent ,openContenAfterImport,showInOrder};
        target.config = Object.assign({}, target.config ,{tableType:resources.properties.hybridTableType}, defaultSettings);
    };
    
    
    const hybridTable = Object.assign({}, dynamicTable, { hybridTableTypeExtender: hybridTableTypeExtender });
    return hybridTable;

});
