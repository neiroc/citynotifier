$(document).ready(function() {
	$("#login").submit(function() {
		
		var loginj = {
			
			username: $('#username').val(),
			password: $('#password').val()
		}
		
		var login_aux = JSON.stringify(loginj);
		//console.log(loginj);
		//console.log(login_aux);
		
		var host = "http://localhost/login/" ;
		
		var path = "SERVER"+"login/" ;
		//console.log(host+" "+path);
		var url = "login/"; // url dello script remoto
		
		$.ajax({

			url: url, //url a cui fare la chiamata

			async: true, //chiamata asincrona

			type: "POST",// metodo della chiamata
			
			contentType: "application/json; charset=utf-8",

			data: JSON.stringify(loginj), // json with user and pass

			dataType: 'json',

			success:function(call){	

				if(call.result==="login effettuato con successo"){	

					jQuery.cookie('username', $('#username').val(), {expires:30});

					console.log("daje")

					location.href="../mappa.html";
				}
				else {
				
					alert(call.result);
				} 		
			},
			error: function(e){
				console.log(e.message);
			},
		});
		return false; // avoid to execute the actual submit of the form.
	});					
});
