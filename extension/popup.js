// ----------------------------------------------------------------------------------------------
// Pop-up window js. 
// Contains authorization, other main functions.
// ----------------------------------------------------------------------------------------------


$(document).ready(function(){
	var bkg = chrome.extension.getBackgroundPage();


	function getSignedInStatus(){

		chrome.storage.sync.get("isSignedIn", function(data) {
	        // bkg.console.log("Intial check isSignedIn: " + data.isSignedIn);
	        if(data.isSignedIn === true){
			    updateSigninStatus(data.isSignedIn);
			   	$.loadScript("https://apis.google.com/js/api.js", handleClientLoad);

	        }else{
	        	updateSigninStatus(false);
	        }
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
  const channelButton = document.getElementById("channel-button");
  const moderateButton = document.getElementById("moderate-button");
  const indexPage = document.getElementById("index-page");
  // const preloader = document.getElementById("preloader");
  const mainPage = document.getElementById("mainDiv");
  var channelId = 1;
  var video_id = total_number_of_comments = total_number_of_views = 0;
  var video_title = uploads_id = "";
  var channel_response = {}



  function updateSigninStatus(isSignedIn) {
	  if (isSignedIn) {
	    authorizeButton.style.display = 'none';
	    indexPage.style.display = 'none';
	    signoutButton.style.display = 'block';
	    channelButton.style.display = 'block';
	    mainPage.style.display = 'block';
	    // preloader.style.display = 'block';
	    // $(document).on('load', function() {
	    // alert("asd")
     //        $('.preloader').delay(350).fadeOut('slow');
     //        $('.preloader-wrapper').delay(350).fadeOut();
     //    });

	  } else {
	    authorizeButton.style.display = 'block';
	    indexPage.style.display = 'block';
	    signoutButton.style.display = 'none';
	    channelButton.style.display = 'none';
	    moderateButton.style.display = 'none';
	    mainPage.style.display = 'none';
	     // preloader.style.display = 'none';
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



	  function buildApiRequest(requestName,requestMethod, path, params, properties) {
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
	    if(requestName === "setChannelDetails"){setChannelDetails(request);}
	    else if(requestName === "flagComment"){flagComment(request);}
	    else if(requestName === "getVideoDetails"){getVideoDetails(request);}
	    else if(requestName === "checkVideoId"){checkVideoId(request);}
	    else{retrieveComments(request);}
	  }

	function setToken(token){
		bkg.console.log(token);
	 	 gapi.client.setToken({
	        access_token: token
	      });
	 	 updateSigninStatus(true);
		chrome.storage.sync.set({"authToken": token}, function() {
          bkg.console.log('authToken is set to ' + token);
        });

		// Get channel details
		  var channelDetails = buildApiRequest("setChannelDetails",'GET',
		   'https://www.googleapis.com/youtube/v3/channels',
		   {'mine': 'true',
		   'part': 'id,snippet,statistics,contentDetails'});

	}

	function setChannelDetails(request){
		request.execute(function(response) {
	      // bkg.console.log(response);
	      document.getElementById("channel-name").innerHTML = response.items[0]["snippet"]["title"];
	      document.getElementById("sub-count").innerHTML = response.items[0]["statistics"]["subscriberCount"] + " subscribers";
	      document.getElementById("channel-thumbnail").src = response.items[0]["snippet"]["thumbnails"]["default"]["url"];
	      channelId = response.items[0]["id"];
	      bkg.console.log(response);
	      var query = { active: true, currentWindow: true };
 		// gets the URL of the current tab
 		channel_response = response;
 			chrome.tabs.query(query, checkCurrentURL);

	    });
		
	}


	function flagComment(request) {
	    request.execute(function(response) {
	    	if (typeof response === 'undefined') {
			  // color is undefined
			  bkg.console.log("comment was flagged!");
			}else{
				bkg.console.log("unsuccessful!");
			}
	      
	    });
	}

	function getVideoDetails(request){
		request.execute(function(response) {
			video_title = response.items[0].snippet.localized.title;
			total_number_of_comments = response.items[0].statistics.commentCount;
			total_number_of_views = response.items[0].statistics.viewCount;

			bkg.console.log("hey"+video_title + total_number_of_views + total_number_of_comments);
			
		});
	}

	function commentsSetModerationStatus(params) {
		bkg.console.log(params);
	  params = removeEmptyParams(params); // See full sample for function
	  var request = gapi.client.youtube.comments.setModerationStatus(params);
	  flagComment(request);
	}

	function retrieveComments(request){
		var text, text_id;
		request.execute(function(response) {
			var item_count = (response.items).length;
			var reply_count = 0;
			bkg.console.log(response);
			for(i = 0; i<item_count; i++){
				reply_count = 0;
				bkg.console.log(i + " : " + response.items[i].snippet.topLevelComment.snippet.textOriginal);
				if(response.items[i].replies) reply_count = (response.items[i].replies.comments).length;
				for(j = 0; j < reply_count; j++){
					bkg.console.log("comment: " + response.items[i].replies.comments[j].snippet.textOriginal);
				}
				// var i = 1;
				// text_id = response.items[i].snippet.topLevelComment.id;
				// text = response.items[i].snippet.topLevelComment.snippet.textOriginal
		
				// // bkg.getServer(text).then(function(data){
				// //     result = data;
				// 	bkg.console.log(text + " : " + text_id);
				// //     if(result ==! 2){
				// 	        // commentsSetModerationStatus({'id': text_id,
    //          //     'moderationStatus': 'heldForReview'});
				// 	        buildApiRequest("flagComment",'POST',
    //             'https://www.googleapis.com/youtube/v3/comments/setModerationStatus',
    //             {'id': text_id,
    //              'moderationStatus': 'heldForReview'});
				// //     }
				// // }).then(function(){
				//     // bkg.console.log(text + " : " + result);

				// });
				// if(item_count > 50){
					// bkg.console.log(response.nextPageToken)
					if(response.nextPageToken){
						buildApiRequest("retrieveComments",'GET',
		                'https://www.googleapis.com/youtube/v3/commentThreads',
		                {'part': 'snippet,replies',
		                'maxResults': 50,
		                'pageToken': response.nextPageToken,
		                 'videoId': video_id});
					}
				// }
			}
	    });
		
	}





	function handleClientLoad(){
		bkg.console.log("handleClientLoad: done");
		gapi.load('client', {
		    callback: function() {
		      // Handle gapi.client initialization.
		      bkg.console.log("handleClientLoad callback");

		      	chrome.storage.sync.get("authToken", function(data) {
			        if(data.authToken){ 
			        	bkg.console.log("existing token: " + data.authToken);
			        	chrome.identity.removeCachedAuthToken({token: data.authToken}, function(){
			        		chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
					        // Use the token.
						        bkg.console.log(token);
						        // updateSigninStatus(true);
						        setToken(token);
						        

						      });
			        	})
			        	// setToken(data.authToken);
			        	// updateSigninStatus(true);
			        }
			        else{
			        	bkg.console.log("not signed in - open identity")
				        chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
					        // Use the token.
					        bkg.console.log(token);
					        // updateSigninStatus(true);
					        setToken(token);
					        

					      });
				    }
			    });


		     
		     //  	chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
				   //  bkg.console.log("HELLO:", account, signedIn);
				   //  updateSigninStatus(true);
			    // });


		      
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
		var bkg = chrome.extension.getBackgroundPage();
		moderateButton.disabled = true;
		if(bkg){
	 		getSignedInStatus();
	 		$(authorizeButton).click(function(){
		   		 $.loadScript("https://apis.google.com/js/api.js", handleClientLoad);
		   	});
			
		}
 		// $(moderateButton).click(function(){
	  //  		console.log("Calling myFunction() " + bkg.getServer());
	  //  	});
		
 		
 	}

 	function checkVideoId(request) {
 		request.execute(function(response) {
 			bkg.console.log(response);

 			for(i = 0; i < response.items.length; i++){
 				if(response.items[i].contentDetails.videoId === video_id){
 								//get video Details
					buildApiRequest("getVideoDetails",'GET',
		                'https://www.googleapis.com/youtube/v3/videos',
		                {'id': video_id,
		                 'part': 'snippet,contentDetails,statistics'});
		 			moderateButton.disabled = false;
		 			break;
		 		}
 			}
 		});
	 //  var currentTab = tabs[0]; // there will be only one in this array
	 //  bkg.console.log(currentTab.url); // also has properties like currentTab.id
	 //  video_id = currentTab.url.split('v=')[1];
		// bkg.console.log("video id:" + video_id);

		// get the commentThreads
		

	}

	function checkCurrentURL(tabs){
		var currentTab = tabs[0];
		bkg.console.log(currentTab.url);
		// moderateButton.disabled = true;
		if(currentTab.url.indexOf("v=") !== -1){
			video_id = currentTab.url.split('v=')[1];
			bkg.console.log("video id:" + video_id);

			var uploads_id = channel_response.items[0].contentDetails.relatedPlaylists.uploads;




			// get all list of user videos.
			buildApiRequest("checkVideoId",'GET',
                'https://www.googleapis.com/youtube/v3/playlistItems',
                {'maxResults': '50',
                 'part': 'snippet,contentDetails',
                 'playlistId': uploads_id});


		}
	}

 	$(moderateButton).click(function(){
 		buildApiRequest("retrieveComments",'GET',
                'https://www.googleapis.com/youtube/v3/commentThreads',
                {'part': 'snippet,replies',
                'maxResults': 50,
                 'videoId': video_id});

	});


 	// creates a new tab and goes to user's channel 
	$(channelButton).click(function(){
        chrome.tabs.create({ 
        	url: "https://www.youtube.com/channel/" + channelId + "?view_as=subscriber"
        });
	});

	

});