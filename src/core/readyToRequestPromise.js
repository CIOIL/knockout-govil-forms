define(['common/external/q',
    'common/resources/domains',
    'common/components/support/supportViewModel',
    'common/core/domReadyPromise'
],
    function (Q, domains, supportInformation, domReadyPromise) {//eslint-disable-line max-params

        const domainsPromise = domains.domainsPromise;
        const supportInformationPromise = supportInformation.getSupportInformationPromise;
        const requiredPromises = [domainsPromise, supportInformationPromise, domReadyPromise.promise];

        return Q.all(requiredPromises);
    });