//coordinate di default
var cityCenter=new google.maps.LatLng(44.494887, 11.342616300000032);
//città di default
var cityDefault="Bologna";
//radius circle
var RADIUS = 2;


function average(event) {

	var latMedia = 0;
	var lngMedia = 0;
	var n = 0;
	while (n < (event.locations.length)) {
		latMedia += parseFloat(event.locations[n].lat);
		lngMedia += parseFloat(event.locations[n].lng);
		n++; 		
	}
	latMedia = parseFloat(latMedia/n);
	lngMedia = parseFloat(lngMedia/n);
	return ({ lat: latMedia, lng: lngMedia }); 
}