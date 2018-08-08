define(['common/utilities/stringExtension'], function (stringExtension) {

    describe('format', function () {

        var basicString = 'between {0}-{1}';

        describe('error handling', function () {
            var missingParameter;

            it('no parameters', function () {
                expect(function () {
                    stringExtension.format();
                }).toThrow(new Error('invalid source or source is missing'));
            });

            it('params is missing', function () {
                expect(stringExtension.format('test')).toEqual('test');
            });

            it('parameter is undefined', function () {
                expect(function () {
                    stringExtension.format(missingParameter);
                }).toThrow(new Error('invalid source or source is missing'));
            });

            it('params are object', function () {
                expect(function () {
                    stringExtension.format(basicString, {});
                }).toThrow(new Error('invalid params'));
            });
        });

        describe('formatting tests', function () {
            var resultString;

            it('should return formated string when params are strings', function () {
                resultString = stringExtension.format(basicString, '5', '100');
                expect(resultString).toEqual('between 5-100');
            });

            it('should return formated string when params are in array', function () {
                resultString = stringExtension.format(basicString, '5', '100');
                expect(resultString).toEqual('between 5-100');
            });

            it('should return formated string - any type', function () {
                var date = new Date('04/05/2012');
                resultString = stringExtension.format(basicString, 5, date);
                expect(resultString).toMatch('^between 5-');
            });

            it('should return formated string - without enought params', function () {
                resultString = stringExtension.format(basicString, 5);
                expect(resultString).toEqual('between 5-{1}');
            });

            it('should return formated string - without pharams', function () {
                resultString = stringExtension.format(basicString);
                expect(resultString).toEqual(basicString);
            });
        });
    });

    describe('trim', function () {

        describe('left', function () {

            it('should exist', function () {
                expect(stringExtension.trimLeft).toBeDefined();
            });

            it('should remove spaces from the left end of a string ', function () {
                expect(stringExtension.trimLeft('   foo')).toEqual('foo');
            });

            it('should not remove spaces from the right end of a string ', function () {
                expect(stringExtension.trimLeft('   foo   ')).toEqual('foo   ');
            });

            it('should remove tab spaces from the left end of a string ', function () {
                expect(stringExtension.trimLeft('   foo')).toEqual('foo');
            });

            describe('and String.prototype.trimLeft doesnt exists', function () {
                var trimLeft = String.prototype.trimLeft;
                delete String.prototype.trimLeft;
                it('should remove spaces from the left end of a string ', function () {
                    expect(stringExtension.trimLeft('   foo')).toEqual('foo');
                });

                it('should not remove spaces from the right end of a string ', function () {
                    expect(stringExtension.trimLeft('   foo   ')).toEqual('foo   ');
                });

                it('should remove tab spaces from the left end of a string ', function () {
                    expect(stringExtension.trimLeft('   foo')).toEqual('foo');
                });
                String.prototype.trimLeft = trimLeft; //eslint-disable-line no-extend-native
            });
        });

        describe('right', function () {

            it('should exist', function () {
                expect(stringExtension.trimRight).toBeDefined();
            });

            it('should remove spaces from the right end of a string ', function () {
                expect(stringExtension.trimRight('foo   ')).toEqual('foo');
            });

            it('should not remove spaces from the left end of a string ', function () {
                expect(stringExtension.trimRight('   foo   ')).toEqual('   foo');
            });

            it('should remove tab spaces from the right end of a string ', function () {
                expect(stringExtension.trimRight('foo   ')).toEqual('foo');
            });

            describe('and String.prototype.trimRight doesnt exists', function () {
                var trimRight = String.prototype.trimRight;
                delete String.prototype.trimRight;
                it('should remove spaces from the right end of a string ', function () {
                    expect(stringExtension.trimRight('foo   ')).toEqual('foo');
                });

                it('should not remove spaces from the left end of a string ', function () {
                    expect(stringExtension.trimRight('   foo   ')).toEqual('   foo');
                });

                it('should remove tab spaces from the right end of a string ', function () {
                    expect(stringExtension.trimRight('foo   ')).toEqual('foo');
                });
                String.prototype.trimRight = trimRight; //eslint-disable-line no-extend-native
            });
        });
    });
    describe('pad', function () {

        describe('left', function () {

            it('should exist', function () {
                expect(stringExtension.padLeft).toBeDefined();
            });

            it('parameters are optionals', function () {
                expect(function () {
                    stringExtension.padLeft();
                }).not.toThrow();
            });
            it('str - should be string ', function () {
                expect(stringExtension.padLeft('3')).toEqual('03');
            });
            it('str - should be numeric ', function () {
                expect(stringExtension.padLeft(3)).toEqual('03');
            });
            it('str - by default empty string ', function () {
                expect(stringExtension.padLeft(undefined, '@', 4)).toEqual('@@@@');
            });
            it('char - by default \'0\'  ', function () {
                expect(stringExtension.padLeft('hi', undefined, 4)).toEqual('00hi');
            });
            it('length - by default 2  ', function () {
                expect(stringExtension.padLeft('i', '@')).toEqual('@i');
            });
            it('valid parameters', function () {
                expect(stringExtension.padLeft('18', '0', 9)).toEqual('000000018');
            });
        });
    });
});
define('spec/stringExtensionSpec.js', function () {});