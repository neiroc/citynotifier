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

				if(call.result==="notifica inviata con successo"){	

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
		return false; // avoid to execute the actual submit of the form.
	});				
});





//CODICE DUPLICATO SU MAP.JS CONTROLLARE SE C'È QUALCOSA DA RECUPERARE




/*//GLOBAL VARIABLES
var lastLatitude;
var lastLongitude;
var geocoder;
var markersArray = [];
var id_count;
var tabella;
var infowindow = null;

$(document).ready(function(){

	geocoder = new google.maps.Geocoder();
	var mapOptions = {
	 	center: cityCenter,
	  	zoom: 14,
	  	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);
	
	
	//se esistono i cookie
	if (lastLatitude && lastLongitude){
		//mi rimetti nell'ultima posizione disponibile
		alternLoc();
	}
	else{
		//funzione di geolocalizzazione
		geoLocal();
	}
	//riceve l'evento se mi sposto sulla mappa
	google.maps.event.addListener(map, 'click', function(event) {
		
		//salva le coordinate della mia nuova posizione
		lastLatitude = event.latLng.lat();
    	lastLongitude = event.latLng.lng();
				
		myPosition = new google.maps.LatLng(lastLatitude, lastLongitude);
		
		//converto il punto cliccato in indirizzo leggibile e lo inserisco nel form		
		geocodePosition(myPosition);
		
		radiusWidgetCheck=false;
		//mette il marker
		getMarker(myPosition);
	});

//elimina marker quando si clicca sulla mappa o su un altro marker
//google.maps.event.addListener(map, 'click', closeInfoWindow);

});//END DOCUMENT READY!

$('.dropdown-toggle').dropdown()

//INSERISCI DATI NELLA TABELLA
$('#table').on('click', function(){

//MOSTRA TABELLA
	$('#myModal').modal({
		backdrop:false
		}).on('show', function(){ 
		//something
    });
});


/*Crea marker sulla mappa per ogni evento ricevuto dalla richiesta *//*
function showOnMap(lat,lng,id,type,subtype,status,inizio,ultima,descr){

	//Nuovo oggetto Infowindow
	infowindow = new google.maps.InfoWindow;

	var data_inizio = timeConverter(inizio);
	var data_fine = timeConverter(ultima);

	var myLatlng = new google.maps.LatLng(lat,lng);

	// Place a marker on the map
	var marker = new google.maps.Marker({
		position: myLatlng,
		icon: getPin(type, subtype, status),
		map: map,
		draggable:false,
		title:id
	});

	//push marker in array
	markersArray.push(marker);

		
	google.maps.event.addListener(marker, 'click', function() {
	//CONTENT INFOWINDOW
	if(status == 'closed'){
		var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-danger">'+status+'</span><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><b>Descrizioni :</b><br><textarea readonly id="descr">'+descr+'</textarea><br><b>Notifica :</b><br><textarea id="notif"></textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\'open\',\''+lat+'\',\''+lng+'\',\''+type+'\',\''+subtype+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button><button type="button" class="btn btn-default btn-sm" style="background-color:red; color:white;"  onclick=\"notify(\''+id+'\',\'closed\',\''+lat+'\',\''+lng+'\')\"><span class="glyphicon glyphicon-off"></span>Chiudi</button></div>';
	}else if(status == 'open'){
			var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-danger">'+status+'</span><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><b>Descrizioni :</b><br><textarea readonly id="descr">'+descr+'</textarea><br><b>Notifica :</b><br><textarea id="notif"></textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\'open\',\''+lat+'\',\''+lng+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button><button type="button" class="btn btn-default btn-sm" style="background-color:red; color:white;"  onclick=\"notify(\''+id+'\',\'closed\',\''+lat+'\',\''+lng+'\')\"><span class="glyphicon glyphicon-off"></span>Chiudi</button></div>';
	}else var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-danger">'+status+'</span><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><b>Descrizioni :</b><br><textarea readonly id="descr">'+descr+'</textarea><br><b>Notifica :</b><br><textarea id="notif"></textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\'open\',\''+lat+'\',\''+lng+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button><button type="button" class="btn btn-default btn-sm" style="background-color:red; color:white;"  onclick=\"notify(\''+id+'\',\'closed\',\''+lat+'\',\''+lng+'\')\"><span class="glyphicon glyphicon-off"></span>Chiudi</button></div>';
		infowindow.setContent(contentString);
		infowindow.open(map,marker);
	});

	google.maps.event.addListener(map, 'click', function() {
		infowindow.close();
	});
}


/*
* Show Events on Table
*/
function showOnTable(event_id,subtype,type,freshness,status,descr,lat,lng){
	freshness = timeConverter(freshness);
	//MakeTable	
	tabella[0].innerHTML +="<td>"+event_id+"</td><td>"+type+" /<br>"+subtype+"</td><td id=\"tableEventAddress"+id_count+"\"><img align=\"center\" src=\"img/load2.gif\"></td><td>"+freshness+"</td><td>"+status+"</td><td><div class=\"btn-group\"><button class=\"btn btn-primary\">Mostra</button><button class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><h5 class=\"muted\">"+descr+"</div></h5></ul></div></td>";
}


