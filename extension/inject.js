// $('a').click(function() {
// 	alert("hey!");	
// });

// var btn = document.createElement("btn"); 
// btn.innerHTML = '<button class="moderate" type="button">Moderate</button>';
// $("body").append(btn);
  // var greeting = "hola, ";
  // var button = document.getElementById("mybutton");
  // button.person_name = "Roberto";
  // button.addEventListener("click", function() {
  //   alert(greeting + button.person_name + ".");
  // }, false);

// var btn1 = document.createElement('btn');
// btn1.id = 'popup';
// document.body.appendChild(btn1);
// document.getElementById('popup').innerHTML="My extension name"​;

// document.getElementById.apply(document, arguments);
// }
src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"
var div = document.createElement( 'div' );
var btn = document.createElement( 'input' );
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


// var bkg = chrome.extension.getBackgroundPage();

function callbackFunc(response){
	alert("yo!");
}


if( document.readyState === 'complete' ) {
    console.log( 'document is already ready, just execute code here' );
    // myInitCode();
} else {
	
	if('addEventListener' in document){
	    // document.addEventListener("DOMContentLoaded", function(e){
	    	$(document).on(	"click","#moderateBtn",function(){
	    		// alert("Calling myFunction() " + bkg.getServer());
				chrome.runtime.sendMessage(
				    "foo",
				    function (response) {
				        console.log(response);
			    });
	    		
				// $.ajax({
				// 	type:"POST",
				// 	url: "~/backend/final_model.py",
				// 	// data: "",
				// 	// type: 'get',
				// 	// dataType: 'json',
				// 	success: callbackFunc,
				// 	error: function(){
				// 		alert("error :(");
				// 	}
				// });
			});
		// },false)
	};
}