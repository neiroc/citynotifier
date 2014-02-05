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

//rende visibile la tabella
$('#table').on('click', function(){
	$('#myModal').modal({backdrop:false})
})


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
	radius = radiusWidget.get('distance');
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
			});
			console.log(circle.getRadius());
		} //chiudi function data
	});//fine chiamata ajax
	
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


