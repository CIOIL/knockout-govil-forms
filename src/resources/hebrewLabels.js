define([], function () {

    var phone = {
        phone: 'מספר טלפון',
        fax: 'מספר פקס',
        mobile: 'מספר טלפון נייד',
        phoneOrMobile: 'מספר טלפון/ נייד'
    };

    var payment = {
        idNum: 'תעודת זהות',
        familyName: 'שם משפחה',
        firstName: 'שם פרטי'
    };

    var dates = {
        hebrewDate: 'תאריך עברי',
        englishDate: 'תאריך לועזי',
        today: 'היום'
    };

    return {
        phone: phone,
        payment: payment,
        dates: dates
    };

});
