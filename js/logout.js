$('#logout').on('click', function(){
	//xml= new XMLHttpRequest();

	//$.ajax({
		//url:url,
		//method:'POST',
		//data: null,
		//success:function(json){	
			//if(json.result=="OK")	
				jQuery.removeCookie('latitude');
				jQuery.removeCookie('longitude');
				jQuery.removeCookie('centerLatitude');
				jQuery.removeCookie('centerLongitude');
				jQuery.removeCookie('lastLatitude');
				jQuery.removeCookie('lastLongitude');
				jQuery.removeCookie('username');
				location.href="index.html";
			//else 
				//alert(json.result); 		
		//},
		//error: function(e){
			//console.log(e.message);
		//},
	//});
		
		//return false; // avoid to execute the actual submit of the form.
});					

