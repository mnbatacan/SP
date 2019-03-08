  // chrome.browserAction.onClicked.addListener(function() {
  //   chrome.tabs.create({url: 'index1.html'});
  // });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.saveState){
        chrome.storage.local.set(request.state, function(){ sendResponse(true)});
    }
});

function callbackFunc(response){
  // alert(response);
  console.log("Connected to the server!")
  console.log("Classifying accuracy score: "+response)
  // return sendResponseonse



}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("background.js got a message")
        console.log(request);
        getServer();
        sendResponse("bar");
    }
);


function getServer(){
  $.ajax({
            type:"GET",
            url: "http://localhost:5000/",
            dataType:"json",
            // data: "",
            // type: 'get',
            // dataType: 'json',
            success: function(response) {
                // Run the code here that needs
                //    to access the data returned
                console.log("Connected to the server!")
                console.log("Classifying accuracy score: "+response)
                return response;
            },
            error: function(){
              alert("error :(");
            }
  });

}


chrome.runtime.onMessage.addListener(function(message) {
        var receivedParameter = message.parameter;
        console.log("from inject:" + message)

        //use receivedParameter as you wish.

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