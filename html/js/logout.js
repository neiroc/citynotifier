$('#logout').on('click', function(){

	var url = "logout/";
	$.ajax({
		type: "POST",
		
		async: true,
		
		contentType: "application/json; charset=utf-8",
		
		url:url,
		
		data: null,
		
		dataType: 'json',
		
		success:function(json){	
			if(json.result==="logout effettuato con successo"){	
			console.log("sfinteriiii");
				jQuery.removeCookie('latitude');
				jQuery.removeCookie('longitude');
				jQuery.removeCookie('centerLatitude');
				jQuery.removeCookie('centerLongitude');
				jQuery.removeCookie('lastLatitude');
				jQuery.removeCookie('lastLongitude');
				jQuery.removeCookie('username');
				location.href="index.html";
			}
			else 
				alert(json.result); 		
		},
		error: function(e){
			console.log(e.message);
		},
	});
		
		//return false; // avoid to execute the actual submit of the form.
});					

