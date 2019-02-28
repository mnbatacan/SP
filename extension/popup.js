$(document).ready(function(){
	var bkg = chrome.extension.getBackgroundPage();
	const authorizeButton = document.getElementById("authorize-button");
  const signoutButton = document.getElementById("signout-button");
  bkg.console.log(authorizeButton.innerHTML);
  // authorizeButton.style.display = 'block'

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

	function injectScript(){
	  var head = document.getElementsByTagName('head')[0];
	  var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.async= true;
	  script.defer= true;
	  head.appendChild(script);
	  script.src = "https://apis.google.com/js/api.js?onload=buttonFunction";
	}

	function buttonFunction(){
	  updateSigninStatus(false);
	  authorizeButton.onclick= handleClientLoad();
	}

	function handleClientLoad(){
 	 bkg.console.log("handleClientLoad: done");
 	}



	// updateSigninStatus(false);
	injectScript();
});