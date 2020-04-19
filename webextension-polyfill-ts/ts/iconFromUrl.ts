/**
 * Classe ayant pour but de changer l'icone si l'URL est invalide.
 */
class iconFromUrl {
  protected urlIconDefault: string;
  protected urlIconDisabled: string;
  /**
   * @param urlDefault Icone par défaut
   * @param urlDisabled Icone si l'URL est "undefined"
   */
  constructor(urlDefault: string, urlDisabled: string) {
    this.urlIconDefault = urlDefault;
    this.urlIconDisabled = urlDisabled;
  }
  /**
   * Change l'icone
   * @param path Chemin de l'icone
   * @param tabId Identifiant de l'onglet correspondant
   */
  setLogo(path, tabId) {
    browser.browserAction.setIcon({ path: path, tabId: tabId });
  }
  /**
   * Vérifie quel logo doit être utilisé
   * @param tabs tabs.Tab
   */
  updateLogo(tabs: object) {
    if (tabs[0].url == undefined)
      this.setLogo(this.urlIconDisabled, tabs[0].id);
    this.setLogo(this.urlIconDefault, tabs[0].id);
  }
  /**
   * L'onglet a été modifié.
   */
  updateActiveTab() {
    browser.tabs.query({ active: true, currentWindow: true }).then(this.updateLogo);
  }
  /**
   * Démarage qui ajoute le listener sur l'icone. (qui va appeler la vérification)
   */
  start() {
    browser.tabs.onUpdated.addListener(this.updateActiveTab);
    browser.tabs.onActivated.addListener(this.updateActiveTab);
    browser.windows.onFocusChanged.addListener(this.updateActiveTab);
    this.updateActiveTab();
  }
};

/**
 * Classe ayant pour but de changer l'icone en fonction de l'URL.
 * @extends iconFromUrl
 */
class iconFromUrlMatch extends iconFromUrl {
  urlMatch: Array<[RegExp, String]>;
  /**
   * @param urlDefault Icone par défaut
   * @param urlDisabled Icone si l'URL est "undefined"
   * @param urlMatch Couple URL, icone;
   */
  constructor(urlDefault: string, urlDisabled: string, urlMatch: Array<[RegExp, String]> = []) {
    super(urlDefault,urlDisabled);
    this.urlMatch = urlMatch;
  }
  /**
   * Ajoute un couple URL, icone à la liste des possibilités.
   * @param url Masque RegExp de l'URL
   * @param urlIcon Chemin de l'icone
   */
  addMatch(url: RegExp, urlIcon: String) {
    this.urlMatch.push([url, urlIcon]);
  }
  /**
   * Vérifie quel logo doit être utilisé
   * @param tabs tabs.Tab
   */
  updateLogo(tabs: object) {
    if (tabs[0].url == undefined)
      super.setLogo(this.urlIconDisabled, tabs[0].id);

    if (this.urlMatch != undefined) {
      for (let i = 0; i < this.urlMatch.length; i++) {
        if (tabs[0].url.match(this.urlMatch[i][0])) {
          super.setLogo(this.urlMatch[i][1], tabs[0].id);
          return;
        }
      }
    }
    super.setLogo(this.urlIconDefault, tabs[0].id);
  }
};