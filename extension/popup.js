// ----------------------------------------------------------------------------------------------
// Pop-up window js. 
// Contains authorization, other main functions.
// ----------------------------------------------------------------------------------------------

$(document).ready(function(){
	var bkg = chrome.extension.getBackgroundPage();
	// $('.dropdown-trigger').dropdown();
	$('.tabs').tabs();


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
  const channelButton = document.getElementById("channel-button");
  const analyticsButton = document.getElementById("analytics-button");

  const moderateButton = document.getElementById("moderate-button");
  const vidStatistics = document.getElementById("vid-statistics");
  const indexPage = document.getElementById("index-page");
  const videoTitle = document.getElementById("video-title");
  const preloader = document.getElementById("preloader");
  const mainPage = document.getElementById("mainDiv");
  const moderateProgress = document.getElementById("moderate-progress");
  var channelId = 1;

  var video_id = total_number_of_comments = total_number_of_views = total_processing_comments=total_processed_comments = if_moderated = total_flagged_1 = total_flagged_0 = 0;
  var video_title = uploads_id = text = text_id = "";
  var channel_response = {};
  var list_offensive_comments = [];
  var list_hate_comments = [];
  var filter_offensive_flag = filter_hate_flag = false;



  function updateSigninStatus(isSignedIn) {
	  if (isSignedIn) {
	    authorizeButton.style.display = 'none';
	    indexPage.style.display = 'none';
	    channelButton.style.display = 'block';
	    // mainPage.style.display = 'block';
	    preloader.style.display = 'block';
	    document.getElementById("statistics-div").style.display = "none";
	    // $(document).on('load', function() {
	    // alert("asd")
     //        $('.preloader').delay(350).fadeOut('slow');
     //        $('.preloader-wrapper').delay(350).fadeOut();
     //    });

	  } else {
	    authorizeButton.style.display = 'block';
	    indexPage.style.display = 'block';
	    channelButton.style.display = 'none';
	    moderateButton.style.display = 'none';
	    mainPage.style.display = 'none';
	     preloader.style.display = 'none';
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
	    else if(requestName === "flagComment_request"){flagComment_request(request);}
	    else if(requestName === "deleteComment"){deleteComment(request);}
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
 		mainPage.style.display = "block";
 		preloader.style.display = "none";


 		channel_response = response;
 			chrome.tabs.query(query, checkCurrentURL);

	    });
		
	}


	// function flagComment(request) {
	//     request.execute(function(response) {
	//     	if (typeof response === 'undefined') {
	// 		  // color is undefined
	// 		  bkg.console.log("comment was flagged!");
	// 		}else{
	// 			bkg.console.log("unsuccessful!");
	// 		}
	      
	//     });
	// }

	function getVideoDetails(request){
		request.execute(function(response) {
			video_title = response.items[0].snippet.localized.title;
			total_number_of_comments = response.items[0].statistics.commentCount;
			total_number_of_views = response.items[0].statistics.viewCount;
			videoTitle.innerHTML = video_title;
			document.getElementById("total_views").innerHTML = total_number_of_views + " views";
			document.getElementById("total_comments").innerHTML = total_number_of_comments + " comments";
			bkg.console.log("hey"+video_title + total_number_of_views + total_number_of_comments);
			
		});
	}

	// function commentsSetModerationStatus(params) {
	// 	bkg.console.log(params);
	//   params = removeEmptyParams(params); // See full sample for function
	//   var request = gapi.client.youtube.comments.setModerationStatus(params);
	//   flagComment(request);
	// }

	function flagComment_request(request){
		request.execute(function(response) {
			// bkg.console.log("flagging:" + total_processing_comments + " / " + total_processed_comments);
			if(total_processed_comments == total_processing_comments && if_moderated == 0){
				// alert("Video moderated!");
				alert("Video moderated!");
				if_moderated = 1

			}


		});

	}

	function deleteComment(request){
		request.execute(function(response) {

		});

	}

	function flagComment(text,text_details){
		var total_percentage = 0;
				//     if(result ==! 2){
				// 	    // commentsSetModerationStatus({'id': text_id,
    //      //        		 'moderationStatus': 'heldForReview'});
				// 	        buildApiRequest("flagComment",'POST',
		  //               'https://www.googleapis.com/youtube/v3/comments/setModerationStatus',
		  //               {'id': text_id,
		  //                'moderationStatus': 'heldForReview'});
				//     }
				//     bkg.console.log(text + " : " + result);

				// });
		bkg.getServer(text).then(function(data){
		    result = data;
		    bkg.console.log(text, " : result - ", result)
			total_processed_comments += 1;
			total_percentage = (total_processed_comments/total_processing_comments)*100
			moderateProgress.style.width = (total_percentage.toString()).concat('%');


			if(result[0] != 2){
				if(result[0] == 1 && filter_offensive_flag){ 
					total_flagged_1+=1;
					// bkg.console.log("add list: " + text);
					var obj = {};
					obj[text] = text_details;
					list_offensive_comments.push(obj);

					buildApiRequest("flagComment_request",'POST',
			                'https://www.googleapis.com/youtube/v3/comments/setModerationStatus',
			                {'id': text_details.id,
			                 'moderationStatus': 'heldForReview'});


				}
				else if(result[0] == 0 && filter_hate_flag){
						total_flagged_0 += 1;
						var obj = {};
						obj[text] = text_details;
						list_hate_comments.push(obj);

						buildApiRequest("flagComment_request",'POST',
			                'https://www.googleapis.com/youtube/v3/comments/setModerationStatus',
			                {'id': text_details.id,
			                 'moderationStatus': 'heldForReview'});

				}
			}
			bkg.console.log("flagging:" + (total_percentage.toString()).concat('%'));
				
			if(total_processed_comments == total_processing_comments && if_moderated == 0){
				// alert("Video moderated!");
				moderateProgress.style.width = "100%";
				//SHOW STATS
				showStatistics();
				// Save video id and stats dets
		 		chrome.storage.sync.set({"video_id": video_id, "total_processed_comments":total_processed_comments,"total_flagged_1":total_flagged_1,"total_flagged_0":total_flagged_0,"list_offensive_comments":list_offensive_comments,"list_hate_comments":list_hate_comments}, function() {
			          bkg.console.log('video_id is set to ' + video_id);
			      });


				if_moderated = 1;
					M.toast({html: "Video filtered!", classes: 'rounded'});

			}
		});


	}

	function retrieveComments(request){
		// text, text_id;
		request.execute(function(response) {
			var item_count = (response.items).length;
			var reply_count = 0;
			text = text_id = "";

			bkg.console.log(response);
			for(i = 0; i<item_count; i++){
				reply_count = 0;
				text_id = response.items[i].snippet.topLevelComment.id;
				text = response.items[i].snippet.topLevelComment.snippet.textOriginal
				if(!response.items[i].snippet.topLevelComment.snippet.hasOwnProperty("moderationStatus")){
					bkg.console.log(i + " : " + response.items[i].snippet.topLevelComment.snippet.textOriginal);
					total_processing_comments +=1
					flagComment(text,response.items[i].snippet.topLevelComment);
				} 



				if(response.items[i].replies) reply_count = (response.items[i].replies.comments).length;
				for(j = 0; j < reply_count; j++){
					text_id = response.items[i].replies.comments[j].id;
					text = response.items[i].replies.comments[j].snippet.textOriginal;
					if(!response.items[i].replies.comments[j].snippet.hasOwnProperty("moderationStatus")){
						bkg.console.log("comment: " + response.items[i].replies.comments[j].snippet.textOriginal);
						total_processing_comments +=1
						flagComment(text,response.items[i].replies.comments[j]);
					} 
				}
				// var i = 1;
		

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
			    chrome.identity.getAuthToken({
				    interactive: true
				}, function(token) {
				    if (chrome.runtime.lastError) {
				        alert(chrome.runtime.lastError.message);
				        return;
				    }
				         setToken(token);
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
		var bkg = chrome.extension.getBackgroundPage();
		// showStatistics();
		moderateButton.disabled = true;
		analyticsButton.disabled = true;
		
		if_moderated = 0;
		moderateProgress.style.width = "0%";

		var script= document.createElement('script');
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css";
		script.rel = "stylesheet";
		document.head.appendChild(script);



		if(bkg){
	 		getSignedInStatus();

	 		$(authorizeButton).click(function(){
		   		 $.loadScript("https://apis.google.com/js/api.js", handleClientLoad);
		   	});
			
		}
		
 		
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
		 			analyticsButton.disabled = false;
		 			vidStatistics.style.display = "block";

		 			break;
		 		}
 			}

 			chrome.storage.sync.get(["video_id","total_processed_comments","total_flagged_1","total_flagged_0","list_offensive_comments","list_hate_comments"], function(data) {
	 			// alert(video_id);
	 			if(video_id == data.video_id){
	 				total_processed_comments = data.total_processed_comments;
	 				total_flagged_1 = data.total_flagged_1;
	 				total_flagged_0 = data.total_flagged_0;
	 				list_offensive_comments = data.list_offensive_comments;
	 				list_hate_comments = data.list_hate_comments;
	 				showStatistics();
	 			} 
	 			else document.getElementById("statistics-div").style.display = 'none';
	 		});
 		});

	}

	function checkCurrentURL(tabs){
		var currentTab = tabs[0];
		bkg.console.log(currentTab.url);
		// moderateButton.disabled = true;
		if(currentTab.url.indexOf("v=") !== -1){
			video_id = currentTab.url.split('v=')[1];

			chrome.storage.sync.get("video_id", function(data) {
		        if(data.video_id == video_id){}
		        else{
					bkg.console.log("--video id:" + video_id);
		        	chrome.storage.sync.set({"video_id": data.video_id}, function() {
			   			document.getElementById("statistics-div").style.display = 'none';
					});

		        }
		    });

			

			$(analyticsButton).click(function(){
		        chrome.tabs.create({ 
		        	url: "https://studio.youtube.com/video/" + video_id + "/comments/moderate?utm_campaign=upgrade&utm_medium=redirect&utm_source=%2Fcomments"
		        });
			});

			var uploads_id = channel_response.items[0].contentDetails.relatedPlaylists.uploads;
			// get all list of user videos.
			buildApiRequest("checkVideoId",'GET',
                'https://www.googleapis.com/youtube/v3/playlistItems',
                {'maxResults': '50',
                 'part': 'snippet,contentDetails',
                 'playlistId': uploads_id});


		}
	}

	function showStatistics(){
		document.getElementById("statistics-div").style.display = "block";
		document.getElementById("no-public-comments").innerHTML = total_processed_comments;
		document.getElementById("no-neutral-comments").innerHTML = total_processed_comments-(total_flagged_1 + total_flagged_0);
		document.getElementById("no-offensive-comments").innerHTML = total_flagged_1;
		document.getElementById("no-hate-comments").innerHTML = total_flagged_0;

		//comments list show in dropdown
		if(list_offensive_comments != undefined){
			bkg.console.log(list_offensive_comments);
			for (var i = 0; i < list_offensive_comments.length; i++) {
				for (var key in list_offensive_comments[i]) {
				    // var temp = list_offensive_comments[i];
				    var ul = document.getElementById("offensive-collections");
				    var li = document.createElement('li');
				    var img = document.createElement('img');
				    var span = document.createElement('span');
				    var p = document.createElement('p');
				    li.className="collection-item avatar";
				    span.innerHTML = key;
				    span.id = "collections-title";
				    p.innerHTML = list_offensive_comments[i][key].snippet.authorDisplayName;
				    p.id = "collections-name";
				    img.src = list_offensive_comments[i][key].snippet.authorProfileImageUrl;
				    img.id = "collections-img";
				    img.className = "circle";

				    li.appendChild(p);
				    li.appendChild(span);
				    li.appendChild(img);
				    ul.appendChild(li);



				}
			}
		}

		if(list_hate_comments != undefined){
			bkg.console.log(list_hate_comments);
			for (var i = 0; i < list_hate_comments.length; i++) {
				for (var key in list_hate_comments[i]) {
				    // var temp = list_hate_comments[i];
				    var ul = document.getElementById("hate-collections");
				    var li = document.createElement('li');
				    var img = document.createElement('img');
				    var span = document.createElement('span');
				    var p = document.createElement('p');
				    li.className="collection-item avatar";
				    span.innerHTML = key;
				    span.id = "collections-title";
				    p.innerHTML = list_hate_comments[i][key].snippet.authorDisplayName;
				    p.id = "collections-name";
				    img.src = list_hate_comments[i][key].snippet.authorProfileImageUrl;
				    img.id = "collections-img";
				    img.className = "circle";

				    li.appendChild(p);
				    li.appendChild(span);
				    li.appendChild(img);
				    ul.appendChild(li);

				}
			}
		}


	}



 	$(moderateButton).click(function(){
 		// show preloader
 		document.getElementById("progress-div").style.display = "block";
 		moderateButton.disabled = "true";

 		document.getElementById("statistics-div").style.display = "none";
 		total_number_of_comments = total_number_of_views = total_processing_comments=total_processed_comments = if_moderated = total_flagged_1 = total_flagged_0 = 0;
 		list_offensive_comments = [];
  		list_hate_comments = [];

  		//
  		filter_offensive_flag = document.getElementById("offensive-checkbox").checked;
  		filter_hate_flag = document.getElementById("hate-checkbox").checked;


 		
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


	 	// creates a new tab and goes to user's channel 



	//delete-offensive comments
	$(document.getElementById("delete-offensive-button")).click(function(){
       	for (var i = 0; i < list_offensive_comments.length; i++) {
			for (var key in list_offensive_comments[i]) {
				bkg.console.log("deleting" + list_offensive_comments[i][key].id);
				buildApiRequest("deleteComment",'DELETE',
			                'https://www.googleapis.com/youtube/v3/comments',
			                {'id': list_offensive_comments[i][key].id});




			}
		}
				list_offensive_comments = [];
				total_flagged_1 = 0;
		 		chrome.storage.sync.set({"total_flagged_1":total_flagged_1,"list_offensive_comments":list_offensive_comments}, function() {
			          bkg.console.log('total_flagged_1' + total_flagged_1);
			      });
		 	showStatistics();
		 		M.toast({html: "Offensive comments deleted!", classes: 'rounded'});

	});

	$(document.getElementById("delete-hate-button")).click(function(){
       	for (var i = 0; i < list_hate_comments.length; i++) {
			for (var key in list_hate_comments[i]) {
				bkg.console.log("deleting: length: " + list_hate_comments.length + " id: " + list_hate_comments[i][key].id);
				buildApiRequest("deleteComment",'DELETE',
			                'https://www.googleapis.com/youtube/v3/comments',
			                {'id': list_hate_comments[i][key].id});




			}
		}
				list_hate_comments = [];
				total_flagged_0 = 0;
		 		chrome.storage.sync.set({"total_flagged_0":total_flagged_0,"list_hate_comments":list_hate_comments}, function() {
			          bkg.console.log('total_flagged_0' + total_flagged_0);
			      });
		 		bkg.console.log("array length after clear: " + list_hate_comments.length)
		 		document.getElementById("statistics-div").style.display = 'none';
		 		showStatistics();
		 			M.toast({html: "Hate comments deleted!", classes: 'rounded'});

	});


	

});