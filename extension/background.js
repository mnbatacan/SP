  // chrome.browserAction.onClicked.addListener(function() {
  //   chrome.tabs.create({url: 'index1.html'});
  // });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.saveState){
        chrome.storage.local.set(request.state, function(){ sendResponse(true)});
    }
});


chrome.storage.local.get('state', function(result){
    if(result.state){
        //This is a function you will write
        render(result.state); 
    }
    else{
        //do nothing
    }
});