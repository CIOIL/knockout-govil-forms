define(['common/components/hybridTable/hybridTableTypeExtender' ],
    (hybridTableTypeExtender) => {

        const resources = {
            tableConfiguration: {
                tableType: 'tableType',
                hybrid: 'hybrid',
                openContenAfterImport: 'openContenAfterImport'
            }
        };

        class TableFactory {

            constructor() {

            }
                      
            static getItemByType(table, item) {
                const hybridType = table.config[resources.tableConfiguration.tableType] === resources.tableConfiguration.hybrid || false;
               
                if (hybridType) {
                    return hybridTableTypeExtender(item, table.config.params);
                }
                return item;
            }

            static updateItemAfterImport(table, item) {
                const hybridType = table.config[resources.tableConfiguration.tableType] === resources.tableConfiguration.hybrid || false;
                if (hybridType) {
                    const openContenAfterImport = table.config[resources.tableConfiguration.openContenAfterImport];
                    item.isOpenContent(openContenAfterImport);

                }
                return item;
            }
        }

        return TableFactory;

    });