var marker;


//Funzione di geolocalizzazione
function geoLocal(){
	if (navigator.geolocation){
		var options={timeout:5000}
    	navigator.geolocation.getCurrentPosition(showPosition, errorGettingPosition);
    }
	else {
		alert("Your browser is a very minghione");
	}
}

//Trova la mia posizione
function showPosition (position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		getMarker(myPosition);
		map.setCenter(myPosition);	
}

//Gestione errori
function errorGettingPosition(err) {
	if(err.code == 1) {
		alert("L'utente non ha autorizzato la geolocalizzazione");
	}
	else if(err.code == 2) {
		alert("Posizione non disponibile");
	}
	else if(err.code == 3) {
		alert("Timeout");
	}
	else {
		alert("ERRORE:" + err.message);
	}
}

//Crea marker
function getMarker(myPosition){

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





