var s = document.createElement('script');
// TODO: add "inject.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('/scripts/inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

var s1 = document.createElement('script');
// TODO: add "inject.js" to web_accessible_resources in manifest.json
s1.src = chrome.extension.getURL('/scripts/caman.full.js');
s1.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s1);