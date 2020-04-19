"use strict";

window.addEventListener('load', function () {
  var icUrl = new iconFromUrlMatch('img/logo-disabled.png', 'img/logo-disabled.png',
    [[/.*\.youtube.com\/watch\?.*v=[^#\&\?]*/, 'img/logo-enabled.png'], [/.*yout.com\//, 'img/logo.png']]);
  icUrl.start();

  var icClick = new iconClickChkUrlSwapHost('yout.com', [/.*\.youtube.com\/watch\?.*v=[^#\&\?]*/]);
  icClick.start();
});