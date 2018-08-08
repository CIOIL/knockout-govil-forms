define([], function () {

    return {
        texts: {
            hebrew: {
                email: 'דואר אלקטרוני',
                reEmail: 'אימות דואר אלקטרוני'
            },
            arabic: {
                email: 'بريد الكتروني',
                reEmail: 'التحقق من البريد الإلكتروني'
            },
            english: {
                email: 'E-mail',
                reEmail: 'Verify E-mail'
            }
        },
        errorMessages: {
            hebrew: {
                equalEmail: 'בשדה זה יש להזין ערך זהה לערך שהוזן בשדה {0}',
                manualTyping: 'עליך להזין {0} ידנית'
            },
            arabic: {
                equalEmail: 'في هذا الحقل، يجب إدخال القيمة نفسها التي تم إدخالها في الحقل {0}',
                manualTyping: 'يجب إدخال {0} يدويا'
            },
            english: {
                equalEmail: 'Please enter the same value as {0}',
                manualTyping: 'Please enter {0} manually'
            }
        }
    };
});