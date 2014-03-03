/*
* Notifica evento
*/
function notify(id,status,lat,lng,type,subtype){
	
var partsArray = id.split('_');
	if(partsArray[0] =="ltw1324") 
		id = partsArray[1];

	var notificaj = {
				
		id_evento : id, 
							 
		status : status,

		lat : lat,

		lng : lng,

		tipo : type,

		sottotipo : subtype,
		
		description : $('#notif').val(),

		id_utente : jQuery.cookie('id_utente')
			
	}
	console.log(JSON.stringify(notificaj));
	

	var host = "http://"+document.location.hostname ;

	var url = host+"/notifica/" ;

	$.ajax({

		url: url, //url a cui fare la chiamata

		async: true, //chiamata asincrona

		type: "POST",// metodo della chiamata
			
		contentType: "application/json; charset=utf-8",

		data: JSON.stringify(notificaj), 

		dataType: 'json',

		success:function(call){	

			if(call.result==="notifica inviata con successo"){	

				rep=call.reputation;
				//successAlert(call.reputation);
				upRep();
				
				if(call.msg){

					successAlert(call.result+" "+call.msg);
				}
				else{
					
					successAlert(call.result);
					
				}
				search();
			}
			else {
				
				errorAlert(call.result+": "+call.errore);
			} 		
		},
		error: function(e){
			errorAlert("errore di risposta dal server");
		},
	});
	return false; // avoid to execute the actual submit of the form.*/
}

