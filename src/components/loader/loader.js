define(['common/utilities/reflection'],
    function (reflection) {

        const defaultSettings = {
            modal: true,
            title: '',
            message: '',
            autoOpen: true,
            appendTo: 'body',
            closeOnEscape: false,
            draggable: false,
            width: 300,
            show: { effect: 'fade', duration: 600 },
            resizable: false,
            buttons: [],
            dialogClass: 'loader-component top-zindex',
            closeText: ''
        };
        let dialogElement;
        const open = function (message, settings) {
            const openSettings = reflection.extendSettingsWithDefaults(settings, defaultSettings);
            dialogElement = $('<div></div>');
            openSettings.title = message;
            dialogElement.dialog(openSettings);
        };

        const close = function () {
            dialogElement.dialog('destroy');

        };

        return {
            open,
            close
        };
    });