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
  // return response



}


function getServer(){
  $.ajax({
            type:"GET",
            url: "http://localhost:5000/",
            dataType:"json",
            // data: "",
            // type: 'get',
            // dataType: 'json',
            success: callbackFunc,
            error: function(){
              alert("error :(");
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