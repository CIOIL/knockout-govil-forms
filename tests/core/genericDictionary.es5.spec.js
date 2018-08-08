define(['common/core/genericDictionary'], function (genericDictionary) {

    describe('genericDictionary', function () {
        var testDictionary;

        beforeEach(function () {
            testDictionary = new genericDictionary.Dictionary();
        });

        it('should be able to store a value', function () {
            testDictionary.store('game', 'football');

            expect(testDictionary.get('game')).toEqual('football');
        });

        it('should be able to override a value', function () {
            testDictionary.store('game', 'football');

            expect(testDictionary.get('game')).toEqual('football');

            testDictionary.store('game', 'basketball');

            expect(testDictionary.get('game')).toEqual('basketball');
        });

        it('should return undefined for none existing key', function () {
            expect(testDictionary.get('game')).toEqual(undefined);
        });

        it('should be able to confirm contained key', function () {
            testDictionary.store('game', 'football');

            expect(testDictionary.contains('game')).toBeTruthy();
        });

        it('should be able to confirm contained key', function () {
            testDictionary.store('game', 'football');

            expect(testDictionary.contains('game')).toBeTruthy();
        });

        it('should be able to confirm contained key based on case sensitivity', function () {
            testDictionary.store('Game', 'football');

            expect(testDictionary.contains('Game')).toBeTruthy();
        });

        it('should be able to deny the existance of uncontained key', function () {
            testDictionary.store('game', 'football');

            expect(testDictionary.contains('gender')).toBeFalsy();
        });

        it('should be able to deny the existance of uncontained key based on case sensitivity', function () {
            testDictionary.store('Game', 'football');

            expect(testDictionary.contains('game')).toBeFalsy();
        });

        it('should be able to deny the existance of inhereted dictionary properties', function () {

            expect(testDictionary.contains('toString')).toBeFalsy();
        });

        describe(' case insensitive : ', function () {

            beforeEach(function () {

                testDictionary.lowercase = true;
            });

            it('should  confirm the existance of contained key with diffrenet case - 1', function () {
                testDictionary.store('Game', 'football');

                expect(testDictionary.contains('game')).toBeTruthy();
            });

            it('should  confirm the existance of contained key with diffrenet case - 2', function () {
                testDictionary.store('ThiS is A footBall GAme', 'Barcellona - Real');

                expect(testDictionary.contains('This IS a FOOTBALL game')).toBeTruthy();
            });

            it('the value is still case sensitive', function () {
                testDictionary.store('Game', 'Football');

                expect(testDictionary.get('game') === 'football').toBeFalsy();
                expect(testDictionary.get('game') === 'Football').toBeTruthy();
            });
        });

        describe('when a dictionary is created from key value pairs', function () {

            it('should store all the keys and corresponding values', function () {
                testDictionary.populateFromKeyValuePairs('action:postForm;url:https://xxx.gov.il;ActionOnreturn:function{callback}', ';');

                expect(testDictionary.get('action')).toEqual('postForm');
                expect(testDictionary.get('url')).toEqual('https://xxx.gov.il');
                expect(testDictionary.get('ActionOnreturn')).toEqual('function{callback}');
            });

            it('should be case sensitive by default', function () {
                testDictionary.populateFromKeyValuePairs('action:postForm;url:https://xxx.gov.il;ActionOnreturn:function{callback}', ';');

                expect(testDictionary.contains('actiononreturn')).toBeFalsy();
            });

            it('should support lowercase definition', function () {
                testDictionary.lowercase = true;
                testDictionary.populateFromKeyValuePairs('action:postForm;url:https://xxx.gov.il;ActionOnreturn:function{callback}', ';');

                expect(testDictionary.contains('actiononreturn')).toBeTruthy();
            });
        });
    });
});
define('spec/genericDictionarySpec.js', function () {});