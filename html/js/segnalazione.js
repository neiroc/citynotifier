$(document).ready(function() {
	$('#notifybutton').on('click', function() {
		if(($('#notifyType').val()=="none") ||($('#notifySubType').val() == "none") ){
			errorAlert("type e subtype non sono stati inseriti correttamente");
		}
		else{

			var segnalazionej = {

				type : {

					type : $('#notifyType').val(),
					subtype : $('#notifySubType').val() 
				},

				lat : lastLatitude,

				lng : lastLongitude,

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
					
					if(call.result==="nuova segnalazione aperta con successo / segnalazione di un evento già in memoria avvenuta con successo"){	
						if(call.skept){

							successAlert(call.result+" "+call.skept);
						
						}
						else{
						
						successAlert(call.result);
						
						}
					}
					else {
					
						errorAlert(call.result+": "+call.errore);

					} 		
				},
				error: function(e){
					errorAlert("errore di risposta dal server");
				},
			});
	}
		return false; // avoid to execute the actual submit of the form.
	});				
});