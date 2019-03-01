$(document).ready(function(){
	var bkg = chrome.extension.getBackgroundPage();
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

	// $.ajax({
	//     url: 'https://apis.google.com/js/api.js?onload=buttonFunction',
	//     dataType: 'script',
	//     async: true,
	//     defer: true
	// });



 //    $.getScript("https://apis.google.com/js/api.js?onload=handleClientLoad", function(){
 //    	// if (this.readyState === 'complete'){handleClientLoad}
	//   // alert("Script loaded and executed.");

	// });

	function injectScript(){


// // "https://apis.google.com/js/api.js"
// //       onload="this.onload=function(){};handleClientLoad()"
// //       onreadystatechange="if (this.readyState === 'complete') this.onload()


//  $(document).ready(function(){
//     $('.tabs').tabs();
	  
//   });
		// bkg.console.log("injectscript");
		// $.getScript("https://apis.google.com/js/api.js?onload=buttonFunction");
	  // var head = document.getElementsByTagName('head')[0];
	  // var script = document.createElement('script');
	  // script.type = 'text/javascript';
	  // script.async= true;
	  // script.defer= true;
	  // head.appendChild(script);

	  // script.src = "https://apis.google.com/js/api.js?onload=buttonFunction";
	}

	function buttonFunction(){
		bkg.console.log("Button function in");
	  updateSigninStatus(false);
	  authorizeButton.onclick= handleClientLoad();
	}

	function handleClientLoad(){
 	 bkg.console.log("handleClientLoad: done");
 	}

 	bkg.console.log(authorizeButton.innerHTML);
 // 	if (typeof someObject == 'undefined') $.loadScript('url_to_someScript.js', function(){
	//     //Stuff to do after someScript has loaded
	// });
	$.loadScript("https://apis.google.com/js/api.js", buttonFunction())

	// updateSigninStatus(false);
	// injectScript();
});