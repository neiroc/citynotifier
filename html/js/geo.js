var marker;
var circle;
var latitude;
var longitude;
var radius;


//Funzione di geolocalizzazione
function geoLocal(){
	//se il browser supporta geolocalizzazione
	if (navigator.geolocation){
		var options={timeout:5000}
    	navigator.geolocation.getCurrentPosition(showPosition, errorGettingPosition);
    }
	else {
		errorAlert("Your browser don't support geolocation");
	}
}

//Trova la mia posizione
function showPosition (pos){
	
	//prendo le coordinate del coordinate di geolocalizzazione
	latitude = pos.coords.latitude;
	longitude = pos.coords.longitude;

	lastLatitude= latitude;
	lastLongitude= longitude;
	
	myPosition = new google.maps.LatLng(latitude, longitude);
	
	//date le coordinate, restituisce l'indirizzo e lo inserisce nel form del menu notify
	geocodePosition(myPosition);
	
	getMarker(myPosition)
		
	//inserisce il cerchio con centro in myPosition
	distanceWidget = new DistanceWidget(map, myPosition)
	radiusWidgetCheck = true;
	if (radius)
		range=radius;
	else 
		range=RADIUS
	
	radiusWidget.set('distance', range);
	radiusWidget.center_changed();
	search();
}

//Gestione errori
function errorGettingPosition(err) {

	if(err.code == 1) {
		//console.log(lastLatitude)
		if(lastLatitude && lastLongitude)
			alternLoc()
		else
			centerLoc();
		errorAlert("L'utente non ha autorizzato la geolocalizzazione");
	}
	else if(err.code == 2) {
		if(lastLatitude && lastLongitude)
			alternLoc()
		else
			centerLoc();
		arrorAlert("Posizione non disponibile");
	}
	else if(err.code == 3) {
		if(lastLatitude && lastLongitude)
			alternLoc()
		else
			centerLoc();
		errorAlert("Timeout");
	}
	else {
		errorAlert("ERRORE:" + err.message);
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
	map.panTo(myPosition);
	//se muovo il marker
	google.maps.event.addListener(marker,'dragend', dragMark)
}
//aggiorna la posizione
function dragMark(event){
	
	//salva le coordinate della mia nuova posizione
	lastLatitude = event.latLng.lat();
    lastLongitude = event.latLng.lng();

    var markerPosition = new google.maps.LatLng(lastLatitude, lastLongitude)

	map.panTo(markerPosition);

	// aggiorno l'indirizzo
    geocodePosition(markerPosition);
}

function alternLoc(){
	
	//prende coordinate dai cookie
	var newMarkPos = new google.maps.LatLng(lastLatitude, lastLongitude);
	
	getMarker(newMarkPos);
	
	distanceWidget = new DistanceWidget(map, newMarkPos);
	radiusWidgetCheck = true
	
	map.setCenter(newMarkPos);	
	geocodePosition(newMarkPos);
	
	radiusWidget.set('distance', radius);
	//$('#searchRange').val(radius + " km ")
	search();
}
	
function centerLoc() {
	
	//prende posizione default
	var newMarkPos = cityCenter;
	lastLatitude=cityCenter.lat();
	lastLongitude=cityCenter.lng();
		
	getMarker(newMarkPos);
	distanceWidget = new DistanceWidget(map, newMarkPos);
	radiusWidgetCheck = true;
	
	radiusWidget.set('distance', RADIUS);
	radiusWidget.center_changed();
		
	map.setCenter(cityCenter);
	geocodePosition(cityCenter);
	search();
}

/**
* Get address from coordinates
* @param latlng point
* ASYNCHRONOUS
*/
function geocodePosition(position){
	geocoder.geocode({'latLng': position}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) { 
			// SUCCESS: get the first matching address and format it properly
			var address = results && results[1] ? results[0].address_components[1].long_name + ", " + results[0].address_components[0].long_name: position,
			lastAddress = results[0].address_components;
			if(address == position)
				geocodePosition(position); //Retry if Geocoder fails
			else{
				$('#notifyAddress').val(address);
				$('#searchAddress').val(address);
			}
		}
		else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {    
		    setTimeout(function() {
		        geocodePosition(position);
		    }, 200);
        }
		else {
			//errorAlert('Geocoder failed due to: ' + status)
			console.log('Geocoder failed due to: ' + status);
		}
	});
}



