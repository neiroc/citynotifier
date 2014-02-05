$(document).ready(function() {
	$('#notifybutton').on('click', function() {


		var segnalazionej = {

			type : {

				type : $('#notifyType').val(),
				subtype : $('#notifySubType').val() 
			},

			lat : $('#lat').val(),

			lng : $('#lng').val(),

			description : $('#description').val(),

			id_utente : jQuery.cookie('id_utente')
		}

		var host = "http://"+document.location.hostname ;

		var url = host+"/segnalazione/" 

		$.ajax({

			url: url, //url a cui fare la chiamata

			async: true, //chiamata asincrona

			type: "POST",// metodo della chiamata
			
			contentType: "application/json; charset=utf-8",

			data: JSON.stringify(segnalazionej), 

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