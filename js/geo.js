var marker;


//Funzione di geolocalizzazione
function geoLocal(){
	//se il browser supporta geolocalizzazione
	if (navigator.geolocation){
		var options={timeout:5000}
    	navigator.geolocation.getCurrentPosition(showPosition, errorGettingPosition);
    }
	else {
		alert("Your browser don't support geolocation");
	}
}

//Trova la mia posizione
function showPosition (position){
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	//cancella cookie default
	jQuery.removeCookie('centerLatitude');
	jQuery.removeCookie('centerLongitude');
	//salvo le coordinate
	var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	jQuery.cookie('latitude', latitude, {expires:30});	
	jQuery.cookie('longitude', longitude, {expires:30});
	getMarker(myPosition);
	//sposto la mappa in base alla mia posizione
	map.setCenter(myPosition);	
}

//Gestione errori
function errorGettingPosition(err) {

	if(err.code == 1) {
		alternLoc();
		alert("L'utente non ha autorizzato la geolocalizzazione");
	}
	else if(err.code == 2) {
		alternLoc();
		alert("Posizione non disponibile");
	}
	else if(err.code == 3) {
		alternLoc();
		alert("Timeout");
	}
	else {
		alert("ERRORE:" + err.message);
	}	
}

//Crea marker
function getMarker(myPosition){
	//se c'è un marker precedente
	if(marker){
		marker.setMap(null);
		map.panTo(myPosition);
	}
	marker = new google.maps.Marker({
			map:map,
			draggable:true,
			animation: google.maps.Animation.DROP,
			position: myPosition
		});
}

function alternLoc(){
	//controlla se ci sono i cookie
	if (jQuery.cookie('lastLatitude') && jQuery.cookie('lastLongitude')){
		//prende coordinate dai cookie
		var newMarkPos = new google.maps.LatLng(jQuery.cookie('lastLatitude'), jQuery.cookie('lastLongitude'));
		getMarker(newMarkPos);
	}
	else {
		//prende coordinate default
		centerLatitude = cityCenter.lat();
		centerLongitude = cityCenter.lng();
		//crea cookie
		jQuery.cookie('centerLatitude', centerLatitude, {expires:30});	
		jQuery.cookie('centerLongitude', centerLongitude, {expires:30});
		//prende posizione default
		var newMarkPos = cityCenter;
		getMarker(newMarkPos);
	}
}



