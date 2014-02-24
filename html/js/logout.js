$('#logout').on('click', function(){
	
	var host = "http://"+document.location.hostname ;
	var url = host+"/logout/";
	$.ajax({
		type: "POST",
		
		async: true,
		
		contentType: "application/json; charset=utf-8",
		
		url:url,
		
		data: null,
		
		dataType: 'json',
		
		success:function(json){	
			if(json.result==="logout effettuato con successo"){	
			
				jQuery.removeCookie('latitude');
				jQuery.removeCookie('longitude');
				jQuery.removeCookie('centerLatitude');
				jQuery.removeCookie('centerLongitude');
				jQuery.removeCookie('lastLatitude');
				jQuery.removeCookie('lastLongitude');
				jQuery.removeCookie('username');
				jQuery.removeCookie('id_utente');
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

