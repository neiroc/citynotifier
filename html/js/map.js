var lastLatitude;
var lastLongitude;

$(document).ready(function(){
	var mapOptions = {
	  		center: cityCenter,
	  		zoom: 14,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);

	console.log("porcoddio");
	var circleOptions = {
    	strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35,
		map: map,
		center: cityCenter,
		radius: 2000
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(circleOptions);

	//funzione di geolocalizzazione
	geoLocal();
	//riceve l'evento se mi sposto sulla mappa
	google.maps.event.addListener(map, 'click', function(event) {
		//salva le coordinate della mia nuova posizione
		lastLatitude = event.latLng.lat();
        lastLongitude = event.latLng.lng();
		//cancella cookie default
		jQuery.removeCookie('centerLatitude');
		jQuery.removeCookie('centerLongitude');
		//cancella cookie geolocalizzazione
		jQuery.removeCookie('latitude');
		jQuery.removeCookie('longitude');
		//crea i cookie
		jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
		jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
		//mette il marker
		var markerPosition = new google.maps.LatLng(lastLatitude, lastLongitude);
		getMarker(markerPosition);
	});

});
$('.dropdown-toggle').dropdown()
$('#myModal').on('show.bs.modal', function(){
	
})

