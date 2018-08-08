define(['common/resources/domains'], function (commonDomains) {
    
    describe('return also a promise', function () {
        it('domainsPromise', function () {
            expect(typeof commonDomains.domainsPromise.then === 'function').toBeTruthy();
            
        });

    });
    describe('return formServers', function () {

        it('local', function () {
            expect(commonDomains.formServers.local).toBeDefined();
        });

        it('dev', function () {
            expect(commonDomains.formServers.dev).toBeDefined();
        });

        it('test', function () {
            expect(commonDomains.formServers.test).toBeDefined();
        });

        it('production', function () {
            expect(commonDomains.formServers.production).toBeDefined();
        });

        it('sca', function () {
            expect(commonDomains.formServers.sca).toBeDefined();
        });

        it('scaTest', function () {
            expect(commonDomains.formServers.scaTest).toBeDefined();
        });

        it('publicSca', function () {
            expect(commonDomains.formServers.publicSca).toBeDefined();
        });

        it('ssoTest', function () {
            expect(commonDomains.formServers.ssoTest).toBeDefined();
        });

        it('ssoProd', function () {
            expect(commonDomains.formServers.ssoProd).toBeDefined();
        });

    });

    describe('processManagerSites', function () {
        it('local', function () {
            expect(commonDomains.processManagerSites.local).toBeDefined();
        });

        it('dev', function () {
            expect(commonDomains.processManagerSites.dev).toBeDefined();
        });

        it('test', function () {
            expect(commonDomains.processManagerSites.test).toBeDefined();
        });

        it('productTest', function () {
            expect(commonDomains.processManagerSites.productTest).toBeDefined();
        });

        it('production', function () {
            expect(commonDomains.processManagerSites.production).toBeDefined();
        });

        it('sca', function () {
            expect(commonDomains.processManagerSites.sca).toBeDefined();
        });

        it('scaTest', function () {
            expect(commonDomains.processManagerSites.scaTest).toBeDefined();
        });

        it('publicSca', function () {
            expect(commonDomains.processManagerSites.publicSca).toBeDefined();
        });

        it('ssoTest', function () {
            expect(commonDomains.processManagerSites.ssoTest).toBeDefined();
        });

        it('ssoProd', function () {
            expect(commonDomains.processManagerSites.ssoProd).toBeDefined();
        });
    });

    describe('listManagerDomains', function () {
        it('production', function () {
            expect(commonDomains.listManagerDomains.production).toBeDefined();
        });
        it('test', function () {
            expect(commonDomains.listManagerDomains.test).toBeDefined();
        });
        it('dev', function () {
            expect(commonDomains.listManagerDomains.dev).toBeDefined();
        });
    });

    describe('govServiceListDomains', function () {
        it('production', function () {
            expect(commonDomains.govServiceListDomains.production).toBeDefined();
        });
        it('publicSca', function () {
            expect(commonDomains.govServiceListDomains.publicSca).toBeDefined();
        });
        it('sca', function () {
            expect(commonDomains.govServiceListDomains.sca).toBeDefined();
        });
        it('dev', function () {
            expect(commonDomains.govServiceListDomains.dev).toBeDefined();
        });
        it('test', function () {
            expect(commonDomains.govServiceListDomains.test).toBeDefined();
        });
        it('scaTest', function () {
            expect(commonDomains.govServiceListDomains.scaTest).toBeDefined();
        });
        it('ssoTest', function () {
            expect(commonDomains.govServiceListDomains.ssoTest).toBeDefined();
        });
        it('ssoProd', function () {
            expect(commonDomains.govServiceListDomains.ssoProd).toBeDefined();
        });
    });

    describe('govFeedbackSurveys', function () {
        it('production', function () {
            expect(commonDomains.govFeedbackSurveys.production).toBeDefined();
        });
        it('default', function () {
            expect(commonDomains.govFeedbackSurveys.default).toBeDefined();
        });
    });

});
define('spec/domainsSpec.js', [], function () { });