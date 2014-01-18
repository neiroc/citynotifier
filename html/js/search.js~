//formato calendario
$('.datepicker').datepicker({
	format: "dd MM yyyy"
});

//mantiene il dropdown aperto pur cliccando sul calendario
$(document).on('click', '.day, .month, .year, .dow, .datepicker-switch, .next, .prev', function (e) {
    e.stopPropagation();
});

//Chiude calendario quando si clicca sul giorno
$(document).on('click','.day', function(){
	$('.datepicker-dropdown').fadeOut();
});

//ricerca indirizzo specoficato nel form
$('#searchLoc').on('click', function(){
	codeAddress();
});

//funzione ricerca indirizzo
function codeAddress() {
	var address = $('#searchAddress').val();
	geocoder.geocode( { 'address': address}, function(results, status) {
	  	if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		  	getMarker(results[0].geometry.location);
		} 
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
		getCircle(results[0].geometry.location);
	});
}
