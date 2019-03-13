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
  $.ajax({
            type:"POST",
            url: "http://localhost:5000/",
            dataType:"json",
            data: text,
            contentType: 'application/json',
            success: function(data) {
                console.log("Classifying accuracy score: "+ text + ": " + data)
            },
            error: function(){
              // alert("error :(");
            }
  });

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