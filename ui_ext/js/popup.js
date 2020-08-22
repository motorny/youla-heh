var enableButton = document.getElementById('enableButton');

enableButton.onclick = function (element) {
    console.log("button click")
    chrome.storage.sync.set({grapghEnabled: true}, function() {
        console.log("Enabled");
    });
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "enableStats"});
   });
};