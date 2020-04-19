var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Classe ayant pour but de changer l'icone si l'URL est invalide.
 */
var iconFromUrl = /** @class */ (function () {
    /**
     * @param urlDefault Icone par défaut
     * @param urlDisabled Icone si l'URL est "undefined"
     */
    function iconFromUrl(urlDefault, urlDisabled) {
        this.urlIconDefault = urlDefault;
        this.urlIconDisabled = urlDisabled;
    }
    /**
     * Change l'icone
     * @param path Chemin de l'icone
     * @param tabId Identifiant de l'onglet correspondant
     */
    iconFromUrl.prototype.setLogo = function (path, tabId) {
        browser.browserAction.setIcon({ path: path, tabId: tabId });
    };
    /**
     * Vérifie quel logo doit être utilisé
     * @param tabs tabs.Tab
     */
    iconFromUrl.prototype.updateLogo = function (tabs) {
        if (tabs[0].url == undefined)
            this.setLogo(this.urlIconDisabled, tabs[0].id);
        this.setLogo(this.urlIconDefault, tabs[0].id);
    };
    /**
     * L'onglet a été modifié.
     */
    iconFromUrl.prototype.updateActiveTab = function () {
        browser.tabs.query({ active: true, currentWindow: true }).then(this.updateLogo);
    };
    /**
     * Démarage qui ajoute le listener sur l'icone. (qui va appeler la vérification)
     */
    iconFromUrl.prototype.start = function () {
        browser.tabs.onUpdated.addListener(this.updateActiveTab);
        browser.tabs.onActivated.addListener(this.updateActiveTab);
        browser.windows.onFocusChanged.addListener(this.updateActiveTab);
        this.updateActiveTab();
    };
    return iconFromUrl;
}());
;
/**
 * Classe ayant pour but de changer l'icone en fonction de l'URL.
 * @extends iconFromUrl
 */
var iconFromUrlMatch = /** @class */ (function (_super) {
    __extends(iconFromUrlMatch, _super);
    /**
     * @param urlDefault Icone par défaut
     * @param urlDisabled Icone si l'URL est "undefined"
     * @param urlMatch Couple URL, icone;
     */
    function iconFromUrlMatch(urlDefault, urlDisabled, urlMatch) {
        if (urlMatch === void 0) { urlMatch = []; }
        var _this = _super.call(this, urlDefault, urlDisabled) || this;
        _this.urlMatch = urlMatch;
        return _this;
    }
    /**
     * Ajoute un couple URL, icone à la liste des possibilités.
     * @param url Masque RegExp de l'URL
     * @param urlIcon Chemin de l'icone
     */
    iconFromUrlMatch.prototype.addMatch = function (url, urlIcon) {
        this.urlMatch.push([url, urlIcon]);
    };
    /**
     * Vérifie quel logo doit être utilisé
     * @param tabs tabs.Tab
     */
    iconFromUrlMatch.prototype.updateLogo = function (tabs) {
        if (tabs[0].url == undefined)
            _super.prototype.setLogo.call(this, this.urlIconDisabled, tabs[0].id);
        if (this.urlMatch != undefined) {
            for (var i = 0; i < this.urlMatch.length; i++) {
                if (tabs[0].url.match(this.urlMatch[i][0])) {
                    _super.prototype.setLogo.call(this, this.urlMatch[i][1], tabs[0].id);
                    return;
                }
            }
        }
        _super.prototype.setLogo.call(this, this.urlIconDefault, tabs[0].id);
    };
    return iconFromUrlMatch;
}(iconFromUrl));
;
//# sourceMappingURL=iconFromUrl.js.map