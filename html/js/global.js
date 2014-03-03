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

//Calcola Area Evento
function calculateEventArea(tipo,sottotipo){
	if(tipo=="problemi_stradali"){
		switch(sottotipo){
			case "incidente": spazio = 100; break;
			case "buca": spazio = 100; break;
			case "coda": spazio = 200; break;
			case "lavori_in_corso": spazio = 30; break;
			case "strada_impraticabile": spazio = 50; break;
		}
	}
	else if(tipo=="emergenze_sanitarie"){
		switch(sottotipo){
			case "incidente": spazio = 100; break;
			case "malore": spazio = 200; break;
			case "ferito": spazio = 200; break;
		}
	}
	else if(tipo=="reati"){
		switch(sottotipo){
			case "furto": spazio = 200; break;
			case "attentato": spazio = 200; break;
		}
	}
	else if(tipo=="problemi_ambientali"){
		switch(sottotipo){
			case "incendio": spazio = 100; break;
			case "tornado": spazio = 500; break;
			case "neve": spazio = 1000; break;
			case "alluvione": spazio = 300; break;
		}
	}
	else if(tipo=="eventi_pubblici"){
		switch(sottotipo){
			case "partita": spazio = 200; break;
			case "manifestazione": spazio = 100; break;
			case "concerto": spazio = 50; break;
		}
	}
	return spazio;
}