define(['common/external/q',
        'common/utilities/reflection',
        'common/core/formMode',
        'common/ko/globals/multiLanguageObservable'
        
],
     (Q, reflection,formMode) => {
         const defaultTexts = {
             hebrew: {
                 ok: 'אישור',
                 cancel: 'ביטול'
             },
             arabic: {
                 ok: 'التأكيد',
                 cancel: 'الغاء'
             },
             english: {
                 ok: 'OK',
                 cancel: 'Cancel'
             }
         };

         //todo: not support in additional languages yet
         let texts;
         let prevFocus;
         const defaultSettings = {
             modal: true,
             title: '', 
             message: '',
             autoOpen: true,
             width: 300,
             resizable: false,
             close:()=>prevFocus.focus(),
             buttons: [],    
             dialogClass: 'dialog-component top-zindex',
             closeText:''
         };

         const open = settings => {
             prevFocus = document.activeElement;
             const openSettings = reflection.extendSettingsWithDefaults(settings, defaultSettings);
             let dialogElement;
             if (openSettings.selector) {
                 dialogElement = $(openSettings.selector);
             }
             else {
                 dialogElement = $('#messageDialog').length > 0 ? $('#messageDialog') : $('<div class="messageDialog" id="messageDialog"></div>')
                .appendTo('body')
                .html('<div><h4></h4></div>');
                 dialogElement.find('h4').html(openSettings.message);
             }
             dialogElement.dialog(openSettings);
         };

         const dialogTypes = defer =>({
             alert: {
                 buttons: [{
                     text: texts().ok,
                     'aria-labelledby': 'messageDialog',
                     click: function () {
                         defer.resolve();
                         $(this).dialog('close');
                         prevFocus.focus();
                     }
                 }]
             },
             confirm: {
                 buttons: [{
                     text: texts().ok,
                     'aria-labelledby': 'messageDialog',
                     click: function () {
                         defer.resolve();
                         $(this).dialog('close');
                         prevFocus.focus();
                     }
                 }, {
                     text: texts().cancel,
                     click: function () {
                         defer.reject();
                         $(this).dialog('close');
                         prevFocus.focus();
                     }
                 }]
             }

         });

         const dialogFactory = (type) => {
             return (settings={}) => {
                 const defer = Q.defer();
                 if(formMode.isPdf()){
                     return defer.promise;
                 }
                 const finaltexts = reflection.extendSettingsWithDefaults(settings.buttonTexts, defaultTexts);
                 texts = ko.multiLanguageObservable({ resource: finaltexts });
                 const innerDefaultSettings = dialogTypes(defer)[type];
                 const factorySettings = reflection.extendSettingsWithDefaults(settings, innerDefaultSettings);
                 open(factorySettings);
                 return defer.promise;
             };
         };

         const alert = dialogFactory('alert');
         const confirm = dialogFactory('confirm');

         return {
             open,
             alert,
             confirm,
             dialogTypes
         };
     });