var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/resources/exeptionMessages', 'common/utilities/stringExtension', 'common/utilities/conversion'], function (exeptionMessages, stringExtension, conversion) {

    describe('keyValuePairsToObject', function () {

        it('should exist', function () {
            expect(conversion.keyValuePairsToObject).toBeDefined();
        });

        it('should return object', function () {
            var keyValuePairs = 'key1-value1,key2-value2';
            expect(_typeof(conversion.keyValuePairsToObject(keyValuePairs, ',', '-'))).toEqual('object');
        });

        it('contain the input keys and their values', function () {
            var keyValuePairs = 'key1-value1,key2-value2';
            var obj = conversion.keyValuePairsToObject(keyValuePairs, ',', '-');
            expect(obj.key1).toEqual('value1');
            expect(obj.key2).toEqual('value2');
        });

        it('default delimiters', function () {
            var keyValuePairs = 'key1:value1;key2:value2';
            var obj = conversion.keyValuePairsToObject(keyValuePairs);
            expect(obj.key1).toEqual('value1');
            expect(obj.key2).toEqual('value2');
        });

        describe('exceptions', function () {

            var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'keyValuePairsToObject');

            it('throw if no parameters', function () {
                expect(function () {
                    conversion.keyValuePairsToObject();
                }).toThrowError(invalidParamMessage);
            });

            it('throw if input is not of the right type', function () {
                expect(function () {
                    conversion.keyValuePairsToObject({});
                }).toThrowError(invalidParamMessage);
            });
        });
    });

    describe('comboSettingsToTfsBind', function () {

        var bindingProperties = {
            text: 'dataText',
            value: 'dataCode',
            url: 'https://xxx',
            queryString: {
                tableName: 'streets',
                addEmptyValue: false,
                filter: ''
            },
            nodelist: '/root/Streets',
            ondemand: 'true'
        };

        var queryString = { 'filter': '2710' };

        it('should exist', function () {
            expect(conversion.comboSettingsToTfsBind).toBeDefined();
        });

        it('should format to tfsBind structure', function () {
            var convertedString = conversion.comboSettingsToTfsBind(bindingProperties, queryString);
            expect(convertedString).toEqual('url:https://xxx?filter=2710&tableName=streets&addEmptyValue=false;text:dataText;value:dataCode;nodelist:/root/Streets;ondemand:true');
        });

        it('should format to tfsBind structure when queryString is undefined', function () {
            var convertedString = conversion.comboSettingsToTfsBind(bindingProperties);
            expect(convertedString).toEqual('url:https://xxx?tableName=streets&addEmptyValue=false&filter=;text:dataText;value:dataCode;nodelist:/root/Streets;ondemand:true');
        });

        describe('exceptions', function () {

            var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'comboSettingsToTfsBind');

            it('throw if no parameters', function () {
                expect(function () {
                    conversion.comboSettingsToTfsBind();
                }).toThrowError(invalidParamMessage);
            });

            it('throw if input is not of the right type', function () {
                expect(function () {
                    conversion.comboSettingsToTfsBind('some text', {});
                }).toThrowError(invalidParamMessage);
            });
        });
    });

    describe('jsonToQueryString', function () {

        it('should exist', function () {
            expect(conversion.jsonToQueryString).toBeDefined();
        });

        it('should call to $.param', function () {
            spyOn($, 'param');
            var inputObj = {
                key1: 'value1', key2: 'value2'
            };
            conversion.jsonToQueryString(inputObj);
            expect($.param).toHaveBeenCalledWith(inputObj);
        });

        it('should delegate to decodeURIComponent', function () {
            spyOn(window, 'decodeURIComponent');
            var inputObj = {
                key1: 'value1', key2: 'value2'
            };
            conversion.jsonToQueryString(inputObj);
            expect(window.decodeURIComponent).toHaveBeenCalledWith($.param(inputObj));
        });

        describe('exceptions', function () {

            var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'jsonToQueryString');

            it('throw if no parameters', function () {
                expect(function () {
                    conversion.jsonToQueryString();
                }).toThrowError(invalidParamMessage);
            });

            it('throw if input is not of the right type', function () {
                expect(function () {
                    conversion.jsonToQueryString('some text');
                }).toThrowError(invalidParamMessage);
            });
        });
    });

    describe('jsonToBinding', function () {

        it('should exist', function () {
            expect(conversion.jsonToBinding).toBeDefined();
        });

        it('should delegate to jsonToKeyValuePair', function () {
            spyOn(conversion, 'jsonToKeyValuePair');
            var inputObj = {
                key1: 'value1', key2: 'value2'
            };
            conversion.jsonToBinding(inputObj);
            expect(conversion.jsonToKeyValuePair).toHaveBeenCalledWith(inputObj, ':', ';');
        });

        describe('exceptions', function () {

            var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'jsonToKeyValuePair');

            it('throw if no parameters', function () {
                expect(function () {
                    conversion.jsonToBinding();
                }).toThrowError(invalidParamMessage);
            });

            it('throw if input is not of the right type', function () {
                expect(function () {
                    conversion.jsonToBinding('some text');
                }).toThrowError(invalidParamMessage);
            });
        });
    });

    describe('jsonToKeyValuePair', function () {

        var inputObj = { key1: 'value1', key2: 'value2' };

        it('should exist', function () {
            expect(conversion.jsonToKeyValuePair).toBeDefined();
        });

        it('should return string', function () {
            expect(_typeof(conversion.jsonToKeyValuePair(inputObj, '-', ','))).toEqual('string');
        });

        it('contain the input keys and their values', function () {
            var serializedObj = 'key1-value1,key2-value2';
            expect(conversion.jsonToKeyValuePair(inputObj, '-', ',')).toEqual(serializedObj);
        });

        it('default delimiters', function () {
            var serializedObj = 'key1:value1;key2:value2';
            expect(conversion.jsonToKeyValuePair(inputObj)).toEqual(serializedObj);
        });

        describe('exceptions', function () {

            var invalidParamMessage = stringExtension.format(exeptionMessages.funcInvalidParams, 'jsonToKeyValuePair');

            it('throw if no parameters', function () {
                expect(function () {
                    conversion.jsonToKeyValuePair();
                }).toThrowError(invalidParamMessage);
            });

            it('throw if input is not of the right type', function () {
                expect(function () {
                    conversion.jsonToKeyValuePair('some text');
                }).toThrowError(invalidParamMessage);
            });
        });
    });
    describe('base64ToArrayBuffer', function () {
        var base64string = 'aGVsbG93';
        var invalidBase64string = '=====';
        it('should exist', function () {
            expect(conversion.base64ToArrayBuffer).toBeDefined();
        });

        it('throw if no parameters', function () {
            expect(function () {
                conversion.base64ToArrayBuffer();
            }).toThrow();
        });

        it('throw if input is not correctly encoded', function () {
            expect(function () {
                conversion.base64ToArrayBuffer(invalidBase64string);
            }).toThrow();
        });

        it('should return arraybuffer', function () {
            var response = conversion.base64ToArrayBuffer(base64string);
            expect(response.byteLength).toBeDefined();
        });
    });
});
define('spec/conversionSpec.js', function () {});