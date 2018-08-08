define(['common/resources/texts/indicators'], function (indicators) {

    describe('hebrew', function () {

        it('biztalkError', function () {
            expect(indicators.errors.hebrew.biztalkError).toEqual('חלה תקלה בתהליך קליטת הטופס. לתמיכה צור קשר בציון מספר הסימוכין בטל xxx@xx.xx 0000* | 00-0000000');
        });
        it('defaultError', function () {
            expect(indicators.errors.hebrew.defaultError).toEqual('חלה תקלה בתהליך קליטת הטופס. לתמיכה צור קשר בציון מספר הסימוכין בטל xxx@xx.xx 0000* | 00-0000000');
        });
        it('submitWithSignErrorMessage', function () {
            expect(indicators.errors.hebrew.submitWithSignErrorMessage).toEqual(' שליחת הטופס נכשלה. אנא שמור את הטופס, ופנה למוקד התמיכה בטלפון (Err:0013) 0000* | 00-0000000');
        });
        it('callServerError', function () {
            expect(indicators.errors.hebrew.callServerError).toEqual('חלה תקלה בגישה לשרת. לתמיכה צור קשר בציון מספר הסימוכין {0} בטלפון 0000* | 00-0000000');
        });
        it('callServiceError', function () {
            expect(indicators.errors.hebrew.callServiceError).toEqual(' לא ניתן לספק את השרות המבוקש - אנא פנה לתמיכה בדואר אלקטרוני xxx@xx.xx או בטלפון 0000* | 00-0000000');
        });
        it('actionDeaultError', function () {
            expect(indicators.errors.hebrew.actionDeaultError).toEqual(' הפעולה נכשלה. אנא נסו שנית, או פנו לתמיכה בדואר אלקטרוני  xxx@xx.xxאו בטלפון 0000* | 00-0000000');
        });
        it('error', function () {
            expect(indicators.errors.hebrew.error).toEqual('שגיאה');
        });
    });
    describe('english', function () {

        it('biztalkError', function () {
            expect(indicators.errors.english.biztalkError).toEqual('An error occured while submitting the form. Please contact support at 0000* | 00-0000000');
        });
        it('defaultError', function () {
            expect(indicators.errors.english.defaultError).toEqual('An error occured while submitting the form. Please contact support at 0000* | 00-0000000');
        });
        it('submitWithSignErrorMessage', function () {
            expect(indicators.errors.english.submitWithSignErrorMessage).toEqual('The form could not be sent. Please save the form and call 0000* | 00-0000000 (err:0013)');
        });
        it('callServerError', function () {
            expect(indicators.errors.english.callServerError).toEqual('Error occured while call server. Please contact support at 0000* | 00-0000000');
        });
        it('callServiceError', function () {
            expect(indicators.errors.english.callServiceError).toEqual('Sorry. We cannot provide the requested service. Please contact support on 0000* | 00-0000000 or xxx@xx.xx');
        });
        it('actionDeaultError', function () {
            expect(indicators.errors.english.actionDeaultError).toEqual('Sorry, it looks like there was an error. Please try again or contact the technical support desk on Tel: 0000* | 00-0000000 or by email to xxx@xx.xx.');
        });
    });
});


