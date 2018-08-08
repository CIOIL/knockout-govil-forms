//D:\WorkingFolder\FormsCDN\Common\test\lib\jasmine-2.0.0\jasmine.js
define(['common/core/scaMethods'],

function (scaMethods) {
    describe('scaMethods', function () {


        describe('extractIdentificationNumber', function () {

            it('Tamuz Card', function () {
                var signValue = '123456782@gov.il';
                var res = scaMethods.extractIdentificationNumber(signValue);
                expect(res).toBe('123456782');
            });
            it('PersonalID & Comsign Cards', function () {
                var signValue = '01-051959930@co.il';
                var res = scaMethods.extractIdentificationNumber(signValue);
                expect(res).toBe('051959930');
            });

        });
        describe('extractCompanyNumber', function () {

            it('Tamuz Card', function () {
                var signValue = 'CN=Cohen Chedva ID_123456782, OU=justice, O=Gov, C=IL';
                var res = scaMethods.extractCompanyNumber(signValue);
                expect(res).toBe('gov');
            });
            it('Comsign Card', function () {
                var signValue = 'CN=Test Test ID_051959930, SN=Test, G=Test, SERIALNUMBER=01-051959930, O=05-123456789, OU=08056, T=Tester, C=IL';
                var res = scaMethods.extractCompanyNumber(signValue);
                expect(res).toBe('123456789');
            });
            it('PersonalID Card', function () {
                var signValue = 'CN=Katz Rachel ID_051959930, OU=Shlomo, O=05-510685118, C=IL, SERIALNUMBER=01 051959930, T=Manager, SN=Katz, G=Rachel';
                var res = scaMethods.extractCompanyNumber(signValue);
                expect(res).toBe('510685118');
            });


        });
        describe('extractCompanyName', function () {

            it('Tamuz Card', function () {
                var signValue = 'Other Name:Principal Name=123456782@gov.il, RFC822 Name=none@justice.gov.il';
                var res = scaMethods.extractCompanyName(signValue);
                expect(res).toBe('');
            });
            it('Comsign Card', function () {
                var signValue = 'RFC822 Name=test@test.co.il, Other Name:Principal Name=01-051959930@co.il, Directory Address:C=IL, O=05-123456789, OU=תעודת בדיקה, T=בודק, SN=בדיקה, G=בדיקה, CN=ID_051959930 בדיקה בדיקה';
                var res = scaMethods.extractCompanyName(signValue);
                expect(res).toBe('תעודת בדיקה');
            });
            it('PersonalID Card', function () {
                var signValue = 'RFC822 Name=katz@mot.gov.il, Other Name:Principal Name=01-051959930@co.il, Directory Address:C=IL, O=05-510685118, OU=שלמה השכרת רכב, T=מנהל, SN=כץ, G=רחל, CN=ID_051959930  כץ  רחל';
                var res = scaMethods.extractCompanyName(signValue);
                expect(res).toBe('שלמה השכרת רכב');
            });

        });
        describe('getIdNumberFromSignature', function () {

            it('Tamuz Card', function () {
                var scaSubject = 'CN=Cohen Chedva ID_123456782, OU=justice, O=Gov, C=IL';
                var res = scaMethods.getIdNumberFromSignature(scaSubject);
                expect(res).toBe('123456782');
            });
            it('ComSign Card', function () {
                var scaSubject = 'CN=Test Test ID_051959930, SN=Test, G=Test, SERIALNUMBER=01-051959930, O=05-123456789, OU=08056, T=Tester, C=IL';
                var res = scaMethods.getIdNumberFromSignature(scaSubject);
                expect(res).toBe('051959930');
            });

            it('PersonalID Card', function () {
                var scaSubject = 'CN=Katz Rachel ID_051959930, OU=Shlomo, O=05-510685118, C=IL, SERIALNUMBER=01 051959930, T=Manager, SN=Katz, G=Rachel';
                var res = scaMethods.getIdNumberFromSignature(scaSubject);
                expect(res).toBe('051959930');
            });

            it('Other Card P_', function () {
                var scaSubject = 'CN=Katz Rachel P_051959930, OU=Shlomo, O=05-510685118, C=IL, SERIALNUMBER=01 051959930, T=Manager, SN=Katz, G=Rachel';
                var res = scaMethods.getIdNumberFromSignature(scaSubject);
                expect(res).toBe('051959930');
            });

            it('Other Card TR_', function () {
                var scaSubject = 'CN=Katz Rachel TR_051959930, OU=Shlomo, O=05-510685118, C=IL, SERIALNUMBER=01 051959930, T=Manager, SN=Katz, G=Rachel';
                var res = scaMethods.getIdNumberFromSignature(scaSubject);
                expect(res).toBe('051959930');
            });


        });


    });
    
});
define('spec/scaMethods.js', function () { });