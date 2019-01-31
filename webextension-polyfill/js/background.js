// MAJ d'onglet
function updateActiveTab(tabs) {
  // MAJ de l'icone en fonction de l'url > .matchhistory.*.leagueoflegends.com/
  function updateLogo(tabs) {
    // MAJ l'icone
    function setLogo(path, tabId) {
      browser.browserAction.setIcon({ path: path, tabId: tabId });
    }

    if (tabs[0].url == undefined) {
      setLogo('img/logo-disabled.png', tabs[0].id);
    } else if (tabs[0].url.match(/.*\.youtube.com\/watch\?.*v=[^#\&\?]*/)) {
      setLogo('img/logo-enabled.png', tabs[0].id);
    } else if (tabs[0].url.match(/.*yout.com\//)) {
      setLogo('img/logo.png', tabs[0].id);
    } else {
      setLogo('img/logo-disabled.png', tabs[0].id);
    }
  }

  browser.tabs.query({ active: true, currentWindow: true }).then(updateLogo);
}

// Après click sur bouton
function getClicked(tabs) {
  function checkURL(tabs) {
    var parser = document.createElement('a');
    parser.href = tabs[0].url;
    if (tabs[0].url.match(/.*\.youtube.com\/watch\?.*v=[^#\&\?]*/)) {
      parser.hostname = "yout.com";
      browser.tabs.create({ url: parser.href });
    }
  }

  browser.tabs.query({ active: true, currentWindow: true }).then(checkURL);
}

window.addEventListener('load', function () {
  // Listener - Changement d'URL
  browser.tabs.onUpdated.addListener(updateActiveTab);

  // Listener - Changement d'onglet
  browser.tabs.onActivated.addListener(updateActiveTab);

  // Listener - Changement de fenêtre
  browser.windows.onFocusChanged.addListener(updateActiveTab);

  // Listener - Au click du bouton
  browser.browserAction.onClicked.addListener(getClicked);

  // Chargement de l'extension
  updateActiveTab();
});
