let enableButton = document.getElementById('enableButton');

enableButton.onclick = function (element) {
    let color = element.target.value;
    console.log("button click")
    chrome.storage.sync.set({grapghEnabled: true}, function() {
        console.log("Enabled");
    });
};