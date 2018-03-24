function uploadToQueue(info) {
    uploadQueue = [];
    chrome.storage.local.get(["uploadQueue"], function (result) {
        if (typeof result.uploadQueue !== "undefined") {
            uploadQueue = result.uploadQueue;
        }
        uploadQueue.push(info.srcUrl);
        chrome.storage.local.set({ "uploadQueue": uploadQueue });
    });
}
chrome.contextMenus.create({
    title: "Upload to Chevereto",
    contexts: ["image"],
    onclick: uploadToQueue,
});

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    if (request.url && request.type) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image()
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            dataUrl = canvas.toDataURL(request.type);
            sendResponse({ dataUrl: dataUrl });

            canvas.remove();
            img.remove();
        }
        img.src = request.url;
        return true;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.tab) {
        tab = request.tab;
        chrome.tabs.executeScript(tab.id, { file: "/scripts/jquery-3.3.1.min.js" }, function () {
            chrome.tabs.executeScript(tab.id, { file: "/scripts/upload.js" }, function () {
                chrome.tabs.highlight({ 'tabs': tab.index });
                return true
            });
        });
    }
});
