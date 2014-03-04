/*
* Notifica evento
*/
function notify(id,status,lat,lng,type,subtype){
	
var partsArray = id.split('_');
	if(partsArray[0] =="ltw1324") 
		id = partsArray[1];

	var date = $('#datepickerid').val();
	
	//trasformo data in unixtime
	var unixdata = data_converter(date) + 3600;
	var now = Math.round((new Date()).getTime() / 1000 + 3600);

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
				search_local(tipo, sottotipo, status, lat, lng, radius, unixdata, now);
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

