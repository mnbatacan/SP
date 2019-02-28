  chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({url: 'index1.html'});
  });



  console.log("yow")