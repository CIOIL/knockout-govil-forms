define(['common/components/support/supportViewModel'], function (support) {
    describe('qs.params', function () {


        it('tobe defined', function () {
            expect(support).toBeDefined();
        });

        describe('properties exist on instance', function () {
            mySupport = support;

            it('properties should be defined in the model', function () {
                expect(mySupport.getModel().activityTime).toBeDefined();
                expect(mySupport.getModel().phone).toBeDefined();
                expect(mySupport.getModel().mail).toBeDefined();
            });
            it('properties shuold be corect values', function () {
                expect(mySupport.activityTime()).toEqual('00:00-00:00');
                expect(mySupport.phone()).toEqual('0000* | 00-0000000');
                expect(mySupport.mail()).toEqual('xxx@xx.xx');
            });
        });

        it('getSupportInformationPromise tobe defined', function () {
            expect(support.getSupportInformationPromise).toBeDefined();
        });

        it('getSupportInformationPromise should be typeOf promise', function () {
            expect(support.getSupportInformationPromise.hasOwnProperty('then')).toBe(true);
        });


    });
});