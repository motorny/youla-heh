
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
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

// chrome.browserAction.onClicked.addListener(function(tab) {
// 	chrome.tabs.create({
// 		url: "https://music.mts.ru"
// 	});
// 	//usage:
// });
//
