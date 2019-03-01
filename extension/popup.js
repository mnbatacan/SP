$(document).ready(function(){
	var bkg = chrome.extension.getBackgroundPage();

	function getSignedInStatus(){
		chrome.storage.sync.get("isSignedIn", function(data) {
	        bkg.console.log("data: " + data.isSignedIn);
	        updateSigninStatus(data.isSignedIn);
	    });
	}


	jQuery.loadScript = function (url, callback) {
	    jQuery.ajax({
	        url: url,
	        dataType: 'script',
	        success: callback,
	        async: true
	    });
	}



	const authorizeButton = document.getElementById("authorize-button");
  const signoutButton = document.getElementById("signout-button");

  // authorizeButton.style.display = 'block'

        // chrome.storage.sync.set({key: value}, function() {
        //   console.log('Value is set to ' + value);
        // });
      
        // chrome.storage.sync.get(['key'], function(result) {
        //   console.log('Value currently is ' + result.key);
        // });

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

	  chrome.storage.sync.set({"isSignedIn": isSignedIn}, function() {
          bkg.console.log('isSignedIn is set to ' + isSignedIn);
      });
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
	      bkg.console.log(response);
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

	function setToken(token){
		bkg.console.log(token);
	  gapi.client.setToken({
	        access_token: token
	      });

	  buildApiRequest('GET',
	   'https://www.googleapis.com/youtube/v3/channels',
	   {'mine': 'true',
	   'part': 'id,snippet'});
	}



	function buttonFunction(){
		bkg.console.log("Button function in");
	  updateSigninStatus(false);
	  	$(authorizeButton).click(function(){
		  // handleClientLoad();
		  	  updateSigninStatus(true);

		}); 
	  // authorizeButton.onclick= handleClientLoad();
	}

	function handleClientLoad(){
		bkg.console.log("handleClientLoad: done");
		gapi.load('client', {
		    callback: function() {
		      // Handle gapi.client initialization.
		      bkg.console.log("handleClientLoad callback");
		      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		        // Use the token.
		        bkg.console.log("handleClientLoad: chrome identity");
		        setToken(token);
		        updateSigninStatus(true);
		        
		      });
		      	chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
				    bkg.console.log("HELLO:", account, signedIn);
				    updateSigninStatus(true);
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


 	if(authorizeButton){
 		getSignedInStatus();
	 	bkg.console.log(authorizeButton.innerHTML);
		$.loadScript("https://apis.google.com/js/api.js", buttonFunction())
 		
 	}

});