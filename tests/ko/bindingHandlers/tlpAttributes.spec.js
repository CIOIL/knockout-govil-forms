define(['common/ko/bindingHandlers/tlpAttributes'],
function (initialization) {//eslint-disable-line no-unused-vars
    var viewModel = {
        frendlyName: ko.observable('street'),
        bind: ko.observable('text:datatext;value:datacode;url:https://xxx')
    };
    ko.cleanNode(document.body);
    ko.applyBindings(viewModel);
    var street;
    describe('tlpAttributes', function () {
        beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpAttributes.html');
            street = $('#Street');
        });
        describe('should be defined', function () {
            it('tlpBind', function () {
                expect(ko.bindingHandlers.tlpBind).toBeDefined();
            });
        });
        it('tlpBind value', function () {
            expect(street.attr('tfsBind')).toEqual('text:datatext;value:datacode;url:https://xxx');
        });
    });
   
});
define('spec/tlpAttributes.spec.js', function () { });