function geoLocal(){
	if (navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition (position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		marker = new google.maps.Marker({
			map:map,
			draggable:true,
			animation: google.maps.Animation.DROP,
			position: myPosition
		});

		map.setCenter(myPosition);	
}

function errorGettingPosition(err) {
			if(err.code == 1) {
				alert("L'utente non ha autorizzato la geolocalizzazione");
			} else if(err.code == 2) {
				alert("Posizione non disponibile");
			} else if(err.code == 3) {
				alert("Timeout");
			} else {
				alert("ERRORE:" + err.message);
			}
}

