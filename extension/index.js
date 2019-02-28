// ajax({
//     url: 'https://apis.google.com/js/api.js',
//     dataType: 'script',
//     async: true,
//     defer: true
// });


// // "https://apis.google.com/js/api.js"
// //       onload="this.onload=function(){};handleClientLoad()"
// //       onreadystatechange="if (this.readyState === 'complete') this.onload()


//  $(document).ready(function(){
//     $('.tabs').tabs();
//     $.getScript("https://apis.google.com/js/api.js?onload=handleClientLoad", function(){
//     	// if (this.readyState === 'complete')
// 	  // alert("Script loaded and executed.");

// 	});
	  
//   });


 var head = document.getElementsByTagName('head')[0];
 var script = document.createElement('script');
 script.type = 'text/javascript';
 script.src = "https://apis.google.com/js/api.js?onload=buttonFunction";
script.async= true;
script.defer= true;

//  script.onreadystatechange = function () {
//   if (this.readyState === 'complete' || this.readyState === 'loaded') {
//     handleClientLoad();
//   }
// };

window.onload = function() {
 // alert("let's go!");


 head.appendChild(script);
 // script.onload = handleClientLoad();

// chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
//   // Use the token.
//   console.log("asdasda");
//   console.log(token);
// });



 const defaultChannel = "pewdiepie"
var authToken;
const CLIENT_ID = '440105667802-rblttlfp7gbvu1e5t5ip09mkkkp9v38d.apps.googleusercontent.com'
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
// const content = document.getElementById('content');
const videoContainer = document.getElementById('video-container');

}

// function handleClientLoad() {
// 	console.log("bwifebise")
//     gapi.load('client:auth2', function(){initClient();});

// 	console.log("handleClientLoad: done");
	
// }


// function initClient() {
// 	console.log("initClient: ---");

// 	gapi.client.init({
// 	    discoveryDocs: DISCOVERY_DOCS,
//     	clientId: CLIENT_ID,
//       	scope: SCOPES
//     }).then(function () {
//     // Listen for sign-in state changes.
//     	console.log("initClient: then");
	
//     	gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus());

//         // Handle the initial sign-in state.
//         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//         authorizeButton.onclick = handleAuthClick;
//         signoutButton.onclick = handleSignoutClick;
//         });
//       }
function setToken(token){
  gapi.client.setToken({
        access_token: token
      });

  https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&key={YOUR_API_KEY}
  // gapi.client.youtube.channels.list({
  //         'part': 'id',
  //         'mine': true
  //       }).then(function(response) {
  //         var channel = response.result.items[0];
  //         console.log(channel);
  //                 });

              buildApiRequest('GET',
                'https://www.googleapis.com/youtube/v3/channels',
                {'mine': 'true',
                 'part': 'id,snippet'});
}

  function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

  function executeRequest(request) {
    request.execute(function(response) {
      console.log(response);
    });
  }

  function buildApiRequest(requestMethod, path, params, properties) {
    params = removeEmptyParams(params);
    var request;
    if (properties) {
      var resource = createResource(properties);
      request = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    executeRequest(request);
  }
function buttonFunction(){
  authorizeButton.onclick= handleClientLoad();
}
function handleClientLoad(){
  console.log("handleClientLoad: done");
  
  gapi.load('client', {
    callback: function() {
      // Handle gapi.client initialization.
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        // Use the token.
        setToken(token);
        console.log("GOT IN");
        console.log(token);
      });

      chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
          console.log("HELLO:", account, signedIn);

      });
      
    },
    onerror: function() {
      // Handle loading error.
      alert('gapi.client failed to load!');
    },
    timeout: 5000, // 5 seconds.
    ontimeout: function() {
      // Handle timeout.
      alert('gapi.client could not load in a timely manner!');
    }
  });
}






function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          content.style.display = 'block';
          videoContainer.style.display = 'block';
          getChannel(defaultChannel);
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
          content.style.display = 'none';
          videoContainer.style.display = 'none';
        }
      }


function handleAuthClick(event) {
		
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }


function getChannel(channel){
	console.log(channel);
}