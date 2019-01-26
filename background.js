chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
	var parser = document.createElement('a');
	parser.href = tab[0].url;
	var regExp = /^.*(youtube\.com\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
	if (tab[0].url.match(regExp)) {
	  parser.hostname = "yout.com";	
      chrome.tabs.update(tab.id, {url: parser.href});
    }
  });
});