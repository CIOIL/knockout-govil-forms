define(['common/utilities/numericExtensions'], function (numericExtensions) {
    it('should be defined', function () {
        expect(numericExtensions).toBeDefined();
    });
    describe('isInRange', function () {
        it('should be defined', function () {
            expect(numericExtensions.isInRange).toBeDefined();
        });
        var number = 5;
        var min = 1;
        var max = 9;
        describe('parameters', function () {

            it('no parameters', function () {
                expect(function () {
                    numericExtensions.isInRange();
                }).toThrow();
            });
            describe('number', function () {
                it('integer', function () {
                    expect(numericExtensions.isInRange(4, min, max)).toBeTruthy();
                });

                it('numeric value by string type ', function () {
                    expect(numericExtensions.isInRange('4', min, max)).toBeTruthy();
                });

                it('string type non-numeric value', function () {
                    expect(function () {
                        numericExtensions.isInRange('rr', min, max);
                    }).toThrow();
                });
            });
            describe('min', function () {
                it('integer', function () {
                    expect(numericExtensions.isInRange(number, 2, max)).toBeTruthy();
                });

                it('numeric value by string type ', function () {
                    expect(numericExtensions.isInRange(number, '2', max)).toBeTruthy();
                });

                it('string type non-numeric value', function () {
                    expect(function () {
                        numericExtensions.isInRange(number, 'rr', max);
                    }).toThrow();
                });
            });
            describe('max', function () {
                it('integer', function () {
                    expect(numericExtensions.isInRange(number, min, 7)).toBeTruthy();
                });

                it('numeric value by string type ', function () {
                    expect(numericExtensions.isInRange(number, min, '7')).toBeTruthy();
                });

                it('string type non-numeric value', function () {
                    expect(function () {
                        numericExtensions.isInRange(number, min, 'rr');
                    }).toThrow();
                });
            });
        });

        describe('logic', function () {
            var resultString;

            it('should return true when number between min and max', function () {
                resultString = numericExtensions.isInRange(number, min, max);
                expect(resultString).toBeTruthy();
            });
            it('should return true when number equals to min', function () {
                resultString = numericExtensions.isInRange(number, number, max);
                expect(resultString).toBeTruthy();
            });
            it('should return true when number equals to max', function () {
                resultString = numericExtensions.isInRange(number, min, number);
                expect(resultString).toBeTruthy();
            });
            it('should return false when number is less than min', function () {
                resultString = numericExtensions.isInRange(0, min, max);
                expect(resultString).toBeFalsy();
            });
            it('should return false when number is grater than max', function () {
                resultString = numericExtensions.isInRange(10, min, max);
                expect(resultString).toBeFalsy();
            });
        });
    });
});