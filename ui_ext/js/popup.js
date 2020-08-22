var enableButton = document.getElementById('enableButton');
var productsInput = document.getElementById('productsInput');

enableButton.onclick = function (element) {
    console.log("button click")
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "enableStats"});
   });
};


productsInput.oninput = function() {
    var val = productsInput.value;
    console.log(val)
    chrome.storage.sync.set({brands: val}, function() {
        console.log("val saved");
    });
};