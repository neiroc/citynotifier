//GLOBAL VARIABLES
var lastLatitude;
var lastLongitude;
var geocoder;
var markersArray = [];
//var infowindow = new google.maps.InfoWindow({});


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

var closeInfoWindow = function() {
  infowindow.close();}

/*Crea un marker sulla mappa per ogni evento ricevuto dalla richiesta */
function showOnMap(lat,lng,id,type,subtype,status,inizio,ultima,descr){

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
	
//CONNTENT INFOWINDOW
if(status == 'closed'){
	var contentString = '<div id="info"><h1>Dettagli Evento</h1><b>ID : </b>'+id+'<br><b>Tipo: </b>'+type+'<br><b>Sottotipo: </b>'+subtype+'<br><b>Stato: </b><span class="label label-danger">'+status+'</span><br>Descrizioni<br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><textarea id="descr">'+descr+'</textarea><br><button type="button" class="btn btn-default btn-sm" style="background-color:green; color:white;" id="notifica"><span class="glyphicon glyphicon-play-circle"></span> Apri</button></div>';
}else{
var contentString = '<div id="info"> <b>'+type+'</b>'+'<br>'+id+'<br>Stato: <span class="label label-danger">'+status+'</span><br>Descrizioni<br><button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus-sign"></span></button><br><b>Inizio :</b>'+data_inizio+'<br><b>Ultima :</b>'+data_fine+'<br><button type="button" id="notifica" class="btn btn-default btn-sm" style="background-color:red; color:white;"><span class="glyphicon glyphicon-off"></span> Chiudi</button></div>';
}



	   var infowindow = new google.maps.InfoWindow({
    	content: contentString,
		 maxWidth: 200
	});
	//var infoWindow = infowindow;
	
	//Add an infowindow for each marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});
  
	//egg vs chicken the infowindow html must be in DOM. PROBLEMA SE CI SONO PIU INFOWINDOWs APERTI PARTONO PIÙ RICHIESTE!!!
	google.maps.event.addListener(infowindow, 'domready', function() {
			$("#notifica").click(function(e){
				/*
				$.ajax({
				url: url,
				type: 'GET',
				data: $(this).serialize(),
				dataType:'json',
				success: function(data){}
				});//fine ajax*/
			console.log("beellaa");
			});    
	});

}


/*
* Show Events on Table
*/
function showOnTable(event_id,subtype,type,freshness,status,descr){
freshness = timeConverter(freshness);	
	
document.getElementById('tabella').innerHTML +="<td>"+event_id+"</td><td>"+type+" /<br>"+subtype+"</td><td>"+1+"</td><td>"+freshness+"</td><td>"+status+"</td><td><div class=\"btn-group\"><button class=\"btn btn-primary\">Mostra</button><button class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><h5 class=\"muted\">"+descr+"</div></h5></ul></div></td>";

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
				//carica eventi sulla tabella. problema sicronizzazione trasformazione coordinate in indirizzo
				eventPosition = new google.maps.LatLng(src.locations[0].lat,src.locations[0].lng);
				//var prova = geocodePosition(eventPosition);
				//console.log(prova);
				showOnTable(src.event_id,src.type.subtype,src.type.type,src.freshness,src.status,src.description);
			});
			console.log(data);
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

	jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
	jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
	jQuery.cookie('latitude', latitude, {expires:30});	
	jQuery.cookie('longitude', longitude, {expires:30});		
	jQuery.cookie('radius', radius, {expires:30});
	jQuery.cookie('type', type, {expires:30});	
	jQuery.cookie('subtype', subtype, {expires:30});
	jQuery.cookie('status', status, {expires:30});
	jQuery.cookie('data', data, {expires:30});
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


