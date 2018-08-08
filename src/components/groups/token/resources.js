define(['common/components/support/supportViewModel'],
    function (supportViewModel) {
        const errorCodes = {
            general: '40000'
        };
        const format = {
            date: {
                format: 'M/d/yyyy H:mm:ss tt',
                generalDateFormat: 'dd/MM/yyyy'
            }
        };
        const texts = {
            labels: {
                hebrew: {
                    id: 'ת.ז:',
                    name: 'שם:',
                    expirationDate: 'תוקף:',
                    date: 'תאריך:',
                    title: 'טופס זה דורש הזדהות דיגיטלית באמצעות כרטיס חכם הכולל תעודה מאושרת.',
                    title1: 'לביצוע ההזדהות נדרש לחבר כרטיס חכם למחשב באמצעות קורא כרטיסים.',
                    titleDetails: 'פרטי הזהוי שלך:',
                    isIdentificationButton: 'הזדהות >',
                    loadData: 'טוען פרטי הזדהות...'
                },
                english: {
                    id: 'ת.ז:',
                    name: 'name:',
                    expirationDate: 'expiration:',
                    date: 'date:',
                    title: '. טופס זה דורש הזדהות דיגיטלית באמצעות כרטיס חכם הכולל תעודה מאושרת',
                    title1: '. לביצוע ההזדהות נדרש לחבר כרטיס חכם למחשב באמצעות קורא כרטיסים',
                    titleDetails: 'Your identity information:',
                    isIdentificationButton: 'identification >',
                    loadData: 'Loading authentication details...'
                }
            }
        };
        var resources =  {
            texts: texts,
            errorCodes: errorCodes,
            format: format
        };
       
        supportViewModel.getSupportInformationPromise.then(function () {
            var texts = {
                errors: {
                    hebrew: {
                        40000: 'ארעה שגיאה בתהליך, אנא בדוק שהכרטיס מחובר למחשב ונסה שנית. במידת הצורך אנא פנה למוקד התמיכה בטלפון ' + supportViewModel.phone(),
                        40015: 'חלה תקלה בפעולה. יש לבצע אותה שנית',
                        5000002: 'קיימת בעיה עם התעודה אנא פנה למוקד במספר ' + supportViewModel.phone(),
                        40020: 'לא ניתן להשלים את בדיקת החתימה, אנא נסה מאוחר יותר',
                        5000003: 'קיימת בעיה בהזדהות  אנא שמור את הטופס ופנה למוקד בטלפון ' + supportViewModel.phone(),
                        40026: 'לא ניתן לאמת את נתוני ההזדהות',
                        5000001: 'אנא בחר תעודה לזיהוי'
                    },
                    english: {
                        40000: 'An error has occurred. Please try again or call',
                        40015: 'The request failed. Please try again',
                        5000002: 'There is a problem with the certificate. Please call ' + supportViewModel.phone(),
                        40020: 'Signature verification could not be completed, please try again later',
                        5000003: 'Certificate error. For help please try again or call ' + supportViewModel.phone(),
                        40026: 'Signature details could not be verified',
                        5000001: 'Please select a certificate to Identification in the form'
                    }
                }
            };
            Object.assign(resources.texts, texts);
        });
        return resources;
    });
