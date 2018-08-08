define([], () => {
    class inlinePopup  {
        constructor(templateName) {
            this.visiblePopup = ko.observable(false);
            this.templateName = ko.observable(templateName);
        }
    }
    return inlinePopup;
});