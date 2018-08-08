define(function () { //eslint-disable-line complexity
    window.tlp = window.tlp || {}; //eslint-disable-line no-undef
    window.govForms = window.govForms || {};
    if (typeof tlp.tlpGeneralAttributes !== 'object' && typeof govForms.govFormConfiguration !== 'object') //eslint-disable-line no-undef
    {
        throw new Error('tlp.tlpGeneralAttributes should be defined');
    }
    if (typeof tlp.tlpGeneralAttributes === 'object' && typeof govForms.govFormConfiguration === 'object') { //eslint-disable-line no-undef
        throw new Error('ambiguous configuration definition');
    }
    return govForms.govFormConfiguration || tlp.tlpGeneralAttributes; //eslint-disable-line no-undef

});
