define([], function () {
    return {
        street: {
            text: 'dataText',
            value: 'dataCode',
            url: 'https://forms.gov.il/xxx',
            queryString: {
                tableName: 'streets',
                addEmptyValue: false,
                filter: ''
            },
            nodelist: '/root/Streets',
            ondemand: 'true'
        }
    };
});