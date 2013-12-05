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
	var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	jQuery.cookie('latitude', latitude, {expires:30});	
	jQuery.cookie('longitude', longitude, {expires:30});
	getMarker(myPosition);
	map.setCenter(myPosition);	
}

//Gestione errori
function errorGettingPosition(err) {

	if(err.code == 1) {
		alternLoc();
		alert("L'utente non ha autorizzato la geolocalizzazione");
		//jQuery.cookie('newLatitude', newLatitude, {expires:30});	
		//jQuery.cookie('newLongitude', newLongitude, {expires:30});
		//var newMarkPos = new google.maps.LatLng(newLatitude, newLongitude);
		//getMarker(newMarkPos);
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
	
	if (jQuery.cookie('lastLatitude') && jQuery.cookie('lastLongitude')){
		var newMarkPos = new google.maps.LatLng(jQuery.cookie('lastLatitude'), jQuery.cookie('lastLongitude'));
		getMarker(newMarkPos);
	}
	else {
		centerLatitude = cityCenter.lat();
		centerLongitude = cityCenter.lng();
		jQuery.cookie('centerLatitude', centerLatitude, {expires:30});	
		jQuery.cookie('centerLongitude', centerLongitude, {expires:30});
		var newMarkPos = cityCenter;
		getMarker(newMarkPos);
		console.log("porcoddio2222222")
	}
}



