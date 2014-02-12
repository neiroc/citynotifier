var lastLatitude;
var lastLongitude;
var geocoder;
var markersArray = [];

$(document).ready(function(){

	geocoder = new google.maps.Geocoder();
	var mapOptions = {
	 	center: cityCenter,
	  	zoom: 14,
	  	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);
	
	//se esistono i cookie
	if (jQuery.cookie('lastLatitude') && jQuery.cookie('lastLongitude')){

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

});

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

function showOnMap(lat,lng,id,type){
		
	var myLatlng = new google.maps.LatLng(lat,lng);
	// Place a marker on the map
	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		draggable:false,
		title:id
		//animation: google.maps.Animation.BOUNCE
	});
	markersArray.push(marker);
	var contentString = '<b>'+type+'</b>'+ '<br>'+id+'<br>'+'<p>Descrizione evento</p><br>Inizio Evento<br>Fine Evento<br> Open / Closed / Skeptical';
	var infowindow = new google.maps.InfoWindow({
    	content: contentString,
		maxWidth: 200
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});
}

function showOnTable(event_id,subtype,type,freshness,status){

			document.getElementById('tabella').innerHTML +="<td>"+event_id+"</td><td>"+subtype+"</td><td>"+type+"</td><td>"+1+"</td><td>"+freshness+"</td><td>"+status+"</td><td>"+7+"</td>";
			
			
}

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
	if(lastLatitude == undefined){ 
		var lat = latitude;
		var lng = longitude;
	}
	else{ 
		var lat = lastLatitude;
		var lng = lastLongitude;
	}
	
	//prendo raggio di ricerca
	radius = radiusWidget.get('distance')*1000;
	//trasformo data in unixtme. ATTENZIONE: settare fuso orario corretto
	var unixdata = new Date(data).getTime() / 1000;	
	var oggi = Math.round((new Date()).getTime() / 1000);
	//console.log(lat);
	//console.log(lng);

	var url = "richieste?scope=local&type="+ type + "&subtype="+ subtype + "&lat="+ lat + "&lng="+ lng+"&radius=" + radius +"&timemin="+ unixdata + "&timemax="+ oggi + "&status="+status;

	$.ajax({
		url: url,
		type: 'GET',
		data: $(this).serialize(),
		dataType:'json',
		success: function(data){
			//for each event add a Marker
			$(data.events).each(function(i, src) {
				showOnMap(src.locations[0].lat,src.locations[0].lng,src.event_id,src.type.type);
				//carica eventi sulla tabella. problema sicronizzazione trasformazione coordinate in indirizzo
				eventPosition = new google.maps.LatLng(src.locations[0].lat,src.locations[0].lng);
				//var prova = geocodePosition(eventPosition);
			
				//console.log(prova);
				showOnTable(src.event_id,src.type.subtype,src.type.type,src.freshness,src.status);
			});
			
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

	if (lastLatitude){
		jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
		jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
	}
	else{
		jQuery.cookie('latitude', latitude, {expires:30});	
		jQuery.cookie('longitude', longitude, {expires:30});		
	}
	jQuery.cookie('radius', radius, {expires:30});
	jQuery.cookie('type', type, {expires:30});	
	jQuery.cookie('subtype', subtype, {expires:30});
	jQuery.cookie('status', status, {expires:30});
	jQuery.cookie('data', data, {expires:30});
});


