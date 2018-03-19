$(document).ready(function(){
    chrome.storage.local.get(["hostname"], function(result) {
        if(typeof result.hostname !== "undefined"){
            $("#hostname").val(result.hostname);
        }
    });
});


$(document).on("click", "#save", function(){
    event.preventDefault();
    hostname = $("#hostname").val();
    chrome.storage.local.set({"hostname": hostname}, function() {
        console.log('Value is set to ' + hostname);
    });
    chrome.storage.local.get(["hostname"], function(result) {
        console.log('Value currently is ' + result.hostname);
    });
});
