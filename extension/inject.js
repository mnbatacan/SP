// ----------------------------------------------------------------------------------------------
// Adds an injected button on Youtube DOM. 
// 
// ----------------------------------------------------------------------------------------------



// CSS ------------------------------------------------------------------------------------------
src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"
var div = document.createElement( 'div' );
var btn = document.createElement( 'input' );
var s = document.createElement( 'source' );
s.type = "text/javascript";
s.src = "jquery.js";
document.body.appendChild( s );
document.body.appendChild( div );
div.appendChild( btn );
// div.appendChild( title);
div.id = 'myDivId';
div.style.position = 'fixed';
div.style.alignContent='center';
div.style.top = '90%';
div.style.left = '75%';
// div.style.right = '70%';
div.style.width = '90%';   
div.style.height = '100%';
div.style.background = 'rgba(228,238,255,0.8)';
// div.style.opacity = '0.7';



btn.type = 'button';
btn.id = 'moderateBtn';
btn.class= 'moderateBtn';
btn.value = 'Moderate!';
// btn.style.position = 'absolute';
btn.style.visibility = 'visible';
btn.style.zIndex='1000';
btn.style.height = '5%';
btn.style.width = '26%';

btn.style.marginLeft = "10px";
btn.style.marginTop = "14px";
// btn.style.top = '50%';
// btn.style.left = '50%';
btn.class="waves-effect waves-light btn-large";
btn.style.backgroundColor = '#3765AB';
btn.style.color = 'white';
// ----------------------------------------------------------------------------------------------




function removeEmptyParams(params) {
	for (var p in params) {
	    if (!params[p] || params[p] == 'undefined') {
	    	delete params[p];
	    }
	}
	return params;
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
	    retrieveComments(request);
	  }


function retrieveComments(){
	request.execute(function(response) {
		alert(response);
	});

}


function handleClientLoad(){
		bkg.console.log("handleClientLoad: done");
		gapi.load('client', {
		    callback: function() {
		      // Handle gapi.client initialization.
		      buildApiRequest('GET',
                '/youtube/v3/commentThreads',
                {'part': 'snippet,replies',
                 'videoId': 'video_id'});

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

// ACTION----------------------------------------------------------------------------------------
if( document.readyState === 'complete' ) {
    console.log( 'document is already ready, just execute code here' );
} else {
	
	// will communicate with the background server on click.
	if('addEventListener' in document){
	    	$(document).on(	"click","#moderateBtn",function(){
				// var currentLocation = window.location;
				var video_id = window.location.search.split('v=')[1];
				var ampersandPosition = video_id.indexOf('&');
				if(ampersandPosition != -1) {
				  video_id = video_id.substring(0, ampersandPosition);
				}

				$.loadScript("https://apis.google.com/js/api.js", handleClientLoad);

				// alert(video_id);

	    		//RETREIVE COMMENTS
	    		

	    		

				// chrome.runtime.sendMessage(
				//     "foo",
				//     function (response) {
				//         console.log(response);
			 //    });
			});
	};
}

// ----------------------------------------------------------------------------------------------
