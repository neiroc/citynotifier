$(document).ready(function(){
	var mapOptions = {
	  		center: new google.maps.LatLng(44.496138,11.342325),
	  		zoom: 14,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);

	//funzione di geolocalizzazione
	geoLocal();

	google.maps.event.addListener(map, 'click', function(event) {
		newLatitude = event.latLng.lat();
        newLongitude = event.latLng.lng();

		var markerPosition = new google.maps.LatLng(newLatitude, newLongitude);

		getMarker(markerPosition);
	});
	
});
$('.dropdown-toggle').dropdown()
$('#myModal').on('show.bs.modal', function(){
	console.log("diocristo")
	
})

