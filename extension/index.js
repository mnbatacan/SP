$.ajax({
    url: 'https://apis.google.com/js/api.js?onload=handleClientLoad()',
    dataType: 'script',
    async: true,
    defer: true
});


// "https://apis.google.com/js/api.js"
//       onload="this.onload=function(){};handleClientLoad()"
//       onreadystatechange="if (this.readyState === 'complete') this.onload()


 $(document).ready(function(){
    $('.tabs').tabs();
    $.getScript("https://apis.google.com/js/api.js?onload=handleClientLoad()", function(){
    	if (this.readyState === 'complete')
	  // alert("Script loaded and executed.");
	console.log('foo');
		handleClientLoad();
	});
	  
  });






 const defaultChannel = "pewdiepie"

const CLIENT_ID = '440105667802-rblttlfp7gbvu1e5t5ip09mkkkp9v38d.apps.googleusercontent.com'
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
// const content = document.getElementById('content');
const videoContainer = document.getElementById('video-container');



function handleClientLoad() {
    gapi.load('client:auth2', initClient());

}


function initClient() {
	// alert("Script loaded and executed.");
	gapi.client.init({
	    discoveryDocs: DISCOVERY_DOCS,
    	clientId: CLIENT_ID,
      	scope: SCOPES
    }).then(function () {
    // Listen for sign-in state changes.

    	gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus());

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
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