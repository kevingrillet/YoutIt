chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
	var parser = document.createElement('a');
	parser.href = tab[0].url;
	if (tab[0].url.match(/^.*(youtube\.com\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)) {
	  parser.hostname = "yout.com";	
      chrome.tabs.create({url: parser.href});
    }
  });
});

var updateLogo = function(url, tabId){
  if (url == undefined) {
    chrome.browserAction.setIcon({path: 'logo-disabled.png', tabId: tabId});
  } else if (url.match(/^.*(youtube\.com\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)){
    chrome.browserAction.setIcon({path: 'logo.png', tabId: tabId});
  } else {
    chrome.browserAction.setIcon({path: 'logo-disabled.png', tabId: tabId});
  }	
}

chrome.tabs.onActivated.addListener(function(info){
  chrome.tabs.get(info.tabId, function(change){
	updateLogo(change.url, info.tabId);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  updateLogo(tab.url, tabId);
});