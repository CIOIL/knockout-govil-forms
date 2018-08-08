define(['common/components/dialog/dialog',
    'common/utilities/resourceFetcher',
    'common/resources/texts/indicators',
    'common/actions/saveAsPdf' ],
function (dialog, resourceFetcher, indicators, pdfAction) {//eslint-disable-line max-params

    const buttonsResources = {
        hebrew: { ok: 'שמור כ-PDF', cancel: 'אישור' },
        english: { ok: 'Save as PDF', cancel: 'OK' },
        arabic: { ok: '', cancel: 'التأكيد' }
    };

    const open = (successMessage = resourceFetcher.get(indicators.information).defaultSuccsess) => {
        const confirmSettings = {
            title: resourceFetcher.get(indicators.information).sendTheForm,
            message: successMessage,
            buttonTexts: buttonsResources,
            width: 'auto'
        };
        const confirmPromise = dialog.confirm(confirmSettings);
        confirmPromise.then(function () {
            pdfAction.saveAsPdf();
        });
    };

    return {         
        open
    };
});