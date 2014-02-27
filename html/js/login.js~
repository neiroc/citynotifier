$(document).ready(function() {
	$("#login").submit(function() {
		
		var loginj = {
			username: $('#username').val(),
			password: $('#password').val()
		}
		
		var host = "http://"+document.location.hostname ;

		var url = host+"/techweb/html/login/"; // url dello script remoto
		

		$.ajax({
			url: url, //url a cui fare la chiamata
			async: true, //chiamata asincrona
			type: "POST",// metodo della chiamata
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(loginj), // json with user and pass
			dataType: 'json',
			success:function(call){	
				if(call.result==="login effettuato con successo"){
					
					session_user = "session"+$('#username').val();
					jQuery.cookie('session_user', session_user, {expires:30});
					jQuery.cookie('username', $('#username').val(), {expires:30});
					jQuery.cookie('id_utente', call.id_utente, {expires:30});
					
					location.href="mappa.html";
					
				}
				else {
					errorAlert(call.result);
				} 		
			},
			error: function(e){
				errorAlert("errore di connessione al server");
			},
		});
		return false; // avoid to execute the actual submit of the form.
	});					
});

