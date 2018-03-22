$(".pop-btn[data-action=top-bar-upload]").click();
setTimeout(function () {
    $(".tablet-hide.laptop-hide.desktop-hide.upload-box-status-text a[data-target=anywhere-upload-paste-url]")[0].click();
    setTimeout(function () {
        chrome.storage.local.get(["uploadQueue"], function (result) {
            var urls = "";
            result.uploadQueue.forEach(function (url) {
                urls = urls + url + "\n";
            });
            $(".resize-vertical").val(urls);
            setTimeout(function () {
                $("#fullscreen-modal-box [data-action=submit]").click();
            }, 1000);
        });
    }, 1000);
}, 1000);
