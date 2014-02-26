$(document).ready(function() {
	$('#notifybutton').on('click', function() {

		console.log($('#notifyDescription').val());
		console.log($('#notifySubType').val() );

		var segnalazionej = {

			type : {

				type : $('#notifyType').val(),
				subtype : $('#notifySubType').val() 
			},

			lat : jQuery.cookie('latitude'), //$('#lat').val(),

			lng : jQuery.cookie('longitude'), //$('#lng').val(),

			description : $('#notifyDescription').val(),

			id_utente : jQuery.cookie('id_utente')
		}

		var host = "http://"+document.location.hostname ;

		var url = host+"/segnalazione/"; 

		$.ajax({

			url: url, //url a cui fare la chiamata

			async: true, //chiamata asincrona

			type: "POST",// metodo della chiamata
			
			contentType: "application/json; charset=utf-8",

			data: JSON.stringify(segnalazionej), 

			dataType: 'json',

			success:function(call){	
				//call = JSON.parse(call);
				//console.log(call.result);
				if(call.result==="nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo"){	

					successAlert(call.result);
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