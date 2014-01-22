$(document).ready(function() {
	$("#notificastato").submit(function() {//da cambiare


		var notificaj = {

			event_id : $('#event_id').val(),

			lat : $('#lat').val(),

			lng : $('#lng').val(),

			description : $('#notifyDescription').val(),

			username : jQuery.cookie('username')
		
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

					alert(call.result);//da finire
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