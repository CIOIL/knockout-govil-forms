define(['common/ko/validate/koValidationInsertMessage'],
    function (koValidationInsertMessage) {
        describe('insertValidationMessage', function () {

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = 'base/Tests/ko/validate/templates';
                loadFixtures('koValidationInsertMessage.html');
            });

            it('should be define', function () {
                expect(koValidationInsertMessage.insertValidationMessage).toBeDefined();
                expect(typeof koValidationInsertMessage.insertValidationMessage).toEqual('function');
            });

            it('should not throw', function () {
                var elem = $('#regularInput');
                expect(function () { koValidationInsertMessage.insertValidationMessage(elem); }).not.toThrow();
            });

        });
    });