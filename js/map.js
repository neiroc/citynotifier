$(document).ready(function(){
	var mapOptions = {
	  		center: new google.maps.LatLng(44.496138,11.342325),
	  		zoom: 14,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("gmap"), mapOptions);
	geoLocal();
});
