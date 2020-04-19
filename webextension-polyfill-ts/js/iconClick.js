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
 * Classe ayant pour but d'ouvrir un nouvel onglet avec l'url envoyée à la création.
 */
var iconClick = /** @class */ (function () {
    /**
     * @param url URL qui sera ouverte à la création.
     */
    function iconClick(url) {
        this.url = url;
    }
    /**
     * Fonction qui permet l'ouverture de l'onglet.
     * @param url URL qui sera chargé.
     */
    iconClick.prototype.goTo = function (url) {
        browser.tabs.create({ url: url });
    };
    /**
     * Démarage qui ajoute le listener sur l'icone.
     */
    iconClick.prototype.start = function () {
        var _this = this;
        browser.browserAction.onClicked.addListener(function (tab) { return _this.goTo(_this.url); });
    };
    return iconClick;
}());
/**
 * Classe ayant pour but d'ouvrir un nouvel onglet avec l'url envoyée à la création
 * si jamais l'URL fait parti des possibilités ajoutées via addMatch.
 * @extends iconClick
 */
var iconClickChkUrl = /** @class */ (function (_super) {
    __extends(iconClickChkUrl, _super);
    /**
     * @param url URL qui sera ouverte à la création.
     * @param urlMatch Liste des masques RegExp de l'URL
     */
    function iconClickChkUrl(url, urlMatch) {
        if (urlMatch === void 0) { urlMatch = []; }
        var _this = _super.call(this, url) || this;
        _this.urlMatch = urlMatch;
        return _this;
    }
    /**
     * Ajoute une URl à la liste des possibilités.
     * @param url Masque RegExp de l'URL
     */
    iconClickChkUrl.prototype.addMatch = function (url) {
        this.urlMatch.push(url);
    };
    /**
     * Fonction qui vérifie la validité des URL.
     * @param tabs tabs.Tab
     */
    iconClickChkUrl.prototype.checkURL = function (tabs) {
        if (this.urlMatch == undefined)
            return;
        for (var i = 0; i < this.urlMatch.length; i++) {
            if (tabs[0].url.match(this.urlMatch[i])) {
                _super.prototype.goTo.call(this, this.url);
                return;
            }
        }
    };
    /**
     * Fonction allant chercher les informations de l'onglet avant vérification.
     */
    iconClickChkUrl.prototype.getClicked = function () {
        browser.tabs.query({ active: true, currentWindow: true }).then(this.checkURL);
    };
    /**
     * Démarage qui ajoute le listener sur l'icone. (qui va appeler la vérification)
     */
    iconClickChkUrl.prototype.start = function () {
        browser.browserAction.onClicked.addListener(this.getClicked);
    };
    return iconClickChkUrl;
}(iconClick));
;
/**
 * Classe ayant pour but d'ouvrir un nouvel onglet avec l'url envoyée à la création
 * tout en conservant la suite de l'URL courante
 * si jamais l'URL fait parti des possibilités ajoutées via addMatch.
 * @extends iconClickChkUrl
 */
var iconClickChkUrlSwapHost = /** @class */ (function (_super) {
    __extends(iconClickChkUrlSwapHost, _super);
    function iconClickChkUrlSwapHost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fonction qui vérifie la validité des URL.
     * @param tabs tabs.Tab
     */
    iconClickChkUrlSwapHost.prototype.checkURL = function (tabs) {
        var parser = document.createElement('a');
        parser.href = tabs[0].url;
        for (var i = 0; i < this.urlMatch.length; i++) {
            if (tabs[0].url.match(this.urlMatch[i])) {
                parser.hostname = this.url;
                _super.prototype.goTo.call(this, parser.href);
                return;
            }
        }
    };
    return iconClickChkUrlSwapHost;
}(iconClickChkUrl));
;
//# sourceMappingURL=iconClick.js.map