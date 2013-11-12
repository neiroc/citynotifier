//Funzione chiamata in body - onload e con il tasto Ricarica
function geo_and_call() {
	//get_user_data(false);//prelevo parametri dell'utente da database
	//$('#bar_username').html("Benvenuto");
	//set_userdata_function();//setta lo scaricamente della pagina come salvataggio dei dati nel database
	initialize_base();//crea la mappa con i parametri globali
	//initialize();//cambia il centro in base alla geolocalizzazione
	//clearMapMarkers();
	//effettua la prima ricerca
	//getEvents(scope, type, subtype, lat, lng, radius, timemin, status, false, false);
	//getEvents("remote", type, subtype, lat, lng, radius, timemin, status, true, false);
}


//Funzioni di inizializzazione, mappa ed eventi

function initialize_base() {
var mapOptions = {
  center: new google.maps.LatLng(44.496138,11.342325),
  zoom: 14,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById("gmap"),
    mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

