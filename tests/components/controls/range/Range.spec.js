define(['common/components/controls/Range/Range',
        'common/components/controls/FormControl'],

function (Range, FormControl) {//eslint-disable-line no-unused-vars

    describe('Range', function () {
        var sampleRange;

        it('should be defined', function () {
            expect(Range).toBeDefined();
        });

        describe('create an instance', function () {

            it('instance is of the right type', function () {
                sampleRange = new Range();
                expect(sampleRange instanceof FormControl).toBeTruthy();
                expect(sampleRange instanceof Range).toBeTruthy();
            });

            it('creating and instance with no settings', function () {
                sampleRange = new Range();
                expect(sampleRange.settings.args.min.value).toEqual(0);
                expect(sampleRange.settings.args.max.value).toEqual(10);
                expect(sampleRange.settings.args.step.value).toEqual(1);
                expect(sampleRange.settings.selectedValue.defaultValue).toEqual('');
                expect(sampleRange.settings.selectedValue.initialValue).toEqual('');
            });

            it('creating and instance with empty settings', function () {
                sampleRange = new Range({});
                expect(sampleRange.settings.args.min.value).toEqual(0);
                expect(sampleRange.settings.args.max.value).toEqual(10);
                expect(sampleRange.settings.args.step.value).toEqual(1);
                expect(sampleRange.settings.selectedValue.defaultValue).toEqual('');
                expect(sampleRange.settings.selectedValue.initialValue).toEqual('');
            });

            it('creating and instance with settings', function () {
                sampleRange = new Range({ args: { min:'5', max: 70, step: 15 }, selectedValue: { initialValue: 15 } });//eslint-disable-line  no-magic-numbers
                expect(sampleRange.settings.args.min.value).toEqual(5);
                expect(sampleRange.settings.args.max.value).toEqual(70);//eslint-disable-line  no-magic-numbers
                expect(sampleRange.settings.args.step.value).toEqual(15);//eslint-disable-line  no-magic-numbers
                expect(sampleRange.settings.selectedValue.defaultValue).toEqual('');
                expect(sampleRange.settings.selectedValue.initialValue).toEqual('15');
            });

            it('settings in wrong type', function () {
                expect(function () {
                    sampleRange = new Range({ args: { min: 'a' } });
                }).toThrow();
                expect(function () {
                    sampleRange = new Range({ args: { step: true } });
                }).toThrow();
                expect(function () {
                    sampleRange = new Range({ selectedValue: { initialValue: 'aa' } });
                }).toThrow();
            });

        });
    });

});

define('spec/IdentificationInfoeSpec.js', function () { });