'use strict';

$(document).ready(function(){
	const authorizeButton = document.getElementById("authorize-button");
	const signoutButton = document.getElementById("signout-button");

	function updateSigninStatus(isSignedIn) {
	  if (isSignedIn) {
	    authorizeButton.style.display = 'none';
	    signoutButton.style.display = 'block';
	     // content.style.display = 'block';
	          // videoContainer.style.display = 'block';
	          // getChannel(defaultChannel);
	  } else {
	    authorizeButton.style.display = 'block';
	    signoutButton.style.display = 'none';
	        // this.content.style.display = 'none';
	          // videoContainer.style.display = 'none';
	  }
	}



	if(authorizeButton){
	    	chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
				    console.log("HELLO:", account, signedIn);
				    alert("Q");
				    updateSigninStatus(true);
			});
	    // authorizeButton.addEventListener('click', function() {
	    // 	updateSigninStatus(false);
	    // 	console.log("udate")
	    //   // chrome.identity.getAuthToken({interactive: true}, function(token) {
	    //   //   console.log(token);
	    //   // });
	    // });
	}
});
