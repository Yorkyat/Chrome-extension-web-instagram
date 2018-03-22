$(document).ready(function () {
    chrome.storage.local.get(["hostname"], function (result) {
        if (typeof result.hostname !== "undefined") {
            $("#hostname").val(result.hostname);
        } else {
            chrome.storage.local.set({ "hostname": "http://localhost/" });
        }
    });
    chrome.storage.local.get(["uploadQueue"], function (result) {
        if (typeof result.uploadQueue !== "undefined") {
            console.log(result.uploadQueue);
            $("span").html(result.uploadQueue.length);
        }
    });
});


$(document).on("click", "#save", function () {
    event.preventDefault();
    hostname = $("#hostname").val();
    chrome.storage.local.set({ "hostname": hostname }, function () {
        console.log('Value is set to ' + hostname);
    });
    chrome.storage.local.get(["hostname"], function (result) {
        console.log('Value currently is ' + result.hostname);
    });
});

$(document).on("click", "#showUploadQueue", function () {
    $("select").toggle();
    $("option").remove();
    chrome.storage.local.get(["uploadQueue"], function (result) {
        if (typeof result.uploadQueue !== "undefined") {
            result.uploadQueue.forEach(function (url) {
                $("select").append("<option>" + url + "</option>");
            });
        } else {
            $("select").append("<option>None</option>");
        }
    });
});

$(document).on("click", "#uploadToChevereto", function () {
    var url = "";
    chrome.storage.local.get(["uploadQueue"], function (result) {
        if (typeof result.uploadQueue === "undefined") {
            chrome.storage.local.get(["hostname"], function (result) {
                url = result.hostname;
                chrome.tabs.create({ "url": url, "active": false }, function (tab) {
                    chrome.tabs.highlight({ 'tabs': tab.index });
                });
            });
        } else {
            chrome.storage.local.get(["hostname"], function (result) {
                url = result.hostname;
                chrome.tabs.create({ "url": url, "active": false }, function (tab) {
                    chrome.runtime.sendMessage(null, { tab: tab });
                });
            });
        }
    });
});