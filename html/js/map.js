//GLOBAL VARIABLES
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
		//geoLocal();
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


/*Crea un marker sulla mappa per ogni evento ricevuto dalla richiesta */
function showOnMap(lat,lng,id,type,subtype,status,inizio,ultima,descr){
	
infowindow = new google.maps.InfoWindow;

var data_inizio = timeConverter(inizio);
var data_fine = timeConverter(ultima);

var myLatlng = new google.maps.LatLng(lat,lng);
// Place a marker on the map
var marker = new google.maps.Marker({
	position: myLatlng,
	map: map,
	draggable:false,
	title:id
	//animation: google.maps.Animation.BOUNCE 
});
//push marker in array
markersArray.push(marker);

	
google.maps.event.addListener(marker, 'click', function() {
	//CONTENT INFOWINDOW
if(status == 'closed'){
	var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-danger">'+status+'</span><br>Descrizioni<br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><textarea id="descr">'+descr+'</textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;"  onclick=\"notify(\''+id+'\',\''+status+'\',\''+lat+'\',\''+lng+'\')\"><span class="glyphicon glyphicon-play-circle"></span> Apri</button></div>';
}else{
	var contentString = '<div id="info"><b>'+type+'</b>'+'<br>'+id+'<br>Stato: <span class="label label-danger">'+status+'</span><br>Descrizioni<br><button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus-sign"></span></button><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><button type="button" id="notifica" class="btn btn-default btn-sm" style="background-color:red; color:white;"><span class="glyphicon glyphicon-off"></span> Chiudi</button></div>';
}
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

//QUI! per ogni Evento la funzione notify farà una chiamata ajax per modificare lo stato di un evento
//puoi deciderez
function notify(id,status,lat,lng,descr){

var notificaj = {
			
			evento_id : id,

			status : status,

			lat : lat,

			lng : lng,

			description : $('#descr').val(),

			username : jQuery.cookie('id_utente')
		
}
console.log(notificaj.username);
console.log(jQuery.cookie('id_utente'));


		var host = "http://"+document.location.hostname ;

		var url = host+"/techweb/html/notifica/" 

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
		return false; // avoid to execute the actual submit of the form.*/
}


/*
* OnClick start request 
*/
$("#searchbutton").click(function(e){
	clearOverlays();
	//prendo tipo
	type = $('#searchType').val();
	//prendo sottotipo
	subtype = $('#searchSubType').val();
	//prendo stato 
	status = $('#searchStatus').val();
	//prendo data (devo convertirla in unixtime
	data = $('#datepickerid').val();
	
	id_count=0;
	tabella = $("#tabella");
	tabella.html("<thead><tr><th>ID</th><th>Tipo/Sottotipo</th><th>Luogo</th><th>Data/Freschezza</th><th>Stato</th><th>Descrizione</th></tr></thead>");
	
	
	//prendo le coordinate.ATTENZIONE: assumono valori solo dopo aver cliccato sulla mappa. vedere geolocal.	
	var lat = lastLatitude;
	var lng = lastLongitude;

	//prendo raggio di ricerca
	radius = radiusWidget.get('distance')*1000;
	//trasformo data in unixtme. ATTENZIONE: settare fuso orario corretto
	var unixdata = new Date(data).getTime() / 1000;	
	var oggi = Math.round((new Date()).getTime() / 1000);


	var url = "richieste?scope=local&type="+ type + "&subtype="+ subtype + "&lat="+ lat + "&lng="+ lng+"&radius=" + radius +"&timemin="+ unixdata + "&timemax="+ oggi + "&status="+status;

	$.ajax({
		url: url,
		type: 'GET',
		data: $(this).serialize(),
		dataType:'json',
		success: function(data){
			//for each event add a Marker 
			$(data.events).each(function(i, src) {
				showOnMap(src.locations[0].lat,src.locations[0].lng,src.event_id,src.type.type,src.type.subtype,src.status,src.start_time,src.freshness,src.description);
				showOnTable(src.event_id,src.type.subtype,src.type.type,src.freshness,src.status,src.description,src.locations[0].lat,src.locations[0].lng);
				console.log(id_count);
		      id_count++;
			});
			console.log(data);
			console.log(markersArray[0]);
			setTableAddress(data.events, 0, data.events.length - 1, 0, 0);
		
		} //chiudi function data
	});//fine chiamata ajax
	radius = radius / 1000;

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


/*$("#searchType, #searchSubType, #searchStatus, #notifyType, #notifySubType").each(function(){
	if($(this).val("")){
		//console.log("porcoddio")
		$(this).val('all')
		//console.log($(this).val())
		type='all';
	}
});*/