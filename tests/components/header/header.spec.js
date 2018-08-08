define(['common/components/header/header', 'common/components/header/texts'], function (header, texts) {
    describe('header - ', function () {
        it('labels is define', function () {
            expect(header.labels).toBeDefined();
        });
        it('customizeResources is define', function () {
            expect(header.customizeResources).toBeDefined();
        });
        describe('customizeResources - ', function () {
            it('with empty object not fail', function () {
                expect(function () { header.customizeResources({}); }).not.toThrow();
            });
            it('with empty object not update labels', function () {
                header.customizeResources({});
                expect(header.labels.resource()).toEqual(texts);
            });
            it('with new object of infra language ', function () {
                header.customizeResources({ hebrew: {formName: 'sda'}});
                expect(header.labels.resource().hebrew).toEqual({
                    formName: 'sda',
                    govil: 'האתר החדש לשירותים ולמידע ממשלתי',
                    stateOfIsraelTitle: 'מדינת ישראל',
                    accessibilityNewWindowAlert: 'קישור זה ייפתח בחלון חדש'
                });
            });
            it('with customize texts of not infra language - take default language', function () {
                header.customizeResources({ russian: { officeName: 'sdadada' } });
                expect(header.labels.resource().russian).toEqual({
                    officeName: 'sdadada',
                    govil: 'Government services and information web site',
                    stateOfIsraelTitle: 'State of Israel',
                    accessibilityNewWindowAlert: 'opens in new window'
                });
            });
        });
    });
});