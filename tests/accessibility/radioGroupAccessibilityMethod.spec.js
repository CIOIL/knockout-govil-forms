define(['common/accessibility/radioGroupAccessibilityMethod'],
    function (radioGroupAccessibilityMethod) {

        describe('isStringEqual', function () {           
            it('no parameters', function () {
                expect(radioGroupAccessibilityMethod.isStringEqual()).toBeTruthy();
            });

            it('just 1 parameter', function () {
                expect(radioGroupAccessibilityMethod.isStringEqual('1')).toBeFalsy();
                expect(radioGroupAccessibilityMethod.isStringEqual(undefined)).toBeTruthy();
                expect(radioGroupAccessibilityMethod.isStringEqual(null)).toBeFalsy();
            });
            it('compare between two strings', function () {
                expect(radioGroupAccessibilityMethod.isStringEqual('1', '1')).toBeTruthy();
                expect(radioGroupAccessibilityMethod.isStringEqual('', '1')).toBeFalsy();
            });
            it('compare between two arrays', function () {
                expect(function () { radioGroupAccessibilityMethod.isStringEqual([1, 2], [1, 2]);}).toThrow();
                expect(function () { radioGroupAccessibilityMethod.isStringEqual([1, 3], [1, 2]);}).toThrow();
            });
            it('compare between a string and integer', function () {
                expect(radioGroupAccessibilityMethod.isStringEqual(undefined, '1')).toBeFalsy();
                expect(radioGroupAccessibilityMethod.isStringEqual('1', undefined)).toBeFalsy();
                expect(radioGroupAccessibilityMethod.isStringEqual(6, '1')).toBeFalsy();
                expect(radioGroupAccessibilityMethod.isStringEqual('1', 6)).toBeFalsy();
            });
            it('compare between two diferent types', function () {
                expect(radioGroupAccessibilityMethod.isStringEqual(1, '1')).toBeTruthy();
                expect(radioGroupAccessibilityMethod.isStringEqual('1', 1)).toBeTruthy();
                expect(radioGroupAccessibilityMethod.isStringEqual('true', true)).toBeTruthy();
            });
            it('compare between two same types', function () {
                expect(radioGroupAccessibilityMethod.isStringEqual(null, null)).toBeTruthy();
                expect(radioGroupAccessibilityMethod.isStringEqual(true, true)).toBeTruthy();
                expect(radioGroupAccessibilityMethod.isStringEqual(6, 6)).toBeTruthy();
            });
           
        });          
    });