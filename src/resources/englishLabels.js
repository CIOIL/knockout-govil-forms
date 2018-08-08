define([], function () {

    var phone = {
        phone: 'phone number',
        fax: 'fax number',
        mobile: 'mobile number',
        phoneOrMobile: 'phone/ mobile number'

    };

    var payment = {
        idNum: 'Id num',
        familyName: 'Last name',
        firstName: 'First Name'
    };

    var dates = {
        today: 'today'
    };

    return {
        phone: phone,
        payment: payment,
        dates: dates
    };

});