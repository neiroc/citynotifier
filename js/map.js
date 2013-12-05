var lastLatitude;
var lastLongitude;

$(document).ready(function(){
	var mapOptions = {
	  		center: cityCenter,
	  		zoom: 14,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);

	//funzione di geolocalizzazione
	geoLocal();

	google.maps.event.addListener(map, 'click', function(event) {
		 
		lastLatitude = event.latLng.lat();
        lastLongitude = event.latLng.lng();
		jQuery.cookie('lastLatitude', lastLatitude, {expires:30});	
		jQuery.cookie('lastLongitude', lastLongitude, {expires:30});
		

		var markerPosition = new google.maps.LatLng(lastLatitude, lastLongitude);

		getMarker(markerPosition);
	});
	
});
$('.dropdown-toggle').dropdown()
$('#myModal').on('show.bs.modal', function(){
	
})

