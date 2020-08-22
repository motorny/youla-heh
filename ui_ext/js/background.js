
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({grapghEnabled: true}, function() {
    console.log("Enabled");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.instagram.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {    console.log(changeInfo)
    if (changeInfo.url) {
        console.log('sending update')
        chrome.tabs.sendMessage(tabId, {
            message: 'url_updated',
        });
    }
});
