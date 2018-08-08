/** Object for storing the different domains that are used by the form in the defferent environments
@module domains 
*/
define(['common/networking/ajax'], function (ajax) {
   
    const domains = {
        fromEnviorments: {
            dev: ['local', 'dev', 'secureDev']
            , test: ['test', 'scaTest', 'ssoTest']
            , production: ['production', 'publicSca', 'agFormManager', 'ssoProd']
        }
    };
    const getPrefix = () =>'https:/xxx.gov.il';
    
    const requestSettings = {
        url: getPrefix() + '/govservicelist/xxx',
        method: 'POST',
        data: { listName: 'Domains' }
    };
    const domainsPromise = ajax.request(requestSettings);
    domainsPromise.then(response => {
        if (response && response.Data) {
            const list = response.Data.List;
            const domainsTypes = list.map(domain => domain.type);
            domainsTypes.forEach(type => (domains[type] = {}));
            list.map(domain => (domains[domain.type][domain.enviorment] = domain.url));
        }
        return domains;
        
    });

    return Object.assign(domains, { domainsPromise });
});