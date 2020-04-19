/**
 * Classe ayant pour but d'ouvrir un nouvel onglet avec l'url envoyée à la création.
 */
class iconClick {
  protected url: string;
  /**
   * @param url URL qui sera ouverte à la création.
   */
  constructor(url: string) {
    this.url = url;
  }
  /**
   * Fonction qui permet l'ouverture de l'onglet.
   * @param url URL qui sera chargé.
   */
  goTo(url: string) {
    browser.tabs.create({ url: url });
  }
  /**
   * Démarage qui ajoute le listener sur l'icone.
   */
  start() {
    browser.browserAction.onClicked.addListener(tab => this.goTo(this.url));
  }
}

/**
 * Classe ayant pour but d'ouvrir un nouvel onglet avec l'url envoyée à la création
 * si jamais l'URL fait parti des possibilités ajoutées via addMatch.
 * @extends iconClick
 */
class iconClickChkUrl extends iconClick {
  protected urlMatch: Array<RegExp>;
  /**
   * @param url URL qui sera ouverte à la création.
   * @param urlMatch Liste des masques RegExp de l'URL
   */
  constructor(url: string, urlMatch: Array<RegExp> = []) {
    super(url);
    this.urlMatch = urlMatch;
  }
  /**
   * Ajoute une URl à la liste des possibilités.
   * @param url Masque RegExp de l'URL
   */
  addMatch(url: RegExp) {
    this.urlMatch.push(url);
  }
  /**
   * Fonction qui vérifie la validité des URL.
   * @param tabs tabs.Tab
   */
  checkURL(tabs: object) {
    if (this.urlMatch == undefined)
      return;
    for (let i = 0; i < this.urlMatch.length; i++) {
      if (tabs[0].url.match(this.urlMatch[i])) {
        super.goTo(this.url);
        return;
      }
    }
  }
  /**
   * Fonction allant chercher les informations de l'onglet avant vérification.
   */
  getClicked() {
    browser.tabs.query({ active: true, currentWindow: true }).then(this.checkURL);
  }
  /**
   * Démarage qui ajoute le listener sur l'icone. (qui va appeler la vérification)
   */
  start() {
    browser.browserAction.onClicked.addListener(this.getClicked);
  }
};

/**
 * Classe ayant pour but d'ouvrir un nouvel onglet avec l'url envoyée à la création
 * tout en conservant la suite de l'URL courante
 * si jamais l'URL fait parti des possibilités ajoutées via addMatch.
 * @extends iconClickChkUrl
 */
class iconClickChkUrlSwapHost extends iconClickChkUrl {
  /**
   * Fonction qui vérifie la validité des URL.
   * @param tabs tabs.Tab
   */
  checkURL(tabs: object) {
    var parser = document.createElement('a');
    parser.href = tabs[0].url;
    for (let i = 0; i < this.urlMatch.length; i++) {
      if (tabs[0].url.match(this.urlMatch[i])) {
        parser.hostname = this.url;
        super.goTo(parser.href);
        return;
      }
    }
  }
};
