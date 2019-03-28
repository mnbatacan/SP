// ----------------------------------------------------------------------------------------------
// Chrome Extension Background script 
// Contains listeners(extension storage, connection to server)
// ---------------------------------------------------------------------------------------------- 


  // chrome.browserAction.onClicked.addListener(function() {
  //   chrome.tabs.create({url: 'index1.html'});
  // });

//Storage listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.saveState){
        chrome.storage.local.set(request.state, function(){ sendResponse(true)});
    }
});


// Inject button listener - for moderating
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("background.js got a message")
        console.log(sender);
        getServer();
        sendResponse("bar");
    }
);

// connecting to server
function getServer(text){
  return $.ajax({
            type:"POST",
            url: "https://blooming-retreat-18848.herokuapp.com/",
            // url: "https://ytest-219100.appspot.com",
            dataType:"json",
            data: text,
            contentType: 'application/json'
  }).then(
   function (data) {
      // console.log("Classifying accuracy score: "+ text + ": " + data);
      return data;
   });;

}




chrome.storage.local.get('state', function(result){
    if(result.state){
        //This is a function you will write
        render(result.state); 
    }
    else{
        //do nothing
    }
});