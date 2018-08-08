define(['common/components/support/supportViewModel'
], function (supportViewModel) {
    var indicators = {};

    supportViewModel.getSupportInformationPromise.then(function () {
        var texts = {
            errors: {
                hebrew: {
                    biztalkError: `חלה תקלה בתהליך קליטת הטופס. לתמיכה צור קשר בציון מספר הסימוכין בטל ${supportViewModel.mail()} ${supportViewModel.phone()}`,
                    defaultError: `חלה תקלה בתהליך קליטת הטופס. לתמיכה צור קשר בציון מספר הסימוכין בטל ${supportViewModel.mail()} ${supportViewModel.phone()}`,
                    uniqSubmitMessage: ' טופס עם סימוכין זה נשלח בעבר',
                    submitWithSignErrorMessage: ` שליחת הטופס נכשלה. אנא שמור את הטופס, ופנה למוקד התמיכה בטלפון (Err:0013) ${supportViewModel.phone()}`,
                    callServerError: `חלה תקלה בגישה לשרת. לתמיכה צור קשר בציון מספר הסימוכין {0} בטלפון ${supportViewModel.phone()}`,
                    error: 'שגיאה',
                    attachmentsError: 'שגיאה בצרופות',
                    loadListFailed: 'טעינת רשימה מהשרת נכשלה',
                    inputsError: 'נתוני הטופס אינם תקינים',
                    inputsSuccess: 'נתוני הטופס תקינים',
                    stageError: 'נתוני השלב אינם תקינים',
                    callServiceError: ` לא ניתן לספק את השרות המבוקש - אנא פנה לתמיכה בדואר אלקטרוני ${supportViewModel.mail()} או בטלפון ${supportViewModel.phone()}`,
                    actionDeaultError: ` הפעולה נכשלה. אנא נסו שנית, או פנו לתמיכה בדואר אלקטרוני  ${supportViewModel.mail()}או בטלפון ${supportViewModel.phone()}`
                },
                arabic: {
                    callServiceError: `حدثت مشكلة أثناء الدخول إلى الخادم. للحصول على الدعم الاتصال بنا عن طريق تحديد الرقم المرجعي في ${supportViewModel.mail()} ${supportViewModel.phone()}`,
                    actionDeaultError: `فشلت العملية ، الرجاء المحاولة مرة اخرى، أو توجهوا للدعم التقني هاتف رقم ${supportViewModel.phone()} أو عن طريق البريد الاكتروني ${supportViewModel.mail()} `,
                    biztalkError: `حدثت مشكلة في عملية استلام النموذج. للحصول على الدعم الاتصال بنا عن طريق الإشارة إلى الرقم المرجعي في ${supportViewModel.mail()} ${supportViewModel.phone()}`,
                    defaultError: `حدثت مشكلة في عملية استلام النموذج. للحصول على الدعم الاتصال بنا عن طريق الإشارة إلى الرقم المرجعي في ${supportViewModel.mail()} ${supportViewModel.phone()}`,
                    uniqSubmitMessage: 'تم إرسال هذا النموذج المرجعي سابقا،',
                    submitWithSignErrorMessage: `أخفق إرسال النموذج. يرجى حفظ النموذج والاتصال بمركز الدعم على الرقم ${supportViewModel.phone()} (إر: 0013)`,
                    callServerError: `حدثت مشكلة أثناء الدخول إلى الخادم. للحصول على الدعم الاتصال بنا عن طريق تحديد الرقم المرجعي في ${supportViewModel.mail()} {0}`,
                    error: 'خطأ',
                    attachmentsError: 'خطأ المرفقات',
                    loadListFailed: 'أخفق تحميل القائمة من الخادم',
                    inputsError: 'بيانات النموذج غير صالحة',
                    inputsSuccess: 'بيانات النموذج صالحة',
                    stageError: 'بيانات الخطوة لا يعمل'

                },
                english: {
                    callServiceError: `Sorry. We cannot provide the requested service. Please contact support on ${supportViewModel.phone()} or ${supportViewModel.mail()}`,
                    actionDeaultError: `Sorry, it looks like there was an error. Please try again or contact the technical support desk on Tel: ${supportViewModel.phone()} or by email to ${supportViewModel.mail()}.`,
                    submitWithSignErrorMessage: `The form could not be sent. Please save the form and call ${supportViewModel.phone()} (err:0013)`,
                    biztalkError: `An error occured while submitting the form. Please contact support at ${supportViewModel.phone()}`,
                    defaultError: `An error occured while submitting the form. Please contact support at ${supportViewModel.phone()}`,
                    uniqSubmitMessage: 'A form with the same reference number was already sent',
                    callServerError: `Error occured while call server. Please contact support at ${supportViewModel.phone()}`,
                    error: 'Error',
                    loadListFailed: 'Failed on loading list from the server',
                    inputsError: 'Form data is invalid',
                    inputsSuccess: 'Form data is valid',
                    stageError: 'Stage data is invalid'
                }
            },
            information: {
                hebrew: {
                    generalSuccess: 'מילוי הטופס',
                    sendTheForm: 'שליחת טופס',
                    checkFormIntegrity: 'בדיקת תקינות טופס',
                    SendingSuccsess: 'הטופס נשלח בהצלחה. מספר סימוכין: {0}',
                    defaultSuccsess: 'הטופס נשלח בהצלחה'
                },
                arabic: {
                    generalSuccess: 'املأ النموذج',
                    sendTheForm: 'إرسال نموذج',
                    checkFormIntegrity: 'التحقق من سلامة النموذج',
                    SendingSuccsess: 'النموذج المقدم بنجاح. الرقم المرجعي: {0}',
                    defaultSuccsess: 'تم إرسال النموذج بنجاح'
                },
                english: {
                    generalSuccess: 'Completing the form',
                    sendTheForm: 'Form Submit',
                    checkFormIntegrity: 'Check Form Integrity',
                    SendingSuccsess: 'submitted successfully. References: {0}',
                    defaultSuccsess: 'submitted successfully'
                }
            },
            instructions: { hebrew: {}, english: {} },
            topics: { hebrew: {}, english: {} }
        };
        Object.assign(indicators, texts);
    });
    return indicators;
});