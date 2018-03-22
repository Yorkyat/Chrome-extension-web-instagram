chrome.storage.local.get(["hostname"], function (result) {
    var expression = result.hostname;
    var regex = new RegExp(expression);
    var t = window.location.href;

    if (t.match(regex)) {
        var s = document.createElement('script');
        // TODO: add "inject.js" to web_accessible_resources in manifest.json
        s.src = chrome.extension.getURL('/scripts/inject.js');
        s.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);

        var s1 = document.createElement('script');
        // TODO: add "inject.js" to web_accessible_resources in manifest.json
        s1.src = chrome.extension.getURL('/scripts/caman.full.js');
        s1.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s1);

        $.get(chrome.extension.getURL('/editor.html'), function (data) {
            $($.parseHTML(data)).appendTo('body')
        })
    }
})

document.addEventListener("click", function (e) {
    if(e.target && e.target.dataset.action === "upload"){
        chrome.storage.local.remove("uploadQueue");
    }
});