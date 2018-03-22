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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        tab = request.tab;
        chrome.tabs.executeScript(tab.id, { file: "/scripts/jquery-3.3.1.min.js" }, function () {
            chrome.tabs.executeScript(tab.id, { file: "/scripts/upload.js" }, function () {
                chrome.tabs.highlight({ 'tabs': tab.index });
            });
        });
    });
