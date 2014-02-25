$(document).ready(function() {
	$('#notifystatusbutton').on('click', function() {//da cambiare


		var notificaj = {

			event_id : $('#event_id').val(),

			status : $('#status').val,

			lat : $('#lat').val(),

			lng : $('#lng').val(),

			description : $('#notifyDescription').val(),

			username : jQuery.cookie('id_utente')
		
		}

		var host = "http://"+document.location.hostname ;

		var url = host+"/notifica/" 

		$.ajax({

			url: url, //url a cui fare la chiamata

			async: true, //chiamata asincrona

			type: "POST",// metodo della chiamata
			
			contentType: "application/json; charset=utf-8",

			data: JSON.stringify(notificaj), 

			dataType: 'json',

			success:function(call){	

				if(call.result==="nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo"){	

					successAlert(call.result);//da finire
				}
				else {
				
					errorAlert(call.result+": "+call.errore);
				} 		
			},
			error: function(e){
				errorAlert("errore di risposta dal server");
			},
		});
		return false; // avoid to execute the actual submit of the form.
	});				
});