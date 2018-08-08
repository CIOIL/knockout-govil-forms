define([], function () {

    return {
        services: {
            voucher: 'voucherspa/directed',
            counter: 'counter/general/direction.aspx',
            retrieval:'FormsPaymentReceiptReproduction/ReceiptReproduction.aspx'
        },
        paymentTypes: [{ code: '1', text: { hebrew: 'רגיל',arabic:'عادي', english: 'REGULAR' } },
                       { code: '2', text: { hebrew: 'העברת זהב',arabic:'نقل الذهب', english: 'RTGS' } },
                       { code: '6', text: { hebrew: 'קרדיט',arabic:'الائتمان', english: 'CREDIT' } },
                       { code: '8', text: { hebrew: 'תשלומים',arabic:'المدفوعات', english: 'PAYMENTS' } },
                       { code: '10', text: { hebrew: 'כרטיס חכם – ללא תשלום',arabic:'البطاقة الذكية - مجانا', english: 'SMARTCARD – NO PAYMENT' } }],
        labels: {
            hebrew: {
                idNum: 'מספר זהות',
                familyName: 'שם משפחה',
                firstName: 'שם פרטי',
                yes: 'כן',
                no: 'לא'
            },
            arabic: {
                idNum: 'رقم هوية',
                familyName: 'اسم عائلة',
                firstName: 'اسم شخصي',
                yes: 'نعم',
                no: 'لا'
            },
            english: {
                idNum: 'ID Number',
                familyName: 'Family Name',
                firstName: 'First Name',
                yes: 'yes',
                no: 'no'
            }
        }
    };
});

