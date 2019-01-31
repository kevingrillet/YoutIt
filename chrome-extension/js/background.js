// MAJ d'onglet
function updateActiveTab(tabs) {
  // MAJ de l'icone en fonction de l'url > .matchhistory.*.leagueoflegends.com/
  function updateLogo(tabs) {
    // MAJ l'icone
    function setLogo(path, tabId) {
      chrome.browserAction.setIcon({ path: path, tabId: tabId });
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

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { updateLogo(tabs) });
}

// Après click sur bouton
function getClicked(tabs) {
  function checkURL(tabs) {
    var parser = document.createElement('a');
    parser.href = tabs[0].url;
    if (tabs[0].url.match(/.*\.youtube.com\/watch\?.*v=[^#\&\?]*/)) {
      parser.hostname = "yout.com";
      chrome.tabs.create({ url: parser.href });
    }
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { checkURL(tabs) });
}

window.addEventListener('load', function () {
  // Listener - Changement d'URL
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { updateActiveTab(); });

  // Listener - Changement d'onglet
  chrome.tabs.onActivated.addListener(function (info) { updateActiveTab(); });

  // Listener - Changement de fenêtre
  chrome.windows.onFocusChanged.addListener(function (windowId) { updateActiveTab(); });

  // Listener - Au click du bouton
  chrome.browserAction.onClicked.addListener(function (tab) { getClicked(); });

  // Chargement de l'extension
  updateActiveTab();
});