/*
* Notifica evento
*/
function notify(id,status,lat,lng,descr,type,subtype){
	
var partsArray = id.split('_');
	if(partsArray[0] =="ltw1324") 
		id = partsArray[1];

	var notificaj = {
				
		id_evento : id, 
							 
		status : status,

		lat : lat,

		lng : lng,

		description : $('#notif').val(),

		tipo : type,

		sottotipo : subtype,

		newstatus : "open",//####################################da modificare per rendere interoperabile status deve essere quello nuovo 

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
	return false; // avoid to execute the actual submit of the form.*/
}


/*
* OnClick start request 
*/
$("#searchbutton").click(function(){
	//chiude il menu
	$('#searchmenu').parent().removeClass('open');
	
	//effettuo la ricerca
	search()
});


//Remove Markers from Map
function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++ ) {
    	markersArray[i].setMap(null);
  	}
  	markersArray.length = 0;
}

//in caso di chiusura browser senza logout, salva i cookie per il prossimo accesso
$(window).unload(function(){

	if (jQuery.cookie('session_user')){
		jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
		jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
		jQuery.cookie('latitude', latitude, {expires:30});	
		jQuery.cookie('longitude', longitude, {expires:30});		
		jQuery.cookie('radius', radius, {expires:30});
		jQuery.cookie('type', type, {expires:30});	
		jQuery.cookie('subtype', subtype, {expires:30});
		jQuery.cookie('status', status, {expires:30});
		jQuery.cookie('data', data, {expires:30});
	}
});

/*
* Convert UnixTime to Date
*/
function timeConverter(UNIX_timestamp){
 var a = new Date(UNIX_timestamp*1000);
 var months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Aug','Set','Ott','Nov','Dic'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = date+' '+month+' '+year+'<br> ore: '+hour+':'+min+':'+sec ;
     return time;
 }
 
 /**
 * Get Pin Event
 */
function getPin(type, subtype, status){
    var mDir = "/img/pins/";
    switch (type){
        case"problemi_stradali" :
            switch(subtype){
                case "incidente": mDir = mDir+"car_accident"; break;
                case "buca": mDir = mDir+"buca"; break;
                case "coda": mDir = mDir+"coda"; break;
                case "lavori_in_corso": mDir = mDir+"lavoriincorso"; break;
                case "strada_impraticabile": mDir = mDir+"stradanonpercorribile"; break;
            }
            break;
        
        case "emergenze_sanitarie" :
            switch(subtype){
                case "incidente": mDir = mDir+"incidente"; break;
                case "malore": mDir = mDir+"malore"; break;
                case "ferito": mDir = mDir+"ferito"; break;
                }
            break;
        
        case "reati" :
            switch(subtype){
                case "furto": mDir = mDir+"thief"; break;
                case "attentato": mDir = mDir+"shooting"; break;
            }
            break;
            
        case "problemi_ambientali" :
            switch(subtype){
                case "incendio" : mDir = mDir+"fire"; break;
                case "tornado" : mDir = mDir+"tornado"; break;
                case "neve" : mDir = mDir+"snow"; break;
                case "alluvione" : mDir = mDir+"rain"; break;
            }
            break;
        case "eventi_pubblici" :
            switch(subtype){
                case "partita" : mDir = mDir+"football"; break;
                case "manifestazione" : mDir = mDir+"manifestazione"; break;
                case "concerto" : mDir = mDir+"livemusic"; break;
                }
            break;
        break;
    }
    
    switch (status){
        case "open" : return mDir + "Open.png";
        case "closed" : return mDir + "Closed.png"
        case "skeptical" : return mDir + ".png";
    }
}