define(['common/utilities/typeVerifier'], function (typeVerifier) {
    describe('JSON', function () {
        it('simple string', function () {
            var isJson = typeVerifier.json('dfsdfsf');
            expect(isJson).toBeFalsy();
        });
        it('json string', function () {
            var isJson = typeVerifier.json('{"hello":"world"}');
            expect(isJson).toBeTruthy();
        });
        it('empty string', function () {
            var isJson = typeVerifier.json('');
            expect(isJson).toBeFalsy();
        });
        it('undefined', function () {
            var isJson = typeVerifier.json();
            expect(isJson).toBeFalsy();
        });
    });
    describe('object', function () {
        it('string', function () {
            var isObject = typeVerifier.object('dfsdfsf');
            expect(isObject).toBeFalsy();
        });
        it('int', function () {
            var isObject = typeVerifier.object(123); //eslint-disable-line no-magic-numbers
            expect(isObject).toBeFalsy();
        });

        it('object', function () {
            var isObject = typeVerifier.object({ name: 'Avi' });
            expect(isObject).toBeTruthy();
        });
        it('empty object', function () {
            var isObject = typeVerifier.object({});
            expect(isObject).toBeTruthy();
        });
        it('undefined', function () {
            var isObject = typeVerifier.object();
            expect(isObject).toBeFalsy();
        });
    });
    describe('arrayBuffer', function () {
        it('arrayBuffer', function () {
            var isArrayBuffer = new ArrayBuffer(); //eslint-disable-line  no-undef
            expect(isArrayBuffer).toBeTruthy();
        });
        it('string', function () {
            var isArrayBuffer = typeVerifier.arrayBuffer('dfsdfsf');
            expect(isArrayBuffer).toBeFalsy();
        });
        it('undefined', function () {
            var isArrayBuffer = typeVerifier.arrayBuffer();
            expect(isArrayBuffer).toBeFalsy();
        });
        it('empty object', function () {
            var isArrayBuffer = typeVerifier.arrayBuffer({});
            expect(isArrayBuffer).toBeFalsy();
        });
    });
});